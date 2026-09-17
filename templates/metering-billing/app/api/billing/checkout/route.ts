// POST /api/billing/checkout — create a Stripe Checkout Session for the
// paid monthly subscription. Body: { user_id?, price_id? }.
// Without STRIPE_SECRET_KEY / STRIPE_PRICE_ID this 501s with a clear error
// (the paywall stays open — nothing breaks).
import {
  BILLING_CONFIG,
  customerIdForRequest,
  stripeClient,
  stripeConfigured,
  stripePriceId,
} from "../../../../lib/metering";

export async function POST(req: Request) {
  let body: { user_id?: string; price_id?: string };
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
        message:
          "Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID, then redeploy.",
      },
      { status: 501 }
    );
  }
  const priceId = body.price_id ?? stripePriceId();
  if (!priceId) {
    return Response.json(
      {
        error: "billing_not_configured",
        message: "No Stripe Price configured. Set STRIPE_PRICE_ID.",
      },
      { status: 501 }
    );
  }
  const stripe = await stripeClient();
  if (!stripe) {
    return Response.json({ error: "billing_not_configured" }, { status: 501 });
  }

  const origin = new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/api/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/api/billing/plans`,
    metadata: { customer_id: customerId },
  });
  return Response.json({ url: session.url });
}
