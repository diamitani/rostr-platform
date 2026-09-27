import { hubFromEnv } from "@/lib/rostr/hub";
import { resolveAuth } from "@/lib/rostr/auth";

// GET /api/v1/entitlements?user_id=&project_id=&skill= — check one entitlement.
// The authenticated identity is used for user/project (in dev mode the
// user falls back to ?user_id= or "local-dev").
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const skill = params.get("skill");
  if (!skill) {
    return Response.json({ error: "skill_required" }, { status: 400 });
  }

  const auth = await resolveAuth(req, {
    projectIdFromQuery: params.get("project_id") ?? undefined,
    userIdFromBody: params.get("user_id") ?? undefined,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  if (process.env.NODE_ENV === "production" && auth.auth.project_id === "artispreneur" && process.env.ARTISPRENEUR_ROSTR_ENABLED !== "true") {
    return Response.json({ error: "artispreneur_harness_not_enabled" }, { status: 503 });
  }
  let hub;
  try { hub = hubFromEnv(auth.auth.user_id); }
  catch { return Response.json({ error: "hub_not_configured" }, { status: 503 }); }
  const entitled = await hub.checkEntitlement(
    auth.auth.user_id,
    auth.auth.project_id,
    skill
  );
  return Response.json({ entitled });
}
