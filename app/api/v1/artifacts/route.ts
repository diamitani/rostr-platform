// GET /api/v1/artifacts?project_id=<id> — list artifact metadata for a project.
//
// Artifact metadata is private project data. Resolve caller authority before
// using the service key; metadata such as names and storage paths can expose
// user information even when artifact bytes are not returned.

import { resolveAuth } from "@/lib/rostr/auth";

interface ArtifactRow {
  id: string;
  name: string;
  storage_path: string;
  kind: string;
  created_at: string;
}

interface ArtifactsResponse {
  artifacts: ArtifactRow[];
  note?: string;
}

const FALLBACK: ArtifactsResponse = {
  artifacts: [],
  note: "artifact storage needs Supabase",
};

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("project_id");
  if (!projectId) {
    return Response.json(
      { error: "bad_request", detail: "missing project_id query param" },
      { status: 400 }
    );
  }

  const auth = await resolveAuth(req, { projectIdFromQuery: projectId });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  const resolvedProjectId = auth.auth.project_id;
  // Without an auth backend, even local-dev artifact metadata is not a
  // safe cross-user listing. No service key means there is no durable store.
  const supabaseUrl = process.env.SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_KEY ?? "";
  if (!supabaseUrl || !serviceKey) {
    return Response.json(FALLBACK);
  }

  const restUrl =
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/artifacts` +
    `?select=id,name,storage_path,kind,created_at` +
    `&project_id=eq.${encodeURIComponent(resolvedProjectId)}` +
    `&order=created_at.desc&limit=50`;

  try {
    const res = await fetch(restUrl, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });
    if (!res.ok) {
      return Response.json({
        artifacts: [],
        note: `artifact storage unavailable (Supabase returned ${res.status})`,
      });
    }
    const rows = (await res.json()) as ArtifactRow[];
    return Response.json({ artifacts: rows } satisfies ArtifactsResponse);
  } catch {
    return Response.json({
      artifacts: [],
      note: "artifact storage unreachable",
    });
  }
}
