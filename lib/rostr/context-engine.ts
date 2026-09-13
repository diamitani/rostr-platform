// Context Engine — the session-memory half (TypeScript port).
//
// A loop runs on EVERY session, in the background, never blocking the
// agent:
//
//   save session as .md -> compress -> store in storage/ (path = the link)
//   -> index a row in the master brain library (ONE central index of
//      sessions + sources + links).
//
// Next session pulls the LAST item or ALL items, decompressed on read.
//
// Continual compression tiers, checked by age:
//   hot  (<7d)   raw .md
//   warm (<30d)  gzipped .md.gz
//   cold (>30d)  extractive auto-summary, then gzipped
// compressLibrary() reports bytes saved.
//
// The RAG DAL — URL ingest, chunking, keyword/vector retrieval for
// outside-world research — lives separately in ./rag-dal.ts.

import * as fs from "node:fs";
import * as path from "node:path";
import { gzipSync, gunzipSync } from "node:zlib";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BrainRow {
  id: string;
  kind: "session" | "source" | "link";
  projectId: string;
  /** Relative path under the storage root. For sessions this is the link. */
  path: string;
  summary: string;
  bytesRaw: number;
  bytesStored: number;
  compressionLevel: "raw" | "gzip" | "summary+gzip";
  createdAt: string;
  lastAccessed: string;
}

export interface BrainIndex {
  addRow(row: BrainRow): void;
  getRow(id: string): BrainRow | null;
  listRows(projectId: string, kind?: BrainRow["kind"], limit?: number): BrainRow[];
  updateRow(id: string, patch: Partial<BrainRow>): BrainRow | null;
  searchRows(
    projectId: string,
    query: string,
    kind?: BrainRow["kind"],
    limit?: number
  ): BrainRow[];
}

// ---------------------------------------------------------------------------
// Env helpers
// ---------------------------------------------------------------------------

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function envBool(name: string, fallback: boolean): boolean {
  const raw = (process.env[name] ?? "").toLowerCase().trim();
  if (!raw) return fallback;
  return raw === "true" || raw === "1" || raw === "yes";
}

/** The always-on trigger loop is opt-OUT: on unless explicitly disabled. */
export function brainBackgroundEnabled(): boolean {
  return envBool("CONTEXT_BACKGROUND", true);
}

