import { resolveAuth } from "@/lib/rostr/auth";
import {
  customerIdFor,
  stripeClient,
  stripeConfigured,
  usageStoreFromEnv,
} from "@/lib/rostr/billing";

// POST /api/v1/billing/portal — Stripe billing-portal link for managing the
// subscription. Body: { project_id, user_id? }. Without STRIPE_SECRET_KEY
// this 501s with a clear error.
export async function POST(req: Request) {
  let body: { project_id?: string; user_id?: string };
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
          "Stripe is not configured. Set STRIPE_SECRET_KEY on the Vercel project (via Secure Vault), then redeploy.",
      },
      { status: 501 }
    );
  }
  const stripe = await stripeClient();
  if (!stripe) {
    return Response.json({ error: "billing_not_configured" }, { status: 501 });
  }
  const customerId = customerIdFor(auth.auth, req);
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
    return_url: `${origin}/api/v1/billing/plans`,
  });
  return Response.json({ url: session.url });
}
