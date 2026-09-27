// Hub: run state + decisions + reference knowledge + skill entitlements.
// Project ID namespaces EVERYTHING — one project's runs can never leak
// into another project's view.
//
// JsonHub is file-backed (zero setup) under <rootDir>/hub/<projectId>/:
//   runs/<runId>.json  — the full RunRecord
//   entitlements.json — skill entitlements for this project
//   reference.log     — append-only reference entries for this project
//
// SupabaseHub is the documented drop-in for Postgres-backed storage.

import * as fs from "node:fs";
import * as path from "node:path";
import { randomUUID } from "node:crypto";
import type {
  Entitlement,
  RunRecord,
  RunStep,
} from "./types";

export interface Hub {
  createRun(
    projectId: string,
    agentId: string,
    goal: string,
    skillName?: string
  ): Promise<RunRecord>;
  getRun(projectId: string, runId: string): Promise<RunRecord | null>;
  updateRun(projectId: string, run: RunRecord): Promise<void>;
  addStep(
    projectId: string,
    runId: string,
    step: Omit<RunStep, "id" | "at">
  ): Promise<RunStep>;
  addDecision(projectId: string, runId: string, text: string): Promise<void>;
  logReference(projectId: string, entry: string): Promise<void>;
  checkEntitlement(
    userId: string,
    projectId: string,
    skill: string
  ): Promise<boolean>;
  grantEntitlement(e: Entitlement): Promise<void>;
}

function nowIso(): string {
  return new Date().toISOString();
}

export class JsonHub implements Hub {
  private rootDir: string;
  // In-memory fallback when the filesystem is unwritable (e.g. Vercel
  // serverless functions). Runs still stream and complete; they just don't
  // persist across invocations. SupabaseHub is the documented path for
  // durable storage.
  private memRuns = new Map<string, RunRecord>();
  private memEntitlements = new Map<string, Entitlement[]>();
  private fsWritable: boolean | null = null;

  constructor(rootDir?: string) {
    this.rootDir = rootDir ?? process.env.DATA_DIR ?? "./data";
  }

  private canWriteFs(): boolean {
    if (this.fsWritable !== null) return this.fsWritable;
    try {
      fs.mkdirSync(this.rootDir, { recursive: true });
      const probe = path.join(this.rootDir, ".writetest");
      fs.writeFileSync(probe, "ok", "utf-8");
      fs.unlinkSync(probe);
      this.fsWritable = true;
    } catch {
      this.fsWritable = false;
    }
    return this.fsWritable;
  }

  private memKey(projectId: string, runId: string): string {
    return `${projectId}:${runId}`;
  }

  private projectDir(projectId: string): string {
    return path.join(this.rootDir, "hub", projectId);
  }

  private runPath(projectId: string, runId: string): string {
    return path.join(this.projectDir(projectId), "runs", `${runId}.json`);
  }

  private entitlementsPath(projectId: string): string {
    return path.join(this.projectDir(projectId), "entitlements.json");
  }

  private referencePath(projectId: string): string {
    return path.join(this.projectDir(projectId), "reference.log");
  }

