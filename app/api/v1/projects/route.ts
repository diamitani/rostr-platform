import { z } from "zod";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { listProjects } from "@/lib/project";
import { resolveAuth } from "@/lib/rostr/auth";
import type { Project } from "@/lib/rostr/types";

const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

// Turn a name into a URL-safe id: lowercase, non-alphanumerics become dashes.
function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project"
  );
}

// GET /api/v1/projects — list all projects (id + name).
export async function GET(req: Request) {
  const auth = await resolveAuth(req, {
    projectIdFromQuery:
      new URL(req.url).searchParams.get("project_id") ?? undefined,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  return Response.json(await listProjects());
}

// POST /api/v1/projects — create a project skeleton from { name }.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "bad_request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const name = parsed.data.name;
  const id = slugify(name);

  // Auth against the id being created (dev mode only needs it non-empty;
  // API-key mode scopes to the caller's project).
  const auth = await resolveAuth(req, { projectIdFromBody: id });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const skeleton: Project = {
    id,
    name,
    agents: [],
    workspaces: [],
    skills: {},
  } as Project;

  const dir = join(process.cwd(), "projects", id);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "project.json"), JSON.stringify(skeleton, null, 2), "utf8");

  return Response.json({ id, name }, { status: 201 });
}
