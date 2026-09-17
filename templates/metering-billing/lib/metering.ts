// Metering + quotas + entitlements. Self-contained: no framework auth
// dependency — the host app passes its own user id (or a Bearer API key).
//
// Money flow:
//   1. The host app reports every LLM call via UsageCollector (see
//      lib/usage-collector.ts) and flushes the events with
//      usageStoreFromEnv().recordEvents(events). Metering never throws.
//   2. Before expensive work, call enforceQuota(customerId, upgradeUrl):
//      over quota -> an HTTP 402 Response with a machine-readable
//      { code: "quota_exceeded" } body; under quota -> null (proceed).
//   3. Stripe Checkout sells the paid plan; the webhook flips the plan.
//      Without STRIPE_SECRET_KEY the billing routes answer 501 and the
//      paywall simply stays open — nothing breaks.
//
// Identity (customer_id). Pass the host app's authenticated user id when
// you have one; otherwise a Bearer API key is hashed (never stored raw):
//   explicit user id -> "user:<id>"
//   Authorization: Bearer <token> -> "key:<sha256(token)[:16]>"
//   neither -> null (route should 401; see customerIdOr401)

import { createHash } from "node:crypto";
import { BILLING_CONFIG, planFor } from "../billing.config";

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

function bearerToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header) return null;
  const match = /^bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1].trim() : null;
}

/** Resolve the metered customer for a request. Returns null when there is
 *  no usable identity (the route should answer 401). */
