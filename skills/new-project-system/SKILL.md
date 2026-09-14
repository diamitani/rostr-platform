---
name: new-project-system
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with new project system. Use when working with new project system."
---

# New Project System

This skill turns one input into one complete, leadership-ready, buildable project package — every time, in the same clean structure.

It is three things in one:
1. **The front door** — takes any idea, doc, link, Asana URL, or brain dump and runs the full intake.
2. **The engine** — compiles that input through the PAL pipeline into a PRD, architecture, reporting framework, tech stack, and an NPAO-classified JTBD build plan.
3. **The scheduler** — places the resulting tasks into real calendar time and tracks them against milestones.

The output is a self-contained **Handoff Package** that a Builder agent can execute autonomously — and a project record any leader can open and understand in 90 seconds.

---

## ⚡ Run Sequence (follow top to bottom)

When this skill triggers, execute in order. Do not skip a phase; compress when the input is thin.

1. **Read the references you need before applying a framework.** Each framework module has a reference file in `references/`. Read it first; fetch the live paper section only if still unclear.
2. **Phase 1 — Intake.** Classify input → silent questionnaire extraction → gap check.
3. **Phase 2 — Knowledge Base.** Build `MASTER_KB.md` → RAG/DAL enrichment.
4. **Phase 3 — Compile & Generate.** PAL build prompt → PRD → Architecture → Reporting → Tech Stack.
5. **Phase 4 — Build Plan.** Invoke JTBD Builder → `JTBD_BUILD_PLAN.md` (NPAO canvas + per-task build prompts).
6. **Phase 5 — Schedule** (if a calendar is connected).
7. **Phase 6 — Record & Hand Off.** Leadership Summary → save to project directory + index → Handoff Trigger.

**Hard stops:** never generate the PRD before the KB is complete; never generate the JTBD plan before the PRD passes a quality check; never mark a project complete if it lives only in chat and not in the directory.

---

## Why This Exists (Center of Excellence)

Before this system, projects lived everywhere and nowhere: half in Asana, half in Slack, the rest in someone's head. Some tasks were over-documented, some empty, none consistent. Leadership couldn't tell what was happening, why, or when — and every status request became a verbal interview.

This system ends that. **Every project that runs through it comes out in the same clean, readable, leadership-ready structure.** It is a Center of Excellence engine: it prevents new chaos and consolidates existing chaos. A project is not "done" until it exists as a structured record in the project directory — running in chat alone does not count.

---

## Framework: ROSTR

Every behavior in this skill is governed by the **ROSTR Framework** — {{USER_NAME}}'s unified architecture for production-grade AI agents and automations. The canonical, authoritative source is the live paper:

> **ROSTR Research Paper:** https://rostr-paper.vercel.app

The framework modules are bundled as reference files in `references/`. **Read the relevant reference file before applying a framework module.** When a definition is still unclear, fetch the live paper section — never guess at framework behavior.

