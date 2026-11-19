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

/**
 * Effect tools (send, publish, anything that changes the outside world)
 * must pass a registered confirmation hook before executing. The hook is
 * the owner-scoped confirm-before-write flow: it sees the tool name and
 * full arguments and returns true to allow, or false/a reason string to
 * refuse. No hook registered -> the effect refuses. The hook is the ONLY
 * authority for effects; a model action or manifest entry never is.
 */
export type EffectConfirmer = (
  tool: string,
  args: Record<string, unknown>
) => Promise<boolean | string>;

export interface ToolDef {
  name: string;
  description: string;
  run: (args: Record<string, unknown>) => Promise<string>;
}

export class ToolRegistry {
  private tools = new Map<string, ToolDef>();
  private allowLists = new Map<string, Set<string>>();
  private denyLists = new Map<string, Set<string>>();
  private effectTools = new Set<string>();
  private effectConfirmer?: EffectConfirmer;

  /** Register the one confirmation hook all effect tools must pass. */
  setEffectConfirmer(fn: EffectConfirmer): void {
    this.effectConfirmer = fn;
  }

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

  /**
   * Register a write-capable tool. Execution requires the confirmation
   * hook's approval on every single call — approval is never cached.
   */
  registerEffectTool(def: ToolDef): void {
    this.register(def);
    this.effectTools.add(def.name);
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
    if (this.effectTools.has(name)) {
      if (!this.effectConfirmer) {
        return `error: effect tool '${name}' has no confirmation hook registered; refusing`;
      }
      const verdict = await this.effectConfirmer(name, args);
      if (verdict !== true) {
        const reason = typeof verdict === "string" ? `: ${verdict}` : "";
        return `error: effect tool '${name}' was not confirmed${reason}`;
      }
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

// -- Web search (free, read-only, DuckDuckGo) -----------------------------------
// DuckDuckGo, no API key. Three routes, best first:
//   1. html.duckduckgo.com/html/  - real web results
//   2. lite.duckduckgo.com/lite/  - real web results, simpler markup
//   3. api.duckduckgo.com instant answers - always reachable, but an
//      entity-lookup service: great for "what is X", empty for news.
// Routes 1-2 answer some datacenter IPs with an HTTP 202 anomaly challenge;
// that is detected and the next route is tried. The returned text names the
// route that served so callers can see which path produced the results.

const DDG_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

interface SearchHit {
  title: string;
  snippet: string;
  url: string;
}

function decodeDdgRedirect(href: string): string {
  const m = /[?&]uddg=([^&]+)/.exec(href);
  if (m) {
    try {
      return decodeURIComponent(m[1]);
    } catch {
      return href;
    }
  }
  return href.startsWith("//") ? `https:${href}` : href;
}

function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

/** Route 1+2: scrape a DDG HTML results page. Returns null on challenge
 *  (HTTP 202 anomaly page) or network failure, [] on a real empty page. */
async function ddgHtmlRoute(endpoint: string, query: string): Promise<SearchHit[] | null> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "User-Agent": DDG_UA,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html",
      },
      body: `q=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(12000),
    });
    if (res.status === 202) return null; // anomaly challenge
    if (!res.ok) return null;
    const html = await res.text();
    if (html.includes("anomaly") && html.includes("challenge")) return null;
    const hits: SearchHit[] = [];
    // Modern html endpoint: <a class="result__a" href="...">title</a> with a
    // nearby <a class="result__snippet">snippet</a>.
    const blocks = html.split(/<div[^>]*class="[^"]*result results_links[^"]*"/).slice(1);
    for (const b of blocks) {
      const a = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/.exec(b);
      if (!a) continue;
      const s = /<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/.exec(b);
      hits.push({
        title: stripTags(a[2]),
        url: decodeDdgRedirect(a[1]),
        snippet: s ? stripTags(s[1]) : "",
      });
    }
    // lite endpoint markup: <a rel="nofollow" href="//duckduckgo.com/l/?uddg=...">
    if (!hits.length) {
      const linkRe = /<a[^>]*href="(\/\/duckduckgo\.com\/l\/\?uddg=[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
      let m: RegExpExecArray | null;
      while ((m = linkRe.exec(html)) !== null) {
        hits.push({ title: stripTags(m[2]), url: decodeDdgRedirect(m[1]), snippet: "" });
      }
    }
    return hits;
  } catch {
    return null;
  }
}

/** Route 3: instant-answer API. Always reachable; entity-focused. */
async function ddgInstantAnswer(query: string): Promise<string | null> {
  try {
    const url = new URL("https://api.duckduckgo.com/");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("no_html", "1");
    url.searchParams.set("skip_disambig", "1");
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": DDG_UA },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const d = (await res.json()) as {
      Heading?: string;
      AbstractText?: string;
      AbstractURL?: string;
      RelatedTopics?: ({ Text?: string; FirstURL?: string } | { Topics?: { Text?: string; FirstURL?: string }[] })[];
    };
    const lines: string[] = [];
    if (d.AbstractText) {
      lines.push(`1. ${d.Heading ?? query}\n   ${d.AbstractText}\n   ${d.AbstractURL ?? ""}`);
    }
    let i = lines.length ? 2 : 1;
    for (const t of d.RelatedTopics ?? []) {
      const item = "Text" in t ? t : ("Topics" in t ? (t.Topics ?? [])[0] : undefined);
      if (item?.Text && item?.FirstURL && i <= 6) {
        lines.push(`${i}. ${stripTags(item.Text)}\n   ${item.FirstURL}`);
        i++;
      }
    }
    return lines.length ? lines.join("\n") : null;
  } catch {
    return null;
  }
}

async function runWebSearch(args: Record<string, unknown>): Promise<string> {
  const query = String(args.query ?? args.q ?? "").trim();
  if (!query) return "error: web_search requires a 'query' argument";
  const limit = Math.min(Number(args.limit ?? 5) || 5, 10);

  for (const [name, endpoint] of [
    ["duckduckgo-html", "https://html.duckduckgo.com/html/"],
    ["duckduckgo-lite", "https://lite.duckduckgo.com/lite/"],
  ] as const) {
    const hits = await ddgHtmlRoute(endpoint, query);
    if (hits === null) continue; // challenged or unreachable: next route
    if (!hits.length) return `[${name}] no results for: ${query}`;
    return (
      `[${name}]\n` +
      hits
        .slice(0, limit)
        .map((h, i) => `${i + 1}. ${h.title}\n   ${h.snippet}\n   ${h.url}`)
        .join("\n")
    );
  }

  const ia = await ddgInstantAnswer(query);
  if (ia) return `[duckduckgo-instant-answer]\n${ia}`;
  return (
    "no results: duckduckgo html/lite routes were challenged or unreachable " +
    "from this host (HTTP 202 anomaly check), and the instant-answer API had " +
    "nothing for this query. The instant-answer API is entity-lookup only; " +
    "news/current-events queries need the html route from an unchallenged IP."
  );
}

/** The built-in toolset. Small on purpose — add yours via registerComposioTool. */
export function defaultRegistry(): ToolRegistry {
  return new ToolRegistry();
}
