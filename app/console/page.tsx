import Link from "next/link";
import { listProjects, loadProject } from "@/lib/project";

export const dynamic = "force-dynamic";

export default async function ConsoleHome() {
  const projects = await listProjects();

  const cards = await Promise.all(
    projects.map(async (p) => {
      const def = await loadProject(p.id);
      return {
        id: p.id,
        name: p.name,
        agentCount: def?.agents?.length ?? 0,
        skillCount: def ? Object.keys(def.skills ?? {}).length : 0,
      };
    })
  );

  return (
    <div className="rc-shell">
      <aside className="rc-sidebar">
        <Link className="rc-brand" href="/console">
          <span className="rc-brand-mark">R</span>
          <span className="rc-brand-name">Rostr Console</span>
        </Link>
        <nav className="rc-nav">
          <span className="rc-nav-label">Projects</span>
          {cards.length === 0 && <span className="rc-note">No projects found.</span>}
          {cards.map((p) => (
            <Link key={p.id} href={`/console/${p.id}`}>
              {p.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="rc-main">
        <h1 className="rc-h1">Rostr Console</h1>
        <p className="rc-lede">
          Every chat here runs through the real Rostr runtime — PAL compiles your goal, NPAO
          triages, workers execute, the context engine remembers. This console is a window onto
          the runtime, not a separate chatbot.
        </p>

        <div className="rc-note">
          <strong>Bet (running on Rostr)</strong> — pick a project below to start a live run.
          Everything you see in the chat pane is streamed straight from the runtime: thoughts,
          tool actions, results, and completion events. Nothing is scripted or mocked in this
          console.
        </div>

        <div className="rc-cards">
          {cards.map((p) => (
            <Link key={p.id} href={`/console/${p.id}`} className="rc-card">
              <h2>{p.name}</h2>
              <p>Open a live chat session against this project&apos;s agents.</p>
              <div className="rc-card-meta">
                <span className="rc-pill">
                  {p.agentCount} agent{p.agentCount === 1 ? "" : "s"}
                </span>
                <span className="rc-pill">
                  {p.skillCount} skill{p.skillCount === 1 ? "" : "s"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
