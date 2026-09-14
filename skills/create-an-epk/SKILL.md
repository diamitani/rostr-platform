---
name: create-an-epk
description: "LLM-agnostic music production and marketing skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Full media kit / EPK. Use when the user wants to create an epk."
---

# Create an EPK

- **Subagent:** @epk-agent
- **Category:** Brand
- **NPAO:** P
- **List price:** $29
- **Source:** Media Kit

## When to use
Full media kit / EPK.

## Steps
1. Bio
2. focus track+links
3. press photos
4. tech rider stub
5. one-sheet
6. save to Drive

## Outputs
EPK.md

## Reference tools
- reference/templates/epk.md
- mcp__google_drive

## Guardrails
No fake press quotes.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
