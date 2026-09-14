---
name: set-up-dsp
description: "LLM-agnostic music production and marketing skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Spotify/Apple/YouTube artist profile claim. Use when the user wants to set up dsp."
---

# set up DSP

- **Subagent:** @distribution-agent
- **Category:** Release
- **NPAO:** N
- **List price:** $15
- **Source:** Distribution Account Setup

## When to use
Spotify/Apple/YouTube artist profile claim.

## Steps
1. Distributor invite
2. Apple Music for Artists
3. YouTube OAC via mcp__youtube_data_api

## Outputs
dsp-claim-steps.md

## Reference tools
- https://artists.spotify.com
- https://artists.apple.com
- mcp__youtube_data_api

## Guardrails
User completes identity OAuth.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
