# Metering + Billing Template

Drop-in usage metering, monthly quotas, and Stripe subscriptions for any
Next.js (App Router) app. Copy the files, set env vars, wire two snippets
into your expensive route — done in about 30 minutes.

## How it works

```
user action ──▶ quota gate ──▶ your LLM work ──▶ usage events ──▶ Supabase
   │                │                                        │
   │           over quota? ──▶ 402 { code:"quota_exceeded",  │
   │                           upgrade_url }                ▼
   │                                              GET /api/usage (dashboard)
   ▼
Stripe Checkout ──▶ webhook ──▶ plan: free → pro ──▶ quota raised
```

- **Meter:** every LLM call is recorded with model, tokens, and real USD
  cost (provider-reported when available, price-table estimate otherwise).
- **Quota:** each customer gets N full "runs" per calendar month. Over
  quota, the route returns **402** with a machine-readable code and an
  upgrade URL — your frontend turns that into a paywall.
- **Bill:** Stripe Checkout sells the paid plan; the webhook flips the
  customer's plan automatically. Cancelling downgrades them back.
- **Never breaks the app:** no Stripe keys → billing routes answer 501
  and the paywall stays open. Store failures are swallowed with a warning.
  Metering code never throws.

## What's inside

```
templates/metering-billing/
├── billing.config.ts              # app name, plans, plan ids — env-overridable
├── lib/
│   ├── metering.ts                # UsageStore (Supabase + memory), quotas,
│   │                              # identity, Stripe helpers, enforceQuota()
│   └── usage-collector.ts         # UsageCollector + reportLlmCall() — wire
│                                  # this into YOUR llm call path (any provider)
├── app/api/
│   ├── usage/route.ts             # GET  — plan, runs used, quota, spend
│   └── billing/
│       ├── plans/route.ts         # GET  — public plan list (paywall target)
│       ├── checkout/route.ts      # POST — Stripe Checkout session { user_id? }
│       ├── webhook/route.ts       # POST — Stripe events (register in dashboard)
│       ├── portal/route.ts        # POST — billing-portal link { user_id? }
│       └── success/route.ts       # GET  — post-checkout landing (JSON)
├── supabase/
│   └── 001_metering_billing.sql   # run once in the Supabase SQL editor
├── .env.example
└── README.md                      # this file
```

## Install (about 30 minutes)

### 1. Copy the files (5 min)

Copy into your Next.js app, keeping the relative layout:

```
billing.config.ts      →  <app>/lib/billing.config.ts
lib/metering.ts        →  <app>/lib/metering.ts        (fix the ../billing.config import if you move it)
lib/usage-collector.ts →  <app>/lib/usage-collector.ts
app/api/usage          →  <app>/app/api/usage
app/api/billing        →  <app>/app/api/billing
```

If your app already has `/api/usage` or `/api/billing/*` routes, move the
template's to a different path and update `upgradeUrlFor` in
`lib/metering.ts` accordingly.

### 2. Install the Stripe SDK (2 min)

```bash
npm install stripe
```

### 3. Set env vars (5 min)

Copy `.env.example` values into your `.env.local` (and later your Vercel
project). Minimum for local dev: **nothing** — the memory store works with
zero config. For production you want:

- `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` (durable storage)
- `STRIPE_SECRET_KEY` + `STRIPE_PRICE_ID` (sell the plan)
- `STRIPE_WEBHOOK_SECRET` (webhook verification)
- `BILLING_APP_NAME`, `BILLING_FREE_RUNS`, `BILLING_PRO_RUNS`, `BILLING_PRO_PRICE_USD` (your plans)

### 4. Run the SQL migration (3 min)

In the Supabase dashboard (SQL editor) for the project behind
`SUPABASE_URL`, run `supabase/001_metering_billing.sql` once. It creates
`billing_customers` and `usage_events` with RLS enabled (the API uses the
service-role key; no anon key can read them). One Supabase project can
serve many apps — pass a distinct `projectId` per app when collecting.

### 5. Wire metering into your LLM calls (10 min)

Wrap your expensive route with the quota gate, collect usage per LLM call,
and flush in a `finally` block:

