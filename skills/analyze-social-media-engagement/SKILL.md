---
name: analyze-social-media-engagement
description: "LLM-agnostic developer tooling skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Hook rate, saves, posting windows feeding paid media decisions. Use when the user wants to analyze social media engagement skill."
---

# Analyze social media engagement skill

- **Subagent:** @marketing-agent
- **Category:** Growth
- **NPAO:** A
- **List price:** $19
- **Source:** Paid Media research

## When to use
Hook rate, saves, posting windows feeding paid media decisions.

## Steps
1. Collect metrics
2. save/share rate
3. best local window
4. feed paid media brief
5. log in mcp__hubspot

## Outputs
engagement-brief.md

## Reference tools
- mcp__hubspot

## Guardrails
No login-gated scraping without connected tool.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
