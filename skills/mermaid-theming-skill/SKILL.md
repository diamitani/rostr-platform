---
name: mermaid-theming-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Mermaid Theming — Editable Diagrams That Still Look Good. Use when working with mermaid theming."
---

# Mermaid Theming — Editable Diagrams That Still Look Good

Use Mermaid when the user needs an editable/embeddable artifact (Notion, GitHub, Confluence) or for types where Mermaid beats hand-drawn SVG (sequence, Gantt, state, ERD). Always ship it themed — never default-theme Mermaid.

## Init block ({{COMPANY_NAME}} theme)

Put this at the top of every `.mmd`:

```
%%{init: {
  "theme": "base",
  "themeVariables": {
    "fontFamily": "Helvetica, Arial, sans-serif",
    "primaryColor": "#E7EEFF",
    "primaryTextColor": "#160629",
    "primaryBorderColor": "#0559FA",
    "lineColor": "#0559FA",
    "secondaryColor": "#FFFFFF",
    "tertiaryColor": "#F7F8FC",
    "background": "#F7F8FC",
    "mainBkg": "#FFFFFF",
    "nodeBorder": "#D9DFEE",
    "clusterBkg": "#EEF2FB",
    "clusterBorder": "#D9DFEE",
    "titleColor": "#160629",
    "edgeLabelBackground": "#F7F8FC",
    "actorBkg": "#160629",
    "actorTextColor": "#FFFFFF",
    "actorLineColor": "#6B7490",
    "signalColor": "#160629",
    "signalTextColor": "#160629",
    "noteBkgColor": "#FFF7E0",
    "noteBorderColor": "#D97706"
  },
  "flowchart": { "curve": "basis", "nodeSpacing": 50, "rankSpacing": 60, "padding": 12 }
}}%%
```

For other themes, swap the hex values from the theme table in `visual-style-guide.md`.

## classDefs for flowcharts

Append after the graph body and assign with `class NODE1,NODE2 hero;`:

```
classDef hero fill:#160629,stroke:#0559FA,stroke-width:2px,color:#FFFFFF
classDef service fill:#FFFFFF,stroke:#D9DFEE,stroke-width:1.5px,color:#160629
classDef data fill:#E7EEFF,stroke:#0559FA,stroke-width:1.5px,color:#160629
classDef external fill:#FFFFFF,stroke:#6B7490,stroke-width:1.5px,stroke-dasharray:6 4,color:#6B7490
classDef risk fill:#FDECEC,stroke:#DC2626,stroke-width:1.5px,color:#7F1D1D
```

## Rules

- Short noun labels; wrap with `<br/>` only when unavoidable
- No hosted-renderer-only syntax (avoid `C4Context`, `architecture-beta`) — portability first
- One `%%{init}%%` per file, first line
- Ship the `.mmd` inside `templates/diagram-viewer.html` (replace `%%MERMAID%%`) so the user double-clicks and sees a rendered, branded diagram
- The viewer loads Mermaid from CDN; it needs internet on first open

## Division of labor

| Need | Use |
|---|---|
| Deck-ready, pixel-perfect visual | Hand-crafted SVG (style guide) |
| Editable source, embeds in docs | Mermaid `.mmd` + viewer HTML |
| Sequence, Gantt, state, ERD | Mermaid first — its layout engine wins |
| Architecture, pipelines, integration maps | SVG first — full design control |
