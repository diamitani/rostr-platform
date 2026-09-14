---
name: upload-track-to-catalogue
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Vault master with provenance. Use when the user wants to upload track to catalogue."
---

# Upload Track to Catalogue

- **Subagent:** @distribution-agent
- **Category:** Catalogue
- **NPAO:** N
- **List price:** $9
- **Source:** Catalogue

## When to use
Vault master with provenance.

## Steps
1. Attach file+metadata
2. status Ready/Pending
3. write mcp__supabase catalogue row

## Outputs
catalogue-row.md

## Reference tools
- mcp__supabase

## Guardrails
Version bump, no silent overwrite.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
