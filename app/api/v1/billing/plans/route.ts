import { PLANS } from "@/lib/rostr/billing";

// GET /api/v1/billing/plans — public. The upgrade_url in 402
// quota_exceeded responses points here; storefronts (e.g. the CreditFixer
// frontend) render this to sell the paid plan.
export async function GET() {
  return Response.json({
    plans: Object.values(PLANS),
    note: "Checkout: POST /api/v1/billing/checkout. Manage: POST /api/v1/billing/portal.",
  });
}
