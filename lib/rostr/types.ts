// Shared types for the Rostr runtime. Other builders depend on these exact
// names — do not rename or remove exports without coordinating.

export type NpaoClass = "necessity" | "priority" | "anxiety" | "opportunity";

export interface SkillMeta {
  name: string;
  description: string;
  price_usd: number;
  vertical: string;
  version: string;
}

export interface AgentDef {
  id: string;
  name: string;
  systemPrompt: string;
  skills: string[];
  model?: string;
  /**
   * When true and systemPrompt is non-empty, the platform renders the
   * finished run as a user-facing reply in the agent's voice and emits it
   * as a `reply` SSE event. Opt-in: existing agents without this flag are
   * unaffected. The worker tool loop always keeps its machine contract.
   */
  voice_reply?: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  skills: string[];
  note?: string;
}

export interface Project {
  id: string;
  name: string;
  agents: AgentDef[];
  workspaces: Workspace[];
  skills: Record<string, SkillMeta>;
}

export interface Manifest {
  projectId: string;
  agentId: string;
  skillName?: string;
  goal: string;
  skillText: string;
  retrievedContext: string;
  constraints: string[];
  allowedTools: string[];
  maxSteps: number;
  model?: string;
}

export interface RunStep {
  id: string;
  n: number;
  kind: "thought" | "action" | "result";
  text: string;
  at: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  npao: NpaoClass;
  status: "pending" | "running" | "done" | "failed";
  manifest?: Manifest;
  error?: string;
  /** Truncated worker result on success — feeds the voice reply. */
  output?: string;
}

export interface Decision {
  at: string;
  text: string;
}

export interface RunRecord {
  id: string;
  projectId: string;
  agentId: string;
  goal: string;
  skillName?: string;
  status: "running" | "done" | "failed";
  tasks: TaskRecord[];
  steps: RunStep[];
  decisions: Decision[];
  createdAt: string;
}

export interface Entitlement {
  userId: string;
  projectId: string;
  skill: string;
  grantedVia: "purchase" | "subscription" | "mock";
  usesRemaining: number | null;
}

export type SseEvent = {
  type: "thought" | "action" | "result" | "done" | "error" | "reply";
  runId?: string;
  text?: string;
  data?: unknown;
};
