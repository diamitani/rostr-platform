---
name: build-a-skill
description: Package a SKILL.md for preload. Use when the user wants: Build a Skill. NPAO P.
allowed-tools: mcp__github
---

# Build a Skill

- **Subagent:** @agent-factory
- **Category:** Platform
- **NPAO:** P
- **List price:** $19
- **Source:** Claude Code skills docs

## When to use
Package a SKILL.md for preload.

## Steps
1. name/description/when-to-use
2. inputs/outputs
3. NPAO+price
4. guardrails
5. commit via mcp__github PR

## Outputs
SKILL.md

## Reference tools
- reference/tools/claude-code-subagent-fields.md
- mcp__github

## Guardrails
No disable-model-invocation preloads.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
