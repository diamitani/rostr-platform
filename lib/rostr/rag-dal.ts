// RAG DAL — the research half of the Context Engine (TypeScript port).
//
// Ingest URLs or raw text per project, retrieve the best chunks for an
// intent, and assemble one "context pack" that PAL stage 2 injects into
// every compiled worker prompt.
// (Session memory — the other half — lives in ./context-engine.ts.)
//
// Two backends, one interface:
//   JsonContextStore      — local JSON files, zero keys, honest
//                           keyword-overlap retrieval (no fake vector math).
//   SupabaseContextStore  — STUB (same pattern as hub.ts): throws
//                           "not configured" without creds; wire the
//                           Supabase client here later. Schema:
//                           supabase/schema.sql.
//
// Env selection: SUPABASE_URL + key wins when set; ROSTR_KB_PATH enables
// the JSON store; neither -> null (context engine inactive, callers fall
// back silently).

import * as fs from "node:fs";
import * as path from "node:path";

export interface KbChunk {
  text: string;
  sourceId: string;
  url: string;
  tier: number;
  score: number;
}

export interface KbLink {
  toUrl: string;
  anchorText: string;
}

export interface KbSource {
  id: string;
  url: string;
  title: string;
  tier: number;
  fetchedAt: string;
}

export interface ContextPack {
  chunks: KbChunk[];
  links: KbLink[];
  decisions: string[];
  packText: string;
}

export interface KnowledgeStore {
  ingestSource(
    source: string,
    projectId: string,
    opts?: { tier?: number; title?: string }
  ): Promise<string>;
  retrieve(
    query: string,
    projectId: string,
    topK?: number
  ): Promise<KbChunk[]>;
  getLinks(sourceId: string): Promise<KbLink[]>;
  listSources(projectId: string): Promise<KbSource[]>;
  assemblePack(
    projectId: string,
    intent: string,
    topK?: number
  ): Promise<ContextPack>;
}

const CHUNK_TARGET_CHARS = 2000; // ~500 tokens
const FETCH_TIMEOUT_MS = 30_000;
const MAX_INGEST_BYTES = 2_000_000;
const RETRIEVAL_MIN_SCORE = 1;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function nowIso(): string {
  return new Date().toISOString();
}

function chunkText(text: string): string[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const p of paragraphs) {
    if (p.length > CHUNK_TARGET_CHARS) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      for (let i = 0; i < p.length; i += CHUNK_TARGET_CHARS) {
        chunks.push(p.slice(i, i + CHUNK_TARGET_CHARS));
      }
    } else if (current.length + p.length + 2 > CHUNK_TARGET_CHARS) {
      chunks.push(current);
      current = p;
    } else {
      current = current ? `${current}\n\n${p}` : p;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function stripTags(htmlText: string): string {
  return htmlText
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLinks(htmlText: string, baseUrl: string): KbLink[] {
  const out: KbLink[] = [];
  const seen = new Set<string>();
  const re =
    /<a\s[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(htmlText)) !== null) {
    try {
      const toUrl = new URL(m[1], baseUrl).toString().split("#")[0];
      if (seen.has(toUrl)) continue;
      seen.add(toUrl);
      out.push({
        toUrl,
        anchorText: stripTags(m[2]).slice(0, 120),
      });
    } catch {
      // Skip malformed URLs rather than failing the ingest.
    }
  }
  return out;
}

async function fetchUrl(url: string): Promise<{
  finalUrl: string;
  text: string;
  links: KbLink[];
}> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { "User-Agent": "rostr-context-engine/1.0" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer()).slice(0, MAX_INGEST_BYTES);
  const raw = buf.toString("utf-8");
  const ctype = res.headers.get("content-type") ?? "";
  const finalUrl = res.url || url;
  if (!/html/i.test(ctype) && !/<html/i.test(raw.slice(0, 2000))) {
    return { finalUrl, text: raw, links: [] };
  }
  return { finalUrl, text: stripTags(raw), links: extractLinks(raw, finalUrl) };
}

function scoreChunk(query: string, text: string): number {
  const terms = query.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
  if (!terms.length) return 0;
  const hay = text.toLowerCase();
  let score = 0;
  for (const t of terms) {
    let i = hay.indexOf(t);
    while (i >= 0) {
      score += 1;
      i = hay.indexOf(t, i + 1);
    }
  }
  return score;
}

