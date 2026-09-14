---
name: write-a-business-plan
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with 12-month plan with revenue mix. Use when the user wants to write a business plan."
---

# Write a business plan

- **Subagent:** @finance-manager
- **Category:** Finance
- **NPAO:** P
- **List price:** $39
- **Source:** Finance

## When to use
12-month plan with revenue mix.

## Steps
1. Q1-Q4 milestones
2. KPI table
3. revenue mix from mcp__finance context

## Outputs
business-plan.md

## Reference tools
- reference/templates/business-plan.md
- mcp__finance

## Guardrails
No guaranteed numbers.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
