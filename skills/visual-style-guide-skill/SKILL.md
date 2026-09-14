---
name: visual-style-guide-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Visual Style Guide — Hand-Crafted SVG Diagrams. Use when working with visual style guide."
---

# Visual Style Guide — Hand-Crafted SVG Diagrams

This is the design system for every diagram this skill draws. Follow it exactly; consistency is what makes the output look professional.

## 1. Themes

Pick one theme per diagram. {{COMPANY_NAME}} is the default.

| Token | {{COMPANY_NAME}} (default) | Slate | Midnight | Blueprint | Warm |
|---|---|---|---|---|---|
| `bg` | `#F7F8FC` | `#F5F5F4` | `#0E1220` | `#0A1A33` | `#FBF7F1` |
| `surface` | `#FFFFFF` | `#FFFFFF` | `#1A2138` | `#10264A` | `#FFFFFF` |
| `surface-dark` | `#160629` | `#292524` | `#242E4D` | `#173764` | `#3B2F2F` |
| `ink` | `#160629` | `#1C1917` | `#EDF1FF` | `#DCEBFF` | `#3B2F2F` |
| `ink-muted` | `#6B7490` | `#78716C` | `#8C96B8` | `#7FA3D6` | `#8A7B6E` |
| `accent` | `#0559FA` | `#0D9488` | `#5B8CFF` | `#4CC3FF` | `#E1553F` |
| `accent-soft` | `#E7EEFF` | `#CCFBF1` | `#26335C` | `#123059` | `#FBE3DE` |
| `line` | `#D9DFEE` | `#D6D3D1` | `#333E63` | `#1E4270` | `#E7DCD0` |
| `ok / warn / err` | `#0E9F6E / #D97706 / #DC2626` | same | `#34D399 / #FBBF24 / #F87171` | same as Midnight | same as {{COMPANY_NAME}} |

Theme use: **{{COMPANY_NAME}}** for {{COMPANY_NAME}} / GTM work. **Slate** for neutral technical docs. **Midnight** for dark-mode decks. **Blueprint** for infra/network topology. **Warm** for journeys, org charts, people-centric maps.

On dark themes (`Midnight`, `Blueprint`): cards use `surface`, text uses `ink`, subtitle uses `ink-muted`, shadows are skipped (use a 1px `line` stroke instead).

## 2. Canvas

- Default `1600 × 900` (16:9, deck-ready). Tall layered stacks: `1400 × 1000`. Wide pipelines: `1800 × 800`.
- Margins: **80px** all sides. Nothing outside the margin except nothing.
- Title block, top-left inside margin: accent dot (`r=7`) + title (`20px`, bold, `ink`) + subtitle line below (`13px`, `ink-muted`).
- Optional footer, bottom-left: `11px`, `ink-muted` — date, owner, or "Draft".

## 3. Layout grid — compute before drawing

Never eyeball coordinates. Decide first:
- Number of columns/rows; standard card `w=240 h=92` (roomy: `260×104`; compact: `200×72`)
- Column gutter **70–90px**, row gutter **56–72px**
- Write down each column center-x and row center-y, then place everything on those lines
- Center the whole node field horizontally in the canvas; leave headroom under the title block (≥60px)

Layout patterns by diagram family:
- **Layered architecture**: rows top→bottom (Experience → Orchestration → Systems → Control), zones as full-width panels
- **Pipeline / ETL**: single left→right lane, stage zones as vertical panels
- **Hub-and-spoke / integration**: hub center, spokes on a ring (use 2 columns each side, not radial chaos)
- **Swimlane process**: horizontal lanes per owner, time flows left→right
- **Sequence**: actor columns with vertical lifelines (or emit Mermaid `sequenceDiagram` instead — often the better tool)
- **C4**: nested zones — system boundary panel containing container cards
- **Network topology**: Blueprint theme, zones per subnet/VPC

## 4. Node anatomy

