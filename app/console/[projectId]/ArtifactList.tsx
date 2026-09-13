"use client";

import { useEffect, useState } from "react";

interface Artifact {
  id: string;
  name: string;
  storage_path: string;
  kind: string;
  created_at: string;
}

interface ArtifactsResponse {
  artifacts: Artifact[];
  note?: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function ArtifactList({ projectId }: { projectId: string }) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/v1/artifacts?project_id=${encodeURIComponent(projectId)}`
        );
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as ArtifactsResponse;
        if (cancelled) return;
        setArtifacts(data.artifacts ?? []);
        setNote(data.note ?? null);
      } catch {
        if (cancelled) return;
        setNote("Could not load artifacts.");
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return (
    <div>
      <h2 className="rc-section-title" style={{ marginTop: 0 }}>
        Artifacts
      </h2>
      {!loaded && <p className="rc-artifact-empty">Loading…</p>}
      {loaded && artifacts.length === 0 && (
        <p className="rc-artifact-empty">
          No artifacts yet.{note ? ` ${note}` : ""}
        </p>
      )}
      {artifacts.length > 0 && (
        <div className="rc-artifact-list">
          {artifacts.map((a) => (
            <div className="rc-artifact" key={a.id}>
              <div className="rc-artifact-name">{a.name}</div>
              <div className="rc-artifact-meta">
                {a.kind} · {formatDate(a.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