function buildPackText(
  chunks: KbChunk[],
  links: KbLink[],
  decisions: string[],
  intent: string
): string {
  const lines = [`KNOWLEDGE BASE CONTEXT for: ${intent.trim().slice(0, 200)}`, ""];
  if (!chunks.length) {
    lines.push(
      "No stored knowledge matched this intent. Do not guess about domain facts the prompt does not provide; note what is unknown."
    );
    return lines.join("\n");
  }
  lines.push("RETRIEVED PASSAGES (highest relevance first):");
  for (const c of chunks) {
    lines.push(`\n--- [tier ${c.tier}] ${c.url || c.sourceId} ---`);
    lines.push(c.text.slice(0, 1200));
  }
  if (links.length) {
    lines.push("\nRELATED LINKS discovered in these sources:");
    for (const l of links.slice(0, 10)) {
      lines.push(`  - ${l.anchorText || l.toUrl}: ${l.toUrl}`);
    }
  }
  if (decisions.length) {
    lines.push("\nRELEVANT PAST DECISIONS from this project:");
    for (const d of decisions.slice(0, 5)) {
      lines.push(`  - ${d.slice(0, 200)}`);
    }
  }
  return lines.join("\n");
}

/** Keyword search over the JsonHub reference.log for this project. */
function searchDecisions(projectId: string, intent: string): string[] {
  const terms = intent.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
  if (!terms.length) return [];
  const logPath = path.join(
    process.env.DATA_DIR ?? "./data",
    "hub",
    projectId,
    "reference.log"
  );
  let raw = "";
  try {
    raw = fs.readFileSync(logPath, "utf-8");
  } catch {
    return [];
  }
  const scored: Array<{ score: number; line: string }> = [];
  for (const line of raw.split("\n")) {
    const low = line.toLowerCase();
    const score = terms.reduce(
      (s, t) => s + (low.split(t).length - 1),
      0
    );
    if (score > 0) scored.push({ score, line: line.slice(0, 300) });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.line);
}

// ---------------------------------------------------------------------------
// JsonContextStore — zero keys, local files under <root>/<projectId>/
// ---------------------------------------------------------------------------

export class JsonContextStore implements KnowledgeStore {
  private rootDir: string;

  constructor(rootDir?: string) {
    this.rootDir =
      rootDir ?? process.env.ROSTR_KB_PATH ?? path.join(process.env.DATA_DIR ?? "./data", "kb");
  }

  private projectDir(projectId: string): string {
    const p = path.join(this.rootDir, projectId);
    fs.mkdirSync(p, { recursive: true });
    return p;
  }

  private sourcesPath(projectId: string): string {
    return path.join(this.projectDir(projectId), "sources.json");
  }

  private chunksPath(projectId: string): string {
    return path.join(this.projectDir(projectId), "chunks.jsonl");
  }

  private linksPath(projectId: string): string {
    return path.join(this.projectDir(projectId), "links.jsonl");
  }

  private readJson<T>(p: string, fallback: T): T {
    try {
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
    } catch {
      // Corrupt file: fall back rather than crash.
    }
    return fallback;
  }

  private readJsonl(p: string): Record<string, unknown>[] {
    const out: Record<string, unknown>[] = [];
    try {
      const raw = fs.readFileSync(p, "utf-8");
      for (const line of raw.split("\n")) {
        if (!line.trim()) continue;
        try {
          out.push(JSON.parse(line) as Record<string, unknown>);
        } catch {
          // Skip corrupt lines.
        }
      }
    } catch {
      // Missing file: no records yet.
    }
    return out;
  }

  async ingestSource(
    source: string,
    projectId: string,
    opts?: { tier?: number; title?: string }
  ): Promise<string> {
    const tier = opts?.tier ?? 3;
    let url = "";
    let text: string;
    let links: KbLink[] = [];
    if (/^https?:\/\//i.test(source.trim())) {
      const fetched = await fetchUrl(source.trim());
      url = fetched.finalUrl;
      text = fetched.text;
      links = fetched.links;
    } else {
      text = source;
    }
    if (!text.trim()) {
      throw new Error("ingestSource: nothing to store (empty text)");
    }
    const { createHash } = await import("node:crypto");
    const hash = createHash("sha256").update(text, "utf-8").digest("hex").slice(0, 16);
    const sourceId = `src_${hash}`;

    const sources = this.readJson<KbSource[]>(this.sourcesPath(projectId), []);
    if (!sources.some((s) => s.id === sourceId)) {
      sources.push({
        id: sourceId,
        url,
        title: opts?.title ?? (url ? url.slice(0, 120) : "pasted text"),
        tier,
        fetchedAt: nowIso(),
      });
      fs.writeFileSync(
        this.sourcesPath(projectId),
        JSON.stringify(sources, null, 2),
        "utf-8"
      );
      const chunks = chunkText(text);
      chunks.forEach((ch, i) => {
        fs.appendFileSync(
          this.chunksPath(projectId),
          JSON.stringify({
            id: `${sourceId}_c${i}`,
            source_id: sourceId,
            project_id: projectId,
            chunk_index: i,
            text: ch,
            token_count: Math.max(1, Math.floor(ch.length / 4)),
          }) + "\n",
          "utf-8"
        );
      });
      for (const l of links) {
        fs.appendFileSync(
          this.linksPath(projectId),
          JSON.stringify({
            project_id: projectId,
            from_source_id: sourceId,
            to_url: l.toUrl,
            anchor_text: l.anchorText,
            discovered_at: nowIso(),
          }) + "\n",
          "utf-8"
        );
      }
    }
    return sourceId;
  }

