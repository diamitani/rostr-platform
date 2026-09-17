import {
  stripeClient,
  stripeConfigured,
  usageStoreFromEnv,
} from "@/lib/rostr/billing";

// GET /api/v1/billing/success?session_id= — landing page after Checkout.
// Verifies the session with Stripe and reports the customer's plan.
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
    message:
      "Subscription active. Your plan upgrades as soon as the webhook lands (usually seconds).",
  });
}
