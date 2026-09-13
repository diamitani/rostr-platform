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
  const root = path.resolve(process.cwd());
  const p = path.resolve(root, rel);
  if (p !== root && !p.startsWith(root + path.sep)) {
    throw new Error(`path escapes workspace root: ${rel}`);
  }
  return p;
}

async function runReadFile(args: Record<string, unknown>): Promise<string> {
  const p = sandbox(String(args.path ?? ""));
  return fs.readFileSync(p, "utf-8");
}

async function runWriteFile(args: Record<string, unknown>): Promise<string> {
  const p = sandbox(String(args.path ?? ""));
  const content = String(args.content ?? "");
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, "utf-8");
  return `wrote ${content.length} chars to ${args.path}`;
}

async function runListDir(args: Record<string, unknown>): Promise<string> {
  const p = sandbox(String(args.path ?? "."));
  return fs.readdirSync(p).sort().join("\n");
}

/** The built-in toolset. Small on purpose — add yours via registerComposioTool. */
export function defaultRegistry(): ToolRegistry {
  return new ToolRegistry();
}