| Module | Role in this skill | Reference file | Live section |
|---|---|---|---|
| **PAL** — Prompt Abstraction Layer | 5-stage compiler: turns raw input into a deployable agent spec | `references/PAL_FRAMEWORK.md` | [#s4](https://rostr-paper.vercel.app/#s4) |
| **NPAO** — Priority Framework | Classifies every task N→A→P→O; sets execution + scheduling order | `references/NPAO_4Ds_FRAMEWORK.md` | [#s6](https://rostr-paper.vercel.app/#s6) |
| **4Ds** — Lifecycle | PreD → D1 → D2 → D3 → D4 phase gates | `references/NPAO_4Ds_FRAMEWORK.md` | [#s6-7](https://rostr-paper.vercel.app/#s6) |
| **RAG DAL** — Retrieval/Data Abstraction | Enriches the KB via web search, internal docs, CRM | `references/RAGDAL_FRAMEWORK.md` | [#s5](https://rostr-paper.vercel.app/#s5) |
| **ROSTR Hub** — Runtime/Orchestration/State/Tools/Reference | Agent coordination layer | `references/ROSTR_HUB_CONTEXTENGINE.md` | [#s7](https://rostr-paper.vercel.app/#s7) |
| **ContextEngine** — Memory | Persists state to `.context-engine/sessions/[project]/` | `references/ROSTR_HUB_CONTEXTENGINE.md` | [#s8](https://rostr-paper.vercel.app/#s8) |
| **JTBD Builder** — Task compiler | PAL pipeline + NPAO task canvas + Handoff Package | `references/JTBD_BUILDER.md` | — |
| **Questionnaire** — Intake reference | The 11 sections L1 extraction maps against | `references/PROJECT_INTAKE_QUESTIONNAIRE.md` | — |
| **Scheduler** — Calendar | Places NPAO tasks into real time blocks | `references/SCHEDULER.md` | — |
| **PRD template** | The 14-section requirements document | `references/PRD_TEMPLATE.md` | — |

**Non-negotiable framework rules** (full detail in the reference files):
- PAL agent spec uses **`agent:`** as the root key — never `apiVersion:`, never Kubernetes-style schema.
- NPAO execution order is strictly **N → A → P → O** — Anxiety runs before Priority; unresolved anxiety degrades Priority quality.
- 4Ds gate: **never advance to D2 (Develop) until all D1 (Design) decisions are locked.**
- RAG DAL tool references use adapter notation: `rag_dal.web_search`, `rag_dal.knowledge_base`, `rag_dal.crm_query`.
- ContextEngine storage path: `.context-engine/sessions/[project-name]/` — flat files, zero infrastructure.

---

## What Gets Produced

For every project, the system outputs the following into the project directory:

| Output | File | Description |
|---|---|---|
| Leadership Summary | top of `PRD.md` | 90-second plain-English overview for any stakeholder |
| Master Knowledge Base | `MASTER_KB.md` | All project knowledge, categorized and indexed — the single source of truth |
| PAL Build Prompt | `PAL_BUILD_PROMPT.md` | Optimized LLM instruction set for executing the project |
| PRD | `PRD.md` | Project Requirements Document — all 14 sections (see `references/PRD_TEMPLATE.md`) |
| Architecture Diagram | `ARCHITECTURE.md` | Mermaid.js end-state user flow + build flow |
| Reporting Framework | `REPORTING_FRAMEWORK.md` | KPIs, data sources, storage, display, dashboard type |
| Tech Stack + Key Sheet | `TECH_STACK.md` | Tools, APIs, endpoints, auth, access status |
| JTBD Build Plan | `JTBD_BUILD_PLAN.md` | NPAO task canvas with a build prompt for every task |
| Schedule | `SCHEDULE.md` | Calendar-placed tasks + milestone tracker (if calendar connected) |
| Handoff Package | `HANDOFF_PACKAGE.json` | Self-contained payload for the Builder agent |

All files save to: `/New Project Automation/projects/[YYYY-MM-DD]-[project-name]/`
The project is also registered in `/New Project Automation/PROJECT_INDEX.md`.

---

## The Pipeline

```
USER SUBMITS INPUT
   │
   ▼
PHASE 1 — INTAKE
   1. Classify input (idea / Asana URL / doc / link / vague / email / multi)
   2. Questionnaire extraction (silent — map to all 11 sections)
   3. Gap check (surface only what can't be resolved; API readiness)
   ▼
PHASE 2 — KNOWLEDGE BASE
   4. Master KB generation (MASTER_KB.md)
   5. RAG/DAL enrichment (best practices, tools, competitors)
   ▼
PHASE 3 — COMPILE & GENERATE
   6. PAL build prompt
   7. PRD → Architecture → Reporting → Tech Stack
   ▼
PHASE 4 — BUILD PLAN
   8. JTBD build plan via JTBD Builder (NPAO canvas + build prompts)
   ▼
PHASE 5 — SCHEDULE (if calendar connected)
   9. Place tasks into calendar; track milestones
   ▼
PHASE 6 — RECORD & HAND OFF
   10. Leadership Summary
   11. Save to project directory + index
   12. Handoff Trigger → user approves → Builder executes
```

---

## Phase 1 — Intake

### Step 1: Classify the input

| Input type | Signal | Behavior |
|---|---|---|
| New idea | "I want to build X", free text | Full intake — all phases |
| Asana URL | `app.asana.com/...` | Pull all tasks + comments + attachments into KB **first**, then intake |
| Existing doc / file | `.md`, `.pdf`, `.docx`, `.txt` | Ingest as KB seed, then intake |
| Link | `https://...` | Scrape via `rag_dal.web_fetch`, ingest, then intake |
| Vague goal | One sentence, no context | Ask exactly **one** clarifying question, then intake |
| Email thread | Pasted email content | Extract project signals, then intake |
| Multiple projects | List / comma-separated | Run intake for each separately |
| Existing project (Section 0 = Yes) | "This already exists in…" | Section 0 consolidation flow first |

The one clarifying question for vague input is always:
> *"What is the primary outcome this project must produce — what does the user receive at the end that they couldn't get before?"*

### Step 2: Questionnaire extraction (silent)

Silently map the user's input against all **11 sections** of the intake questionnaire (`references/PROJECT_INTAKE_QUESTIONNAIRE.md`). The user never fills out a form — the system fills it internally and surfaces only what it can't resolve.

Label every field:
- `[Extracted]` — found directly in the input
- `[Inferred]` — derived from context or project type
- `[UNKNOWN — enrich via RAG]` — not present; will attempt web search
- `[TBD — confirm with user]` — required but missing; surface to user

Classify gaps by NPAO as you extract:
- Missing **required** field (project name 1.1, description 1.3, primary goal 3.1) → **N-class blocker**
- Missing **API/integration** info (6.1, 6.4) → **N-class** → triggers API Readiness Protocol
- Ambiguous **scope/constraints** (4.x) or missing **KPIs** (3.3–3.5) → **A-class anxiety**
- Optional context (5, 7, 8, 9, 10) → **O-class** (enrich if present, skip if not)

Output quality scales with coverage: description-only ≈ 60%, +Sections 1–3 ≈ 80%, +Sections 1–6 ≈ 95%, all sections ≈ 100%. State the estimated quality in the PRD.

### Step 3: Gap check

Surface only what cannot be resolved, then proceed:

```
──────────────────────────────────────
INTAKE GAP CHECK — [Project Name]
──────────────────────────────────────
❌ REQUIRED (project can't be named without these):
  • [Q1.1] Project name — not provided
  • [Q3.1] Primary goal — not clear from description

⚠ UNCONFIRMED INTEGRATIONS (will block build — N-class):
  • HubSpot API key — not confirmed (Q6.4)
  • n8n webhook URL — not confirmed

? RECOMMENDED (improves output quality):
  • Who is the primary end user? (Q5.1)
  • Target timeline? (Q3.6)

Fill these in, or hit [SKIP ALL] to run with what we have.
──────────────────────────────────────
```

If the user hits **SKIP ALL**, fill gaps with `[TBD]` labels and proceed; note resulting quality in the PRD.

---

## Phase 2 — Knowledge Base

### Step 4: Master KB generation

Build `MASTER_KB.md` — the single source of truth. Every downstream output is generated from this file.

```markdown
# [Project Name] — Master Knowledge Base
Generated: [date] | Version: 1.0 | Quality: [X]%

## 1. Project Identity          [Section 1 fields]
## 2. Problem Statement         [Section 2 fields]
## 3. Goals and Success Metrics [Section 3 fields]
## 4. Scope and Constraints     [Section 4 fields]
## 5. Users and Personas        [Section 5 fields]
## 6. Tech Stack and Data       [Section 6 — with API status flags]
## 7. Reference Materials       [Section 7 — with scraped summaries]
## 8. Output Preferences        [Section 8 fields]
## 9. Stakeholder Context       [Section 9 fields]
## 10. Open Context             [Section 10 + imported Asana content]
## 11. RAG Enrichment Layer     [best practices, tools, competitors — Step 5]
## 12. Extracted Signals        [facts, constraints, assumptions, open questions]
```

### Step 5: RAG/DAL enrichment

For every `[UNKNOWN — enrich via RAG]` field, and regardless of completeness, enrich the KB (see `references/RAGDAL_FRAMEWORK.md` for the source-tier strategy — pursue **completeness, not adequacy**):

- **Best practices** for this project type (Q1.2)
- **Tool / platform recommendations** for the use case (e.g., "internal SDR system" → research top platforms, processes, and proven patterns, then fold that understanding into the build prompt)
- **Competitor / industry examples** (Q7.4)
- **API documentation** for any unconfirmed integration → triggers API Readiness Protocol per tool

Write results into `Section 11 — RAG Enrichment Layer` of the KB.

---

## Phase 3 — Compile & Generate

### Step 6: PAL build prompt

Run the input through the PAL pipeline (`references/PAL_FRAMEWORK.md`) to produce `PAL_BUILD_PROMPT.md` — the optimized, deployable LLM instruction set for executing this specific project (ROLE → MISSION → INPUTS → OUTPUTS → STEP-BY-STEP → TOOLS → CONSTRAINTS → QUALITY BAR → CONTEXT).

### Step 7: Generate outputs in dependency order

Never generate a downstream output before its upstream dependency is complete:

```
MASTER_KB.md → PAL_BUILD_PROMPT.md
             → PRD.md                 (requires KB)
             → ARCHITECTURE.md         (requires PRD)
             → REPORTING_FRAMEWORK.md  (requires PRD + KPIs)
             → TECH_STACK.md           (requires Section 6 + API lookups)
```

- **PRD.md** — all 14 sections per `references/PRD_TEMPLATE.md`, Leadership Summary at the very top.
- **ARCHITECTURE.md** — Mermaid.js flowchart: user input → processing → outputs, tool connections and data flows, and the Agent 1 → Agent 2 handoff point. Include both the **end-product user flow** and the **build steps to reach that final state**.
- **REPORTING_FRAMEWORK.md** — primary KPIs (Q3.4–3.5), where each metric is **sourced**, where data is **stored**, where it is **displayed** (HTML / Notion / HubSpot / Slack), update frequency, owner.
- **TECH_STACK.md** — per tool: purpose, API status (✓ Confirmed / ⚠ Unconfirmed / ✗ Blocked), auth method + credential location, key endpoints used, fallback if unavailable.

---

## Phase 4 — JTBD Build Plan

### Step 8: Compile the build plan

Invoke the **JTBD Builder** (`references/JTBD_BUILDER.md`) with the completed KB as input. It runs the full PAL pipeline and produces `JTBD_BUILD_PLAN.md`: the NPAO task canvas (N→A→P→O) with a build prompt, owner, estimate, done-when criterion, and dependency map for **every task and subtask**. This is the document the Builder agent executes.

Every task must be classified N/A/P/O and tagged to its 4Ds phase. No P-class task may be marked ready while an N-class dependency is unresolved.

---

## Phase 5 — Schedule

### Step 9: Place tasks into calendar (if a calendar is connected)

Invoke the **Scheduler** (`references/SCHEDULER.md`). It reads the connected calendar to find open work blocks, pulls the NPAO queue from this project (and any other active projects), and places each task into a real time slot — sequenced N→A→P→O, matched to block size (Deep Work for P-class builds, Quick Hit for A-class unblocks), and tracked against the project's milestones. Output: `SCHEDULE.md` with a daily/weekly plan and a milestone tracker (ON TRACK / AT RISK / BLOCKED).

If no calendar is connected, skip this phase and note in the Handoff Trigger that scheduling is available once a calendar is linked.

---

## Phase 6 — Record & Hand Off

### Step 10: Leadership Summary

Auto-generate and place at the top of `PRD.md`. Always written for a non-technical stakeholder with 90 seconds. Never skipped.

```
══════════════════════════════════════
LEADERSHIP SUMMARY — [Project Name]
Owner: [name] | Phase: [4Ds] | Last Updated: [date]
══════════════════════════════════════
WHAT IS THIS?   [2 sentences. Plain English. No acronyms.]
WHY NOW?        [1 sentence. The business driver.]
SUCCESS LOOKS LIKE:
  • [Outcome 1 — specific, measurable]
  • [Outcome 2]
  • [Outcome 3]
WHERE WE ARE:   [4Ds phase] — [status + next milestone]
RISKS/BLOCKERS: [N-class + A-class items, or "None"]
LINKS:          [PRD] | [Architecture] | [JTBD Plan] | [Schedule] | [Asana]
══════════════════════════════════════
```

### Step 11: Save to project directory

```
/New Project Automation/projects/[YYYY-MM-DD]-[project-name]/
  ├── MASTER_KB.md
  ├── PAL_BUILD_PROMPT.md
  ├── PRD.md
  ├── ARCHITECTURE.md
  ├── REPORTING_FRAMEWORK.md
  ├── TECH_STACK.md
  ├── JTBD_BUILD_PLAN.md
  ├── SCHEDULE.md            (if calendar connected)
  └── HANDOFF_PACKAGE.json
```

Register in `PROJECT_INDEX.md`:
```
| [Date] | [Project Name] | [Type] | [Owner] | [4Ds Phase] | [Quality %] | [Links] |
```

Optionally persist session state via ContextEngine to `.context-engine/sessions/[project-name]/` (see `references/ROSTR_HUB_CONTEXTENGINE.md`).

### Step 12: Handoff Trigger

```
══════════════════════════════════════
✅ PROJECT PACKAGE COMPLETE — [Project Name]
══════════════════════════════════════
WHAT WAS BUILT:
  ✓ Master Knowledge Base    ✓ PRD (+ Leadership Summary)
  ✓ PAL Build Prompt         ✓ Architecture Diagram
  ✓ Reporting Framework      ✓ Tech Stack + Key Sheet
  ✓ JTBD Build Plan ([N] tasks — N:[x] A:[x] P:[x] O:[x])
  ✓ Schedule (if calendar connected)

PACKAGE QUALITY: [X]%   |   SAVED TO: /projects/[YYYY-MM-DD]-[name]/

INTEGRATIONS:
  ✓ [confirmed tool]
  ⚠ [unconfirmed tool] — setup steps in TECH_STACK.md
──────────────────────────────────────
WHAT'S NEXT?
  [🚀 HAND OFF TO BUILDER — start autonomous execution]
  [📅 SCHEDULE IT — place tasks in my calendar]
  [📋 REVIEW PACKAGE FIRST]
  [✏️ MAKE CHANGES]
  [📊 PUSH JTBD TASKS TO ASANA]
══════════════════════════════════════
```

On **HAND OFF TO BUILDER** → emit `HANDOFF_PACKAGE.json` (schema in `references/JTBD_BUILDER.md`) → pass to the Builder agent (Agent 2).

---

## Multi-Agent Handoff (Idea → Done in the Background)

This skill is **Agent 1 (the Planner)**. It never builds — it plans, then hands off.

```
USER PROMPT → AGENT 1 (Planner = this skill)
                Questionnaire extraction → PAL L1→L5 → JTBD plan → Handoff Package
                      │
                      ▼
               [CONFIRMATION GATE — user approves the plan]
                      │
                      ▼
               AGENT 2 (Builder)
                Executes the N→A→P→O queue using the build prompts
                Pauses at guardrail gates · emits a status block per task
                      │
                      ▼
               COMPLETED PROJECT (live feed → dashboard)
```

The **Handoff Package** is a self-contained JSON payload so Agent 2 never needs to ask Agent 1 a question. It contains: project metadata, intent summary, compiled PAL runtime (system prompt + `agent:` spec YAML), the full NPAO queue with a build prompt per task, the integration checklist, the guardrail gates, and the dashboard config. Full schema and the Builder execution protocol are in `references/JTBD_BUILDER.md`.

### Guardrail gates (Agent 2 always pauses here)

| Gate | Trigger | Checkpoint | If blocked |
|---|---|---|---|
| **G1** | Before any P-class task | All N + A complete? | Surface to user; do not proceed |
| **G2** | Entering D3 (Deploy) | Explicit user approval | Pause; present deployment summary |
| **G3** | Unconfirmed API hit at runtime | API Readiness Protocol | Block and report; never substitute silently |
| **G4** | Ambiguous, scope-altering decision | Ask one clarifying question | Do not guess |

The user sees a clean approve/modify prompt at each gate plus a per-task status feed — not raw logs.

---

## API Readiness Protocol

Whenever an integration is unconfirmed (Q6.4 = No / Some / Unsure), it runs as an **N-class** task — the project cannot advance to D2 until every required API has a confirmed acquisition path. Surface a readiness block per tool:

```
🔑 API READINESS — [Tool Name]
Status: NOT CONFIRMED   |   Used for: [specific task]

Option A — Get the key yourself:
  1. Go to: [direct URL]
  2. [Steps: where to click, what to create]
  3. Copy: [key name / format]
  4. Paste into: [n8n credential | .env | config]
  Time: ~[X] min

Option B — Alternative: [tool] — [tradeoffs]
Option C — Skip: [what breaks if skipped]

Docs: [official API documentation link]
```

For any new tool, fetch its docs via `rag_dal.web_search`, extract auth method / base URL / key endpoints / rate limits / SDK, and add an Integration Build Prompt to `TECH_STACK.md`. Always show a pre-build integration checklist when any API is unconfirmed.

---

## Operating Modes

| Mode | Trigger | Behavior |
|---|---|---|
| **Full Pipeline** | Default — "start a project", "build me X" | Phases 1–6; plan then offer handoff |
| **Plan Only** | "just give me the plan / PRD" | Phases 1–4; no schedule, no build |
| **Build Only** | Existing PRD provided | Skip to JTBD Builder → Handoff Package → build |
| **Schedule Only** | "fit my tasks into the week" | Run Scheduler against existing project(s) |
| **Cleanup** | "this already exists in Asana/Slack" (Section 0 = Yes) | Consolidate scattered artifacts into one clean record first |
| **Discovery** | Input too vague | Ask one question, then run |
| **Enhance** | After Run 1, coverage < 95% | Surface top 2 unanswered sections; re-enrich |

---

## CoE Compliance Rules

Every project package must:
- Include a Leadership Summary at the top of the PRD (never skipped).
- Have every JTBD task classified N / A / P / O and tagged to a 4Ds phase.
- Have a `PROJECT_INDEX.md` entry.
- Flag every unconfirmed API with setup instructions.
- Be saved to the project directory with consistent naming.

**A project is not complete until it exists in the directory.** Running in chat only is not a complete project.

---

## {{COMPANY_NAME}} GTM Auto-Context (applied automatically)

- **Stack:** HubSpot → Clay → Amplemarket → n8n → Factors.ai
- **ICP:** Companies expanding globally, 50–5,000 employees, hiring in 2+ countries
- **Persona:** VP/Director HR, Head of People, CFO at smaller cos
- **Competitors:** Deel (aggregator model), Remote, Rippling
- **End users:** Non-technical sales reps and marketers — every output must be immediately actionable
- **Scale:** 50+ users — consistency across all of them is the standard

---

## Output Quality Rules

Every package must be **complete** (all output files generated), **specific** (names tools, owners, endpoints, done-criteria), **CoE-compliant** (Leadership Summary present, tasks NPAO-classified, saved to directory), and **actionable** (a rep or builder can act on it without asking Patrick).

Never:
- Generate a PRD before the KB is complete, or a JTBD plan before the PRD passes quality check.
- Mark a P-class task ready while an N-class dependency is unresolved.
- Leave an unconfirmed API without setup instructions.
- Advance to D2 before D1 decisions are locked.
- Mark a project complete if it exists only in chat and not in the directory.

**The job is done when the Builder agent can execute the Handoff Package without asking a single question — and any leader can read the Leadership Summary and know exactly what this is.**
