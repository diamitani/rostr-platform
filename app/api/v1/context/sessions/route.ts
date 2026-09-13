import { z } from "zod";
import {
  brainIndexFromEnv,
  loadLastSession,
  loadSessions,
  saveSession,
} from "@/lib/rostr/context-engine";
import { resolveAuth } from "@/lib/rostr/auth";

// GET /api/v1/context/sessions?project_id=&mode=last|all&limit=
// Returns decompressed session text from the brain library.
// mode=last (default): the newest session only. mode=all: newest first.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("project_id");
  const mode = url.searchParams.get("mode") ?? "last";
  const limitRaw = url.searchParams.get("limit");

  if (!projectId) {
    return Response.json({ error: "project_id_required" }, { status: 400 });
  }

  // Auth via the platform contract — the requester must own the project.
  const auth = await resolveAuth(req, { projectIdFromQuery: projectId });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  const resolvedProjectId = auth.auth.project_id;
  if (mode !== "last" && mode !== "all") {
    return Response.json(
      { error: "bad_request", details: "mode must be 'last' or 'all'" },
      { status: 400 }
    );
  }

  const limit = limitRaw === null ? undefined : Number.parseInt(limitRaw, 10);
  if (limitRaw !== null && (!Number.isFinite(limit) || (limit as number) <= 0)) {
    return Response.json(
      { error: "bad_request", details: "limit must be a positive integer" },
      { status: 400 }
    );
  }

  const index = brainIndexFromEnv();
  if (!index) {
    return Response.json({ error: "brain_not_configured" }, { status: 503 });
  }

  try {
    const sessions =
      mode === "last"
        ? (() => {
            const one = loadLastSession(resolvedProjectId, index);
            return one ? [one] : [];
          })()
        : loadSessions(resolvedProjectId, limit ?? 10, index);
    return Response.json({
      project_id: resolvedProjectId,
      mode,
      sessions: sessions.map((s) => ({
        id: s.row.id,
        kind: s.row.kind,
        summary: s.row.summary,
        compression_level: s.row.compressionLevel,
        bytes_raw: s.row.bytesRaw,
        bytes_stored: s.row.bytesStored,
        created_at: s.row.createdAt,
        last_accessed: s.row.lastAccessed,
        text: s.text,
      })),
    });
  } catch (err) {
    return Response.json(
      {
        error: "brain_error",
        details: err instanceof Error ? err.message : "load_failed",
      },
      { status: 500 }
    );
  }
}

const saveBodySchema = z.object({
  project_id: z.string().min(1),
  session_id: z.string().min(1),
  session_md: z.string().min(1),
  summary: z.string().optional(),
});

// POST /api/v1/context/sessions — save a session into the brain library.
// 503 when session memory is disabled (no backend).
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = saveBodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "bad_request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { project_id, session_id, session_md, summary } = parsed.data;

  const index = brainIndexFromEnv();
  if (!index) {
    return Response.json(
      {
        error: "brain_not_configured",
        hint: "Session memory is disabled (CONTEXT_BACKGROUND=false).",
      },
      { status: 503 }
    );
  }

  // Auth via the platform contract — the requester must own the project.
  const auth = await resolveAuth(req, { projectIdFromBody: project_id });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  const resolvedProjectId = auth.auth.project_id;

  try {
    const row = saveSession(session_id, resolvedProjectId, session_md, summary, index);
    return Response.json({ saved: true, row });
  } catch (err) {
    return Response.json(
      {
        error: "brain_error",
        details: err instanceof Error ? err.message : "save_failed",
      },
      { status: 500 }
    );
  }
}
