"use client";

import type { BrainRow } from "@/lib/rostr/context-engine";

export interface SessionEntry {
  row: BrainRow;
  text: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function SessionSidebar({ sessions }: { sessions: SessionEntry[] }) {
  return (
    <div>
      <h2 className="rc-section-title" style={{ marginTop: 0 }}>
        Recent sessions
      </h2>
      {sessions.length === 0 ? (
        <p className="rc-session-empty">
          No sessions remembered yet. Run the agent and the context engine will keep its notes
          here.
        </p>
      ) : (
        <div className="rc-session-list">
          {sessions.map(({ row, text }) => (
            <div className="rc-session" key={row.id}>
              <details>
                <summary>
                  <span className="rc-session-id">{row.id}</span>
                  <span className="rc-session-summary">{row.summary}</span>
                  <span className="rc-session-meta">
                    <span className="rc-pill">{formatDate(row.createdAt)}</span>
                    <span className="rc-pill rc-pill-accent">{row.compressionLevel}</span>
                  </span>
                </summary>
                <pre className="rc-session-text">{text}</pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
