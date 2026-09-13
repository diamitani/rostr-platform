import { loadProject } from "@/lib/project";
import { resolveAuth } from "@/lib/rostr/auth";

// GET /api/v1/projects/[id] — return the full project definition.
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await resolveAuth(req, { projectIdFromQuery: params.id });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const project = await loadProject(auth.auth.project_id);
  if (!project) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json(project);
}
