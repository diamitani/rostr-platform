// Composio integrations — real REST calls, no new npm dependencies.
//
// The platform wires Composio in as an extension of the tool registry:
// listComposioTools() discovers the tools for the configured apps,
// attachComposioTools() registers each one as a ToolDef whose run()
// delegates to executeComposioTool(), and the runtime can fall back to
// executeComposioTool() for tool names the registry doesn't know.
//
// Endpoints (Composio REST API v3, confirmed against public docs):
//   GET  /tools                  — list tools, filter by toolkits slugs
//   POST /tools/execute/{slug}   — execute, body { arguments, connected_account_id }
// Auth: `x-api-key: <COMPOSIO_API_KEY>` header.
// Base URL is a named constant so it can change defensively in one place.
//
// Graceful by design: no key -> every function degrades (configured: false,
// registered: 0, errors returned as strings), never throws.

import type { ToolRegistry } from "./tools";

// -- Composio REST API v3 ------------------------------------------------------

const COMPOSIO_BASE_URL = "https://backend.composio.dev/api/v3";
const TOOLS_LIST_PATH = "/tools";
const TOOL_EXECUTE_PATH = "/tools/execute";

export function composioConfigured(): boolean {
  return Boolean(process.env.COMPOSIO_API_KEY?.trim());
}

function apiKey(): string {
  return process.env.COMPOSIO_API_KEY?.trim() ?? "";
}

export interface ComposioToolInfo {
  name: string;
  description: string;
  app: string;
}

/** Parse the v3 tool-list payload defensively — fields differ by version. */
function parseToolList(payload: unknown): ComposioToolInfo[] {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { items?: unknown })?.items)
      ? (payload as { items: unknown[] }).items
      : [];
  const out: ComposioToolInfo[] = [];
  for (const raw of items) {
    const t = raw as Record<string, unknown>;
    const name = String(t.slug ?? t.name ?? "").trim();
    if (!name) continue;
    out.push({
      name,
      description: String(t.description ?? ""),
      app: String(t.toolkit_slug ?? t.app ?? ""),
    });
  }
  return out;
}


// Composio calls must never hang a run: 20s cap per call (tool execution
// can legitimately take a while), fail closed to a clean error string.
function composioFetch(input: string, init?: RequestInit): Promise<Response> {
  return fetch(input, { ...init, signal: AbortSignal.timeout(20000) });
}

/**
 * List Composio tools for the given apps (toolkit slugs). Returns [] when
 * unconfigured or on any error — never throws.
 */
export async function listComposioTools(opts?: {
  apps?: string[];
}): Promise<ComposioToolInfo[]> {
  if (!composioConfigured()) return [];
  try {
    const url = new URL(TOOLS_LIST_PATH, COMPOSIO_BASE_URL);
    if (opts?.apps?.length) {
      url.searchParams.set("toolkits", opts.apps.join(","));
    }
    const res = await composioFetch(url.toString(), {
      method: "GET",
      headers: { "x-api-key": apiKey() },
    });
    if (!res.ok) return [];
    return parseToolList(await res.json());
  } catch {
    return [];
  }
}

/**
 * Execute a Composio tool by slug. Returns the result as a JSON string, or
 * an `error: ...` string when unconfigured/failed — never throws.
 */
export async function executeComposioTool(
  name: string,
  args: Record<string, unknown>,
  connectedAccountId?: string
): Promise<string> {
  if (!composioConfigured()) {
    return "error: Composio is not configured (COMPOSIO_API_KEY missing)";
  }
  try {
    const url = new URL(
      `${TOOL_EXECUTE_PATH}/${encodeURIComponent(name)}`,
      COMPOSIO_BASE_URL
    );
    const body: Record<string, unknown> = { arguments: args };
    if (connectedAccountId) {
      body.connected_account_id = connectedAccountId;
    }
    const res = await composioFetch(url.toString(), {
      method: "POST",
      headers: {
        "x-api-key": apiKey(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const payload = (await res.json().catch(() => null)) as {
      successful?: boolean;
      data?: unknown;
      error?: unknown;
    } | null;
    if (!res.ok || payload?.successful === false) {
      const detail =
        payload?.error != null
          ? String(payload.error)
          : `http ${res.status}`;
      return `error: composio execute failed for '${name}': ${detail}`;
    }
    return JSON.stringify(payload?.data ?? payload ?? null);
  } catch (e) {
    return `error: composio execute failed for '${name}': ${e instanceof Error ? e.message : String(e)}`;
  }
}

const DEFAULT_APPS = ["gmail", "googlecalendar", "googledrive", "slack"];

/**
 * Discover Composio tools and register each one into the registry with run()
 * wrapped around executeComposioTool(). Returns the outcome; never throws.
 */
export async function attachComposioTools(
  registry: ToolRegistry,
  opts?: { apps?: string[]; connectedAccountId?: string }
): Promise<{ configured: boolean; registered: number }> {
  if (!composioConfigured()) {
    return { configured: false, registered: 0 };
  }
  const tools = await listComposioTools({ apps: opts?.apps ?? DEFAULT_APPS });
  let registered = 0;
  for (const t of tools) {
    const name = t.name;
    const accountId = opts?.connectedAccountId;
    registry.registerComposioTool({
      name,
      description: t.description || `Composio tool ${name}`,
      run: async (args) => executeComposioTool(name, args, accountId),
    });
    registered++;
  }
  return { configured: true, registered };
}
