import { z } from "zod";
import { hubFromEnv } from "@/lib/rostr/hub";
import { loadProject } from "@/lib/project";
import { resolveAuth } from "@/lib/rostr/auth";

const purchaseBodySchema = z.object({
  user_id: z.string().min(1),
  skill: z.string().min(1),
  project_id: z.string().min(1),
});

// POST /api/v1/marketplace/purchase — Stripe checkout or mock entitlement.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = purchaseBodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "bad_request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const auth = await resolveAuth(req, {
    projectIdFromBody: parsed.data.project_id,
    userIdFromBody: parsed.data.user_id,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  // The authenticated identity wins over client-supplied values.
  const user_id = auth.auth.user_id;
  const project_id = auth.auth.project_id;
  const { skill } = parsed.data;

  const project = (await loadProject(project_id)) as {
    skills?: Record<string, { price_usd?: number }>;
  } | null;
  if (!project || !project.skills || !(skill in project.skills)) {
    return Response.json({ error: "skill_not_found" }, { status: 404 });
  }
  const price = project.skills[skill].price_usd ?? 0;

  const hub = hubFromEnv();
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  // Live mode: create a Stripe Checkout session via the REST API.
  if (stripeKey) {
    const auth64 = Buffer.from(stripeKey + ":").toString("base64");
    const params = new URLSearchParams({
      "payment_method_types[0]": "card",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(Math.round(price * 100)),
      "line_items[0][price_data][product_data][name]": skill,
      "line_items[0][quantity]": "1",
      mode: "payment",
      success_url: `${originOf(req)}/api/v1/marketplace/purchase/success`,
      cancel_url: `${originOf(req)}/api/v1/marketplace/purchase/cancel`,
    });
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth64}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    if (!res.ok) {
      return Response.json(
        { error: "stripe_error", status: res.status },
        { status: 502 }
      );
    }
    const json = (await res.json()) as { url?: string };
    return Response.json({ checkout_url: json.url });
  }

  // Mock mode: grant the entitlement immediately, no payment needed.
  await hub.grantEntitlement({
    userId: user_id,
    projectId: project_id,
    skill,
    grantedVia: "mock",
    usesRemaining: null,
  });
  return Response.json({
    receipt: "mock_" + Date.now(),
    entitled: true,
    price_usd: price,
  });
}

function originOf(req: Request): string {
  return new URL(req.url).origin;
}
