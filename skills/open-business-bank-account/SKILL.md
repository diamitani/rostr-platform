---
name: open-business-bank-account
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Docs list + bank comparison. Use when the user wants to open business bank account."
---

# open business bank account

- **Subagent:** @legal-setup
- **Category:** Finance
- **NPAO:** N
- **List price:** $12
- **Source:** Legal sequence

## When to use
Docs list + bank comparison.

## Steps
1. EIN letter
2. Articles PDF
3. ID
4. compare accounts
5. route payouts

## Outputs
bank-kit.md

## Reference tools
- mcp__google_drive

## Guardrails
Never mix personal rent.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
