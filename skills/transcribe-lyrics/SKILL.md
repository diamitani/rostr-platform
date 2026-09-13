---
name: transcribe-lyrics
description: Clean lyrics with section tags. Use when the user wants: transcribe lyrics. NPAO N.
allowed-tools: inherit
---

# transcribe lyrics

- **Subagent:** @social-media-agent
- **Category:** Catalogue
- **NPAO:** N
- **List price:** $9
- **Source:** Content Creation

## When to use
Clean lyrics with section tags.

## Steps
1. Pass 1 words
2. section tags
3. explicit flag

## Outputs
lyrics.txt

## Reference tools
- None beyond parent tools

## Guardrails
Mark uncertain lines [?].

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
