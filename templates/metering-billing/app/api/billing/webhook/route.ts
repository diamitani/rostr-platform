// POST /api/billing/webhook — Stripe events. MUST be registered in the
// Stripe dashboard (Developers -> Webhooks) with the signing secret stored
// as STRIPE_WEBHOOK_SECRET.
// Handled events:
//   checkout.session.completed    -> plan = paid plan (customer_id in metadata)
//   customer.subscription.deleted -> plan = free plan (downgrade)
// Without Stripe configured this 501s.
import Stripe from "stripe";
import {
  BILLING_CONFIG,
  stripeClient,
  stripeConfigured,
  usageStoreFromEnv,
} from "../../../../lib/metering";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  if (!stripeConfigured() || !secret) {
    return Response.json({ error: "billing_not_configured" }, { status: 501 });
  }
  const stripe = await stripeClient();
  if (!stripe) {
    return Response.json({ error: "billing_not_configured" }, { status: 501 });
  }
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return Response.json({ error: "missing_signature" }, { status: 400 });
  }
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return Response.json({ error: "invalid_signature" }, { status: 400 });
  }

  const store = usageStoreFromEnv();
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.metadata?.customer_id;
      const stripeCustomer =
        typeof session.customer === "string" ? session.customer : null;
      if (customerId) {
        await store.setPlan(customerId, BILLING_CONFIG.paidPlanId, stripeCustomer);
      }
    } else if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const stripeCustomer =
        typeof sub.customer === "string" ? sub.customer : null;
      if (stripeCustomer) {
        const customerId = await store.findCustomerIdByStripeCustomer(
          stripeCustomer
        );
        if (customerId) {
          await store.setPlan(
            customerId,
            BILLING_CONFIG.freePlanId,
            stripeCustomer
          );
        }
      }
    }
  } catch (err) {
    // Webhook retries will redeliver; report but acknowledge.
    console.warn(
      "[billing] webhook handler error:",
      err instanceof Error ? err.message : err
    );
  }
  return Response.json({ received: true });
}
