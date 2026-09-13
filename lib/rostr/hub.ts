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

  constructor(rootDir?: string) {
    this.rootDir = rootDir ?? process.env.DATA_DIR ?? "./data";
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
    this.writeJson(this.runPath(projectId, run.id), run);
    return run;
  }

  async getRun(projectId: string, runId: string): Promise<RunRecord | null> {
    return this.readJson<RunRecord | null>(
      this.runPath(projectId, runId),
      null
    );
  }

  async updateRun(projectId: string, run: RunRecord): Promise<void> {
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
    this.writeJson(this.runPath(projectId, runId), run);
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
    this.writeJson(this.runPath(projectId, runId), run);
  }

  async logReference(projectId: string, entry: string): Promise<void> {
    const p = this.referencePath(projectId);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.appendFileSync(p, `${nowIso()} ${entry}\n`, "utf-8");
  }

  private loadEntitlements(projectId: string): Entitlement[] {
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
    this.writeJson(this.entitlementsPath(e.projectId), all);
  }
}

// ---------------------------------------------------------------------------
// SupabaseHub: STUB. This class implements the Hub interface against a
// Supabase/Postgres backend, but the client wiring is not implemented yet —
// every method throws until it is. Swap JsonHub for this class in
// hubFromEnv() once the real client is wired (schema: one row per run in a
// `runs` table keyed by (project_id, run_id), entitlements in an
// `entitlements` table, reference entries in a `reference_log` table).
// ---------------------------------------------------------------------------

export class SupabaseHub implements Hub {
  private url: string;
  private key: string;

  constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
  }

  private get configured(): boolean {
    return Boolean(this.url && this.key);
  }

  private fail(method: string): never {
    if (!this.configured) {
      throw new Error("SupabaseHub not configured");
    }
    throw new Error(
      `SupabaseHub stub: ${method} is not implemented yet — wire the Supabase client here.`
    );
  }

  async createRun(): Promise<RunRecord> {
    this.fail("createRun");
  }
  async getRun(): Promise<RunRecord | null> {
    this.fail("getRun");
  }
  async updateRun(): Promise<void> {
    this.fail("updateRun");
  }
  async addStep(): Promise<RunStep> {
    this.fail("addStep");
  }
  async addDecision(): Promise<void> {
    this.fail("addDecision");
  }
  async logReference(): Promise<void> {
    this.fail("logReference");
  }
  async checkEntitlement(): Promise<boolean> {
    this.fail("checkEntitlement");
  }
  async grantEntitlement(): Promise<void> {
    this.fail("grantEntitlement");
  }
}

export function hubFromEnv(): Hub {
  const url = process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_ANON_KEY ?? "";
  if (url && key) {
    return new SupabaseHub(url, key);
  }
  return new JsonHub();
}
