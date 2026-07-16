export interface Agent {
  id: string;
  name: string;
  description: string;
  type: "assistant" | "worker" | "supervisor" | "custom";
  status: "live" | "idle" | "error" | "deploying" | "offline";
  tools: string[];
  lastActive: string;
  createdAt: string;
  apiKeyConfigured: boolean;
  model: string;
  taskCount: number;
  successRate: number;
}

export interface SystemStatus {
  uptime: string;
  activeAgents: number;
  totalTasks: number;
  cpuUsage: number;
  memoryUsage: number;
  apiStatus: "connected" | "disconnected" | "free_tier";
  version: string;
}

export interface LogEntry {
  id: string;
  agentId: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
}

export const mockAgents: Agent[] = [
  {
    id: "agent-001",
    name: "Research Analyst",
    description: "Autonomous research agent that gathers and synthesizes information from multiple sources",
    type: "worker",
    status: "live",
    tools: ["web_search", "document_parser", "summarizer"],
    lastActive: "2 minutes ago",
    createdAt: "2026-07-10T08:00:00Z",
    apiKeyConfigured: true,
    model: "deepseek-chat",
    taskCount: 142,
    successRate: 94.2,
  },
  {
    id: "agent-002",
    name: "Code Reviewer",
    description: "Reviews pull requests and provides detailed feedback on code quality",
    type: "assistant",
    status: "idle",
    tools: ["code_analysis", "diff_viewer", "commenter"],
    lastActive: "15 minutes ago",
    createdAt: "2026-07-12T14:30:00Z",
    apiKeyConfigured: true,
    model: "deepseek-chat",
    taskCount: 87,
    successRate: 97.8,
  },
  {
    id: "agent-003",
    name: "Data Pipeline Orchestrator",
    description: "Manages and monitors ETL pipelines across the data infrastructure",
    type: "supervisor",
    status: "error",
    tools: ["pipeline_monitor", "alerting", "log_analyzer"],
    lastActive: "1 hour ago",
    createdAt: "2026-07-08T09:15:00Z",
    apiKeyConfigured: true,
    model: "deepseek-chat",
    taskCount: 56,
    successRate: 88.5,
  },
  {
    id: "agent-004",
    name: "Customer Support Bot",
    description: "Handles tier-1 customer inquiries with natural language understanding",
    type: "custom",
    status: "deploying",
    tools: ["chat", "knowledge_base", "ticket_system"],
    lastActive: "Just now",
    createdAt: "2026-07-14T11:00:00Z",
    apiKeyConfigured: false,
    model: "deepseek-chat",
    taskCount: 0,
    successRate: 0,
  },
  {
    id: "agent-005",
    name: "Market Monitor",
    description: "Real-time market data aggregator with anomaly detection",
    type: "worker",
    status: "offline",
    tools: ["market_data", "anomaly_detector", "reporting"],
    lastActive: "2 days ago",
    createdAt: "2026-07-05T16:45:00Z",
    apiKeyConfigured: true,
    model: "deepseek-chat",
    taskCount: 230,
    successRate: 91.3,
  },
];

export const mockSystemStatus: SystemStatus = {
  uptime: "14d 7h 23m",
  activeAgents: 3,
  totalTasks: 515,
  cpuUsage: 34,
  memoryUsage: 62,
  apiStatus: "connected",
  version: "1.0.0-beta.4",
};

export const mockLogs: LogEntry[] = [
  { id: "log-001", agentId: "agent-001", timestamp: "2026-07-15T10:23:00Z", level: "info", message: "Starting research task: market analysis Q3 2026" },
  { id: "log-002", agentId: "agent-001", timestamp: "2026-07-15T10:23:15Z", level: "debug", message: "Fetching data from 3 sources" },
  { id: "log-003", agentId: "agent-003", timestamp: "2026-07-15T10:20:00Z", level: "error", message: "Pipeline stage 'transform' failed: schema mismatch" },
  { id: "log-004", agentId: "agent-002", timestamp: "2026-07-15T10:18:00Z", level: "info", message: "Code review completed for PR #847" },
  { id: "log-005", agentId: "agent-001", timestamp: "2026-07-15T10:24:00Z", level: "info", message: "Research complete: 12 sources analyzed" },
  { id: "log-006", agentId: "agent-003", timestamp: "2026-07-15T10:19:00Z", level: "warn", message: "Retry attempt 2/3 for pipeline stage" },
  { id: "log-007", agentId: "agent-004", timestamp: "2026-07-15T10:25:00Z", level: "info", message: "Deployment in progress: container build stage" },
  { id: "log-008", agentId: "agent-001", timestamp: "2026-07-15T10:22:00Z", level: "debug", message: "Token usage: 4.2k input, 1.8k output" },
];

export const availableTools = [
  { id: "web_search", name: "Web Search", description: "Search the web for real-time information", icon: "Globe" },
  { id: "document_parser", name: "Document Parser", description: "Parse and extract text from documents", icon: "FileText" },
  { id: "summarizer", name: "Summarizer", description: "Generate concise summaries from long content", icon: "TextAlignLeft" },
  { id: "code_analysis", name: "Code Analysis", description: "Analyze code for quality and bugs", icon: "Code" },
  { id: "diff_viewer", name: "Diff Viewer", description: "View and compare code differences", icon: "GitDiff" },
  { id: "commenter", name: "Commenter", description: "Add inline comments to code", icon: "ChatCircle" },
  { id: "pipeline_monitor", name: "Pipeline Monitor", description: "Monitor data pipeline health", icon: "Activity" },
  { id: "alerting", name: "Alerting", description: "Configure and manage alerts", icon: "Bell" },
  { id: "log_analyzer", name: "Log Analyzer", description: "Analyze system and application logs", icon: "MagnifyingGlass" },
  { id: "chat", name: "Chat", description: "Natural language conversation", icon: "Chats" },
  { id: "knowledge_base", name: "Knowledge Base", description: "Query and update knowledge base", icon: "BookOpen" },
  { id: "ticket_system", name: "Ticket System", description: "Create and manage support tickets", icon: "Ticket" },
  { id: "market_data", name: "Market Data", description: "Fetch real-time market data", icon: "TrendUp" },
  { id: "anomaly_detector", name: "Anomaly Detector", description: "Detect anomalies in data streams", icon: "Warning" },
  { id: "reporting", name: "Reporting", description: "Generate reports from data", icon: "ChartBar" },
];
