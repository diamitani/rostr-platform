---
name: pal-framework-skill
description: "LLM-agnostic AI agent development skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with PAL — Prompt Abstraction Layer. Use when working with pal."
---

# PAL — Prompt Abstraction Layer

**Canonical source:** https://rostr-paper.vercel.app/#s4
*Read this file before running the PAL pipeline. Fetch the live section only if a definition is still unclear.*

PAL is a **5-stage compiler**. It transforms declarative intent into a precise, deployable agent specification — the same way a compiler turns source code into an executable. The output is not a description; it is a runtime.

**Run all five stages in order. Never skip a stage. Never merge stages into a single pass.** Each stage is a distinct reasoning step that emits its own labeled output block.

---

## ◈ Stage 1 — Intent Extraction

**Purpose:** Strip format noise and implementation detail. Isolate the raw agent intent. No tools, no tasks yet.

Inside the New Project System, L1 is **driven by the Project Intake Questionnaire** — silently map the user's input against all 11 questionnaire sections:

| Questionnaire Section | PAL L1 Field |
|---|---|
| 0 — Project Health | 4Ds entry phase, CoE gap |
| 1 — Project Identity | Agent role, project type, scope |
| 2 — Problem Statement | Core JTBD: when / want / outcome |
| 3 — Goals & Success | Desired outcomes, KPIs |
| 4 — Scope & Constraints | Hard constraints, out-of-scope |
| 5 — Users & Personas | Who, technical level, scale |
| 6 — Tech Stack & Data | Inputs, outputs, API status |
| 7–10 | RAG candidates, anxiety signals, opportunities |

**Labeling:** `[Extracted]` (stated) · `[Inferred]` (derivable) · `[UNKNOWN — enrich via RAG DAL]` (absent). A missing required field → **N-class blocker**; ambiguous scope or missing API → **A-class anxiety**.

**L1 output block:**
```
PAL-L1 — Intent:
  Questionnaire coverage: [X/11 sections]
  Goal(s): [verb + noun] — [Extracted | Inferred | UNKNOWN]
  Role: [system identity] — [Extracted | Inferred]
  User context: [who, trigger, frustration]
  Constraints: [hard limits]
  Inputs: [list]
  Outputs: [list]
  4Ds Entry Phase: [PreD | D1 | D2 | D3 | D4]
  CoE Gap: [Yes | No | Partially]
  API Readiness: [Ready | Partial | Blocked]
  N-class gaps: [required fields missing]
  A-class gaps: [ambiguous items]
  O-class gaps: [optional skipped]
```
> Intent only. No tools. No tasks.

---

## ◈ Stage 2 — Composition

**Purpose:** Decompose intent into discrete functional behaviors, assign each an NPAO class, and build the execution skeleton.

For each goal from L1:
1. Break into atomic functional behaviors.
2. Map each to a template pattern: `researcher` / `extractor` / `summarizer` / `reasoner` / `formatter` / `copywriter` / `classifier` / `ranker` / `validator` / `orchestrator`.
3. Assign NPAO class (see `NPAO_4Ds_FRAMEWORK.md`): **N** (hard blocker) · **A** (friction that degrades P) · **P** (core mission work) · **O** (optional growth).
4. Identify dependencies. Assemble execution order: **N → A → P → O**.

**L2 output block:**
```
PAL-L2 — Composition:
  Behaviors + NPAO Class:
    [behavior] → [pattern] → [N | A | P | O]
  Execution order:
    N: [list] | A: [list] | P: [list] | O: [list]
  Template patterns: [list]
  Handoff logic: [how behaviors chain]
  Conflicts/ambiguities: [flagged — not silently resolved]
  4Ds phase gate: [what locks before advancing]
```

---

## ◈ Stage 3 — Optimization

**Purpose:** Allocate resources, select tools, set memory mode, tune sampling, flag risks.