  async retrieve(
    query: string,
    projectId: string,
    topK = 5
  ): Promise<KbChunk[]> {
    const sources = this.readJson<KbSource[]>(this.sourcesPath(projectId), []);
    const byId = new Map(sources.map((s) => [s.id, s]));
    const scored: Array<{ score: number; chunk: KbChunk }> = [];
    for (const ch of this.readJsonl(this.chunksPath(projectId))) {
      const text = String(ch.text ?? "");
      const s = scoreChunk(query, text);
      if (s >= RETRIEVAL_MIN_SCORE) {
        const src = byId.get(String(ch.source_id));
        scored.push({
          score: s,
          chunk: {
            text,
            sourceId: String(ch.source_id),
            url: src?.url ?? "",
            tier: src?.tier ?? 3,
            score: s,
          },
        });
      }
    }
    // Tier 1 wins ties; then raw score.
    scored.sort((a, b) => a.chunk.tier - b.chunk.tier || b.score - a.score);
    return scored.slice(0, topK).map((s) => s.chunk);
  }

  async getLinks(sourceId: string): Promise<KbLink[]> {
    // Links live per project dir; scan the whole KB root for the source.
    const out: KbLink[] = [];
    let projects: string[] = [];
    try {
      projects = fs
        .readdirSync(this.rootDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
    } catch {
      return out;
    }
    for (const pid of projects) {
      for (const l of this.readJsonl(this.linksPath(pid))) {
        if (String(l.from_source_id) === sourceId) {
          out.push({
            toUrl: String(l.to_url),
            anchorText: String(l.anchor_text ?? ""),
          });
        }
      }
    }
    return out;
  }

  async listSources(projectId: string): Promise<KbSource[]> {
    return this.readJson<KbSource[]>(this.sourcesPath(projectId), []);
  }

  async assemblePack(
    projectId: string,
    intent: string,
    topK = 5
  ): Promise<ContextPack> {
    const chunks = await this.retrieve(intent, projectId, topK);
    const links: KbLink[] = [];
    const seen = new Set<string>();
    for (const c of chunks) {
      for (const l of await this.getLinks(c.sourceId)) {
        if (!seen.has(l.toUrl)) {
          seen.add(l.toUrl);
          links.push(l);
        }
      }
    }
    const decisions = searchDecisions(projectId, intent);
    return {
      chunks,
      links,
      decisions,
      packText: buildPackText(chunks, links, decisions, intent),
    };
  }
}

// ---------------------------------------------------------------------------
// SupabaseContextStore: STUB. Implements the KnowledgeStore interface against
// Postgres + pgvector, but every method throws until the client is wired —
// the same pattern as SupabaseHub in hub.ts. Schema: supabase/schema.sql.
// Swap JsonContextStore for this class in contextStoreFromEnv() once wired.
// ---------------------------------------------------------------------------

export class SupabaseContextStore implements KnowledgeStore {
  constructor(
    private url: string,
    private key: string
  ) {}

  private fail(method: string): never {
    if (!this.url || !this.key) {
      throw new Error("SupabaseContextStore not configured");
    }
    throw new Error(
      `SupabaseContextStore stub: ${method} is not implemented yet — wire the Supabase client here.`
    );
  }

  async ingestSource(): Promise<string> {
    this.fail("ingestSource");
  }
  async retrieve(): Promise<KbChunk[]> {
    this.fail("retrieve");
  }
  async getLinks(): Promise<KbLink[]> {
    this.fail("getLinks");
  }
  async listSources(): Promise<KbSource[]> {
    this.fail("listSources");
  }
  async assemblePack(): Promise<ContextPack> {
    this.fail("assemblePack");
  }
}

export function contextStoreFromEnv(): KnowledgeStore | null {
  const url = process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";
  if (url && key) {
    return new SupabaseContextStore(url, key);
  }
  if (process.env.ROSTR_KB_PATH) {
    return new JsonContextStore();
  }
  return null;
}

// Re-export a singleton-ish default for routes that just want "the KB".
export function kbStore(): KnowledgeStore | null {
  return contextStoreFromEnv();
}