```ts
import { randomUUID } from "node:crypto";
import {
  customerIdForRequest,
  enforceQuota,
  usageStoreFromEnv,
} from "./lib/metering";
import { UsageCollector, reportLlmCall } from "./lib/usage-collector";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  // 1. Who is this? Pass your app's authenticated user id when you have
  //    one; otherwise a Bearer API key is hashed (never stored raw).
  const customerId = customerIdForRequest(req, body.user_id);
  if (!customerId)
    return Response.json({ error: "unauthorized" }, { status: 401 });

  // 2. Quota gate — over quota returns 402, your frontend shows the paywall.
  const blocked = await enforceQuota(req, customerId);
  if (blocked) return blocked;

  // 3. Do the work, collecting one report per LLM call (any provider).
  const collector = new UsageCollector({
    customerId,
    projectId: "my-app", // <-- your app's id (one Supabase, many apps)
    runId: randomUUID(), // <-- one billable "run" per user action
  });
  try {
    const res = await callYourLlm(...);
    collector.add(
      reportLlmCall({
        model: "anthropic/claude-sonnet-4-6",
        promptTokens: res.usage?.input_tokens,
        completionTokens: res.usage?.output_tokens,
        // Best: pass the real cost when your provider reports it.
        // Vercel AI Gateway: res.providerMetadata?.gateway?.cost
        reportedCostUsd: res.providerMetadata?.gateway?.cost,
      })
    );
    return Response.json({ ok: true /* ... */ });
  } finally {
    // 4. Flush — one "call" event per LLM call + one aggregate "run"
    //    event that quota counting is based on. Never throws.
    await usageStoreFromEnv().recordEvents(collector.toEvents());
  }
}
```

That is the whole integration: gate at the top, collect in the middle,
flush at the end.

### 6. Stripe dashboard (5 min)

1. **Product + price:** Products → Add product → recurring monthly price →
   copy the `price_...` id into `STRIPE_PRICE_ID`.
2. **Webhook:** Developers → Webhooks → Add endpoint →
   `https://YOUR-APP.com/api/billing/webhook` → listen for
   `checkout.session.completed` and `customer.subscription.deleted` →
   copy the `whsec_...` secret into `STRIPE_WEBHOOK_SECRET`.
3. **Customer portal:** Settings → Billing → Customer portal → activate
   (needed for `POST /api/billing/portal`).

### 7. Test

```bash
# 1. Quota block: set BILLING_FREE_RUNS=1, hit your route twice.
#    First → 200. Second → 402:
#    { "code": "quota_exceeded", "runs_this_month": 1, "runs_quota": 1,
#      "upgrade_url": "https://.../api/billing/plans" }

# 2. Usage readout:
curl "http://localhost:3000/api/usage?user_id=test-user"
# → { plan: "free", runs_this_month: 1, runs_quota: 1, spend_usd: 0.0123 }

# 3. Paid flow (Stripe test mode, card 4242 4242 4242 4242):
#    POST /api/billing/checkout → open url → complete → webhook fires →
#    GET /api/usage shows plan "pro" with the bigger quota.
#    Cancel the subscription in the dashboard → webhook → back to "free".

# 4. No-keys behavior: unset STRIPE_SECRET_KEY → /api/billing/checkout
#    answers 501 { error: "billing_not_configured" } and the app keeps working.
```

## Adapting plans per app

Everything is env-driven — no code changes to rebrand:

| Env var | Default | Meaning |
|---|---|---|
| `BILLING_APP_NAME` | `My App` | Shown in plan/success responses |
| `BILLING_FREE_RUNS` | `10` | Free runs per month |
| `BILLING_PRO_RUNS` | `500` | Paid runs per month |
| `BILLING_PRO_PRICE_USD` | `49` | Display price (real charge = Stripe Price) |
| `BILLING_PAID_PLAN_ID` / `BILLING_FREE_PLAN_ID` | `pro` / `free` | Plan ids the webhook flips between |
| `BILLING_UPGRADE_URL` | `<origin>/api/billing/plans` | Override for the 402 upgrade link |

Want three tiers instead of two? Add entries to `billing.config.ts` plans
and create the matching Stripe Prices; pass `price_id` in the checkout
body to sell a specific tier (the webhook grants `BILLING_PAID_PLAN_ID` —
extend it to read the tier from the session metadata for multi-tier).

## API reference

| Route | Method | Auth | Notes |
|---|---|---|---|
| `/api/usage?user_id=` | GET | user_id or Bearer | plan, runs_this_month, runs_quota, spend_usd |
| `/api/billing/plans` | GET | none | public plan list |
| `/api/billing/checkout` | POST | user_id or Bearer | body `{ user_id?, price_id? }` → `{ url }` |
| `/api/billing/webhook` | POST | Stripe signature | register in dashboard |
| `/api/billing/portal` | POST | user_id or Bearer | → `{ url }` billing-portal session |
| `/api/billing/success?session_id=` | GET | none | verifies session, reports plan |

Identity: `user:<your user id>` when the app passes one, otherwise
`key:<sha256(bearer)[:16]>`. Raw API keys are never stored.

## Files this adds to your repo

Two lib files, one config file, six route files, one SQL migration. No
new database service, no auth framework required — bring your own user
ids. The only npm dependency is `stripe`.
