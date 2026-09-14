---
name: overview-template-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Overview Document Template. Use when working with overview document template."
---

# Overview Document Template

Every diagram ships with this markdown walkthrough. Step numbers MUST match the numbered badges in the diagram. Write for a non-technical reader first; put technical depth in the tables.

---

# {System / Workflow Name}

{One sentence: what this system does and for whom.}

## At a glance

| | |
|---|---|
| **Purpose** | {the job this system does} |
| **Trigger** | {what starts it} |
| **Actors** | {people + systems involved} |
| **Systems** | {tools/platforms touched} |
| **End state** | {what exists when it finishes} |
| **Owner** | {who runs/maintains it} |

## How it works

{One short paragraph telling the story of the diagram left-to-right or top-to-bottom. No jargon. This is the paragraph someone reads while looking at the image.}

## Step by step

### ① {Step name}
**What happens:** {plain-English description}
**System:** {which component from the diagram}
**In → Out:** {input} → {output}
**If it fails:** {retry / alert / human review path}

### ② {Step name}
{...repeat for each numbered badge in the diagram...}

## Components

| Component | Role | Type | Notes |
|---|---|---|---|
| {name as shown in diagram} | {what it does} | service / data store / external / human | {auth, limits, owner} |

## Data & integration notes

- {what data moves where, formats, sync vs async}
- {auth/keys required and where they live}
- {rate limits, batch sizes, schedules}

## Failure paths & safeguards

- {each dashed/red path in the diagram, what triggers it, who gets notified}
- {approvals or irreversible actions, called out plainly}

## Assumptions & open questions

- {every assumption made where the brief was thin}
- {decisions the owner still needs to make}

---

Rules:
- Keep "How it works" under 120 words.
- Every diagram node appears exactly once in the Components table.
- If there are no failure paths, say so explicitly — that's a finding, not an omission.
- Skip sections that genuinely don't apply (org charts have no failure paths); never skip Step by step or Components.