export function customerIdForRequest(
  req: Request,
  userId?: string | null
): string | null {
  if (userId && userId.trim()) return `user:${userId.trim()}`;
  const token = bearerToken(req);
  if (token) {
    const hash = createHash("sha256").update(token, "utf8").digest("hex");
    return `key:${hash.slice(0, 16)}`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Usage events
// ---------------------------------------------------------------------------

export interface UsageEvent {
  kind: "call" | "run";
  customer_id: string;
  project_id: string;
  run_id: string | null;
  agent_id: string | null;
  model: string | null;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  estimated: boolean;
  at: string; // ISO timestamp
}

export interface UsageSummary {
  customer_id: string;
  plan: string;
  period_start: string; // ISO, first of month UTC
  runs_this_month: number;
  runs_quota: number;
  spend_usd: number; // sum of metered call costs this month
}

function monthStartIso(): string {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  ).toISOString();
}

export interface UsageStore {
  recordEvents(events: UsageEvent[]): Promise<void>;
  getPlan(customerId: string): Promise<string>;
  setPlan(
    customerId: string,
    plan: string,
    stripeCustomerId?: string | null
  ): Promise<void>;
  findCustomerIdByStripeCustomer(
    stripeCustomerId: string
  ): Promise<string | null>;
  getStripeCustomerId(customerId: string): Promise<string | null>;
  getSummary(customerId: string): Promise<UsageSummary>;
}

// ---------------------------------------------------------------------------
// In-memory store (dev / fallback). Per-process on serverless — fine for
// local dev, not durable on Vercel. Supabase below is the durable backend.
// ---------------------------------------------------------------------------

class MemoryUsageStore implements UsageStore {
  private events: UsageEvent[] = [];
  private plans = new Map<string, { plan: string; stripe: string | null }>();

  async recordEvents(events: UsageEvent[]): Promise<void> {
    this.events.push(...events);
  }

  async getPlan(customerId: string): Promise<string> {
    return this.plans.get(customerId)?.plan ?? BILLING_CONFIG.freePlanId;
  }

  async setPlan(
    customerId: string,
    plan: string,
    stripeCustomerId?: string | null
  ): Promise<void> {
    this.plans.set(customerId, {
      plan,
      stripe: stripeCustomerId ?? this.plans.get(customerId)?.stripe ?? null,
    });
  }

  async findCustomerIdByStripeCustomer(
    stripeCustomerId: string
  ): Promise<string | null> {
    for (const [id, v] of this.plans) {
      if (v.stripe === stripeCustomerId) return id;
    }
    return null;
  }

  async getStripeCustomerId(customerId: string): Promise<string | null> {
    return this.plans.get(customerId)?.stripe ?? null;
  }

  async getSummary(customerId: string): Promise<UsageSummary> {
    const start = monthStartIso();
    const mine = this.events.filter(
      (e) => e.customer_id === customerId && e.at >= start
    );
    const runs = new Set(
      mine.filter((e) => e.kind === "run" && e.run_id).map((e) => e.run_id)
    ).size;
    const spend = mine
      .filter((e) => e.kind === "call")
      .reduce((s, e) => s + e.cost_usd, 0);
    const plan = await this.getPlan(customerId);
    return {
      customer_id: customerId,
      plan,
      period_start: start,
      runs_this_month: runs,
      runs_quota: planFor(plan).runsPerMonth,
      spend_usd: Math.round(spend * 1e6) / 1e6,
    };
  }
}

// ---------------------------------------------------------------------------
// Supabase store (durable). Tables live in
// supabase/001_metering_billing.sql — run it once in the dashboard.
// The API uses the service-role key, which bypasses RLS; the migration
// enables RLS so no anon key can ever read these tables.
// ---------------------------------------------------------------------------

function sbUrl(): string {
  return (process.env.SUPABASE_URL ?? "").replace(/\/+$/, "");
}
function sbServiceKey(): string {
  return process.env.SUPABASE_SERVICE_KEY ?? "";
}

function sbFetch(path: string, init?: RequestInit): Promise<Response> {
  const key = sbServiceKey();
  return fetch(`${sbUrl()}${path}`, {
    ...init,
    signal: AbortSignal.timeout(8000),
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

class SupabaseUsageStore implements UsageStore {
  private warnOnce(err: unknown, op: string) {
    console.warn(
      `[billing] supabase ${op} failed (fail-open):`,
      err instanceof Error ? err.message : err
    );
  }

  async recordEvents(events: UsageEvent[]): Promise<void> {
    if (!events.length) return;
    try {
      const rows = events.map((e) => ({
        kind: e.kind,
        customer_id: e.customer_id,
        project_id: e.project_id,
        run_id: e.run_id,
        agent_id: e.agent_id,
        model: e.model,
        input_tokens: e.input_tokens,
        output_tokens: e.output_tokens,
        cost_usd: e.cost_usd,
        estimated: e.estimated,
      }));
      const res = await sbFetch("/rest/v1/usage_events", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(rows),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      this.warnOnce(err, "recordEvents");
    }
  }

  async getPlan(customerId: string): Promise<string> {
    try {
      const res = await sbFetch(
        `/rest/v1/billing_customers?customer_id=eq.${encodeURIComponent(
          customerId
        )}&select=plan`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = (await res.json()) as Array<{ plan?: string }>;
      return rows[0]?.plan ?? BILLING_CONFIG.freePlanId;
    } catch (err) {
      this.warnOnce(err, "getPlan");
      return BILLING_CONFIG.freePlanId;
    }
  }

  async setPlan(
    customerId: string,
    plan: string,
    stripeCustomerId?: string | null
  ): Promise<void> {
    try {
      const body: Record<string, unknown> = {
        customer_id: customerId,
        plan,
        updated_at: new Date().toISOString(),
      };
      if (stripeCustomerId !== undefined)
        body.stripe_customer_id = stripeCustomerId;
      const res = await sbFetch("/rest/v1/billing_customers", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      this.warnOnce(err, "setPlan");
    }
  }

  async findCustomerIdByStripeCustomer(
    stripeCustomerId: string
  ): Promise<string | null> {
    try {
      const res = await sbFetch(
        `/rest/v1/billing_customers?stripe_customer_id=eq.${encodeURIComponent(
          stripeCustomerId
        )}&select=customer_id`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = (await res.json()) as Array<{ customer_id?: string }>;
      return rows[0]?.customer_id ?? null;
    } catch (err) {
      this.warnOnce(err, "findCustomerIdByStripeCustomer");
      return null;
    }
  }

  async getStripeCustomerId(customerId: string): Promise<string | null> {
    try {
      const res = await sbFetch(
        `/rest/v1/billing_customers?customer_id=eq.${encodeURIComponent(
          customerId
        )}&select=stripe_customer_id`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = (await res.json()) as Array<{
        stripe_customer_id?: string | null;
      }>;
      return rows[0]?.stripe_customer_id ?? null;
    } catch (err) {
      this.warnOnce(err, "getStripeCustomerId");
      return null;
    }
  }

  async getSummary(customerId: string): Promise<UsageSummary> {
    const start = monthStartIso();
    const plan = await this.getPlan(customerId);
    let runs = 0;
    let spend = 0;
    try {
      const res = await sbFetch(
        `/rest/v1/usage_events?customer_id=eq.${encodeURIComponent(
          customerId
        )}&created_at=gte.${encodeURIComponent(start)}&select=kind,run_id,cost_usd`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = (await res.json()) as Array<{
        kind?: string;
        run_id?: string | null;
        cost_usd?: number;
      }>;
      runs = new Set(
        rows.filter((r) => r.kind === "run" && r.run_id).map((r) => r.run_id)
      ).size;
      spend = rows
        .filter((r) => r.kind === "call")
        .reduce((s, r) => s + (Number(r.cost_usd) || 0), 0);
    } catch (err) {
      this.warnOnce(err, "getSummary");
    }
    return {
      customer_id: customerId,
      plan,
      period_start: start,
      runs_this_month: runs,
      runs_quota: planFor(plan).runsPerMonth,
      spend_usd: Math.round(spend * 1e6) / 1e6,
    };
  }
}

let storeSingleton: UsageStore | null = null;

export function usageStoreFromEnv(): UsageStore {
  if (storeSingleton) return storeSingleton;
  storeSingleton =
    sbUrl() && sbServiceKey()
      ? new SupabaseUsageStore()
      : new MemoryUsageStore();
  return storeSingleton;
}

// ---------------------------------------------------------------------------
// Quota gate — drop this into any expensive route handler.
// Returns null when the customer may proceed, otherwise an HTTP 402
// Response the handler should return directly.
// ---------------------------------------------------------------------------

export interface QuotaCheck {
  ok: boolean;
  plan: string;
  runsThisMonth: number;
  quota: number;
}

export async function checkQuota(customerId: string): Promise<QuotaCheck> {
  const store = usageStoreFromEnv();
  const summary = await store.getSummary(customerId);
  return {
    ok: summary.runs_this_month < summary.runs_quota,
    plan: summary.plan,
    runsThisMonth: summary.runs_this_month,
    quota: summary.runs_quota,
  };
}

export function upgradeUrlFor(req: Request): string {
  if (BILLING_CONFIG.upgradeUrlOverride) return BILLING_CONFIG.upgradeUrlOverride;
  return `${new URL(req.url).origin}/api/billing/plans`;
}

export async function enforceQuota(
  req: Request,
  customerId: string
): Promise<Response | null> {
  const quota = await checkQuota(customerId);
  if (quota.ok) return null;
  return Response.json(
    {
      code: "quota_exceeded",
      error: "Monthly usage quota exceeded for this plan.",
      plan: quota.plan,
      runs_this_month: quota.runsThisMonth,
      runs_quota: quota.quota,
      upgrade_url: upgradeUrlFor(req),
    },
    { status: 402 }
  );
}

// ---------------------------------------------------------------------------
// Stripe (lazy — safe to import without keys configured)
// ---------------------------------------------------------------------------

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function stripeClient(): Promise<import("stripe").default | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const { default: Stripe } = await import("stripe");
  return new Stripe(key);
}

export function stripePriceId(): string {
  return process.env.STRIPE_PRICE_ID ?? "";
}

// Re-exported so routes only need one import.
export { BILLING_CONFIG, planFor } from "../billing.config";
