---
name: new-project-automation-jtbd-builder
description: "LLM-agnostic workflow automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with new project automation jtbd builder. Use when working with new project automation jtbd builder."
---

# New Project Automation — JTBD Builder (PAL-Powered)

This skill compiles any project input through the **PAL (Prompt Abstraction Layer)** pipeline into a deployment-ready JTBD blueprint with every task classified by NPAO priority (N→A→P→O). It produces a **Handoff Package** that a Builder Agent can receive and execute autonomously.

---

## Framework References

This skill is built on the **ROSTR Framework** — a unified architecture for production-grade multi-agent systems. All framework behavior in this skill is defined by and must conform to the canonical paper:

> **ROSTR Research Paper:** https://rostr-paper.vercel.app
> *{{USER_NAME}} — GTM AI & Automation Manager, {{COMPANY_NAME}}*

When any framework term or behavior is unclear, fetch the live paper as the authoritative source. Do not guess at framework definitions.

### Framework Modules Used in This Skill

| Module | What It Does in This Skill | Reference |
|---|---|---|
| **PAL** — Prompt Abstraction Layer | 5-stage compilation pipeline that transforms raw input into a deployable agent spec | https://rostr-paper.vercel.app/#s4 |
| **NPAO** — Priority Framework | Classifies every task as Necessity / Anxiety / Priority / Opportunity and enforces N→A→P→O execution order | https://rostr-paper.vercel.app/#s6 |
| **RAG DAL** — Retrieval/Data Abstraction Layer | Unified query interface for enriching KB with web search, internal docs, CRM data | https://rostr-paper.vercel.app/#s5 |
| **ContextEngine** | Persistent session memory stored at `.context-engine/sessions/[project-name]/` | https://rostr-paper.vercel.app/#s8 |
| **ROSTR Hub** | Runtime, Orchestration, State, Tools, Reference — agent coordination layer | https://rostr-paper.vercel.app/#s7 |
| **4Ds Lifecycle** | PreD → D1 → D2 → D3 → D4 phase progression with NPAO-dominant phase mapping | https://rostr-paper.vercel.app/#s6-7 |

### Key Framework Rules (from paper — non-negotiable)

- **PAL DSL uses `agent:` as the root key** — never `apiVersion:`, never Kubernetes-style schema
- **NPAO execution order is strictly N → A → P → O** — Anxiety runs before Priority; unresolved anxiety degrades Priority execution quality
- **4Ds gate rule:** Never advance to D2 (Develop) until all D1 (Design) decisions are locked
- **RAG DAL tool references use adapter notation:** `rag_dal.web_search`, `rag_dal.knowledge_base`, `rag_dal.crm_query`
- **ContextEngine storage path:** `.context-engine/sessions/[build-name]/` — flat file, zero infrastructure

---

## Step 0 — Intake Triage

Before compiling, classify the input type and route accordingly:

| Input Type | Signal | Action |
|---|---|---|
| New project idea | "I want to build..." | Full PAL pipeline L1→L5 |
| Existing PRD | Structured doc with goals, tech stack | Extract intent → L2→L5 only |
| Asana task dump | List of tasks, no structure | Extract intent → reclassify via NPAO → L2→L5 |
| Vague goal | "Make our outbound better" | Ask 1 clarifying question → L1→L5 |
| Existing system prompt or skill | Formatted instructions | Reverse-compile → recompile L1→L5 |
| Project backlog / braindump | Multiple jobs at once | Decompose → prioritize → compile each |
| Full ROSTR Build Spec | `agent:` YAML | Validate → optimize L3→L5 only |

If input is too vague: ask exactly one clarifying question:
> *"What is the primary outcome this project must produce — what does the user receive at the end that they couldn't get before?"*

Label all assumptions: `[Assumption]` / `[Open Question]` / `[Recommended Default]`

---

## The PAL Compilation Pipeline