- **Context budget:** allocate tokens across system prompt / examples / tool schema / user input / output (default target: fit within 8k).
- **Tool selection (ranked):** P1 (required) / P2 (useful) / P3 (optional). Prune anything that adds schema overhead without clear value. {{COMPANY_NAME}} GTM standard tools: `rag_dal.web_search`, `rag_dal.web_fetch`, `rag_dal.knowledge_base`, `rag_dal.crm_query`, `hubspot_api`, `notion_api`, `asana_api`, `n8n_webhook`, `clay_table`, `amplemarket_api`, `file_read_write`, `mermaid_renderer`.
- **Memory mode:** `stateless` / `short_term` / `long_term` (ContextEngine).
- **Sampling:** `deterministic` (extraction, formatting) / `exploratory` (ideation, copy) / `balanced` (default).
- **NPAO risk check:** any unresolved N-class blocking P-class? Flag explicitly.

**L3 output block:**
```
PAL-L3 — Optimization:
  Context budget: { system_prompt: Xt, examples: Xt, tools: Xt, input: Xt, output: Xt }
  Tools: P1: [tool — why] | P2: [tool — why] | P3: [tool — why]
  Memory: [mode] | Sampling: [strategy]
  NPAO risks: [unresolved N-class] | [unresolved A-class]
  Tradeoff flags: [latency | cost | quality | scope]
```

---

## ◈ Stage 4 — Compilation

**Purpose:** Compile the agent spec — a deployable system prompt and the ROSTR DSL YAML.

**System prompt snippet** (deployable as-is):
```
You are [role] for [context].
Your job is to [primary objective].
When you receive [input], you will: 1. [Step] 2. [Step] 3. [Step]
You always produce [output format] including: [required fields]
You do NOT: [prohibited behaviors]
Quality bar: [what done looks like]
```

**PAL Agent Spec — ROSTR DSL YAML** (`agent:` root key — never `apiVersion:`):
```yaml
agent:
  name: ""
  version: "1.0"
  phase: "[4Ds phase]"
  objective: |
    [2–3 sentences from L1]
  inputs:
    - [input_name]: [type] ([required | optional])
  outputs:
    type: object
    properties:
      [output_name]:
        type: [string | array | object]
        format: [markdown | json | plain | mermaid]
    required: [required_output_list]
  tools:
    - rag_dal.web_search
    - [other tools from L3 P1 list]
  memory:
    type: "[stateless | short_term | long_term]"
    backend: "[none | session | context_engine]"
    storage_path: ".context-engine/sessions/[project-name]/"
  guardrails:
    - "[hard constraint 1]"
    - max_tool_calls: [number]
    - timeout_seconds: [number]
```

---

## ◈ Stage 5 — Runtime

**Purpose:** Produce the complete NPAO task canvas + Handoff Package for the Builder agent. This is the full deployable output: task queue, build prompts, integration checklist, guardrail gates, dashboard config. See `JTBD_BUILDER.md` for the canvas and Handoff Package schema.

---

## PAL Compilation Summary (always required in output)

Every blueprint shows a condensed compilation trace so the reasoning stays transparent and catchable:
```
PAL_Compilation_Summary:
  L1 — Intent: Goal(s), Role, Constraints, 4Ds Phase, CoE Gap, API Readiness
  L2 — Composition: Behaviors + NPAO class, template patterns, execution order
  L3 — Optimization: Context budget, Tools P1/P2/P3, Memory, Sampling, NPAO risks
  L4 — Compilation: System prompt ✓, Agent spec YAML ✓
  L5 — Runtime: NPAO canvas task count (N/A/P/O), Handoff Package ✓, Deployment flags
```

---

## Operating Modes

| Mode | When to use | PAL stages |
|---|---|---|
| Fast JTBD | Single clear prompt | L1 → L5 (compressed) |
| Full Blueprint | Complex job, deep plan | L1 → L5 (full) |
| Multi-Agent | Multiple roles, orchestration | L1 → L5 per agent + orchestration |
| Discovery | Input too vague | Ask 1 question → L1 → L5 |
| Reverse Compile | User pastes an existing prompt | Deconstruct → re-run L1 → L5 |

**Final rule:** PAL is the engine; the job is done when the output can be handed to a builder and executed without a clarifying question.
