---
name: create-brand-logo
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Wordmark/lockup brief. Use when the user wants to create brand logo."
---

# create brand logo

- **Subagent:** @epk-agent
- **Category:** Brand
- **NPAO:** P
- **List price:** $19
- **Source:** Branding Kit

## When to use
Wordmark/lockup brief.

## Steps
1. Wordmark
2. lockup
3. foil-on-black notes
4. clear space/min size

## Outputs
logo-brief.md

## Reference tools
- reference/templates/logo-brief.md

## Guardrails
Brief only, not fake art.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
