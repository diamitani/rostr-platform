// GET /api/billing/plans — public. Lists the plans. The upgrade_url in
// 402 quota_exceeded responses points here; your storefront renders this
// to sell the paid plan.
import { BILLING_CONFIG } from "../../../../billing.config";

export async function GET() {
  return Response.json({
    app: BILLING_CONFIG.appName,
    plans: Object.values(BILLING_CONFIG.plans),
    note: "Checkout: POST /api/billing/checkout. Manage subscription: POST /api/billing/portal.",
  });
}
