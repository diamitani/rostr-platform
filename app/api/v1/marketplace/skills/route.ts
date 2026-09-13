import { loadProject } from "@/lib/project";
import { resolveAuth } from "@/lib/rostr/auth";

// GET /api/v1/marketplace/skills?project_id=&workspace= — list purchasable skills.
// Workspace membership lives on project.workspaces[].skills, so we build a
// skill -> workspace-ids map and filter by it.
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const auth = await resolveAuth(req, {
    projectIdFromQuery: params.get("project_id") ?? undefined,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  const projectId = auth.auth.project_id;

  const workspaceFilter = params.get("workspace") ?? undefined;

  const project = await loadProject(projectId);
  if (!project) {
    return Response.json({ error: "project_not_found" }, { status: 404 });
  }

  const wsOf: Record<string, string[]> = {};
  for (const w of project.workspaces ?? []) {
    for (const s of w.skills ?? []) {
      (wsOf[s] = wsOf[s] ?? []).push(w.id);
    }
  }

  const list = Object.keys(project.skills ?? {})
    .filter(
      (name) =>
        !workspaceFilter || (wsOf[name] ?? []).includes(workspaceFilter)
    )
    .map((name) => {
      const meta = project.skills[name];
      return {
        name: meta.name,
        price_usd: meta.price_usd,
        vertical: meta.vertical,
        description: meta.description,
      };
    });

  return Response.json(list);
}
