---
name: track-royalties-on-dsps
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Key-sheet-linked royalty pulse and gap alerts. Use when the user wants to track your royalties on dsps."
---

# Track your royalties on DSPs

- **Subagent:** @pro-agent
- **Category:** Finance
- **NPAO:** A
- **List price:** $25
- **Source:** Account Management

## When to use
Key-sheet-linked royalty pulse and gap alerts.

## Steps
1. Ingest statements
2. WoW deltas
3. Flag Content ID gaps
4. Notify Distribution Agent

## Outputs
royalty-brief.md

## Reference tools
- mcp__supabase royalty_ledger

## Guardrails
Estimates aren't statements.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
