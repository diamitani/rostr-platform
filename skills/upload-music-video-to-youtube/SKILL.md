---
name: upload-music-video-to-youtube
description: "LLM-agnostic music production and marketing skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with YouTube packet: title/desc/chapters, confirmed via API. Use when the user wants to upload music video to youtube."
---

# upload music video to youtube

- **Subagent:** @social-media-agent
- **Category:** Content
- **NPAO:** P
- **List price:** $12
- **Source:** Content Creation

## When to use
YouTube packet: title/desc/chapters, confirmed via API.

## Steps
1. Title formula
2. desc credits+mcp__bitly link
3. chapters
4. end screens
5. publish via mcp__youtube_data_api

## Outputs
youtube-packet.md

## Reference tools
- mcp__youtube_data_api
- mcp__bitly

## Guardrails
Don't claim upload without API confirmation.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
