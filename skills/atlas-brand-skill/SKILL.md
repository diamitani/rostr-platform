---
name: atlas-brand-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with {{COMPANY_NAME}} Brand Guide for Presentations. Use when working with {{company_name}} brand guide for presentations."
---

# {{COMPANY_NAME}} Brand Guide for Presentations

## Colors

| Role | Hex | Usage |
|---|---|---|
| **Primary dark** | `#1E1244` | All headings, primary body text, dark backgrounds |
| **Lavender panel** | `#E8DEFF` | Right-panel backgrounds, agenda/section slides, card fills |
| **White** | `#FFFFFF` | Primary slide background, card backgrounds |
| **Off-white** | `#F7F5FC` | Cover slide background (very subtle lavender tint) |
| **Card border** | `#D4C5F9` | Rounded-corner content box borders |
| **Purple accent** | `#7C3AED` | Logo, dot 1, accent highlights |
| **Blue accent** | `#2563EB` | Dot 2, Priority badge border/text |
| **Green accent** | `#10B981` | Dot 3, "High impact" badge, positive indicators |
| **Orange accent** | `#F59E0B` | "Medium effort" badge, caution indicators |
| **Coral accent** | `#EF4444` | Alerts, important callouts (use sparingly) |
| **Muted text** | `#6B7280` | Subtitles, captions, footer text |

## Typography

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Slide title | Calibri | 36–40pt | Bold | `#1E1244` |
| Section heading | Calibri | 24–28pt | Bold | `#1E1244` |
| Body text | Calibri | 14–16pt | Regular | `#1E1244` |
| Card label / bold callout | Calibri | 12–14pt | Bold | `#1E1244` |
| Footer / caption | Calibri | 9–10pt | Regular | `#6B7280` |
| Tagline ("For People, By People") | Calibri | 12pt | Regular | `#1E1244` |

> Note: {{COMPANY_NAME}} uses a custom sans-serif in their brand materials (similar to Neue Haas Grotesk). Calibri is the closest system font match for PPTX generation.

## Slide Dimensions

- **Widescreen 16:9** — 13.33" × 7.5" (standard)
- pptxgenjs: `{ layout: 'LAYOUT_WIDE' }` — 10" × 7.5" or set custom `{ w: 13.33, h: 7.5 }`

## Logo & Brand Elements

### Logo Treatment
- Top-left on every slide (except full-bleed cover images)
- Use the 'ä' monogram (small 'a' with umlaut-style dots) on content slides
- Use full "{{COMPANY_NAME}}" wordmark on cover and section divider slides
- Three colored dots (purple, blue, green) appear above the icon

### Three-Dot Motif
The three-dot motif (●●●) appears in the bottom-right footer on content slides:
- Dot 1: `#7C3AED` (purple)
- Dot 2: `#2563EB` (blue)
- Dot 3: `#10B981` (green)

### Tagline
- "For People, By People" — appears top-right on all slides
- Calibri, 11–12pt, `#1E1244`, right-aligned

### Footer (all content slides)
- Left: "Confidential – Do not duplicate or distribute without written permission from {{COMPANY_NAME}}. Copyright ©2026 {{COMPANY_NAME}} Technology Solutions, Inc. All Rights Reserved."
- Right: "{{COMPANY_FILE}} + three colored dots
- Font: 8–9pt, `#6B7280`
- Horizontal rule above footer (1pt, `#D4C5F9`)

## Slide Layout Patterns

### Cover Slide
- Off-white (`#F7F5FC`) background
- Large bold title: left side, vertically centered, `#1E1244`, 48–56pt
- Subtitle (e.g., "Kickoff Brief", "Country Profile"): below title, 18pt regular
- Photo or illustration: right half, with lavender (`#E8DEFF`) background block behind it
- Full "{{COMPANY_NAME}}" wordmark top-left
- Tagline top-right

### Two-Column / Section Slide (e.g., Agenda)
- White left panel: large section label (e.g., "Agenda") in 48pt bold, vertically centered
- Lavender right panel (`#E8DEFF`): list items separated by thin horizontal rules (`#B8A8E8`)
- 'ä' monogram top-left, tagline top-right

### Content Slide with Cards
- White background
- Slide title top-left, 36pt bold, `#1E1244`
- Content organized in rounded-corner boxes (border `#D4C5F9`, fill white or `#F7F5FC`)
- Box header: 13pt bold, `#1E1244`
- Box body: 13pt regular, `#1E1244`
- Corner radius: ~8pt

### Stat / Callout Slide
- Large number (60–72pt, bold, `#7C3AED`) with small label below
- Use for: key country metrics, timelines, cost figures

### Badge / Priority Chips
Used to indicate priority, impact, effort levels:
```
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Priority │   │  Impact  │   │  Effort  │
│    #1    │   │   High   │   │  Medium  │
└──────────┘   └──────────┘   └──────────┘
  Blue border   Green border   Orange border
  Blue text     Green text     Orange text
```
Border: 1.5pt, font: 11pt bold, padding: 8px, border-radius: 6pt

## Dos and Don'ts

**Do:**
- Use lavender panels generously — they're the signature visual element
- Use rounded-corner cards for all information blocks
- Always include the three-dot motif in footers
- Use bold labels inside cards before body text
- Left-align all body text; center only titles and large callout numbers

**Don't:**
- Don't add decorative underlines beneath titles
- Don't use more than 3 colors on a single content slide (excluding footer/logo)
- Don't use bullet points without a bold lead-in label in card contexts
- Don't stretch or modify the logo
- Don't use gradient backgrounds — flat colors only
