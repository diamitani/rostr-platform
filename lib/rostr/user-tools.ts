// User-added tools. A user registers their own tool in a JSON config
// (default rostr.tools.json): an HTTP API, a Composio app/slug, or a pointer
// to an MCP server. Effect tools (writes) go through the exact same
// confirm-before-write hook as the built-ins. When a configured tool needs a
// vendor account the user lacks, the loader says so and attaches the signup
// link from the affiliate registry.

import { ToolRegistry } from "./tools";
import { executeComposioTool } from "./tools-composio";
import { accountNeededMessage } from "./affiliates";
import * as fs from "node:fs";

export interface UserToolConfig {
  name: string;
  description?: string;
  kind: "http" | "composio";
  /** Writes must be confirmed on every call, same as built-in effect tools. */
  effect?: boolean;
  /** kind=http: URL template; {placeholders} are filled from args. */
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  /** kind=http: which vendor account this tool needs (for signup links). */
  account?: string;
  /** kind=http: env var holding the API key; missing key -> accountNeeded. */
  keyEnv?: string;
  /** kind=composio */
  slug?: string;
  connectedAccountId?: string;
  entityId?: string;
}

export function loadUserTools(
  tools: ToolRegistry,
  configPath = "rostr.tools.json"
): { loaded: string[]; needsAccount: string[] } {
  const loaded: string[] = [];
  const needsAccount: string[] = [];
  if (!fs.existsSync(configPath)) return { loaded, needsAccount };
  const configs = JSON.parse(fs.readFileSync(configPath, "utf-8")) as UserToolConfig[];

  for (const c of configs) {
    if (c.kind === "http") {
      const key = c.keyEnv ? process.env[c.keyEnv] ?? "" : "";
      if (c.keyEnv && !key) {
        needsAccount.push(accountNeededMessage(c.account ?? c.name));
        continue;
      }
      const def = {
        name: c.name,
        description: c.description ?? `user tool: ${c.name}`,
        run: async (args: Record<string, unknown>) => {
          let url = String(c.url ?? "");
          for (const [k, v] of Object.entries(args)) {
            url = url.split(`{${k}}`).join(encodeURIComponent(String(v)));
          }
          const headers: Record<string, string> = { ...(c.headers ?? {}) };
          if (key) headers.Authorization = `Bearer ${key}`;
          try {
            const res = await fetch(url, {
              method: c.method ?? "GET",
              headers,
              signal: AbortSignal.timeout(20000),
            });
            const text = await res.text();
            return `[user-tool ${c.name} http ${res.status}] ${text.slice(0, 4000)}`;
          } catch (e) {
            return `error: ${c.name} ${e instanceof Error ? e.message : String(e)}`;
          }
        },
      };
      if (c.effect) tools.registerEffectTool(def);
      else tools.register(def);
      loaded.push(c.name);
    } else if (c.kind === "composio") {
      if (!c.slug || !c.connectedAccountId || !c.entityId) continue;
      const slug = c.slug;
      const connectedAccountId = c.connectedAccountId;
      const entityId = c.entityId;
      const def = {
        name: c.name,
        description: c.description ?? `user tool (composio): ${c.name}`,
        run: async (args: Record<string, unknown>) =>
          (await executeComposioTool(slug, args, connectedAccountId, entityId)).slice(0, 4000),
      };
      if (c.effect) tools.registerEffectTool(def);
      else tools.register(def);
      loaded.push(c.name);
    }
  }
  return { loaded, needsAccount };
}
