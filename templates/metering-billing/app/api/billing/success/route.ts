// GET /api/billing/success?session_id= — landing page after Checkout.
// Verifies the session with Stripe and reports the customer's plan.
// (Returns JSON; swap for a real "welcome" page in your app.)
import {
  BILLING_CONFIG,
  stripeClient,
  stripeConfigured,
  usageStoreFromEnv,
} from "../../../../lib/metering";

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!stripeConfigured() || !sessionId) {
    return Response.json({ error: "billing_not_configured" }, { status: 501 });
  }
  const stripe = await stripeClient();
  if (!stripe) {
    return Response.json({ error: "billing_not_configured" }, { status: 501 });
  }
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const customerId = (session.metadata?.customer_id as string) ?? null;
  const plan = customerId
    ? await usageStoreFromEnv().getPlan(customerId)
    : "unknown";
  return Response.json({
    ok: true,
    plan,
    message: `Welcome to ${BILLING_CONFIG.appName}. Your plan upgrades as soon as the webhook lands (usually seconds).`,
  });
}
