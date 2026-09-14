---
name: create-an-artist-bio
description: "LLM-agnostic music production and marketing skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with 50/150/400 word bios. Use when the user wants to create an artist bio."
---

# Create an artist bio

- **Subagent:** @epk-agent
- **Category:** Brand
- **NPAO:** P
- **List price:** $12
- **Source:** Media Kit

## When to use
50/150/400 word bios.

## Steps
1. Capture voice/hometown/genre
2. 50w
3. 150w
4. 400w+CTA

## Outputs
bios.md

## Reference tools
- reference/templates/bio.md

## Guardrails
No fake awards.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
