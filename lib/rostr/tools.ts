// Tool registry with allow/deny enforcement per skill.
// File tools are sandboxed to the workspace root (process.cwd()): any path
// that resolves outside it is rejected.
//
// EXTENSION POINT — Composio: wrap a Composio MCP tool call as a ToolDef
// and register it with registerComposioTool(). Example:
//
//   import { Composio } from "@composio/core"; // once the dep is installed
//   const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
//   for (const t of await composio.tools.list({ entityId: "default" })) {
//     registry.registerComposioTool({
//       name: t.name,
//       description: t.description,
//       run: async (args) => JSON.stringify(await composio.tools.execute(t.name, args)),
//     });
//   }
//
// The runtime doesn't care where tools came from — it just calls the
// registry, which enforces the per-skill allow/deny policy first.

import * as fs from "node:fs";
import * as path from "node:path";

/**
 * The one safety switch. Default ON: the PAL compiler admits read-only
 * tools only and write_file is sealed in the registry. Set
 * ROSTR_SAFETY_GATE=off to build with write-capable tools: the allow-list
 * model, per-skill enforcement and unknown-tool refusal still apply, and
 * file writes stay sandboxed to the workspace root. The owner asked for
 * this switch ("Keep safety off wyd im building here", 2026-11-18).
 */
export function safetyGateOn(): boolean {
  return (process.env.ROSTR_SAFETY_GATE ?? "on").toLowerCase() !== "off";
}

export interface ToolDef {
  name: string;
  description: string;
  run: (args: Record<string, unknown>) => Promise<string>;
}

export class ToolRegistry {
  private tools = new Map<string, ToolDef>();
  private allowLists = new Map<string, Set<string>>();
  private denyLists = new Map<string, Set<string>>();

  constructor() {
    this.register({ name: "read_file", description: "Read a text file inside the workspace root.", run: runReadFile });
    this.register({ name: "write_file", description: "Write text to a file inside the workspace root.", run: runWriteFile });
    this.register({ name: "list_dir", description: "List files in a directory inside the workspace root.", run: runListDir });
    this.register({ name: "web_search", description: "Search the web (Wikipedia full-text) and return the top results with snippets. Read-only, no key required.", run: runWebSearch });
  }

  /** Register any tool implementation. */
  register(def: ToolDef): void {
    this.tools.set(def.name, def);
  }

  /**
   * Register a tool that comes from Composio (an MCP tool wrapped as a
   * ToolDef). Composio-side auth is the caller's responsibility — wrap the
   * Composio execute call inside def.run and register here.
   */
  registerComposioTool(def: ToolDef): void {
    this.register(def);
  }

  getTool(name: string): ToolDef | undefined {
    return this.tools.get(name);
  }

  allow(skillName: string, toolNames: string[]): void {
    const set = this.allowLists.get(skillName) ?? new Set<string>();
    for (const n of toolNames) set.add(n);
    this.allowLists.set(skillName, set);
  }

  deny(skillName: string, toolNames: string[]): void {
    const set = this.denyLists.get(skillName) ?? new Set<string>();
    for (const n of toolNames) set.add(n);
    this.denyLists.set(skillName, set);
  }

  allowedFor(skillName: string): string[] {
    return [...(this.allowLists.get(skillName) ?? [])];
  }

