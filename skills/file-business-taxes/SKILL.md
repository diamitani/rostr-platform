---
name: file-business-taxes
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Quarterly estimate + tax folder. Use when the user wants to file business taxes."
---

# file business taxes

- **Subagent:** @legal-setup
- **Category:** Finance
- **NPAO:** A
- **List price:** $49
- **Source:** Finance

## When to use
Quarterly estimate + tax folder.

## Steps
1. Pull ledger via mcp__plaid/mcp__supabase
2. 1099s
3. Schedule C checklist
4. estimated payments

## Outputs
tax-folder-checklist.md

## Reference tools
- mcp__plaid
- mcp__supabase
- reference/templates/tax-folder.md

## Guardrails
Not tax advice; CPA files.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
