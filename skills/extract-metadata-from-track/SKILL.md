---
name: extract-metadata-from-track
description: "LLM-agnostic data engineering and analytics skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with ISRC/writers/BPM/key JSON. Use when the user wants to extract metadata from track."
---

# Extract Metadata from Track

- **Subagent:** @distribution-agent
- **Category:** Catalogue
- **NPAO:** N
- **List price:** $9
- **Source:** Catalogue

## When to use
ISRC/writers/BPM/key JSON.

## Steps
1. Read tags/input
2. normalize ISRC
3. writers from split sheet

## Outputs
metadata.json

## Reference tools
- reference/templates/metadata.json

## Guardrails
Never invent ISRC.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