  /** Check a tool call against the skill's allow/deny policy before running. */
  async call(skillName: string, name: string, args: Record<string, unknown>): Promise<string> {
    if (this.denyLists.get(skillName)?.has(name)) {
      return `error: tool '${name}' is denied for skill '${skillName}'`;
    }
    if (!this.allowLists.get(skillName)?.has(name)) {
      return `error: tool '${name}' is not allowed for skill '${skillName}'`;
    }
    // There is no server-side human approval token or idempotent proposal
    // contract yet. A prompt, manifest allow-list or model action cannot
    // authorize a filesystem mutation on its own.
    if (name === "write_file" && safetyGateOn()) {
      return "error: write_file is sealed while ROSTR_SAFETY_GATE is on";
    }
    const tool = this.tools.get(name);
    if (!tool) {
      return `error: unknown tool '${name}'`;
    }
    try {
      return await tool.run(args);
    } catch (e) {
      return `error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
}

// -- Built-in file tools (sandboxed to process.cwd()) --------------------------

function sandbox(rel: string): string {
  const root = fs.realpathSync(process.cwd());
  const p = path.resolve(root, rel);
  if (p !== root && !p.startsWith(root + path.sep)) {
    throw new Error(`path escapes workspace root: ${rel}`);
  }
  // Lexical containment alone allows a symlink inside the root to point at
  // private host files. Resolve the target before reading or listing it.
  const actual = fs.realpathSync(p);
  if (actual !== root && !actual.startsWith(root + path.sep)) {
    throw new Error(`path escapes workspace root: ${rel}`);
  }
  return actual;
}

async function runReadFile(args: Record<string, unknown>): Promise<string> {
  const p = sandbox(String(args.path ?? ""));
  return fs.readFileSync(p, "utf-8");
}

/** Containment check for paths that may not exist yet (writes). Resolves
 *  the nearest existing ancestor to defeat symlink escapes, then lets the
 *  caller create the rest. */
function sandboxForWrite(rel: string): string {
  const root = fs.realpathSync(process.cwd());
  const p = path.resolve(root, rel);
  if (p !== root && !p.startsWith(root + path.sep)) {
    throw new Error(`path escapes workspace root: ${rel}`);
  }
  let ancestor = p;
  while (!fs.existsSync(ancestor)) {
    const parent = path.dirname(ancestor);
    if (parent === ancestor) throw new Error(`no existing ancestor for: ${rel}`);
    ancestor = parent;
  }
  const actual = fs.realpathSync(ancestor);
  if (actual !== root && !actual.startsWith(root + path.sep)) {
    throw new Error(`path escapes workspace root: ${rel}`);
  }
  return p;
}

async function runWriteFile(args: Record<string, unknown>): Promise<string> {
  // Sealed at the implementation level too while the gate is on, so a
  // future refactor cannot accidentally bypass registry.call.
  if (safetyGateOn()) {
    return "error: write_file is sealed while ROSTR_SAFETY_GATE is on";
  }
  const p = sandboxForWrite(String(args.path ?? ""));
  const content = String(args.content ?? "");
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, "utf-8");
  return `wrote ${content.length} bytes to ${path.relative(process.cwd(), p)}`;
}

async function runListDir(args: Record<string, unknown>): Promise<string> {
  const p = sandbox(String(args.path ?? "."));
  return fs.readdirSync(p).sort().join("\n");
}

// -- Web search (free, read-only) --------------------------------------------
// Wikipedia full-text search: no API key, stable JSON API. DuckDuckGo's
// HTML endpoints challenge datacenter clients (HTTP 202), so they are not
// a dependable backend for an unattended agent.

async function runWebSearch(args: Record<string, unknown>): Promise<string> {
  const query = String(args.query ?? args.q ?? "").trim();
  if (!query) return "error: web_search requires a 'query' argument";
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("srsearch", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("srlimit", String(Math.min(Number(args.limit ?? 5) || 5, 10)));
  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(15000) });
  if (!res.ok) return `error: web_search http ${res.status}`;
  const payload = (await res.json()) as {
    query?: { search?: { title: string; snippet: string }[] };
  };
  const hits = payload.query?.search ?? [];
  if (!hits.length) return `no results for: ${query}`;
  return hits
    .map(
      (h, i) =>
        `${i + 1}. ${h.title}\n   ${h.snippet.replace(/<[^>]+>/g, "")}\n   https://en.wikipedia.org/wiki/${encodeURIComponent(h.title)}`
    )
    .join("\n");
}

/** The built-in toolset. Small on purpose — add yours via registerComposioTool. */
export function defaultRegistry(): ToolRegistry {
  return new ToolRegistry();
}
