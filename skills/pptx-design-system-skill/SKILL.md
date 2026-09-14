---
name: pptx-design-system-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with {{COMPANY_NAME}} PPTX Design System. Use when working with {{company_name}} pptx design system."
---

# {{COMPANY_NAME}} PPTX Design System
> Extracted from visual analysis of {{COMPANY_FILE}} (51 slides, 49 layouts)
> and {{COMPANY_NAME}} Discorvery Deck Draft_V1.pptx + {{COMPANY_FILE}}
> Photographed and analyzed April 2026

---

## Brand Colors

### Primary Palette
Extracted from logo SVG (`{{COMPANY_FILE}} and slide backgrounds.

| Token | Hex | RGB | Usage |
|---|---|---|---|
| `{{COMPANY_NAME}} Blue 500` | `#0559FA` | 5, 89, 250 | Primary accent, CTA borders, icon fills, bullet dots |
| `{{COMPANY_NAME}} Purple 500` | `#5827E3` | 88, 39, 227 | Secondary accent, gradient mid-point |
| `{{COMPANY_NAME}} Magenta 500` | `#BA33CA` | 186, 51, 202 | Tertiary accent, closing gradients |
| `{{COMPANY_NAME}} Navy` | `#160629` | 22, 6, 41 | Cover bg, dividers, closings, body text |
| `White` | `#FFFFFF` | 255, 255, 255 | All content slide backgrounds |
| `Off-White` | `#F8F8F8` | 248, 248, 248 | Alternate content bg, subtle panels |

### Gradient
The {{COMPANY_NAME}} brand uses a distinctive left-to-right gradient seen on agenda slides, closing slides, and some cover variants:
- **Blue → Purple → Magenta**: `#0559FA` → `#5827E3` → `#BA33CA`
- Also seen as blue → purple on section dividers

### Light Tints (100-level — card backgrounds on white slides)
| Token | Hex | Usage |
|---|---|---|
| `Blue 100` | `#DAE6FE` | Card background for feature 1 |
| `Purple 100` | `#E6DFFB` | Card background for feature 2 |
| `Magenta 100` | `#F5E0F7` | Card background for feature 3 |

### Supporting Text Colors
| Token | Hex | Usage |
|---|---|---|
| Body text | `#160629` (Navy) | Primary text on white slides |
| Muted / captions | `#666677` | Footnotes, source citations |
| Reversed (white) | `#FFFFFF` | Text on dark/navy/gradient backgrounds |

### ⚠️ Color Rules
- **No green** — ever. {{COMPANY_NAME}} palette has zero green.
- Dark navy `#160629` **only** on: covers, section dividers, closing slides
- Content slides are **always white or off-white**
- Blue `#0559FA` and purple `#5827E3` are accents — not full-slide backgrounds for body content

---

## Typography

### Font Family: Gelion
Custom typeface. All weights bundled in `assets/fonts/`. **Never substitute.**

| Weight | File | Class | Usage |
|---|---|---|---|
| Regular (400) | `Gelion-Regular.otf` | Body | Body text, subtitles, captions, footer |
| Medium (500) | `Gelion-Medium.otf` | Subhead | Subheadings, card titles, stat labels |
| SemiBold (600) | `Gelion SemiBold.ttf` | Heading | Slide headings, section titles |
| Bold (700) | `Gelion Bold.ttf` | Display | Cover headlines, large stat numbers |

When referencing in python-pptx: use `run.font.name = 'Gelion SemiBold'` exactly (case-sensitive).

### Type Scale

| Role | Font | Size | Color |
|---|---|---|---|
| Cover headline | Gelion SemiBold | 40–52pt | White |
| Slide heading | Gelion SemiBold | 28–36pt | Navy or Blue |
| Subheading | Gelion Medium | 20–24pt | Navy |
| Body text | Gelion Regular | 12–14pt | Navy |
| Stat number (large) | Gelion Bold | 48–64pt | White or Blue |
| Stat label | Gelion Medium | 12–14pt | White or Navy |
| Caption / source | Gelion Regular | 8–10pt | Muted gray |
| Footer / tagline | Gelion Regular | 7–8pt | White (dark bg) or Navy (light bg) |
| Copyright footer | Gelion Regular | 6–7pt | Muted |

---

## Slide Dimensions

- **Width:** 13.33 inches (1920px at 144dpi)
- **Height:** 7.5 inches (1080px at 144dpi)
- **Aspect ratio:** 16:9 widescreen

---

## Layout Catalogue (49 Layouts)

### Cover Slides (Layouts 0–10)
Dark backgrounds. Feature: person photo (right side or circle-cropped), large headline (left), subtitle, logo top-left, "For People, By People" top-right.

| Idx | Name | Description |
|---|---|---|
| 0 | Master_Cover_01 | Full-bleed blue bg. Person right. Title left bold. Subtitle below. Accent arc shape (coral or magenta). |
| 1 | Master_Cover_02 | Similar to 01 but darker navy gradient. Different accent color. |
| 2 | Master_Cover_03 | Person in circle (right side). Blue gradient background. |
| 3 | Master_Cover_04 | Two-person layout. Darker navy. |
| 4 | Master_Cover_05 | Person right (half bleed). Blue-navy gradient. Two-photo option. |
| 5 | Master_Cover_06 | Similar to 05. |
| 6 | Master_Cover_07 | Three-photo layout with date and title fields. |
| 7 | 1_Master_Cover_01 | **BLANK** — no placeholders. Add all shapes manually. Use for fully custom covers. |
| 8 | Master_Cover_08 | Multi-photo grid (3 photos). Title + subtitle. |
| 9 | Master_Cover_09 | Circle-cropped photo (centered right). White background variant. |
| 10 | Master_Cover_10 | Dark navy, large title, minimal. |

**Placeholders for cover layouts 0-5:**
- `idx=0` — Title (large, white, Gelion SemiBold 40-44pt)
- `idx=1` — Subtitle (smaller, white, Gelion Regular 16-18pt)
- `idx=13` — Picture placeholder (person photo)

---

### Agenda / Table of Contents (Layouts 12–15)
Split layout: white left half (label "Agenda" or "Table of Contents"), blue-to-purple gradient right half with numbered items.

| Idx | Name | Description |
|---|---|---|
| 12 | Master_Agenda_01 | Standard. 5 time-slot rows on right (gradient). "Agenda" large left. |
| 13 | Master_Agenda_02 | Variant with slightly different gradient. |
| 14 | Master_Agenda_03 | Magenta-leaning gradient. |
| 15 | Master_Agenda_04 | Blue-purple variant. |

**Placeholders:**
- `idx=15` — Right column (numbered list / time + topic rows)
- `idx=16` — Left column title (e.g., "Agenda", "Table of Contents")

---

### Section Dividers (Layouts 16–19)
Full dark background (navy or blue). Section number large (circled). Section heading below.

| Idx | Name | Description |
|---|---|---|
| 16 | Master_Content_Divider_01 | Blue `#0559FA` or navy bg. Section number (circle, top-left). Section heading large bold white. Person photo right (circle-cropped). |
| 17 | Master_Content_Divider_02 | Darker variant. |
| 18 | Master_Content_Divider_03 | Purple-blue gradient variant. |
| 19 | Master_Content_Divider_Elevation | Minimal — just text, no photo. |

**Placeholders:**
- `idx=10` — Section number (e.g., "01", "02")
- `idx=13` — Person photo (optional)
- `idx=14` — Section heading text

---

### Content Slides (Layouts 20–44)
White or off-white backgrounds. Left-side navigation bar with {{COMPANY_NAME}} 'a' icon. "For People, By People" top-right. Copyright footer bottom.

| Idx | Name | Description | Best For |
|---|---|---|---|
| 20 | Master_Content_01 | Heading top. Body text below. Right edge has blue vertical bar. | Body copy, bullet points, description |
| 21 | 1_Master_Content_01 | Similar with subtle layout variant. | Alternate body |
| 22 | Master_Content_02 | 6-person team grid. Title above. 2 rows × 3 cols of photo+name+title. | Team slide |
| 23 | Master_Content_03 | Two image placeholders side by side + heading + description. | Comparison, two scenarios |
| 24 | Master_Content_04 | Image left (half slide) + text right. | Feature with visual |
| 25 | 1_Master_Content_04 | Three-column layout. | Three features/services |
| 26 | 2_Master_Content_04 | Three-column variant. | Three features/services |
| 27 | 3_Master_Content_04 | Three-column variant. | Three features/services |
| 28 | 4_Master_Content_04 | Three-column variant. | Three features/services |
| 29 | Master_Content_05 | Heading + large body area. Chart-friendly. | Data, timelines, charts |
| 30 | Master_Content_06 | Full-width text. | Long-form text, T&Cs |
| 31 | Master_Content_07 | Text + accent visual. | Mixed content |
| 32 | Master_Content_08 | Two-column text layout. | Comparison, pros/cons |
| 33 | 1_Master_Content_06 | Three-col variant. | Three-column content |
| 34 | 2_Master_Content_06 | Three-col variant. | Three-column content |
| 35 | 3_Master_Content_06 | Three-col variant. | Three-column content |
| 36 | Master_Content_09 | Blank / full-bleed. No placeholders. | Custom visual layouts |
| 37 | Master_Content_Elevation | Blue/purple gradient card. High emphasis. | Key stats, pull quotes |
| 38 | Master_Content_10 | Image right, text left. | Feature with right-side visual |
| 39 | Master_Content_11 | 4-item quad grid. | Four features/benefits |
| 40 | Master_Content_12 | Timeline/process layout. | Process flows |
| 41 | Master_Content_13 | Standard content with 0/1 title placeholders. | Simple title+content |
| 42 | Master_Content_14 | Content with subtle accent. | Standard body |
| 43 | Master_Content_15 | Heading + multi-column body. | Structured comparison |
| 44 | Master_Content_16 | Heading + body text. | Standard content |

**Standard content placeholders:**
- `idx=10` — Heading / section label
- `idx=11` — Body text (primary)
- `idx=12` — Body text (secondary / col 2)
- `idx=13` — Body text (col 3 or image)
- `idx=14` — Additional text field

---

### Closing Slides (Layouts 45–48)
Gradient backgrounds (blue→purple→magenta or purple→pink). "Thank You" or custom close message. {{COMPANY_NAME}} logo centered bottom. "For People, By People" sub-tagline.

| Idx | Name | Description |
|---|---|---|
| 45 | Master_Closing_01 | Blue→magenta gradient with person photo bleed. "Thank You" centered large. Logo centered. |
| 46 | Master_Closing_02 | Purple→coral gradient. Decorative circle motifs. Clean, abstract. |
| 47 | Master_Closing_03 | Similar gradient with circle overlay patterns. |
| 48 | Master_Closing_Elevation | Emphasis variant. |

**Placeholder:**
- `idx=10` — Closing message text (e.g., "Thank You", "For People, By People", custom CTA)

---

## Visual Motifs

The {{COMPANY_NAME}} template has several consistent visual elements:

1. **{{COMPANY_NAME}} 'a' icon** — appears top-left corner on content slides (with the colored dots: blue, purple, magenta)
2. **"For People, By People"** — appears top-right on most slides in white (dark bg) or navy (light bg)
3. **Curved accent arcs** — coral/magenta curved stroke decorations on some cover slides
4. **Circle-cropped photos** — person photos often appear in circular frames (especially on dividers and some covers)
5. **Gradient band** — the blue→purple→magenta gradient appears as backgrounds and as the agenda/ToC right panel
6. **Confidentiality footer** — bottom of every slide: "Confidential – Do not duplicate or distribute..." in 6-7pt Gelion
7. **{{COMPANY_FILE}} — appears bottom-right on content slides

---

## Logo Usage Guide

| File | Background | When to Use |
|---|---|---|
| `{{COMPANY_FILE}} | Light/white | Content slides, white backgrounds |
| `{{COMPANY_FILE}} | Dark/navy/gradient | Cover, dividers, closings |
| `{{COMPANY_FILE}} | Grayscale/dark mono | Print, monochrome contexts |
| `{{COMPANY_FILE}} | Grayscale/light mono | Print, monochrome contexts |
| `{{COMPANY_FILE}} | Light | Compact spaces (icon context) |
| `{{COMPANY_FILE}} | Dark | Compact + dark background |

**Logo dimensions:** Primary is ~3.8:1 width:height. Always preserve aspect ratio.
**Recommended sizes in slides:**
- Header (top-left): 1.3–1.5" wide
- Closing slide (centered): 2.0–2.5" wide
- Footer: 1.0–1.2" wide

**⚠️ CRITICAL:** Never embed SVG directly in PPTX XML. Always convert to PNG via `cairosvg.svg2png()` first.

---

## Slide Anatomy

### Content Slide (white bg)
```
┌─────────────────────────────────────────────────────────────────┐
│ [{{COMPANY_NAME}} 'a' icon]                     For People, By People      │  ← top bar (white bg)
│─────────────────────────────────────────────────────────────────│
│                                                                   │
│  SLIDE HEADING (Gelion SemiBold 32pt, Navy)                      │
│                                                                   │
│  Body text here (Gelion Regular 13pt, Navy)                      │
│  • Bullet one                                                     │
│  • Bullet two                                                     │
│  • Bullet three                                                   │
│                                                                   │
│─────────────────────────────────────────────────────────────────│
│ [{{COMPANY_NAME}} logo]   Confidential...Copyright ©2025     {{COMPANY_FILE}}  │  ← footer
└─────────────────────────────────────────────────────────────────┘
```

### Cover Slide (dark bg)
```
┌─────────────────────────────────────────────────────────────────┐
│ [{{COMPANY_NAME}} logo white]                   For People, By People       │  ← top bar (dark bg)
│                                                                   │
│  THE TITLE HEADING                     [  person photo  ]        │
│  GOES HERE                             [    right side   ]       │
│  (Gelion SemiBold 44pt, White)                                   │
│                                                                   │
│  The subtitle text goes here                                      │
│  (Gelion Regular 16pt, White)                                     │
│                                                                   │
│─────────────────────────────────────────────────────────────────│
│ Confidential...                                                   │  ← footer
└─────────────────────────────────────────────────────────────────┘
```

---

## Proposal Deck Structure (Standard)

| Slide # | Layout | Content |
|---|---|---|
| 1 | Cover_01 | Client name / deck title / date |
| 2 | Agenda_01 | Table of contents (5 sections) |
| 3 | Divider_01 | Section 01: About {{COMPANY_NAME}} |
| 4 | Content_01 | Who is {{COMPANY_NAME}} + EOR explainer |
| 5 | Content_01 | {{COMPANY_NAME}} origin story + direct model |
| 6 | Divider_01 | Section 02: The Challenge |
| 7 | Content_01 | Client's situation / pain points |
| 8 | Divider_01 | Section 03: Our Solution |
| 9 | Content_04 | EOR services overview |
| 10 | 1_Content_04 | Three key services (3-col) |
| 11 | Divider_01 | Section 04: Why {{COMPANY_NAME}} |
| 12 | Content_01 | Differentiators vs competitors |
| 13 | Content_Elevation | Key stats (160+ countries, etc.) |
| 14 | Content_02 | Account team (if applicable) |
| 15 | Divider_01 | Section 05: Next Steps |
| 16 | Content_01 | Next steps / CTA |
| 17 | Closing_01 | Thank you + For People, By People |

---

## {{COMPANY_NAME}} Core Messaging (Brand Voice)

**Tagline:** For People, By People

**Positioning:** {{COMPANY_NAME}} is the original Employer of Record — direct, expert, and built for people.

**Key proof points:**
- 160+ countries, direct EOR model (no third-party intermediaries)
- 10+ years of EOR expertise
- ~500 employees globally
- Proprietary HXM platform
- Founded 2015/2016, HQ Chicago, IL

**ICP (Ideal Customer Profile):**
- Companies expanding internationally who need to hire in 1+ new countries
- High-growth / PE-backed companies needing speed to hire
- Enterprises simplifying a fragmented multi-country HR stack
- Companies moving from PEO to EOR for more control/compliance

**Competitive positioning vs:**
- **Deel**: {{COMPANY_NAME}} is direct (no aggregators); Deel uses local partners in some markets
- **Remote**: {{COMPANY_NAME}} has broader direct footprint; older more proven platform
- **Rippling**: {{COMPANY_NAME}} is EOR-specialist; Rippling is broader HR suite (different positioning)
- **Traditional PEO**: EOR doesn't require co-employment; more compliant for international

**Voice attributes:**
- Warm, expert, human
- "Your people" not "human capital" or "headcount"
- Confident, not boastful
- Clear > clever
- Global reach, personal service
