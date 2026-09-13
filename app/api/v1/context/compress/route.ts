import { z } from "zod";
import { timingSafeEqual } from "node:crypto";
import { brainIndexFromEnv, compressLibrary } from "@/lib/rostr/context-engine";
import { resolveAuth } from "@/lib/rostr/auth";
import { listProjects } from "@/lib/project";

const compressBodySchema = z.object({
  project_id: z.string().min(1),
});

// GET /api/v1/context/compress?project_id=<id|all>&cron_secret=...
// Cron entrypoint: same compression, authorized by a shared secret (never by
// user auth — cron has no user). project_id=all compresses every project on
// disk, same as the projects list route. Fail closed on any mismatch.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("project_id");
  const cronSecret = url.searchParams.get("cron_secret");
  const expected = process.env.CRON_SECRET;

  let authorized = false;
  if (cronSecret && expected) {
    const a = Buffer.from(cronSecret);
    const b = Buffer.from(expected);
    authorized = a.length === b.length && timingSafeEqual(a, b);
  }
  if (!authorized) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!projectId) {
    return Response.json({ error: "project_id_required" }, { status: 400 });
  }

  const index = brainIndexFromEnv();
  if (!index) {
    return Response.json({ error: "brain_not_configured" }, { status: 503 });
  }

  const ids =
    projectId === "all"
      ? (await listProjects()).map((p) => p.id)
      : [projectId];

  const results: Record<string, unknown> = {};
  try {
    for (const id of ids) {
      results[id] = compressLibrary(id, index);
    }
    return Response.json({ results });
  } catch (err) {
    return Response.json(
      {
        error: "brain_error",
        details: err instanceof Error ? err.message : "compress_failed",
        results,
      },
      { status: 500 }
    );
  }
}

// POST /api/v1/context/compress — run continual compression over a
// project's session library. Tiers: hot (<7d) stays raw, warm (<30d) is
// gzipped, cold (>30d) is auto-summarized then gzipped.
// Returns {processed, gzipped, summarized, bytesBefore, bytesAfter, bytesSaved}.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = compressBodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "bad_request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

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
  const auth = await resolveAuth(req, {
    projectIdFromBody: parsed.data.project_id,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  const resolvedProjectId = auth.auth.project_id;

  try {
    const stats = compressLibrary(resolvedProjectId, index);
    return Response.json({ project_id: resolvedProjectId, ...stats });
  } catch (err) {
    return Response.json(
      {
        error: "brain_error",
        details: err instanceof Error ? err.message : "compress_failed",
      },
      { status: 500 }
    );
  }
}
