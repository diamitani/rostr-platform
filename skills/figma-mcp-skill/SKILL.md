---
name: figma-mcp-skill
description: "LLM-agnostic AI agent development skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Figma MCP. Use when working with figma mcp."
---

# Figma MCP

Use this reference when the task includes mockups, interface boards, storyboards, polished diagrams, or design-system-like layout work.

Official doc:
- `https://help.figma.com/hc/en-us/articles/35281186390679-Figma-MCP-collection-How-to-setup-the-Figma-desktop-MCP-server`

## Working Mode

Treat Figma MCP as a production surface for the already-reasoned design packet.

The order is:

1. define the workflow story
2. choose the artifact format
3. map frames and sections
4. instruct Figma MCP with concrete actions
5. refine spacing, type, color, and grouping

## What To Hand Off To Figma MCP

Before using Figma MCP, prepare:

- frame list with names and sizes
- section hierarchy
- on-canvas text blocks
- component list
- connector or annotation plan
- visual direction note

## Strong Figma MCP Requests

Prefer requests like:

- create a 1600x1200 architecture board with four horizontal layers named Experience, Orchestration, Systems, and Control
- place six rounded cards in a 12-column grid with 32px outer margin and 24px gutters
- connect the cards with directional arrows and add a small legend in the lower right
- restyle the board with a restrained graphite, ivory, and electric-blue palette
- turn these repeated cards into a reusable component set with default, active, and warning variants

Avoid vague requests like:

- make it prettier
- design a cool screen
- add some nice colors

## Visual Direction Heuristics

- For enterprise workflow boards, use strong alignment, disciplined spacing, and one accent color.
- For product concept images, anchor the scene around one focal panel and one supporting annotation rail.
- For architecture posters, prefer layered depth and labels over decorative illustration noise.
- For AI-heavy systems, combine technical scaffolding with one memorable hero motif such as a signal path, orbital mesh, or luminous control grid.

## If Figma MCP Is Unavailable

Return a build-ready spec with:

- frame names
- dimensions
- grid
- palette
- type scale
- card list
- connector directions
- copy for every visible label
