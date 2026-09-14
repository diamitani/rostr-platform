---
name: add-music-to-collaborative-playlist
description: "LLM-agnostic sales prospecting and go-to-market skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Playlist pitch, Indie Bible tone, part of Messaging/Sequences. Use when the user wants to add music to collaborative playlist."
---

# add music to collaborative playlist

- **Subagent:** @outreach-agent
- **Category:** Outreach
- **NPAO:** O
- **List price:** $15
- **Source:** EMAIL TEMPLATES PLAYLISTS + Playlists cap

## When to use
Playlist pitch, Indie Bible tone, part of Messaging/Sequences.

## Steps
1. One personal line
2. subject track+BPM+city
3. one link (mcp__bitly)
4. 3-10 curated targets
5. log in mcp__hubspot
6. send via mcp__outlook after approval

## Outputs
pitch-email.md, target-list.md

## Reference tools
- reference/tools/directories.md
- mcp__hubspot
- mcp__outlook
- mcp__bitly

## Guardrails
Never dump full CSV. Max 10 targets/run. Human approves send.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
