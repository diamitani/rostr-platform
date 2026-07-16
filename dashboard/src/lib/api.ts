// ROSTR API Client — types and fetch wrappers for all backend endpoints
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8420';

async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const url = `${API_BASE}${path}`;
  const opts: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status}`);
  return res.json();
}

// ── Types ────────────────────────────────────────────────────

export interface Agent {
  id: string;
  name: string;
  agent_type: string;
  capabilities: string;
  tools: string;
  phases: string;
  model: string;
  max_parallel_tasks: number;
  current_tasks: number;
  tasks_completed: number;
  success_rate: number;
  avg_latency_ms: number;
  status: string;
  created_at: number;
  last_active_at: number;
}

export interface CompileResult {
  primary_intent: string;
  domain: string;
  subject: string;
  constraints: string[];
  urgency: string;
  ambiguity_score: number;
  enhanced_instruction: string;
  agent_type: string;
  model: string;
  temperature: number;
  tools_allow: string[];
  routing_phase: string;
  completion_criteria: string[];
}

export interface NpaoResult {
  phase: string;
  phase_index: number;
  criteria: string[];
  priority: {
    composite: number;
    status: string;
    breakdown: Record<string, number>;
  };
  allocation: { agent: string | null; agent_name: string | null };
  orchestration: string;
}

export interface Task {
  id: string;
  description: string;
  phase: string;
  priority_score: number;
  priority_status: string;
  allocated_agent_id: string | null;
  orchestration_pattern: string;
  status: string;
  created_at: number;
  completed_at: number | null;
}

export interface KnowledgeEntry {
  entry_id: string;
  query_origin: string;
  content: string;
  summary: string;
  source_url: string;
  source_title: string;
  source_tier: number;
  credibility_score: number;
  topics: string;
  entities: string;
  data_type: string;
  confidence: number;
  created_at: number;
}

export interface Decision {
  id: string;
  context: string;
  decision: string;
  rationale: string;
  alternatives: string;
  namespace: string;
  created_at: number;
}

export interface Learning {
  id: string;
  context: string;
  insight: string;
  outcome: string;
  source: string;
  tags: string;
  created_at: number;
}

export interface Stats {
  active_agents: number;
  total_agents: number;
  knowledge_sources: number;
  orchestrations: number;
  completed_orchestrations: number;
  skills_available: number;
  avg_success_rate: number;
  uptime: string;
}

export interface Compound {
  total_agents: number;
  total_decisions: number;
  total_learnings: number;
  total_knowledge_entries: number;
  total_tasks: number;
  completed_tasks: number;
  knowledge_compounding_active: boolean;
}

// ── API Functions ─────────────────────────────────────────────

export const rostr = {
  // PAL
  compile: (input: string) =>
    api<CompileResult>('POST', '/pal/compile', { input }),

  // NPAO
  classify: (desc: string, domain = '', opts?: Partial<Record<string, unknown>>) =>
    api<NpaoResult>('POST', '/npao/classify', { task_description: desc, domain, ...opts }),

  createTask: (description: string, domain = '') =>
    api<NpaoResult & { task_id: string }>('POST', '/npao/tasks', { description, domain }),

  listTasks: () => api<Task[]>('GET', '/npao/tasks'),

  // RAG DAL
  ingestKnowledge: (data: {
    query_origin: string;
    content: string;
    summary?: string;
    source_url?: string;
    source_title?: string;
    source_tier?: number;
    credibility_score?: number;
    topics?: string[];
    entities?: string[];
    data_type?: string;
  }) => api<KnowledgeEntry>('POST', '/ragdal/ingest', data),

  listKnowledge: () => api<KnowledgeEntry[]>('GET', '/ragdal/knowledge'),

  // Hub
  listAgents: () => api<Agent[]>('GET', '/hub/agents'),
  registerAgent: (data: { name: string; agent_type: string; tools?: string[]; phases?: string[] }) =>
    api<{ agent_id: string; status: string }>('POST', '/hub/agents', data),

  listDecisions: () => api<Decision[]>('GET', '/hub/decisions'),
  logDecision: (data: { context: string; decision: string; rationale?: string; alternatives?: string[]; namespace?: string }) =>
    api<{ decision_id: string; status: string }>('POST', '/hub/decisions', data),

  listLearnings: () => api<Learning[]>('GET', '/hub/learnings'),
  logLearning: (data: { context: string; insight: string; outcome?: string; source?: string; tags?: string[] }) =>
    api<{ learning_id: string; status: string }>('POST', '/hub/learnings', data),

  compound: () => api<Compound>('GET', '/hub/compound'),
  stats: () => api<Stats>('GET', '/stats/'),
};