function nowIso(): string {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// JsonBrainIndex — storage/index.json + storage/sessions/<project>/<id>.md
// ---------------------------------------------------------------------------

interface BrainIndexFile {
  seq: number;
  rows: BrainRow[];
}

const SESSIONS_DIR = "sessions";

export class JsonBrainIndex implements BrainIndex {
  readonly rootDir: string;

  constructor(rootDir?: string) {
    this.rootDir =
      rootDir ??
      process.env.ROSTR_STORAGE_PATH ??
      path.join(process.env.DATA_DIR ?? "./data", "storage");
  }

  /** Absolute path of a blob stored at a row-relative path. */
  blobPath(row: BrainRow): string {
    return path.join(this.rootDir, row.path);
  }

  /** Absolute path for a new session blob. */
  sessionPath(projectId: string, sessionId: string): string {
    return path.join(
      this.rootDir,
      SESSIONS_DIR,
      projectId,
      `${sessionId}.md`
    );
  }

  private indexPath(): string {
    return path.join(this.rootDir, "index.json");
  }

  private readFile(): BrainIndexFile {
    try {
      const raw = fs.readFileSync(this.indexPath(), "utf-8");
      const parsed = JSON.parse(raw) as Partial<BrainIndexFile>;
      return {
        seq: typeof parsed.seq === "number" ? parsed.seq : 0,
        rows: Array.isArray(parsed.rows) ? (parsed.rows as BrainRow[]) : [],
      };
    } catch {
      return { seq: 0, rows: [] };
    }
  }

  private writeFile(file: BrainIndexFile): void {
    fs.mkdirSync(this.rootDir, { recursive: true });
    fs.writeFileSync(this.indexPath(), JSON.stringify(file, null, 2), "utf-8");
  }

  private writeRow(row: BrainRow): void {
    const file = this.readFile() as { seq: number; rows: Array<BrainRow & { seq?: number }> };
    const i = file.rows.findIndex((r) => r.id === row.id);
    if (i >= 0) {
      // Upsert: keep the original seq so "last item" ordering stays stable.
      file.rows[i] = { ...file.rows[i], ...row, id: file.rows[i].id };
    } else {
      file.seq += 1;
      file.rows.push({ ...row, seq: file.seq });
    }
    this.writeFile(file);
  }

  addRow(row: BrainRow): void {
    this.writeRow(row);
  }

  getRow(id: string): BrainRow | null {
    const rows = this.readFile().rows;
    return rows.find((r) => r.id === id) ?? null;
  }

  listRows(
    projectId: string,
    kind?: BrainRow["kind"],
    limit?: number
  ): BrainRow[] {
    const rows = (this.readFile().rows as Array<BrainRow & { seq?: number }>)
      .filter(
        (r) => r.projectId === projectId && (kind === undefined || r.kind === kind)
      )
      // Stable "last item" ordering: highest seq first.
      .sort((a, b) => (b.seq ?? 0) - (a.seq ?? 0))
      .map((r) => {
        const { seq: _seq, ...row } = r;
        void _seq;
        return row as BrainRow;
      });
    return limit === undefined ? rows : rows.slice(0, limit);
  }

  updateRow(id: string, patch: Partial<BrainRow>): BrainRow | null {
    const file = this.readFile() as { seq: number; rows: Array<BrainRow & { seq?: number }> };
    const i = file.rows.findIndex((r) => r.id === id);
    if (i < 0) return null;
    const merged = { ...file.rows[i], ...patch, id: file.rows[i].id };
    file.rows[i] = merged;
    this.writeFile(file);
    const { seq: _s, ...clean } = merged;
    void _s;
    return clean as BrainRow;
  }

  searchRows(
    projectId: string,
    query: string,
    kind?: BrainRow["kind"],
    limit = 5
  ): BrainRow[] {
    const terms = query.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
    if (!terms.length) return [];
    const rows = (this.readFile().rows as Array<BrainRow & { seq: number }>).filter(
      (r) => r.projectId === projectId && (kind === undefined || r.kind === kind)
    );
    const scored: Array<{ score: number; seq: number; row: BrainRow }> = [];
    for (const r of rows) {
      const hay = `${r.summary} ${r.id}`.toLowerCase();
      let score = 0;
      for (const t of terms) {
        let i = hay.indexOf(t);
        while (i >= 0) {
          score += 1;
          i = hay.indexOf(t, i + 1);
        }
      }
      if (score > 0) {
        const { seq: _q, ...clean } = r;
        void _q;
        scored.push({ score, seq: r.seq, row: clean as BrainRow });
      }
    }
    // Honest keyword overlap only — no vector math.
    scored.sort((a, b) => b.score - a.score || b.seq - a.seq);
    return scored.slice(0, limit).map((s) => s.row);
  }
}

// ---------------------------------------------------------------------------
// SupabaseBrainIndex: STUB. Same pattern as SupabaseContextStore in
// rag-dal.ts — implements BrainIndex against Postgres, but every method
// throws until the client is wired. Schema: supabase/schema.sql (kb_items).
// ---------------------------------------------------------------------------

export class SupabaseBrainIndex implements BrainIndex {
  constructor(
    private url: string,
    private key: string
  ) {}

  private fail(method: string): never {
    if (!this.url || !this.key) {
      throw new Error("SupabaseBrainIndex not configured");
    }
    throw new Error(
      `SupabaseBrainIndex stub: ${method} is not implemented yet — wire the Supabase client here.`
    );
  }

  addRow(): void {
    this.fail("addRow");
  }
  getRow(): BrainRow | null {
    this.fail("getRow");
  }
  listRows(): BrainRow[] {
    this.fail("listRows");
  }
  updateRow(): BrainRow | null {
    this.fail("updateRow");
  }
  searchRows(): BrainRow[] {
    this.fail("searchRows");
  }
}

export function brainIndexFromEnv(): BrainIndex | null {
  if (!brainBackgroundEnabled()) {
    // Session memory explicitly disabled — routes treat this as "no backend".
    return null;
  }
  const url = process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";
  if (url && key) {
    return new SupabaseBrainIndex(url, key);
  }
  return new JsonBrainIndex();
}

// ---------------------------------------------------------------------------
// Blob read/write (decompression on read)
// ---------------------------------------------------------------------------

/** Read a session blob, gunzipping when the row says it is compressed. */
export function readSessionText(rootDir: string, row: BrainRow): string {
  const abs = path.join(rootDir, row.path);
  const buf = fs.readFileSync(abs);
  if (row.compressionLevel === "raw") {
    return buf.toString("utf-8");
  }
  return gunzipSync(buf).toString("utf-8");
}

// ---------------------------------------------------------------------------
// Save / load
// ---------------------------------------------------------------------------

export function saveSession(
  sessionId: string,
  projectId: string,
  sessionMd: string,
  summary?: string,
  index?: BrainIndex
): BrainRow {
  const idx = index ?? brainIndexFromEnv();
  if (!idx) {
    throw new Error("saveSession: session memory is disabled (CONTEXT_BACKGROUND=false)");
  }
  if (!(idx instanceof JsonBrainIndex)) {
    throw new Error(
      "saveSession: blob storage is only implemented for JsonBrainIndex — wire the Supabase client in SupabaseBrainIndex."
    );
  }
  if (!sessionMd.trim()) {
    throw new Error("saveSession: empty session markdown");
  }

  const abs = idx.sessionPath(projectId, sessionId);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, sessionMd, "utf-8");

  const now = nowIso();
  const bytes = Buffer.byteLength(sessionMd, "utf-8");
  const row: BrainRow = {
    id: sessionId,
    kind: "session",
    projectId,
    path: path.relative(idx.rootDir, abs),
    summary: summary ?? sessionMd.slice(0, 280).replace(/\s+/g, " ").trim(),
    bytesRaw: bytes,
    bytesStored: bytes,
    compressionLevel: "raw",
    createdAt: now,
    lastAccessed: now,
  };
  idx.addRow(row);
  return row;
}

