// Billing configuration for the metering-and-billing template.
// Everything is overridable via environment variables — no code changes
// needed to rebrand this for another app. Copy this file to your project
// (e.g. lib/billing.config.ts) and set the env vars per app.

function envInt(name: string, fallback: number): number {
  const raw = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(raw) && raw >= 0 ? raw : fallback;
}

function envStr(name: string, fallback: string): string {
  const v = process.env[name];
  return v !== undefined && v !== "" ? v : fallback;
}

export interface Plan {
  id: string;
  name: string;
  /** Full metered "runs" included per calendar month. */
  runsPerMonth: number;
  /** Display price only — the real charge is the Stripe Price. */
  priceUsdPerMonth: number;
  blurb: string;
}

export const BILLING_CONFIG = {
  /** Shown in plan blurbs and the success message. */
  appName: envStr("BILLING_APP_NAME", "My App"),

  /** Plan id granted by a completed Stripe Checkout. */
  paidPlanId: envStr("BILLING_PAID_PLAN_ID", "pro"),
  /** Plan id restored when the Stripe subscription ends. */
  freePlanId: envStr("BILLING_FREE_PLAN_ID", "free"),

  /** Optional absolute URL for the upgrade button. Defaults to a URL built
   *  from the incoming request (origin + /api/billing/plans). */
  upgradeUrlOverride: envStr("BILLING_UPGRADE_URL", ""),

  plans: {
    free: {
      id: "free",
      name: "Starter",
      runsPerMonth: envInt("BILLING_FREE_RUNS", 10),
      priceUsdPerMonth: 0,
      blurb: "Try it out: a handful of full runs every month, free.",
    },
    pro: {
      id: "pro",
      name: "Pro",
      runsPerMonth: envInt("BILLING_PRO_RUNS", 500),
      priceUsdPerMonth: envInt("BILLING_PRO_PRICE_USD", 49),
      blurb:
        "For power users: hundreds of runs a month. The actual charge is the Stripe Price (STRIPE_PRICE_ID).",
    },
  } as Record<string, Plan>,
};

export function planFor(id: string): Plan {
  return (
    BILLING_CONFIG.plans[id] ??
    BILLING_CONFIG.plans[BILLING_CONFIG.freePlanId] ??
    BILLING_CONFIG.plans.free
  );
}