*(Reference: https://rostr-paper.vercel.app/#s4)*

PAL is a 5-stage compiler. Every project runs all stages in order. No skipping. No merging.

The PAL pipeline transforms declarative intent into a precise, deployable agent specification — the same way a compiler transforms source code into an executable. The output is not a description; it is a runtime.

---

### ◈ PAL Stage 1 — Intent Extraction

**Purpose:** Strip format noise. Isolate the raw agent intent. No tools, no tasks yet.

**Driven by the Project Intake Questionnaire** — silently map user input against all 11 questionnaire sections:

| Questionnaire Section | PAL L1 Field |
|---|---|
| Section 0 — Project Health | 4Ds entry phase, CoE gap |
| Section 1 — Project Identity | Agent role, project type, scope |
| Section 2 — Problem Statement | Core JTBD: when / want / outcome |
| Section 3 — Goals & Success | Desired outcomes, KPIs |
| Section 4 — Scope & Constraints | Hard constraints, out-of-scope |
| Section 5 — Users & Personas | Who, technical level, scale |
| Section 6 — Tech Stack & Data | Inputs, outputs, API status |
| Sections 7–10 | RAG candidates, anxiety signals, opportunities |

**Labeling:**
- `[Extracted]` — directly stated in input
- `[Inferred]` — derivable from context
- `[UNKNOWN — enrich via RAG DAL]` — not present; system will attempt web search
- Required field missing → **N-class blocker**
- Ambiguous scope or missing API → **A-class anxiety**

**L1 Output block:**
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

### ◈ PAL Stage 2 — Composition

**Purpose:** Decompose intent into discrete functional behaviors. Assign NPAO class. Build execution skeleton.

*(NPAO reference: https://rostr-paper.vercel.app/#s6)*

For each goal from L1:
1. Break into atomic functional behaviors
2. Map each to a template pattern: `researcher` / `extractor` / `summarizer` / `reasoner` / `formatter` / `copywriter` / `classifier` / `ranker` / `validator` / `orchestrator`
3. Assign NPAO class per paper definitions:
   - **N (Necessity):** "I MUST" — hard blocker; nothing downstream runs without it
   - **A (Anxiety):** "I WON'T HAVE PEACE" — unresolved friction that degrades Priority execution
   - **P (Priority):** "I NEED" — core mission work that directly advances the objective
   - **O (Opportunity):** "I CAN" — optional growth; pursue when N, A, P are complete
4. Identify dependencies. Assemble execution order: **N → A → P → O**

**L2 Output block:**
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

### ◈ PAL Stage 3 — Optimization

**Purpose:** Allocate resources. Select tools. Set memory. Tune approach. Flag risks.

- **Context budget:** allocate tokens across system prompt / examples / tool schema / user input / output
- **Tool selection (ranked by priority):**
  - P1 (required) / P2 (useful) / P3 (optional)
  - {{COMPANY_NAME}} GTM standard tools: `rag_dal.web_search`, `rag_dal.web_fetch`, `hubspot_api`, `notion_api`, `asana_api`, `n8n_webhook`, `clay_table`, `amplemarket_api`, `file_read_write`, `mermaid_renderer`
- **Memory mode:** `stateless` / `short_term` / `long_term` (ContextEngine)
- **Sampling strategy:** `deterministic` (extraction, formatting) / `exploratory` (ideation, copy) / `balanced` (default)
- **NPAO risk check:** any unresolved N-class blocking P-class? Flag explicitly.

**L3 Output block:**
```
PAL-L3 — Optimization:
  Context budget: { system_prompt: Xt, examples: Xt, tools: Xt, input: Xt, output: Xt }
  Tools: P1: [tool — why] | P2: [tool — why] | P3: [tool — why]
  Memory: [mode] | Sampling: [strategy]
  NPAO risks: [unresolved N-class] | [unresolved A-class]
  Tradeoff flags: [latency | cost | quality | scope]
```

---

### ◈ PAL Stage 4 — Compilation

**Purpose:** Compile the agent spec. Produce the deployable system prompt and ROSTR DSL YAML.

**System prompt snippet** (compiled, deployable as-is):
```
You are [role] for [context].
Your job is to [primary objective].
When you receive [input], you will: 1. [Step] 2. [Step] 3. [Step]
You always produce [output format] including: [required fields]
You do NOT: [prohibited behaviors]
Quality bar: [what done looks like]
```

**PAL Agent Spec — ROSTR DSL YAML** (`agent:` root key — per paper):
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
    - rag_dal.web_fetch
    - [other tools from L3 P1 list]
  memory:
    type: "[stateless | short_term | long_term]"
    backend: "[none | session | context_engine]"
    storage_path: ".context-engine/sessions/[project-name]/"
  guardrails:
    - "[hard constraint 1]"
    - "[hard constraint 2]"
    - max_tool_calls: [number]
    - timeout_seconds: [number]
```

---

### ◈ PAL Stage 5 — Runtime

**Purpose:** Produce the complete NPAO task canvas + Handoff Package for Agent 2.

This is the full deployable output: task queue, build prompts, integration checklist, guardrail gates, dashboard config.

---

## API Readiness Protocol

Triggered when any integration is unconfirmed (Q6.4 = No / Some / Unsure).

Runs as an N-class task. Project cannot advance to D2 until all required APIs have a confirmed acquisition path.

**Per unconfirmed tool:**
```
🔑 API READINESS — [Tool Name]
Status: NOT CONFIRMED | Used for: [task]

Option A — Get the key:
  1. [Direct URL to developer console / API settings]
  2. [Steps: where to click, what to create]
  3. Copy: [key name / format]
  4. Paste into: [n8n credential | .env | config file]
  Time: ~[X min]

Option B — Alternative:
  • [Tool] — [tradeoffs]

Option C — Skip: Impact: [what breaks]
Docs: [official API documentation URL]
```

**Integration documentation lookup** (for new tools):
Fetch official docs via `rag_dal.web_search` → extract auth method, base URL, key endpoints, rate limits, SDK → add to `TECH_STACK.md`:
```
INTEGRATION BUILD PROMPT — [Tool]
Auth: [method + credential location]
Base URL: [url]
Key endpoints: [endpoint — purpose — request/response shape]
Rate limits: [calls/sec or day]
SDK: [name + install command]
Docs: [link]
```

**Post-blueprint integration checklist** (always shown when any API unconfirmed):
```
⚡ BEFORE YOU BUILD — INTEGRATION CHECKLIST
  [ ] [Tool 1] — [status] — [link or instruction]
  [ ] [Tool 2] — [status] — [link or instruction]
Want me to walk you through any of these?
```

---

## JTBD Output Structure

Full blueprint produced after all PAL stages. Never omit sections that affect buildability.

---

### 1–5. Core JTBD Fields

- **Job Title:** Verb + noun ("Automate Prospect Research")
- **Executive Summary:** 2–3 sentences for leadership, no jargon
- **Core JTBD:** `When [trigger], I want to [action], so I can [outcome]`
- **User Context:** who / trigger / frustration eliminated / after state / scale
- **Desired Outcomes:** 3–5 measurable outcomes with metric + timeframe

---

### 6. PAL Compilation Summary *(always required)*

```
PAL_Compilation_Summary:
  L1 — Intent: Goal(s), Role, Constraints, 4Ds Phase, CoE Gap, API Readiness
  L2 — Composition: Behaviors + NPAO class, template patterns, execution order
  L3 — Optimization: Context budget, Tools P1/P2/P3, Memory mode, Sampling, NPAO risks
  L4 — Compilation: System prompt ✓, Agent spec YAML ✓
  L5 — Runtime: NPAO canvas task count (N/A/P/O), Handoff Package ✓, Deployment flags
```

---

### 7. NPAO Task Canvas

*(Full reference: https://rostr-paper.vercel.app/#s6-4)*

```
NPAO TASK CANVAS — [Project Name]
Mission: [one-line]
4Ds Phase: [current] | Dominant NPAO class: [per phase]

══════════════════════════════════════════
N — NECESSITY ("I MUST") — resolve first
Nothing downstream proceeds without these.
══════════════════════════════════════════
  N1. [Task name]
      Owner: [role] | Est: [duration]
      Done when: [specific criterion]
      Build prompt: [instruction for Agent 2]
      Subtasks: N1a. [subtask] / N1b. [subtask]
      Blocks: [downstream task IDs]

══════════════════════════════════════════
A — ANXIETY ("I WON'T HAVE PEACE") — clear before Priority
Unresolved friction that degrades P-class execution.
══════════════════════════════════════════
  A1. [Task name]
      Owner: [role] | Est: [duration]
      Done when: [criterion]
      Why anxiety (not priority): [rationale]
      Build prompt: [instruction]
      Resolves: [what friction this eliminates]

══════════════════════════════════════════
P — PRIORITY ("I NEED") — core mission work
Execute with full focus after N and A are clear.
══════════════════════════════════════════
  P1. [Task name]
      Owner: [role] | Est: [duration] | 4Ds: [phase]
      Done when: [criterion]
      Build prompt: [instruction]
      Subtasks: P1a. / P1b. / P1c.
      Feeds: [downstream task ID]

══════════════════════════════════════════
O — OPPORTUNITY ("I CAN") — pursue when bandwidth allows
Non-blocking. Compounding value.
══════════════════════════════════════════
  O1. [Task name]
      Owner: [role] | Est: [duration]
      Done when: [criterion]
      Value if completed: [what this adds]
      Build prompt: [instruction]

══════════════════════════════════════════
Execution Queue: N1 → N2 → A1 → A2 → P1 → P2 → O1
══════════════════════════════════════════
```

---

### 8–12. Supporting Sections

- **Agent Role Design:** role + responsibilities + NOT responsible for + tone + escalation triggers
- **Capabilities Required:** capability / template pattern / NPAO class / required? table
- **Inputs:** input / type / required? / source / edge cases table
- **Outputs:** output / format / destination / schema notes table
- **Constraints and Guardrails:** hard limits, data access, output rules, human review triggers, failure behavior, CoE compliance

---

### 13. System Instructions Snippet *(compiled, deployable)*

PAL Stage 4 output — ready to deploy as agent system prompt.

---

### 14. PAL Agent Spec *(ROSTR DSL)*

PAL Stage 4 output — `agent:` root key YAML, version-controlled.

---

### 15–17. Quality and Risk

- **Success Metrics:** metric / target / measurement / timeframe table
- **Risks and Failure Modes:** risk / likelihood / impact / mitigation + highest hallucination risk flagged
- **Recommended Next Step:** one specific action, owner, prerequisite, done-when criterion

---

## CoE Leadership Summary *(auto-generated, always included)*

```
══════════════════════════════════════
LEADERSHIP SUMMARY — [Project Name]
Owner: [name] | Phase: [4Ds] | Last Updated: [date]
══════════════════════════════════════
WHAT IS THIS? [2 sentences. Plain English. No acronyms.]
WHY NOW? [1 sentence. Business driver.]
SUCCESS LOOKS LIKE: • [Outcome 1] • [Outcome 2] • [Outcome 3]
WHERE WE ARE: [4Ds phase] — [status + next milestone]
RISKS / BLOCKERS: [N-class + A-class items, or "None"]
LINKS: [PRD] | [Architecture] | [JTBD Plan] | [Asana]
══════════════════════════════════════
```

---

## Multi-Agent Execution Architecture

### System Flow

```
USER PROMPT → AGENT 1 (Planner / This Skill)
                │  Questionnaire Extraction
                │  PAL L1→L5 Pipeline
                │  JTBD Blueprint + Handoff Package
                ▼
         [CONFIRMATION GATE]
         User approves plan
                │
                ▼
             AGENT 2 (Builder)
                │  Executes N→A→P→O queue
                │  Calls tools via Handoff Package build prompts
                │  Emits status blocks to Dashboard
                │  Pauses at guardrail gates
                ▼
         COMPLETED PROJECT
```

---

### The Handoff Package

Self-contained JSON payload. Agent 2 never needs to ask Agent 1 a question.

```json
{
  "handoff_package": {
    "version": "1.0",
    "rostr_paper": "https://rostr-paper.vercel.app",
    "project": {
      "name": "[name]",
      "type": "[type from Q1.2]",
      "owner": "[owner]",
      "phase": "[4Ds phase]",
      "coe_gap": "[yes | no | partial]",
      "workspace_path": "/New Project Automation/projects/[YYYY-MM-DD]-[name]/"
    },
    "intent_summary": {
      "goal": "[verb + noun]",
      "role": "[system identity]",
      "core_jtbd": "When [X], I want to [Y], so I can [Z]"
    },
    "pal_runtime": {
      "system_prompt": "[compiled — deploy as-is]",
      "agent_spec_yaml": "[ROSTR DSL agent: spec]"
    },
    "npao_queue": [
      {
        "id": "N1", "class": "N",
        "task": "[name]", "est_minutes": 30,
        "done_when": "[criterion]",
        "build_prompt": "[full instruction for Agent 2]",
        "tools_required": ["rag_dal.web_search"],
        "api_status": "confirmed | unconfirmed | not_needed",
        "blocks": ["P1"]
      }
    ],
    "integration_checklist": [
      { "tool": "[name]", "status": "confirmed | unconfirmed", "required_for": "[task ID]", "setup_url": "[link]", "alternative": "[alt tool]" }
    ],
    "guardrail_gates": [
      { "gate_id": "G1", "trigger": "Before any P-class task", "checkpoint": "All N + A complete?", "action_if_blocked": "Surface to user. Do not proceed." },
      { "gate_id": "G2", "trigger": "D3 Deploy entry", "checkpoint": "Explicit user approval", "action_if_blocked": "Pause. Present deployment summary." },
      { "gate_id": "G3", "trigger": "Unconfirmed API hit during execution", "checkpoint": "API Readiness Protocol", "action_if_blocked": "Block and report. Never substitute silently." },
      { "gate_id": "G4", "trigger": "Ambiguous requirement — two meaningfully different builds possible", "checkpoint": "Ask one clarifying question", "action_if_blocked": "Do not guess on scope-altering decisions." }
    ],
    "dashboard_config": {
      "destination": "[Slack | n8n webhook | Notion | email]",
      "update_frequency": "after_each_task"
    }
  }
}
```

---

### Build Prompt Format (per task)

```
BUILD PROMPT — [Task ID]: [Task Name]
NPAO: [N | A | P | O] | Phase: [4Ds] | Est: [X min]
Prerequisites: [task IDs that must be complete]

OBJECTIVE: [1–2 sentences — what must exist when done]

INSTRUCTIONS:
1. [Step — verb-first, names exact tool or file]
2. [Step]
3. [Step]

TOOLS: [tool]: [call / endpoint]
DONE WHEN: [exact criterion]
OUTPUT: [file path, field, or API response to verify]
IF BLOCKED: [fallback — never skip silently]
```

---

### Guardrail Confirmation Format

```
✅ CHECKPOINT — [Gate ID]
Project: [name] | Phase: [4Ds]
COMPLETED: ✓ [N1] ✓ [A1]
READY TO START: → [P1] — [what this builds]
INTEGRATION STATUS: [ ] [Tool] — [status]
[APPROVE AND CONTINUE] or tell me what to change.
```

---

### Dashboard Status Block (emitted after each task)

```
[PROJECT] — Build Update
✓ [Task ID] [Task Name] | Output: [what was created] | Next: [Task ID]
Progress: N[████░] A[███░░] P[█░░░░] O[░░░░░] | ~[X] tasks left
```

---

### Handoff Trigger (user approval before Agent 2 starts)

```
🚀 READY TO BUILD — [Project Name]
WHAT GETS BUILT: • [output 1] • [output 2] • [output 3]
TASKS: [N] total | N:[x] A:[x] P:[x] O:[x] | Gates: [x]
INTEGRATIONS: ✓ [confirmed] | ⚠ [unconfirmed — will walk through]
FILES: [workspace_path]
[YES, BUILD IT]  [REVIEW PLAN FIRST]  [MAKE CHANGES]
```

---

### Operating Modes

| Mode | Description | Agent 2 |
|---|---|---|
| **Full Pipeline** | Idea → deployed system | Executes N→A→P; O optional |
| **Plan Only** | Blueprint, no build | Not invoked |
| **Build Only** | Existing PRD provided | Converts to Handoff Package, executes |
| **Checkpoint Mode** | Approval at every task | Pauses after each task |
| **Fast Build** | N + P only | Executes N→P; flags A for follow-up |
| **Discovery** | Vague input | Clarify before planning |

---

## NPAO Quick Reference

*(Full specification: https://rostr-paper.vercel.app/#s6)*

```
N — NECESSITY: "I MUST"
  Hard blocker. Nothing downstream works without it.
  Auth, schema, DB creation, API access, access provisioning.
  Schedule FIRST. Cannot be skipped.

A — ANXIETY: "I WON'T HAVE PEACE"
  Persistent friction. Unresolved loop. Degrades P-class execution.
  Ambiguous scope, broken dependency, missing edge cases, stale data.
  Execute BEFORE Priority. Open >3 days → escalate to N-class.

P — PRIORITY: "I NEED"
  Mission-critical. Directly advances the objective.
  Build, write, generate, create, deploy.
  Execute THIRD — with full focus, all N and A cleared.

O — OPPORTUNITY: "I CAN"
  Optional growth. Non-blocking. Compounding value.
  Logging, dashboards, fallback enrichment, notifications.
  Execute LAST — only when N, A, P complete.

ORDER: N → A → P → O
CRITICAL: Anxiety before Priority — unresolved loops degrade
          execution quality on core mission work.
```

---

## 4Ds Phase Gate Reference

*(Reference: https://rostr-paper.vercel.app/#s6-7)*

| Phase | Name | Dominant NPAO | Rule |
|---|---|---|---|
| PreD | Drafting | N | Research and validate. Prove before building. |
| D1 | Design | P | Lock all decisions. Nothing moves to D2 until locked. |
| D2 | Develop | P + A | Build. Clear blockers in parallel. |
| D3 | Deploy | N | Hard gate — explicit user approval required. |
| D4 | Debug | A + O | Fix first, then optimize. |

---

## {{COMPANY_NAME}} GTM Auto-Context

- **ICP:** Companies expanding globally, 50–5,000 employees, hiring in 2+ countries
- **Persona:** VP/Director HR, Head of People, CFO at smaller cos
- **GTM stack:** HubSpot → Clay → Amplemarket → n8n → Factors.ai
- **Competitors:** Deel (aggregator), Remote, Rippling
- **End users:** Non-technical reps and marketers — outputs must be immediately actionable
- **Scale:** 50+ users — consistency across all of them is the standard

---

## Output Quality Rules

Every blueprint must be specific, implementation-oriented, NPAO-classified (per https://rostr-paper.vercel.app/#s6), phase-aware, modular, and CoE-compliant.

Never: skip PAL Compilation Summary / use vague language / fabricate constraints / force multi-agent architecture when one agent is sufficient / mark P-class tasks when N-class dependencies are unresolved.

**The job is done when Agent 2 can execute the Handoff Package without asking a single question.**
