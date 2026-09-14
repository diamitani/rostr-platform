---
name: set-up-merch-drop-shipping
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with POD vs warehouse for E-Commerce/Merch. Use when the user wants to set up merch drop shipping."
---

# set up merch drop shipping

- **Subagent:** @website-agent
- **Category:** Merch
- **NPAO:** O
- **List price:** $25
- **Source:** E-Commerce/Merch

## When to use
POD vs warehouse for E-Commerce/Merch.

## Steps
1. Printful/Printify test
2. warehouse if >200
3. USPS ground
4. insert card

## Outputs
merch-ops.md

## Reference tools
- reference/templates/merch-ops.md

## Guardrails
No fake carrier accounts.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
