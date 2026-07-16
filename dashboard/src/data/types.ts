export interface Agent {
  id: string;
  name: string;
  type: 'PAL' | 'RAG' | 'NPAO' | 'HUB';
  status: 'active' | 'idle' | 'error' | 'offline';
  uptime: string;
  tasksCompleted: number;
  successRate: number;
  latency: string;
  allocatedMemory: string;
  lastDeployed: string;
  version: string;
  description: string;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: 'document' | 'database' | 'api' | 'vector-store' | 'web';
  size: string;
  documents: number;
  chunks: number;
  lastIndexed: string;
  status: 'healthy' | 'indexing' | 'error' | 'stale';
  embeddingModel: string;
  freshness: number;
}

export interface OrchestrationPhase {
  id: string;
  name: string;
  step: number;
  description: string;
  status: 'completed' | 'active' | 'waiting' | 'blocked' | 'failed';
  duration: string;
  agentCount: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'analysis' | 'integration' | 'automation' | 'communication' | 'data';
  description: string;
  version: string;
  installs: number;
  rating: number;
  author: string;
  isInstalled: boolean;
  size: string;
  dependencies: string[];
  updatedAt: string;
}

export interface FrameworkStats {
  totalValue: number;
  activeAgents: number;
  knowledgeSources: number;
  skillsAvailable: number;
  orchestrations: number;
  uptime: string;
  avgLatency: string;
  tokensProcessed: string;
}
