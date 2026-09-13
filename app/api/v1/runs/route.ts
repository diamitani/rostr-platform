import * as fs from "node:fs";
import * as path from "node:path";
import { resolveAuth } from "@/lib/rostr/auth";

interface RunSummary {
  id: string;
  agentId: string;
  goal: string;
  status: string;
  createdAt: string;
  steps: number;
}

// GET /api/v1/runs?project_id= — list recent runs (newest first, limit 20).
// JSON-backed only; returns 503 when Supabase is configured.
export async function GET(req: Request) {
  const auth = await resolveAuth(req, {
    projectIdFromQuery:
      new URL(req.url).searchParams.get("project_id") ?? undefined,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  if (process.env.SUPABASE_URL) {
    return Response.json(
      {
        error: "runs_not_configured",
        hint: "run listing is JSON-backed in this build",
      },
      { status: 503 }
    );
  }

  // Mirror hub.ts's path logic: <rootDir>/hub/<projectId>/runs/<runId>.json.
  const rootDir = process.env.DATA_DIR ?? "./data";
  const runsDir = path.join(rootDir, "hub", auth.auth.project_id, "runs");

  let files: string[] = [];
  try {
    files = fs.readdirSync(runsDir).filter((f) => f.endsWith(".json"));
  } catch {
    files = [];
  }

  const summaries: RunSummary[] = [];
  for (const file of files) {
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(runsDir, file), "utf-8")
      ) as {
        id?: string;
        agentId?: string;
        goal?: string;
        status?: string;
        createdAt?: string;
        steps?: unknown[];
      };
      if (!raw || typeof raw.id !== "string") continue;
      summaries.push({
        id: raw.id,
        agentId: raw.agentId ?? "",
        goal: raw.goal ?? "",
        status: raw.status ?? "",
        createdAt: raw.createdAt ?? "",
        steps: Array.isArray(raw.steps) ? raw.steps.length : 0,
      });
    } catch {
      // Corrupt file: skip it rather than failing the listing.
    }
  }

  summaries.sort((a, b) => {
    const ta = Date.parse(a.createdAt);
    const tb = Date.parse(b.createdAt);
    return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
  });

  return Response.json(summaries.slice(0, 20));
}
