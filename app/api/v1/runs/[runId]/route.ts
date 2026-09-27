import { hubFromEnv } from "@/lib/rostr/hub";
import { resolveAuth } from "@/lib/rostr/auth";

// GET /api/v1/runs/[runId]?project_id= — fetch a stored run record.
export async function GET(req: Request, { params }: { params: { runId: string } }) {
  const auth = await resolveAuth(req, {
    projectIdFromQuery:
      new URL(req.url).searchParams.get("project_id") ?? undefined,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  if (process.env.NODE_ENV === "production" && auth.auth.project_id === "artispreneur" && auth.auth.mode !== "jwt") {
    return Response.json({ error: "user_jwt_required" }, { status: 403 });
  }
  if (process.env.NODE_ENV === "production" && auth.auth.project_id === "artispreneur" && process.env.ARTISPRENEUR_ROSTR_ENABLED !== "true") {
    return Response.json({ error: "artispreneur_harness_not_enabled" }, { status: 503 });
  }
  let hub;
  try { hub = hubFromEnv(auth.auth.user_id); }
  catch { return Response.json({ error: "hub_not_configured" }, { status: 503 }); }
  const run = await hub.getRun(auth.auth.project_id, params.runId);
  if (!run) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json(run);
}
