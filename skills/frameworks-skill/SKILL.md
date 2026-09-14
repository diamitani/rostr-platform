---
name: frameworks-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Frameworks (Reference). Use when working with frameworks."
---

# Frameworks (Reference)

> Internal engine rules — condensed from the ROSTR Framework (canonical source: https://rostr-paper.vercel.app). These shape how the work is done. **The terminology never appears in user-facing documents** — the Brief and Leadership Summary use plain English (blocker, friction, core work, nice-to-have).

---

## 1. PAL — the prompt compiler

Every intake runs through a 5-stage compile before anything is generated. Silent — the user sees only the results.

| Stage | What happens |
|---|---|
| **1. Intent** | Parse the raw input into: what they want, domain, subject, constraints, desired output, urgency, ambiguity score |
| **2. Context** | Inject the top 3–5 relevant items: session files, memory, {{COMPANY_NAME}} auto-context, available skills, prior decisions |
| **3. Composition** | Structure the compiled instruction: ROLE → MISSION → INPUTS → OUTPUTS → STEPS → TOOLS → CONSTRAINTS → QUALITY BAR → CONTEXT |
| **4. Optimization** | Cut redundancy, resolve conflicts, make every step verb-first and testable |
| **5. Runtime** | Emit the Master Build Prompt into the Build Plan; route follow-on work to the right skill/tool |

Rules: treat typos and fragments as valid input — normalize, don't reject. If intent depends on a tool/API you can't recall confidently, do a quick doc lookup (search official docs, extract exact syntax) before composing.

The **Master Build Prompt** format (goes in every Build Plan):

```
PROJECT BUILD PROMPT — [Project Name]

ROLE: You are [agent identity] for [context].
MISSION: [verb + noun, 2 sentences max]
INPUTS: [what the executor receives]
OUTPUTS: [what must be produced, with formats]
STEPS:
  1. [verb-first, specific]
  2. ...
TOOLS: [tool]: [endpoint, auth, how used]
CONSTRAINTS: [hard limits]
QUALITY BAR: [what done looks like]
CONTEXT: [key facts — type, ICP, stack, personas]
```

---

## 2. NPAO — task priority

Work isn't started; it's classified. Every task in the Build Plan gets one of four classes, executed strictly in order:

| Class | Internal | Plain-English label (use this in docs) | Examples | Rule |
|---|---|---|---|---|
| **N** | Necessity | **Blocker** | API auth, credentials, schema creation, access provisioning | First. Cannot be skipped. |
| **A** | Anxiety | **Friction** | Ambiguous scope, broken prior automation, stale data, undefined edge cases | Before core work — unresolved friction degrades build quality. Open > 3 days → escalate to Blocker. |
| **P** | Priority | **Core build** | Agent logic, skill body, workflow nodes, enrichment steps | Third, with full focus, all blockers and friction cleared. |
| **O** | Opportunity | **Nice-to-have** | Logging, dashboards, fallback enrichment, notifications | Last. Never displaces the others. Waiting is correct. |

**Most-violated, most-important rule: friction clears before core build.**

Task queue format:

```
TASK QUEUE — [Project]
Mission: [one line]

BLOCKERS:      B1. [task]  B2. [task]
FRICTION:      F1. [task]
CORE BUILD:    C1. [task]  C2. [task]  C3. [task]
NICE-TO-HAVE:  X1. [task]

Order: B1 → B2 → F1 → C1 → C2 → C3 → X1
```

Each task carries: build prompt · owner · estimate · done-when · dependencies · phase.

---

## 3. 4Ds — lifecycle phases

Tag every project and task to a phase; each phase has a dominant class.

| Phase | Name | Dominant | What happens |
|---|---|---|---|
| **PreD** | Drafting | Blockers | Research, requirements, validation. Prove or kill the idea. |
| **D1** | Design | Core | Architecture, data models, specs. Make the blocking decisions. |
| **D2** | Develop | Core + Friction | Build, implement, test. |
| **D3** | Deploy | Blockers | Release, credentials, config. Hard gate — explicit user approval. |
| **D4** | Debug | Friction + Nice-to-have | Monitor, fix, optimize. |

**Gate rule: never enter D2 (Develop) until all D1 (Design) decisions are locked.** Most wasted builds jump from idea straight to building.

---

## 4. Builder guardrail gates

When a Handoff Package is executed autonomously, the Builder always pauses at:

| Gate | Trigger | Behavior |
|---|---|---|
| **G1** | Before any core-build task | All blockers + friction complete? If not, surface to user — do not proceed |
| **G2** | Entering Deploy | Present deployment summary; wait for explicit approval |
| **G3** | Unconfirmed API hit at runtime | Show API Readiness block; never substitute a tool silently |
| **G4** | Ambiguous, scope-altering decision | Ask exactly one question; never guess |

The user sees clean approve/modify prompts and a per-task status feed — not raw logs. Append each major step and gate to `/{{COMPANY_NAME}} Projects/RUN_LOG.md`:

```
| Timestamp | Project | Step/Gate | Status | Output | Next |
```
