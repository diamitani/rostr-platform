---
name: claim-tracks-with-pro
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Claim unmatched performances/digital uses. Use when the user wants to claim tracks with a p.r.o."
---

# Claim tracks with a P.R.O.

- **Subagent:** @pro-agent
- **Category:** Publishing
- **NPAO:** A
- **List price:** $15
- **Source:** PRO guide

## When to use
Claim unmatched performances/digital uses.

## Steps
1. Open unmatched queue
2. Match ISRC/title
3. Attach recordings
4. Dispute hijacks

## Outputs
claim-queue.md

## Reference tools
- mcp__supabase update status

## Guardrails
Only claim controlled works.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
