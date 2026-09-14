---
name: build-an-agent
description: "LLM-agnostic developer tooling skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to compile a Claude Code subagent markdown file. Use when the user wants to build an agent."
---

# Build an Agent

- **Subagent:** @agent-factory
- **Category:** Platform
- **NPAO:** P
- **List price:** $29
- **Source:** Claude Code subagent docs

## When to use
Compile a Claude Code subagent markdown file.

## Steps
1. name+description
2. tools allowlist
3. model
4. skills preload
5. commit via mcp__github PR

## Outputs
agent.md

## Reference tools
- reference/tools/claude-code-subagent-fields.md
- mcp__github

## Guardrails
Skip files missing name/description.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
