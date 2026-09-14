---
name: npao-4ds-framework-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with NPAO Priority Framework + 4Ds Lifecycle. Use when working with npao priority framework + 4ds lifecycle."
---

# NPAO Priority Framework + 4Ds Lifecycle

**Canonical source:** NPAO https://rostr-paper.vercel.app/#s6 · 4Ds https://rostr-paper.vercel.app/#s6-7
*Read this file before classifying tasks or assigning phases. Fetch the live section only if a definition is still unclear.*

---

## NPAO — the four classes

NPAO classifies every task by the *felt urgency* behind it, not by topic. The class determines execution order **and** scheduling order.

```
N — NECESSITY: "I MUST"
  Hard blocker. Nothing downstream works without it.
  Examples: API auth, schema definition, database creation, tool registration,
            access provisioning.
  → Execute FIRST. Cannot be skipped. Cannot be pushed past today without a BLOCKED flag.

A — ANXIETY: "I WON'T HAVE PEACE"
  Persistent friction. An unresolved loop. Degrades the quality of P-class work.
  Examples: ambiguous scope, broken prior automation, undefined edge cases,
            stale data, missing owner.
  → Execute SECOND — before Priority. Open >3 days → auto-escalate to N-class.

P — PRIORITY: "I NEED"
  Mission-critical. Directly advances the objective.
  Examples: build the agent, write the workflow, create the output, run the test.
  → Execute THIRD — with full focus, all N and A cleared. Needs a Deep Work block.

O — OPPORTUNITY: "I CAN"
  Optional growth. Non-blocking. Compounding value.
  Examples: logging, dashboards, fallback enrichment, notifications.
  → Execute LAST — only when N, A, P are complete. If no slot, it waits. That is correct.

EXECUTION ORDER: N → A → P → O
CRITICAL RULE: Anxiety before Priority — unresolved loops degrade execution quality
               on core mission work.
```

### Why Anxiety runs before Priority

The single most important and most counter-intuitive NPAO rule. An open anxiety (an unresolved dependency, an ambiguous scope decision) silently taxes every priority task that follows it — the builder second-guesses, re-checks, and reworks. Clearing anxiety first is not procrastination; it is what makes priority execution clean.

---

## NPAO Canvas format

When producing a task plan, lay it out as a canvas with every task atomic (one owner, one done-state):

```
NPAO TASK CANVAS — [Project Name]
Mission: [one-line]
4Ds Phase: [current] | Dominant NPAO class: [per phase]

N — NECESSITY (resolve first) — nothing downstream proceeds without these
  N1. [Task] | Owner: [role] | Est: [duration] | Done when: [criterion]
      Build prompt: [instruction] | Subtasks: N1a / N1b | Blocks: [downstream IDs]

A — ANXIETY (clear before Priority) — friction that degrades P-class
  A1. [Task] | Owner | Est | Done when | Why anxiety (not priority): [rationale]
      Resolves: [what friction this eliminates]

P — PRIORITY (core mission work)
  P1. [Task] | Owner | Est | 4Ds: [phase] | Done when | Subtasks | Feeds: [downstream ID]

O — OPPORTUNITY (when bandwidth allows)
  O1. [Task] | Owner | Est | Done when | Value if completed: [what this adds]

Execution Queue: N1 → N2 → A1 → A2 → P1 → P2 → O1
```

---

## Scheduling rules (used by the Scheduler)

- **N:** earliest available slot; cannot be pushed past today without a BLOCKED flag.
- **A:** before any P-class task; prefer Focus or Quick Hit blocks; open >3 days → escalate to N.
- **P:** requires a Deep Work block (90+ min uninterrupted); never fragmented time; pushed >2 consecutive days → milestone-risk flag.
- **O:** fills remaining capacity only; never displaces N/A/P; waiting is correct.

---

## 4Ds Lifecycle

Every project and task is tagged to a phase. The phase determines which NPAO class is dominant.

| Phase | Name | Dominant NPAO | What's happening | Gate rule |
|---|---|---|---|---|
| **PreD** | Drafting | N | Research, validate, prove the idea before building | — |
| **D1** | Design | P | Architecture, specs, schemas, agent behavior — lock decisions | Nothing moves to D2 until **all** D1 decisions are locked |
| **D2** | Develop | P + A | Build, implement, test; clear blockers in parallel | — |
| **D3** | Deploy | N | Release, credentials, config, health checks | **Hard gate** — explicit user approval required |
| **D4** | Debug | A + O | Monitor, fix, optimize | Fix first, then optimize |

**Phase gate rule (most-violated):** Never advance to D2 (Develop) until all D1 (Design) decisions are locked. Most wasted builds skip straight from PreD to D2. The NPAO canvas flags this explicitly.

---

## Classification heuristics

When unsure which class a task is, ask in order:
1. Does anything else literally fail to start without this? → **N**
2. Is this an unresolved question/loop that will make me re-do P-work if left open? → **A**
3. Does this directly produce the thing the project exists to make? → **P**
4. Is this nice-to-have, additive, non-blocking? → **O**

A task can only hold one class. If it feels like two, split it.
