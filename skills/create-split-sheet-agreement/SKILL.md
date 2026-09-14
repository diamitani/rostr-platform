---
name: create-split-sheet-agreement
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Writer/producer splits before submission or distribution. Use when the user wants to create split sheet agreement."
---

# create split sheet agreement

- **Subagent:** @music-contract-agent
- **Category:** Legal
- **NPAO:** N
- **List price:** $19
- **Source:** Submission gate

## When to use
Writer/producer splits before submission or distribution.

## Steps
1. List contributors
2. % composition
3. master points
4. sign
5. save to mcp__google_drive
6. log in mcp__notion

## Outputs
split-sheet.md

## Reference tools
- reference/templates/split-sheet.md
- mcp__google_drive
- mcp__notion

## Guardrails
Not a substitute for counsel on samples.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
