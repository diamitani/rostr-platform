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

  const hub = hubFromEnv();
  const run = await hub.getRun(auth.auth.project_id, params.runId);
  if (!run) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json(run);
}
