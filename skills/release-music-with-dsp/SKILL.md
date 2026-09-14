---
name: release-music-with-dsp
description: "LLM-agnostic music production and marketing skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Release ticket, 21-day buffer. Use when the user wants to release your music with a dsp."
---

# Release your music with a DSP

- **Subagent:** @distribution-agent
- **Category:** Release
- **NPAO:** P
- **List price:** $29
- **Source:** Streaming guide + Distribution Account Setup

## When to use
Release ticket, 21-day buffer.

## Steps
1. Confirm splits signed
2. WAV+art+metadata
3. pick distributor
4. set store date +21d
5. write release_tickets row

## Outputs
release-ticket.md

## Reference tools
- reference/templates/release-ticket.md
- mcp__supabase

## Guardrails
No release without signed splits.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
