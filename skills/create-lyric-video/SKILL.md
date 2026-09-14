---
name: create-lyric-video
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Timed lyric storyboard. Use when the user wants to create lyric video."
---

# create lyric video

- **Subagent:** @social-media-agent
- **Category:** Content
- **NPAO:** O
- **List price:** $19
- **Source:** Content Creation

## When to use
Timed lyric storyboard.

## Steps
1. Transcribe first
2. timestamps
3. caps on drop

## Outputs
lyric-timing.md

## Reference tools
- reference/templates/lyric-timing.md

## Guardrails
Needs transcript first.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
