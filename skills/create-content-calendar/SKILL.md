---
name: create-content-calendar
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with 30-day calendar for Scheduling and Posting. Use when the user wants to create content calendar."
---

# create content calendar

- **Subagent:** @social-media-agent
- **Category:** Content
- **NPAO:** P
- **List price:** $15
- **Source:** Content Scheduling and Posting

## When to use
30-day calendar for Scheduling and Posting.

## Steps
1. Anchor store date
2. D-21 announce
3. D-14 visualizer
4. D0 premiere
5. D+3 follow-ups

## Outputs
calendar.md

## Reference tools
- reference/templates/content-calendar.md

## Guardrails
Respect artist timezone.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
