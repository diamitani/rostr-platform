// POST /api/billing/portal — Stripe billing-portal link so customers can
// manage/cancel their subscription. Body: { user_id? }.
// Without STRIPE_SECRET_KEY this 501s with a clear error.
import {
  customerIdForRequest,
  stripeClient,
  stripeConfigured,
  usageStoreFromEnv,
} from "../../../../lib/metering";

export async function POST(req: Request) {
  let body: { user_id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const customerId = customerIdForRequest(req, body.user_id);
  if (!customerId) {
    return Response.json(
      { error: "unauthorized", message: "Pass user_id or a Bearer API key." },
      { status: 401 }
    );
  }
  if (!stripeConfigured()) {
    return Response.json(
      {
        error: "billing_not_configured",
        message: "Stripe is not configured. Set STRIPE_SECRET_KEY, then redeploy.",
      },
      { status: 501 }
    );
  }
  const stripe = await stripeClient();
  if (!stripe) {
    return Response.json({ error: "billing_not_configured" }, { status: 501 });
  }
  const stripeCustomerId = await usageStoreFromEnv().getStripeCustomerId(
    customerId
  );
  if (!stripeCustomerId) {
    return Response.json(
      {
        error: "no_stripe_customer",
        message: "No Stripe customer on file — check out first.",
      },
      { status: 400 }
    );
  }
  const origin = new URL(req.url).origin;
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${origin}/api/billing/plans`,
  });
  return Response.json({ url: session.url });
}
