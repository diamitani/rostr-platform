---
name: create-merch-designs
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with SKU concepts for E-Commerce/Merch. Use when the user wants to create merch designs."
---

# create merch designs

- **Subagent:** @website-agent
- **Category:** Merch
- **NPAO:** O
- **List price:** $25
- **Source:** E-Commerce/Merch

## When to use
SKU concepts for E-Commerce/Merch.

## Steps
1. 3 SKUs
2. prices
3. print notes from brand guide
4. 72h drop copy

## Outputs
merch-brief.md

## Reference tools
- reference/templates/merch-brief.md

## Guardrails
Follow brand guidelines if owned.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
