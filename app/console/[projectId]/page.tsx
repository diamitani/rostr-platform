import Link from "next/link";
import { notFound } from "next/navigation";
import { loadProject } from "@/lib/project";
import { loadSessions } from "@/lib/rostr/context-engine";
import type { SessionEntry } from "./SessionSidebar";
import ChatPane from "./ChatPane";
import SessionSidebar from "./SessionSidebar";
import ArtifactList from "./ArtifactList";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: { projectId: string };
}

export default async function ProjectConsole({ params }: ProjectPageProps) {
  const project = await loadProject(params.projectId);
  if (!project) notFound();

  // Recent session memory from the context engine. The JSON-backed index is
  // the supported read path; anything else (disabled memory, a Supabase
  // index without a local blob reader) yields an empty list rather than a
  // broken page.
  let sessions: SessionEntry[] = [];
  try {
    sessions = loadSessions(project.id, 10);
  } catch {
    sessions = [];
  }

  return (
    <div className="rc-shell">
      <aside className="rc-sidebar">
        <Link className="rc-brand" href="/console">
          <span className="rc-brand-mark">R</span>
          <span className="rc-brand-name">Rostr Console</span>
        </Link>
        <nav className="rc-nav">
          <span className="rc-nav-label">Project</span>
          <Link href="/console">&larr; All projects</Link>
        </nav>
        <div>
          <span className="rc-nav-label">Agents</span>
          <nav className="rc-nav">
            {(project.agents ?? []).map((a) => (
              <span key={a.id} className="rc-nav-link">
                {a.name}
              </span>
            ))}
          </nav>
        </div>
      </aside>

      <main className="rc-main">
        <h1 className="rc-h1">{project.name}</h1>
        <p className="rc-lede">
          This chat runs through the real Rostr runtime for this project. Your goal is compiled
          by PAL, triaged by NPAO, executed by workers, and the session is remembered by the
          context engine — nothing here is mocked or pre-written.
        </p>

        <div className="rc-chat-layout">
          <div className="rc-chat-main">
            <ChatPane projectId={project.id} agents={project.agents ?? []} skills={project.skills ?? {}} />
          </div>
          <div className="rc-side-panel">
            <SessionSidebar sessions={sessions} />
            <ArtifactList projectId={project.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