Standard card, drawn in this order:
```svg
<!-- shadow: same rect offset +3,+4 -->
<rect x="303" y="204" width="240" height="92" rx="14" fill="{ink}" opacity="0.08"/>
<!-- card -->
<rect x="300" y="200" width="240" height="92" rx="14" fill="{surface}" stroke="{line}" stroke-width="1.5"/>
<!-- accent top bar: inset 14px each side so it doesn't overhang the rounded corners -->
<rect x="314" y="200" width="212" height="4" rx="2" fill="{accent}"/>
<!-- title, centered -->
<text x="420" y="240" text-anchor="middle" font-family="Helvetica, Arial" font-size="16" font-weight="700" fill="{ink}">Service Name</text>
<!-- subtitle -->
<text x="420" y="262" text-anchor="middle" font-family="Helvetica, Arial" font-size="12" fill="{ink-muted}">what it does</text>
```

Variants:
- **Primary / hero node**: fill `surface-dark`, title `#FFFFFF`, subtitle a light tint of accent (`#8FB5FF` on {{COMPANY_NAME}})
- **External system**: `stroke-dasharray="6 4"` border, no accent bar
- **Data store**: card + stacked-disc glyph left of title (two ellipses `rx=14 ry=5`, one 6px below the other, `stroke={accent}` `fill={accent-soft}`)
- **Queue / topic**: pill (`rx = height/2`)
- **Decision**: diamond `<polygon>`, `accent-soft` fill, `accent` stroke, short label
- **Human / actor**: circle head `r=10` + shoulders arc above the label, `ink-muted` stroke
- **Zone / group panel**: rounded rect `rx=18`, fill `accent-soft` `opacity="0.45"`, stroke `line`; label top-left inside, `11px`, bold, uppercase, `letter-spacing="1.5"`, `ink-muted`. Draw zones FIRST (bottom layer).

## 5. Edges

- **Primary flow**: `stroke={accent}` `stroke-width="2.5"`
- **Secondary call**: `stroke={line-darkened}` (`#A9B3CC` on {{COMPANY_NAME}}) `stroke-width="1.75"`
- **Async / event / observability**: `stroke-dasharray="7 5"`
- Orthogonal routing with rounded corners: `M x1 y1 H xm Q ... V ...` or straight lines; never diagonal spaghetti
- **Arrowheads are explicit polygons** (markers do NOT render in the PNG pipeline). Triangle pointing right at line end `(x,y)`:
  `<polygon points="{x},{y} {x-11},{y-5.5} {x-11},{y+5.5}" fill="{same-as-stroke}"/>`
  Rotate points for other directions.
- **Edge labels**: chip behind text — `<rect rx="8" fill="{bg}" stroke="{line}">` sized to text + 8px padding each side, text `11px` `ink-muted`. Place chips ON the line, never floating.
- **Step badges**: circle `r=12` fill `{accent}`, white bold `12px` number centered (`y` = cy+4). Place on the primary path near each step's edge or node corner. These numbers MUST match the overview doc.

## 6. Legend

Only when color/shape carries meaning. Bottom-right inside margin: small swatch (14×14 rounded rect or line sample) + `11px` label, one row per meaning, max 5 rows.

## 7. Renderer-safe SVG rules (hard constraints)

The PNG step may fall back to ImageMagick, which uses a limited SVG engine. Obey ALL of these:

1. **No `<marker>`** — arrowheads as explicit polygons (markers silently drop or misplace)
2. **No `<filter>`** — no `feDropShadow`, no blur; fake shadow = offset rect `opacity 0.08`
3. **No gradients** — `linearGradient` bands badly when rasterized; solid fills only
4. **No CSS** — no `<style>`, no classes; every attribute inline
5. **Fonts**: `font-family="Helvetica, Arial"` only; no webfonts, no `@font-face`
6. **No external references** — no `<image href>`, no `use xlink`
7. Escape text: `&amp;` `&lt;` `&gt;`
8. Root: `<svg xmlns="http://www.w3.org/2000/svg" width="W" height="H" viewBox="0 0 W H">`
9. Text fitting: budget ~`0.58 × font-size` px per character. A 240px card fits ~23 chars at 16px bold. If a label exceeds the budget, shorten the label — never shrink below 11px.

## 8. Verification (view the PNG, always)

After rendering, open the PNG with the Read tool and check:
- [ ] No text touching or overflowing card edges
- [ ] No node overlaps; columns/rows visibly aligned
- [ ] No edge passing through a text label
- [ ] Arrowheads present, pointing the right way
- [ ] Zones contain their nodes fully with ≥16px padding
- [ ] Contrast: muted text readable, dark-on-dark avoided
- [ ] Title block and (if present) legend inside margins

Fix and re-render until every box checks. Two iterations is normal.