export function loadLastSession(
  projectId: string,
  index?: BrainIndex
): { row: BrainRow; text: string } | null {
  const idx = index ?? brainIndexFromEnv();
  if (!idx) return null;
  const rows = idx.listRows(projectId, "session", 1);
  if (!rows.length) return null;
  const row = rows[0];
  if (!(idx instanceof JsonBrainIndex)) {
    throw new Error("loadLastSession: only implemented for JsonBrainIndex so far");
  }
  const text = readSessionText(idx.rootDir, row);
  const updated = idx.updateRow(row.id, { lastAccessed: nowIso() }) ?? row;
  return { row: updated, text };
}

export function loadSessions(
  projectId: string,
  limit = 10,
  index?: BrainIndex
): Array<{ row: BrainRow; text: string }> {
  const idx = index ?? brainIndexFromEnv();
  if (!idx) return [];
  if (!(idx instanceof JsonBrainIndex)) {
    throw new Error("loadSessions: only implemented for JsonBrainIndex so far");
  }
  return idx
    .listRows(projectId, "session", limit)
    .map((row) => ({ row, text: readSessionText(idx.rootDir, row) }));
}

// ---------------------------------------------------------------------------
// Continual compression
// ---------------------------------------------------------------------------

export interface CompressStats {
  processed: number;
  gzipped: number;
  summarized: number;
  bytesBefore: number;
  bytesAfter: number;
  bytesSaved: number;
}

const HOT_MAX_DAYS = 7;
const WARM_MAX_DAYS = 30;
const SUMMARY_CHARS = 1500;
const SUMMARY_CAP = 4000;

