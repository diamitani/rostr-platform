import { resolveAuth } from "@/lib/rostr/auth";
import {
  customerIdFor,
  stripeClient,
  stripeConfigured,
  stripePriceId,
} from "@/lib/rostr/billing";

// POST /api/v1/billing/checkout — create a Stripe Checkout Session for the
// "pro" monthly subscription. Body: { project_id, user_id?, price_id? }.
// Without STRIPE_SECRET_KEY / STRIPE_PRICE_ID this 501s with a clear error.
export async function POST(req: Request) {
  let body: { project_id?: string; user_id?: string; price_id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const auth = await resolveAuth(req, {
    projectIdFromBody: body.project_id,
    userIdFromBody: body.user_id,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  if (!stripeConfigured()) {
    return Response.json(
      {
        error: "billing_not_configured",
        message:
          "Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID on the Vercel project (via Secure Vault), then redeploy.",
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

  const customerId = customerIdFor(auth.auth, req);
  const origin = new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/api/v1/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/api/v1/billing/plans`,
    metadata: {
      customer_id: customerId,
      project_id: auth.auth.project_id,
    },
  });
  return Response.json({ url: session.url });
}
