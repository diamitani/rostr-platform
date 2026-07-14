---
sidebar_position: 8
---

# Rostr Hub — Agent Operating System

**Agent OS** — 4-level persistent state management with knowledge compounding.

## Reference Hub Architecture

```
rostr-hub/
├── projects/{project-id}/
│   ├── README.md           # Purpose, goals
│   ├── goals.md            # Current objectives
│   ├── decisions.md        # Key decisions + rationale
│   ├── architecture.md     # System design
│   ├── knowledge-base/     # RAG DAL outputs
│   ├── learnings.jsonl     # Agent insights
│   ├── timeline.jsonl      # Action log
│   └── checkpoints/        # Progress snapshots
│
├── orgs/{org-id}/
│   ├── identity.md         # Mission, values
│   ├── icp.md              # Ideal customer profile
│   ├── positioning.md      # Messaging, brand
│   ├── playbooks/          # Repeatable processes
│   └── knowledge-base/     # Org-wide knowledge
│
├── teams/{team-id}/
│   ├── agents.md           # Registered agents
│   ├── conventions.md      # Working agreements
│   └── shared-context/     # Team knowledge
│
└── global/
    ├── knowledge-base/     # Public shared
    └── agent-templates/    # Reusable definitions
```

## 4-Level State Management

| Level | Scope | Storage | Lifetime |
|-------|-------|---------|----------|
| **Session** | Active tasks, in-progress work | In-memory / Redis | Process lifetime |
| **Project** | Decisions, artifacts, learnings | File-based + vector DB | Project lifetime |
| **Organization** | Identity, ICP, positioning | File-based, version-controlled | Org lifetime |
| **Agent** | Skills, preferences, calibration | Agent namespace | Cross-session |

## Agent Registration

```json
{
  "agent_id": "uuid-v4",
  "name": "Builder Agent — Feature Implementation",
  "type": "builder",
  "capabilities": ["code_generation", "test_writing", "refactoring"],
  "tools": ["file_system:read", "file_system:write", "code_execution"],
  "phases": ["development", "debugging"],
  "model": "claude-sonnet-4",
  "max_parallel_tasks": 3,
  "performance_stats": {
    "tasks_completed": 127,
    "avg_completion_time_minutes": 18,
    "success_rate": 0.94
  }
}
```

## Knowledge Compounding

The Hub's core innovation: **agents never start from scratch.**

1. Agent A resolves a bug → saves learning to Hub
2. Agent B loads the same project → Hub injects Agent A's learning
3. Agent C encounters a similar bug in a different project → cross-project knowledge transfer

This turns every agent interaction into compound interest on knowledge.
