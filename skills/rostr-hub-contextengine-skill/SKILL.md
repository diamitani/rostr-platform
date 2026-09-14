---
name: rostr-hub-contextengine-skill
description: "LLM-agnostic AI agent development skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with ROSTR Hub + ContextEngine. Use when working with rostr hub + contextengine."
---

# ROSTR Hub + ContextEngine

**Canonical source:** ROSTR Hub https://rostr-paper.vercel.app/#s7 · ContextEngine https://rostr-paper.vercel.app/#s8
*Read this file before wiring orchestration or persisting state. Fetch the live section only if a definition is still unclear.*

---

## ROSTR Hub — the coordination layer

ROSTR Hub is the runtime coordination layer for an agent or multi-agent system. Its five layers spell **R-O-S-T-R**.

### R — Runtime
The PAL-compiled config that actually runs.
- System prompt source: `SKILL.md` + `CLAUDE.md` ({{COMPANY_NAME}} context) + locked KB schema.
- Tool bindings: from the PAL L3 priority list.
- Version + scope (project vs. team).
- Model routing: lighter model for intake/formatting; stronger model for PRD/JTBD; reserve top tier for complex enrichment. Default to the latest Claude models.

### O — Orchestration
How steps and agents are sequenced.
- **Pattern:** sequential with conditional branching (default for the New Project System pipeline).
- **Pipeline:** Intake → DB write → KB agent → PAL engine → RAG/DAL → generation fan-out (PRD, diagram, reporting, tech stack) → JTBD plan (requires PRD) → artifact save.
- **Conditional branches:** no files/URLs → skip `web_fetch`; Asana ID present → pull task first; similar past project → surface prior KB; PRD quality gate fails → loop back to enrichment before JTBD.
- **Delegation:** the Planner (this skill, Agent 1) hands a self-contained Handoff Package to the Builder (Agent 2). No sub-agents needed for v1.
- **Trigger:** user prompt in chat (primary); n8n webhook from Asana (secondary).

### S — State
What is remembered.
- **Per-session:** raw inputs, project name/type, file paths (KB, PRD, JTBD), quality gate status, enrichment sources used.
- **Persistent (survives sessions):** all artifact paths in the project index, the domain taxonomy map (improves over time), quality feedback scores.
- **Shared:** the project index is readable by any teammate with directory access.

### T — Tools
The bound capabilities and their limits.
- `rag_dal.*`, `notion_api`, `asana_api`, `n8n_webhook`, `file_read_write`, `mermaid_renderer`, plus GTM tools (`hubspot_api`, `clay_table`, `amplemarket_api`).
- Track auth + rate limits per tool (e.g., Notion 3 req/sec → batch writes; Asana 1,500 req/min).

### R — Reference
The grounding knowledge.
- {{COMPANY_NAME}} org context (`CLAUDE.md`), locked templates (KB taxonomy, PRD template, JTBD format, naming convention), prior outputs (past KBs, past enrichment source lists).

---

## ContextEngine — persistent memory

ContextEngine gives the system memory across sessions with **zero infrastructure** — flat files on disk.

### Storage path (non-negotiable)
```
.context-engine/sessions/[project-name]/
```

### Modes
- **CACHE** (primary): store every project package run through the system.
- **RETRIEVE** (secondary): surface relevant past projects when a new intake is similar.
- **REPORT** (tertiary): generate the project index / activity digest on demand.

### What gets stored per session
```
project_id · project_name · project_type · submission_date
raw_input_summary (first 500 chars)
kb_file_path · prd_file_path · jtbd_plan_file_path
enrichment_sources_used · quality_gate_status · user_quality_score
tags (auto-extracted: tools, domain, team)
```

### Directory layout
```
.context-engine/
├── sessions/[project-name]/
│   └── [project-id]-session.md     (per-project context record)
└── CONTEXT.md                       (project index — all projects + metadata)

/New Project Automation/
├── projects/[YYYY-MM-DD]-[project-name]/   (the artifact package)
└── PROJECT_INDEX.md                         (master registry)
```

### Persistence scope
- Level: project (Patrick first; team-level on rollout).
- TTL: indefinite — projects don't expire; they are manually archived.

Use ContextEngine to (1) avoid rebuilding projects that already exist, (2) reuse prior enrichment to sharpen RAG queries, and (3) answer "show me every active GTM project" with confidence.
