import { z } from "zod";
import { kbStore } from "@/lib/rostr/rag-dal";
import { resolveAuth } from "@/lib/rostr/auth";

const assembleBodySchema = z.object({
  project_id: z.string().min(1),
  intent: z.string().min(1),
  top_k: z.number().int().min(1).max(20).optional(),
});

// POST /api/v1/context/assemble — build the context pack PAL stage 2
// injects into worker prompts. 503 when no knowledge backend is configured.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = assembleBodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "bad_request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { project_id, intent, top_k } = parsed.data;

  // Auth via the platform contract — the requester must own the project.
  const auth = await resolveAuth(req, { projectIdFromBody: project_id });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  const resolvedProjectId = auth.auth.project_id;

  const store = kbStore();
  if (!store) {
    return Response.json(
      {
        error: "kb_not_configured",
        hint: "Set ROSTR_KB_PATH (local JSON) or SUPABASE_URL + SUPABASE_SERVICE_KEY.",
      },
      { status: 503 }
    );
  }

  try {
    const pack = await store.assemblePack(resolvedProjectId, intent, top_k ?? 5);
    return Response.json({
      project_id: resolvedProjectId,
      chunks: pack.chunks,
      links: pack.links,
      decisions: pack.decisions,
      pack_text: pack.packText,
    });
  } catch (err) {
    return Response.json(
      { error: "kb_error", details: err instanceof Error ? err.message : "assemble_failed" },
      { status: 500 }
    );
  }
}

// GET /api/v1/context/assemble?project_id=... — list ingested sources.
export async function GET(req: Request) {
  const projectId = new URL(req.url).searchParams.get("project_id");
  if (!projectId) {
    return Response.json({ error: "project_id_required" }, { status: 400 });
  }
  // Auth via the platform contract — the requester must own the project.
  const auth = await resolveAuth(req, { projectIdFromQuery: projectId });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  const resolvedProjectId = auth.auth.project_id;
  const store = kbStore();
  if (!store) {
    return Response.json({ error: "kb_not_configured" }, { status: 503 });
  }
  try {
    const sources = await store.listSources(resolvedProjectId);
    return Response.json({ project_id: resolvedProjectId, sources });
  } catch (err) {
    return Response.json(
      { error: "kb_error", details: err instanceof Error ? err.message : "list_failed" },
      { status: 500 }
    );
  }
}
