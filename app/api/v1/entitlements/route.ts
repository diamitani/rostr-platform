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

  const hub = hubFromEnv();
  const entitled = await hub.checkEntitlement(
    auth.auth.user_id,
    auth.auth.project_id,
    skill
  );
  return Response.json({ entitled });
}
