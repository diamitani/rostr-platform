---
sidebar_position: 4
---

# PAL — The Five Compilation Stages

A deep dive into each stage of the PAL compilation pipeline.

## Stage 1: Intent Extraction

The entry point. Raw natural language is parsed into structured intent:

```json
{
  "primary_intent": "what user wants (verb + object)",
  "domain": "code | design | research | ops | sales | content | deploy | debug",
  "subject": "thing being acted upon",
  "constraints": ["scope limits, restrictions, requirements"],
  "desired_output": "completion criteria",
  "urgency": "immediate | queued | scheduled",
  "ambiguity_score": 0.0-1.0
}
```

This extraction happens regardless of input quality. Typos, fragments, casual language — all valid.

## Stage 2: Context Injection

Load from Reference Hub:
- **Session state**: current branch, recent changes, active files
- **Project context**: architecture, conventions, CLAUDE.md
- **Org context**: ICP, brand guidelines, messaging
- **Team context**: shared conventions, tool preferences

**Context Budget Management:**
```
Max tokens = 8000
- System: 1500
- Tools: 500
- Output reserve: 200
= Context budget: 5500 tokens

Priority:
1. Critical project state
2. Relevant prior decisions (vector similarity > 0.75)
3. Domain knowledge
4. Learnings from prior runs
```

## Stage 3: Semantic Enhancement

**Rules:**
- Expand ambiguous verbs: "improve" → "identify top 3 issues by severity, propose specific fix for each"
- Add missing precision: success criteria, output format, verification method
- Decompose compound goals into phase sequence
- Remove hedging: "maybe we should" → "do X"
- Inject domain best practices

## Stage 4: Runtime Compilation

```yaml
runtime:
  agent_type: builder | researcher | reviewer | designer | deployer | debugger
  model: claude-sonnet-4 | claude-opus-4 | auto-select
  temperature: 0.0-1.0
  max_parallel_tasks: int
  timeout_seconds: int

instructions:
  behavior_profile: "analytical | creative | operational | investigative"
  completion_criteria: ["checklist"]
  escalation_policy: "auto-proceed | require-approval | human-in-loop"

tools_enabled:
  allow: ["web_search", "file_system:read", "code_execution"]
  deny: ["file_system:write:production"]

memory:
  mode: "session | project | persistent"
  save_triggers: [decisions, learnings, artifacts]

output:
  format: "markdown | json | code | action"
  destination: "return | file:path | api:endpoint"
  verification: "none | test | human-review"
```

## Stage 5: Output Routing

Route to appropriate execution layer based on domain and phase:

| Domain | Route |
|--------|-------|
| Code, Debug | Builder Agent |
| Research, Content | RAG DAL pipeline |
| Design | Design Agent |
| Ops, Deploy | Ship workflow |
| Multiple domains | NPAO orchestrator |

## PAL Modes

| Mode | Behavior |
|------|----------|
| **Transparent** (default) | Runs invisibly. User sees only output. |
| **Visible** (debug) | Surfaces extracted intent, context, enhancement. |
| **Manual Override** | User provides fully-formed prompt. PAL handles routing only. |
| **Batch Compilation** | Compiles queue of instructions for parallel agent execution. |