  private readJson<T>(p: string, fallback: T): T {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
      }
    } catch {
      // Corrupt file: fall back to the default rather than crashing the run.
    }
    return fallback;
  }

  private writeJson(p: string, value: unknown): void {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(value, null, 2), "utf-8");
  }

  async createRun(
    projectId: string,
    agentId: string,
    goal: string,
    skillName?: string
  ): Promise<RunRecord> {
    const run: RunRecord = {
      id: randomUUID().slice(0, 8),
      projectId,
      agentId,
      goal,
      skillName,
      status: "running",
      tasks: [],
      steps: [],
      decisions: [],
      createdAt: nowIso(),
    };
    if (!this.canWriteFs()) {
      this.memRuns.set(this.memKey(projectId, run.id), run);
    } else {
      this.writeJson(this.runPath(projectId, run.id), run);
    }
    return run;
  }

  async getRun(projectId: string, runId: string): Promise<RunRecord | null> {
    if (!this.canWriteFs()) {
      return this.memRuns.get(this.memKey(projectId, runId)) ?? null;
    }
    return this.readJson<RunRecord | null>(
      this.runPath(projectId, runId),
      null
    );
  }

  async updateRun(projectId: string, run: RunRecord): Promise<void> {
    if (!this.canWriteFs()) {
      this.memRuns.set(this.memKey(projectId, run.id), run);
      return;
    }
    this.writeJson(this.runPath(projectId, run.id), run);
  }

  async addStep(
    projectId: string,
    runId: string,
    step: Omit<RunStep, "id" | "at">
  ): Promise<RunStep> {
    const run = await this.getRun(projectId, runId);
    if (!run) {
      throw new Error(`run not found: ${runId}`);
    }
    const full: RunStep = {
      ...step,
      id: randomUUID().slice(0, 8),
      n: run.steps.length + 1,
      at: nowIso(),
    };
    run.steps.push(full);
    await this.updateRun(projectId, run);
    return full;
  }

  async addDecision(
    projectId: string,
    runId: string,
    text: string
  ): Promise<void> {
    const run = await this.getRun(projectId, runId);
    if (!run) {
      throw new Error(`run not found: ${runId}`);
    }
    run.decisions.push({ at: nowIso(), text });
    await this.updateRun(projectId, run);
  }

  async logReference(projectId: string, entry: string): Promise<void> {
    if (!this.canWriteFs()) return; // ephemeral on serverless; skip silently
    const p = this.referencePath(projectId);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.appendFileSync(p, `${nowIso()} ${entry}\n`, "utf-8");
  }

  private loadEntitlements(projectId: string): Entitlement[] {
    if (!this.canWriteFs()) {
      return this.memEntitlements.get(projectId) ?? [];
    }
    return this.readJson<Entitlement[]>(
      this.entitlementsPath(projectId),
      []
    );
  }

  async checkEntitlement(
    userId: string,
    projectId: string,
    skill: string
  ): Promise<boolean> {
    const found = this.loadEntitlements(projectId).find(
      (e) => e.userId === userId && e.skill === skill
    );
    if (!found) return false;
    return found.usesRemaining === null || found.usesRemaining > 0;
  }

  async grantEntitlement(e: Entitlement): Promise<void> {
    const all = this.loadEntitlements(e.projectId);
    const idx = all.findIndex(
      (x) => x.userId === e.userId && x.skill === e.skill
    );
    if (idx >= 0) {
      all[idx] = e;
    } else {
      all.push(e);
    }
    if (!this.canWriteFs()) {
      this.memEntitlements.set(e.projectId, all);
      return;
    }
    this.writeJson(this.entitlementsPath(e.projectId), all);
  }
}

// A hub is bound to one verified caller. Service-role requests bypass RLS, so
// every query must also filter by this user and project. Never use anon keys
// for this backend: a missing service credential is a configuration failure.
export class SupabaseHub implements Hub {
  private url: string;
  private key: string;
  private userId: string;
  constructor(url: string, key: string, userId: string) {
    this.url = url;
    this.key = key;
    this.userId = userId;
    if (!url || !key || !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(userId)) {
      throw new Error("SupabaseHub requires a verified user UUID and service credential");
    }
  }

