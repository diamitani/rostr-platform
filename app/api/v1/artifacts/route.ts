// GET /api/v1/artifacts?project_id=<id> — list artifact metadata for a project.
//
// Deliberately open: this is a public listing route (no row content is
// returned, only metadata rows). If Supabase is not configured the route
// returns an empty list with a note instead of failing.

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

  const supabaseUrl = process.env.SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_KEY ?? "";
  if (!supabaseUrl || !serviceKey) {
    return Response.json(FALLBACK);
  }

  const restUrl =
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/artifacts` +
    `?select=id,name,storage_path,kind,created_at` +
    `&project_id=eq.${encodeURIComponent(projectId)}` +
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