/** Extractive auto-summary: headings + the first 1500 chars, capped. */
function autoSummary(text: string): string {
  const headings = text
    .split("\n")
    .filter((l) => /^#{1,4}\s+/.test(l.trim()))
    .slice(0, 20);
  let body = "AUTO-SUMMARY\n\n";
  if (headings.length) {
    body += "SECTIONS:\n" + headings.map((h) => `- ${h.trim()}`).join("\n") + "\n\n";
  }
  body += text.slice(0, SUMMARY_CHARS);
  return body.slice(0, SUMMARY_CAP);
}

export function compressLibrary(
  projectId: string,
  index?: BrainIndex
): CompressStats {
  const idx = index ?? brainIndexFromEnv();
  const stats: CompressStats = {
    processed: 0,
    gzipped: 0,
    summarized: 0,
    bytesBefore: 0,
    bytesAfter: 0,
    bytesSaved: 0,
  };
  if (!idx || !(idx instanceof JsonBrainIndex)) return stats;

  const rows = idx.listRows(projectId, "session");
  for (const row of rows) {
    stats.processed += 1;
    const abs = path.join(idx.rootDir, row.path);
    let storedBytes = row.bytesStored;
    try {
      storedBytes = fs.statSync(abs).size;
    } catch {
      continue; // Missing blob: leave the row alone.
    }
    stats.bytesBefore += storedBytes;

    const ageDays =
      (Date.now() - new Date(row.createdAt).getTime()) / 86_400_000;

    if (row.compressionLevel !== "raw") {
      // Already compressed; just report current size.
      stats.bytesAfter += storedBytes;
      continue;
    }
    if (ageDays < HOT_MAX_DAYS) {
      // Hot: keep raw.
      stats.bytesAfter += storedBytes;
      continue;
    }

    const raw = fs.readFileSync(abs, "utf-8");
    let payload: string;
    let level: BrainRow["compressionLevel"];
    if (ageDays < WARM_MAX_DAYS) {
      payload = raw;
      level = "gzip";
      stats.gzipped += 1;
    } else {
      payload = autoSummary(raw);
      level = "summary+gzip";
      stats.summarized += 1;
    }

    const gz = gzipSync(Buffer.from(payload, "utf-8"));
    const gzPath = `${abs}.gz`;
    fs.writeFileSync(gzPath, gz);
    fs.unlinkSync(abs);

    idx.updateRow(row.id, {
      path: path.relative(idx.rootDir, gzPath),
      bytesStored: gz.length,
      compressionLevel: level,
    });
    stats.bytesAfter += gz.length;
  }
  stats.bytesSaved = stats.bytesBefore - stats.bytesAfter;
  return stats;
}

// ---------------------------------------------------------------------------
// Assembly: what the next session pulls in
// ---------------------------------------------------------------------------

export interface SessionPack {
  sessions: Array<{ row: BrainRow; text: string }>;
  packText: string;
}

export function assemblePack(
  projectId: string,
  intent: string,
  opts?: { lastN?: number },
  index?: BrainIndex
): SessionPack {
  const lastN = opts?.lastN ?? 2;
  const recent = loadSessions(projectId, lastN, index);
  const seen = new Set(recent.map((s) => s.row.id));

  const idx = index ?? brainIndexFromEnv();
  const relevant: Array<{ row: BrainRow; text: string }> = [];
  if (idx instanceof JsonBrainIndex) {
    for (const row of idx.searchRows(projectId, intent, "session", 5)) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      relevant.push({ row, text: readSessionText(idx.rootDir, row) });
    }
  }

  const sessions = [...recent, ...relevant];
  const lines = [
    `SESSION MEMORY for project "${projectId}" (decompressed on read)`,
    "",
  ];
  if (!sessions.length) {
    lines.push("No prior sessions stored for this project.");
  }
  sessions.forEach((s, i) => {
    lines.push(`--- session ${i + 1}: ${s.row.id} (${s.row.compressionLevel}, stored ${s.row.createdAt}) ---`);
    lines.push(s.text.slice(0, 6000));
    lines.push("");
  });
  return { sessions, packText: lines.join("\n") };
}

// ---------------------------------------------------------------------------
// Always-on trigger loop: runs on EVERY session, in the background,
// never blocking the agent.
// ---------------------------------------------------------------------------

export function checkpointTokensPct(): number {
  return envInt("CONTEXT_CHECKPOINT_TOKENS_PCT", 75);
}

export function checkpointMinutes(): number {
  return envInt("CONTEXT_CHECKPOINT_MINUTES", 30);
}

export function shouldCheckpoint(
  contextTokens: number,
  maxTokens: number,
  elapsedMinutes: number,
  opts?: { tokensPct?: number; minutes?: number }
): boolean {
  if (!brainBackgroundEnabled()) return false;
  const pct = opts?.tokensPct ?? checkpointTokensPct();
  const mins = opts?.minutes ?? checkpointMinutes();
  if (maxTokens > 0 && (contextTokens / maxTokens) * 100 >= pct) return true;
  return elapsedMinutes >= mins;
}

export interface CheckpointArgs {
  sessionId: string;
  projectId: string;
  transcriptMd: string;
  summary?: string;
  contextTokens: number;
  maxTokens: number;
  elapsedMinutes: number;
  index?: BrainIndex;
}

/**
 * Fire-and-forget checkpoint. If the triggers fire, saves the session and
 * runs compression in the background WITHOUT awaiting the work — the agent
 * never waits on it. Catches and logs errors; never throws.
 */
export async function maybeCheckpoint(args: CheckpointArgs): Promise<boolean> {
  if (
    !shouldCheckpoint(
      args.contextTokens,
      args.maxTokens,
      args.elapsedMinutes
    )
  ) {
    return false;
  }
  const { sessionId, projectId, transcriptMd, summary, index } = args;
  // Fire and forget: do not await. Errors are logged, never thrown.
  void Promise.resolve()
    .then(() => {
      saveSession(sessionId, projectId, transcriptMd, summary, index);
      compressLibrary(projectId, index);
    })
    .catch((err) => {
      console.error(
        "[context-engine] background checkpoint failed:",
        err instanceof Error ? err.message : err
      );
    });
  return true;
}
