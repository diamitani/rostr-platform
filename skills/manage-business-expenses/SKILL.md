---
name: manage-business-expenses
description: Studio/ads/travel ledger. Use when the user wants: manage business expenes. NPAO A.
allowed-tools: mcp__plaid, mcp__supabase
---

# manage business expenes

- **Subagent:** @finance-manager
- **Category:** Finance
- **NPAO:** A
- **List price:** $15
- **Source:** Finance

## When to use
Studio/ads/travel ledger.

## Steps
1. Pull via mcp__plaid
2. tag category
3. monthly total
4. write mcp__supabase expenses row

## Outputs
expense-ledger.md

## Reference tools
- mcp__plaid
- mcp__supabase

## Guardrails
Not tax advice.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
