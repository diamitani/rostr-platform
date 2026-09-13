---
name: upload-track-to-catalogue
description: Vault master with provenance. Use when the user wants: Upload Track to Catalogue. NPAO N.
allowed-tools: mcp__supabase
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
