import { z } from "zod";
import { compileManifest } from "@/lib/rostr/pal";
import { loadProject, loadSkillText } from "@/lib/project";
import { resolveAuth } from "@/lib/rostr/auth";

const compileBodySchema = z.object({
  project_id: z.string().min(1),
  agent: z.string().min(1),
  goal: z.string().min(1),
  skill: z.string().min(1).optional(),
});

// POST /api/v1/pal/compile — build the PAL manifest for a goal.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = compileBodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "bad_request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const auth = await resolveAuth(req, {
    projectIdFromBody: parsed.data.project_id,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  const projectId = auth.auth.project_id;

  const { agent, goal, skill } = parsed.data;

  const project = await loadProject(projectId);
  if (!project) {
    return Response.json({ error: "project_not_found" }, { status: 404 });
  }
  const agentDef = (project.agents ?? []).find((a) => a.id === agent);
  if (!agentDef) {
    return Response.json({ error: "agent_not_found" }, { status: 404 });
  }

  const skillText = skill ? await loadSkillText(skill) : "";

  const manifest = compileManifest({
    projectId,
    agent: agentDef,
    goal,
    skillName: skill,
    skillText,
    context: "",
  });

  return Response.json(manifest);
}