  private async request(table: string, query: string, init: RequestInit = {}): Promise<unknown> {
    const res = await fetch(`${this.url.replace(/\/+$/, "")}/rest/v1/${table}${query}`, {
      ...init,
      signal: AbortSignal.timeout(8000),
      headers: {
        apikey: this.key,
        Authorization: `Bearer ${this.key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...init.headers,
      },
    });
    if (!res.ok) throw new Error(`SupabaseHub ${table} failed (${res.status})`);
    return res.status === 204 ? null : res.json();
  }

  private scope(projectId: string): string {
    return `project_id=eq.${encodeURIComponent(projectId)}&user_id=eq.${encodeURIComponent(this.userId)}`;
  }

  async createRun(projectId: string, agentId: string, goal: string, skillName?: string): Promise<RunRecord> {
    const run: RunRecord = {
      id: randomUUID(), projectId, agentId, goal, skillName,
      status: "running", tasks: [], steps: [], decisions: [], createdAt: nowIso(),
    };
    const rows = await this.request("rostr_runs", "", {
      method: "POST",
      body: JSON.stringify({ id: run.id, user_id: this.userId, project_id: projectId, record: run }),
    }) as unknown[];
    if (rows.length !== 1) throw new Error("run persistence was not confirmed");
    return run;
  }

  async getRun(projectId: string, runId: string): Promise<RunRecord | null> {
    const rows = await this.request("rostr_runs", `?${this.scope(projectId)}&id=eq.${encodeURIComponent(runId)}&select=record`) as Array<{ record: RunRecord }>;
    return rows[0]?.record ?? null;
  }

  async updateRun(projectId: string, run: RunRecord): Promise<void> {
    if (run.projectId !== projectId) throw new Error("run project mismatch");
    const rows = await this.request("rostr_runs", `?${this.scope(projectId)}&id=eq.${encodeURIComponent(run.id)}`, {
      method: "PATCH", body: JSON.stringify({ record: run }),
    }) as unknown[];
    if (rows.length !== 1) throw new Error("run not found or not owned by caller");
  }

  async addStep(projectId: string, runId: string, step: Omit<RunStep, "id" | "at">): Promise<RunStep> {
    const rows = await this.request("rpc/rostr_append_step", "", {
      method: "POST",
      body: JSON.stringify({ p_project_id: projectId, p_user_id: this.userId, p_run_id: runId,
        p_step: { ...step, id: randomUUID(), at: nowIso() } }),
    }) as RunStep;
    return rows;
  }

  async addDecision(projectId: string, runId: string, text: string): Promise<void> {
    await this.request("rpc/rostr_append_decision", "", {
      method: "POST", body: JSON.stringify({ p_project_id: projectId, p_user_id: this.userId,
        p_run_id: runId, p_decision: { at: nowIso(), text } }),
    });
  }

  async logReference(projectId: string, entry: string): Promise<void> {
    await this.request("rostr_reference_log", "", {
      method: "POST", body: JSON.stringify({ project_id: projectId, user_id: this.userId, entry }),
    });
  }

  async checkEntitlement(userId: string, projectId: string, skill: string): Promise<boolean> {
    if (userId !== this.userId) return false;
    const rows = await this.request("rostr_entitlements", `?${this.scope(projectId)}&skill=eq.${encodeURIComponent(skill)}&select=uses_remaining`) as Array<{ uses_remaining: number | null }>;
    return rows.length > 0 && (rows[0].uses_remaining === null || rows[0].uses_remaining > 0);
  }

  async grantEntitlement(e: Entitlement): Promise<void> {
    // Hosted grants must be proved by Artispreneur's purchase/subscription
    // ledger, not asserted by callers of this runtime. No local mock grants.
    if (process.env.NODE_ENV === "production") throw new Error("hosted entitlement grants disabled");
    if (e.userId !== this.userId) throw new Error("entitlement user mismatch");
    await this.request("rostr_entitlements", "?on_conflict=user_id,project_id,skill", {
      method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ user_id: this.userId, project_id: e.projectId, skill: e.skill,
        granted_via: e.grantedVia, uses_remaining: e.usesRemaining }),
    });
  }
}

export function hubFromEnv(userId?: string): Hub {
  const url = process.env.SUPABASE_URL ?? "";
  if (url) {
    const key = process.env.SUPABASE_SERVICE_KEY ?? "";
    if (!key) throw new Error("SupabaseHub requires service credential");
    if (userId && /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(userId)) {
      return new SupabaseHub(url, key, userId);
    }
    throw new Error("SupabaseHub requires an authenticated user UUID");
  }
  if (process.env.NODE_ENV === "production") throw new Error("Durable hub not configured");
  return new JsonHub();
}
