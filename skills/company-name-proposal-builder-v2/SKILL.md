---
name: company-name-proposal-builder-v2
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with company name proposal builder v2. Use when working with company name proposal builder v2."
---

# {{COMPANY_NAME}} Smart Proposal & Presentation Builder (v3.0.0)

You are an autonomous agent that builds polished, fully-branded {{COMPANY_NAME}} PowerPoint
presentations. You take user content and produce a .pptx that is indistinguishable from
a deck built by {{COMPANY_NAME}}'s design team — because it literally IS built from {{COMPANY_NAME}}'s own template.

**Two modes — pick based on the request:**

| Mode | Use When | Approach |
|---|---|---|
| **Auto Build** (default) | "Build me a proposal for [company]", standard deck types | ROSTR Semantic Intake → Python automation → .pptx |
| **Custom Build** | Non-standard layouts, charts, custom visuals, team slides | Unpack template XML → Edit → Pack |

---

## Non-Negotiables (Both Modes)

1. **Always output .pptx** — never HTML, never Google Slides markup
2. **Always use Gelion font** — never substitute Poppins, Arial, Calibri, or any alternative
3. **Always start from the bundled template**: {{COMPANY_FILE}}
4. **Tagline is always "For People, By People"** — fixed, non-negotiable. Never use any alternative tagline. Closing slides always use this exact tagline.
5. **Clone, don't rebuild.** Auto Build mode clones template source slides — never constructs from scratch
6. **Max 5 bullets per content slide** — auto-splits if more
7. **Always strip inherited bullet styling** — _strip_bullet_elements() runs on every paragraph to prevent double-bullet rendering
8. **All bullets use "— " prefix** (em-dash + space) — consistent across all slide types, normalized by fmt_bullet()
9. **10 words max per bullet** — cut ruthlessly; enterprise slides read in 5 seconds
10. **Validate ZIP structure before delivery**

---

## MODE 1: AUTO BUILD (Proposals & Standard Decks)

Use this mode for: proposals, discovery decks, sales pitches, partner decks, renewal decks,
and any request where content can be generated from a company name + deal context.

### ROSTR Semantic Intake — Step A: Extract Deal Context

```
DEAL CONTEXT EXTRACTION
Company name   : [extracted or "unknown"]
Company size   : [headcount if mentioned]
Industry       : [sector if mentioned or inferable]
Countries      : [countries of interest for EOR]
Use case       : [why they need EOR — expansion, remote hire, compliance, speed]
Pain points    : [challenges driving this deal — specific, not generic]
Deal stage     : [early | mid | late | renewal]
Deck type      : [proposal | discovery | pitch | internal | partner]
Audience       : [HR, C-suite, IT, Finance, or mix]
Tone           : [formal | conversational | executive]
```

Infer freely — only ask when a gap would produce a meaningless deck.

### ROSTR Semantic Intake — Step B: Narrative Arc + Deck Structure

**Arc by audience:**

| Deck Type | Audience | Narrative Arc |
|---|---|---|
| proposal | HR / People | Pain → {{COMPANY_NAME}} Solution → How It Works → Countries → Platform → Rollout → Next Steps |
| proposal | C-suite | Business risk → Cost of inaction → {{COMPANY_NAME}} advantage → ROI + speed → Next Steps |
| discovery | HR | EOR 101 → Why direct model matters → {{COMPANY_NAME}} differentiators → Platform demo → Next Steps |
| pitch | Investor | Market size → Problem → {{COMPANY_NAME}} unique position → Traction → Team → Ask |
| internal | {{COMPANY_NAME}} team | Context → Current state → Decision needed → Options → Recommendation → Timeline |
| partner | Partner org | Shared ICP → Joint value prop → Go-to-market motion → Deal mechanics → Next Steps |

**Structure by deal stage:**

| Deal Stage | Ideal Deck Length | Emphasis |
|---|---|---|
| early | 8–10 slides | Problem framing, {{COMPANY_NAME}} credibility, differentiators |
| mid | 12–14 slides | Solution depth, platform walkthrough, ROI, rollout |
| late | 10–12 slides | Commercial terms, timeline, risk mitigation, next steps |
| renewal | 8–10 slides | Value delivered, expansion opportunity, retention offer |

**Structure rules:**
- Every deck starts with cover and ends with closing
- Every major section starts with a divider
- three_col is best for comparisons, process steps, or parallel benefits
- content is best for narrative, bullets, and analysis
- Max 3 three_col slides per deck — overuse dilutes impact
- Never put two divider slides back-to-back
- Never put two three_col slides back-to-back without a content slide between them

### ROSTR Semantic Intake — Step C: {{COMPANY_NAME}} Value Prop Selection

**Core differentiators — rank by deal context:**

| Value Prop | Best For |
|---|---|
| 160+ countries, 100% direct EOR model — {{COMPANY_NAME}} owns every entity, zero intermediaries | C-suite, compliance-sensitive industries |
| 48-hour onboarding in most markets (vs. 4–6 weeks competitors) | Speed-to-hire, competitive-offer scenarios |
| One platform: HXM manages payroll, benefits, compliance, mobility end-to-end | Ops/IT, platform consolidation buyers |
| No markup on local benefits — employees get market-rate packages | HR/People teams |
| Compliance-first: local labor law, mandatory benefits, termination risk built in | Legal, Finance, regulated industries |
| Dedicated in-country support with local expertise | Companies entering complex markets first time |

**Problem framing — use 2–3 matching the prospect:**

| Problem Frame | Use When |
|---|---|
| "Setting up legal entities takes 6–18 months and $50K–$500K per country" | Expansion, new markets |
| "Misclassifying contractors creates $200K+ liability per person" | Contractor-heavy companies |
| "Top international candidates accept competing offers in 72 hours" | Fast-growth, competitive hiring |
| "Managing payroll across 3+ providers creates compliance exposure" | Multi-country, existing EOR users |
| "Labor law violations in non-US markets can trigger criminal liability" | C-suite, regulated industries |

**Country-specific (inject only when countries are mentioned):**

| Country | Key Facts |
|---|---|
| Germany | Works council, Kurzarbeit, strict termination protections |
| Japan | Complex social insurance, probationary periods — {{COMPANY_NAME}} owns Tokyo entity |
| UK | IR35 compliance, auto-enrollment pensions, post-Brexit complexity |
| India | PF/ESIC, gratuity, complex payroll — {{COMPANY_NAME}} owns Mumbai entity |
| Brazil | CLT, FGTS, mandatory vacation accrual — {{COMPANY_NAME}} owns São Paulo entity |
| Canada | Provincial standards vary — {{COMPANY_NAME}} covers all 13 provinces and territories |
| Singapore | MPF, work pass management, tripartite guidelines |

### ROSTR Semantic Intake — Step D: Content Quality Rules

**Bullet rules:**
- Max 10 words per bullet — cut ruthlessly
- Lead with the benefit or outcome, not the feature
- Use specific numbers: "48-hour onboarding" not "fast onboarding"
- No filler: no "leveraging", "utilizing", "synergies", "best-in-class"
- One idea per bullet — never compound two points with "and"
- Never start two consecutive bullets with the same word

**Heading rules:**
- 3–7 words, title case
- State the insight, not the topic: "Expansion Costs More Than You Think" not "About Global Expansion"
- divider headings should tease the section: "The Problem", "How {{COMPANY_NAME}} Fixes It", "What Rollout Looks Like"

**Column title rules:**
- 2–5 words max, title case, parallel grammatically across all three columns

**Closing message rules:**
- 5–15 words, action-oriented, mild urgency
- Always follows "For People, By People" on the closing slide

### ROSTR Semantic Intake — Step E: Build the Slide Spec

```python
from datetime import datetime
company = "[Company Name]"  # replace with actual

slides_data = [
    {'type': 'cover',
     'title': f'Global Hiring Solution for {company}',
     'subtitle': '{{COMPANY_NAME}} — Employer of Record',
     'date': datetime.now().strftime('%B %Y')},

    {'type': 'content',
     'heading': 'Executive Summary',
     'body': [
         f'{company} expanding into [countries]: [N] hires by [date]',
         'Current approach creates [specific risk or cost]',
         '{{COMPANY_NAME}} provides [specific capability] in 48 hours',
         '100% direct EOR model — no intermediaries, no surprises',
     ]},

    {'type': 'divider', 'number': '01', 'title': 'The Problem'},

    {'type': 'three_col',
     'heading': 'Three Risks You Face Today',
     'cols': [
         ('Speed', ['Top talent accepts in 72 hrs', 'Traditional setup takes 6+ months', 'You lose before the offer']),
         ('Compliance', ['Local labor law varies by country', 'Penalties reach $200K+ per hire', 'Executives hold personal liability']),
         ('Cost', ['Entity setup: $50K–$500K', 'Ongoing legal ops adds overhead', 'Multi-vendor payroll creates errors']),
     ]},

    {'type': 'divider', 'number': '02', 'title': 'How {{COMPANY_NAME}} Solves This'},

    {'type': 'content',
     'heading': 'The {{COMPANY_NAME}} Difference',
     'body': [
         '160+ countries, every entity owned directly by {{COMPANY_NAME}}',
         '48-hour onboarding — from contract to first payslip',
         'One platform for payroll, benefits, compliance, mobility',
         'No markup on local benefits — your people get fair packages',
     ]},

    {'type': 'three_col',
     'heading': 'How It Works',
     'cols': [
         ('Day 1', ['Rep requests hire via HXM', '{{COMPANY_NAME}} activates in-country entity', '48-hr onboarding SLA begins']),
         ('Week 1', ['Local contract generated', 'Payroll + benefits enrolled', 'Compliance review complete']),
         ('Ongoing', ['Single platform for all countries', 'Dedicated in-country support', 'Real-time compliance monitoring']),
     ]},

    {'type': 'divider', 'number': '03', 'title': 'Rollout Plan'},

    {'type': 'content',
     'heading': '30-60-90 Day Plan',
     'body': [
         'Day 0–30: {{COMPANY_NAME}} legal review + country activation for [markets]',
         'Day 31–60: First [N] hires onboarded, payroll live',
         'Day 61–90: Full team operational, QBR with {{COMPANY_NAME}} success team',
     ]},

    {'type': 'content',
     'heading': 'Why Move Now',
     'body': [
         '[Specific market condition or competitor pressure]',
         'Every month delayed costs [specific estimate]',
         '[N] companies in [industry] already hired via {{COMPANY_NAME}} in [region]',
     ]},

    {'type': 'closing',
     'message': 'Your Global Team Starts in 48 Hours',
     'contact': '[Rep Name]  |  [rep@{{COMPANY_FILE}}  |  {{COMPANY_FILE}}
]
```

**After building the spec, call build_deck(slides_data, filename) immediately.**

Filename convention: {{COMPANY_FILE}}[Company]_Proposal_[MonthYear].pptx
Example: {{COMPANY_FILE}}

### Standard Deck Structures

**Early stage (8–10 slides):**
```
1. cover
2. content   — Executive Summary
3. divider   — 01 / The Challenge
4. three_col — Three Risk Areas
5. divider   — 02 / How {{COMPANY_NAME}} Solves This
6. content   — The {{COMPANY_NAME}} Advantage
7. content   — Why Now
8. closing
```

**Mid stage (12–14 slides):**
```
1.  cover
2.  content   — Executive Summary
3.  divider   — 01 / The Problem
4.  three_col — Pain Points (3 columns)
5.  content   — Business Impact
6.  divider   — 02 / The Solution
7.  content   — How {{COMPANY_NAME}} Solves This
8.  three_col — How It Works (3-step process)
9.  divider   — 03 / Rollout & Timeline
10. content   — 30-60-90 Day Plan
11. three_col — Success Metrics
12. content   — Why Now
13. content   — Next Steps
14. closing
```

**Late stage (10–12 slides):**
```
1.  cover
2.  content   — Executive Summary
3.  content   — Proposed Scope
4.  divider   — 01 / Commercial Terms
5.  content   — Pricing Overview
6.  three_col — Included Services
7.  divider   — 02 / Implementation
8.  content   — Onboarding Timeline
9.  content   — Success Criteria
10. content   — Next Steps + Decision Points
11. closing
```

**Internal / All-Hands:**
```
1. cover (title + presenter name)
2. content   — Agenda
3. divider   — per section
4. content slides per section
5. closing
```

**Sales Pitch:**
```
1. cover
2. content   — "The World Has Changed" (one compelling market truth)
3. three_col — Three problems we solve
4. divider   — How {{COMPANY_NAME}} Works
5. content   — The Solution
6. content   — Proof Points
7. content   — Next Steps
8. closing
```

---

### STEP 0 — Install & Setup

```python
import subprocess, sys, os, zipfile, glob, traceback
from datetime import datetime
from copy import deepcopy

for pkg in ['python-pptx']:
    subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', pkg], capture_output=True)

from pptx import Presentation
from pptx.oxml.ns import qn
from lxml import etree as _etree

def find_skill_dir():
    home = os.path.expanduser('~')
    candidates = (
        list(glob.glob('/sessions/*/mnt/.claude/skills/{{COMPANY_NAME}}-proposal-builder-v2/')) +
        [f'{home}/.claude/skills/{{COMPANY_NAME}}-proposal-builder-v2',
         f'{home}/.claude/skills/{{COMPANY_NAME}}-proposal-builder']
    )
    for c in candidates:
        c = c.rstrip('/')
        if os.path.exists(os.path.join(c, 'assets/templates')):
            return c
    return '.'

def find_output_dir():
    for p in sorted(glob.glob('/sessions/*/mnt/*/'), reverse=True):
        if not p.split('/')[-2].startswith('.') and os.access(p, os.W_OK):
            return p.rstrip('/')
    desktop = os.path.expanduser('~/Desktop')
    return desktop if os.path.isdir(desktop) else os.path.expanduser('~')

SKILL_DIR = find_skill_dir()
_T_SKILL  = os.path.join(SKILL_DIR, '{{COMPANY_FILE}}
_T_SLIM   = os.path.join(SKILL_DIR, '{{COMPANY_FILE}}
TEMPLATE  = _T_SKILL if os.path.exists(_T_SKILL) else _T_SLIM
OUT_DIR   = find_output_dir()

print(f"Template : {'OK' if os.path.exists(TEMPLATE) else 'MISSING'} {TEMPLATE}")
print(f"Output   : {OUT_DIR}")
```

### STEP 1 — Load Template + Source Slide Map

```python
_R_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

SRC = {
    'cover'    : 0,   # Master_Cover_03
    'divider'  : 3,   # Master_Content_Divider_01
    'content'  : 7,   # Master_Content_01 — idx=11 body; TextBox 5 deleted first
    'three_col': 44,  # 1_Master_Content_04
    'closing'  : 58,  # Master_Closing_01
}

prs = Presentation(TEMPLATE)
orig_count = len(prs.slides)
print(f"Template loaded: {orig_count} slides")
```

### STEP 2 — Clone Helper

```python
def clone_slide(src_idx):
    src = prs.slides[src_idx]
    new_slide = prs.slides.add_slide(src.slide_layout)
    src_cSld = src._element.find(qn('p:cSld'))
    dst_cSld = new_slide._element.find(qn('p:cSld'))
    dst_cSld.getparent().replace(dst_cSld, deepcopy(src_cSld))
    for rId, rel in src.part._rels._rels.items():
        if not rel.is_external and '/image' in rel.reltype:
            new_slide.part._rels._rels[rId] = rel
    return new_slide
```

### STEP 3 — Text Replacement Helpers

```python
def ph(slide, idx):
    for shape in slide.placeholders:
        if shape.placeholder_format.idx == idx:
            return shape
    return None

def _fmt(tf):
    result = {'pPr': None, 'rPr': None}
    for para in tf.paragraphs:
        if result['pPr'] is None:
            pPr = para._p.find(qn('a:pPr'))
            if pPr is not None:
                result['pPr'] = deepcopy(pPr)
        for run in para.runs:
            if result['rPr'] is None:
                rPr = run._r.find(qn('a:rPr'))
                if rPr is not None:
                    result['rPr'] = deepcopy(rPr)
            break
        if result['pPr'] is not None and result['rPr'] is not None:
            break
    return result

def _strip_bullet_elements(pPr):
    """Strip all inherited bullet chars from pPr and add buNone.
    Prevents double-bullet rendering (inherited layout bullet + em-dash text prefix)."""
    for tag in [qn('a:buClr'), qn('a:buClrTx'), qn('a:buSzClr'),
                qn('a:buSzPct'), qn('a:buSzTx'), qn('a:buFont'),
                qn('a:buFontTx'), qn('a:buNone'), qn('a:buAutoNum'),
                qn('a:buChar')]:
        el = pPr.find(tag)
        if el is not None:
            pPr.remove(el)
    _etree.SubElement(pPr, qn('a:buNone'))

def _write(tf, lines, fmt):
    """Rebuild text frame. _strip_bullet_elements() applied to every paragraph —
    eliminates double-bullet rendering on all slide types consistently."""
    tf.clear()
    for i, text in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        if fmt['pPr'] is not None:
            existing = p._p.find(qn('a:pPr'))
            if existing is not None:
                p._p.remove(existing)
            pPr = deepcopy(fmt['pPr'])
            _strip_bullet_elements(pPr)
            p._p.insert(0, pPr)
        run = p.add_run()
        run.text = str(text)
        if fmt['rPr'] is not None:
            existing = run._r.find(qn('a:rPr'))
            if existing is not None:
                run._r.remove(existing)
            run._r.insert(0, deepcopy(fmt['rPr']))

def smart_trim(text, max_chars, label=''):
    text = str(text).strip()
    if len(text) > max_chars:
        trimmed = text[:max_chars - 1].rstrip() + chr(8230)
        print(f"  Trimmed {label or 'text'}: '{text[:40]}...' -> {max_chars} chars")
        return trimmed
    return text

def set_ph(slide, idx, text):
    shape = ph(slide, idx)
    if not shape or not text:
        return False
    fmt = _fmt(shape.text_frame)
    _write(shape.text_frame, [str(text)], fmt)
    return True

def set_ph_lines(slide, idx, lines):
    shape = ph(slide, idx)
    if not shape or not lines:
        return False
    fmt = _fmt(shape.text_frame)
    _write(shape.text_frame, [str(l) for l in lines[:6]], fmt)
    return True

def delete_shape(slide, name):
    spTree = slide._element.spTree
    for child in list(spTree):
        nvSpPr = child.find(qn('p:nvSpPr'))
        if nvSpPr is not None:
            cNvPr = nvSpPr.find(qn('p:cNvPr'))
            if cNvPr is not None and cNvPr.get('name') == name:
                spTree.remove(child)
                return True
    return False

def fmt_bullet(text):
    """Normalize bullet: strip any existing prefix char, prepend em-dash."""
    text = str(text).strip().lstrip('—–-•▪▸►◆◇○●').strip()
    return f"—  {text}"
```

### STEP 4 — Slide Builders

```python
def build_cover(title, subtitle, date=''):
    s = clone_slide(SRC['cover'])
    set_ph(s, 0, smart_trim(title, 80, 'cover title'))
    line = f"{subtitle}  |  {date}" if date else subtitle
    set_ph(s, 1, smart_trim(line, 100, 'cover subtitle'))
    return s

def build_divider(number, title):
    s = clone_slide(SRC['divider'])
    num = str(number).zfill(2) if str(number).isdigit() else str(number)
    set_ph(s, 10, num)
    set_ph(s, 14, smart_trim(title, 80, 'divider title'))
    return s

def build_content(heading, bullets):
    """Content slide. Auto-splits at 5 bullets using 'cont'd' label (not numbered suffixes)."""
    if not bullets:
        bullets = ['']
    bullets = [fmt_bullet(b) for b in bullets if str(b).strip()]
    if not bullets:
        bullets = ['']
    if len(bullets) > 5:
        chunks = [bullets[j:j+5] for j in range(0, len(bullets), 5)]
        for i, chunk in enumerate(chunks):
            label = heading if i == 0 else f"{heading} (cont'd)"
            build_content(label, [b.lstrip('— ') for b in chunk])
        return
    s = clone_slide(SRC['content'])
    set_ph(s, 10, smart_trim(heading, 80, 'content heading'))
    delete_shape(s, 'TextBox 5')  # decorative shape overlaying body area
    set_ph_lines(s, 11, bullets)
    return s

def build_three_col(heading, cols):
    """Three-column layout. Pads to 3 cols automatically."""
    cols = list(cols)
    while len(cols) < 3:
        cols.append(('', []))
    s = clone_slide(SRC['three_col'])
    set_ph(s, 10, smart_trim(heading, 80, 'three_col heading'))
    for i, (col_title, col_body) in enumerate(cols[:3]):
        set_ph(s, [14, 15, 16][i], smart_trim(str(col_title), 60, f'col {i+1} title'))
        body = col_body if isinstance(col_body, list) else [col_body]
        lines = [fmt_bullet(b) for b in body if str(b).strip()]
        set_ph_lines(s, [11, 12, 13][i], lines)
    return s

def build_closing(message, contact='{{COMPANY_FILE}}
    s = clone_slide(SRC['closing'])
    set_ph(s, 10, smart_trim(message, 120, 'closing message'))
    set_ph(s, 11, smart_trim(contact, 80, 'closing contact'))
    return s
```

### STEP 5 — Orchestrator

```python
def build_deck(slides_data: list, output_filename: str = '{{COMPANY_FILE}} -> str:
    if not output_filename.endswith('.pptx'):
        output_filename += '.pptx'
    output_path = os.path.join(OUT_DIR, output_filename)
    print(f"Building {len(slides_data)} slides -> {output_path}")

    errors = []
    for i, spec in enumerate(slides_data):
        stype = spec.get('type', 'content')
        try:
            if   stype == 'cover':
                build_cover(spec.get('title',''), spec.get('subtitle',''), spec.get('date',''))
            elif stype == 'content':
                build_content(spec.get('heading',''), spec.get('body', []))
            elif stype == 'divider':
                build_divider(spec.get('number',''), spec.get('title',''))
            elif stype == 'three_col':
                build_three_col(spec.get('heading',''), spec.get('cols', []))
            elif stype == 'closing':
                build_closing(spec.get('message',''), spec.get('contact','{{COMPANY_FILE}}
            else:
                print(f"  Slide {i+1}: unknown type '{stype}' — skipped")
        except Exception as e:
            errors.append((i+1, stype, e))
            print(f"  ERROR Slide {i+1} ({stype}): {e}")
            traceback.print_exc()

    sldIdLst = prs.slides._sldIdLst
    for sldId in list(sldIdLst)[:orig_count]:
        rId = sldId.attrib.get(f'{{{_R_NS}}}id')
        if rId:
            try: prs.part.drop_rel(rId)
            except: pass
        sldIdLst.remove(sldId)

    prs.save(output_path)

    with zipfile.ZipFile(output_path, 'r') as z:
        sc = len([n for n in z.namelist()
                  if n.startswith('ppt/slides/slide') and n.endswith('.xml')])
    kb = os.path.getsize(output_path) / 1024

    status = 'OK' if not errors else f'PARTIAL ({len(errors)} error(s))'
    print(f"\n{status}  {output_path}")
    print(f"   {sc} slides  |  {kb:.0f} KB")
    if errors:
        for slide_num, stype, err in errors:
            print(f"   Slide {slide_num} ({stype}): {err}")
    return output_path
```

---

## MODE 2: CUSTOM BUILD (XML Editing)

Use this mode for: non-standard layouts, chart slides, team slides, icon grids, case studies,
timelines, or any deck requiring layouts beyond the 5 Auto Build templates.

```bash
# 1. Unpack the template
python /path/to/pptx/scripts/office/unpack.py \
  {{COMPANY_FILE}} unpacked/

# 2. Select layouts (see Full Layout Catalogue below)
#    Delete unused slides from ppt/presentation.xml <p:sldIdLst>
#    Duplicate needed slides using add_slide.py

# 3. Edit content in each slide XML (use the Edit tool, not sed/Python)

# 4. Clean orphaned files
python /path/to/pptx/scripts/clean.py unpacked/

# 5. Pack back to .pptx
python /path/to/pptx/scripts/office/pack.py unpacked/ output.pptx \
  --original {{COMPANY_FILE}}
```

When editing XML: reference font as typeface="Gelion" or typeface="Gelion SemiBold".

---

## Full Layout Catalogue (2026 Template — 60 Layouts)

### Cover / Title Slides

| Layout Name | Best For |
|---|---|
| 13_Master_Cover_03 | Dark cover with large photo — flagship title slide |
| Master_Cover_03 | Standard cover, clean layout |
| 1_Master_Cover_03 | Cover variant with subtitle area |
| 4_Master_Cover_03 | Cover with text-forward layout |
| 5_Master_Cover_03 | Cover with image left |
| 4_Title Slide | Light title slide |
| 5_Title Slide | Minimal title slide |
| 10_Title Slide | Title slide with bold accent |
| 16_Title Slide | Title slide with full-bleed treatment |
| Master_Cover_08 | Alternate cover treatment |

### Agenda Slides

| Layout Name | Best For |
|---|---|
| Master_Agenda_01 | Standard time-based agenda (5 items) |
| 1_Master_Agenda_01 | Agenda variant |
| 2_Master_Agenda_01 | Agenda with intro column |

### Section Dividers

| Layout Name | Best For |
|---|---|
| Master_Content_Divider_01 | Standard navy divider — section number + heading |
| 1_Master_Content_Divider_01 | Divider with image right |
| 2_Master_Content_Divider_01 | Divider variant |
| 3_Master_Content_Divider_01 | Divider with accent treatment |

### Content Slides

| Layout Name | Best For |
|---|---|
| Master_Content_01 | Text + image — standard body (most used) |
| Master_Content_02 | Two-column content |
| Master_Content_03 | Content with large visual |
| Master_Content_04 | Stats / numbers callout |
| 1_Master_Content_04 | Stats variant — used for three_col in Auto Build |
| 2_Master_Content_04 | Stats 3-up |
| 3_Master_Content_04 | Stats with context |
| 4_Master_Content_04 | Stats 4-up |
| 5_Master_Content_04 | Stats large format |
| Master_Content_05 | Quote / testimonial slide |
| Master_Content_06 | Three-column layout |
| 1_Master_Content_06 | Three-column variant |
| 2_Master_Content_06 | Three-column with icons |
| 3_Master_Content_06 | Three-column with images |
| Master_Content_07 | Full-bleed image with text overlay |
| Master_Content_08 | Two-panel layout |
| Master_Content_09 | Chart / data slide — headline + chart area |
| Master_Content_10 | Process / timeline flow |
| Master_Content_11 | Team slide — grid of people |
| 1_Master_Content_11 | Team 2-up |
| 2_Master_Content_11 | Team 3-up |
| Master_Content_12 | Icon grid |
| Master_Content_13 | List with large numbering |
| Master_Content_14 | Case study / proof point |
| 1_Master_Content_14 | Case study variant |
| 2_Master_Content_14 | Case study with metrics |
| Master_Content_15 | Comparison / before-after |
| Master_Content_16 | Full-width text |

### Closing Slides

| Layout Name | Best For |
|---|---|
| Master_Closing_01 | Standard closing — "For People, By People" tagline |
| 3_Master_Closing_01 | Closing with contact info |
| 4_Master_Closing_01 | Closing with CTA |

### Other

| Layout Name | Best For |
|---|---|
| Master_Disclaimer | Legal / disclaimer text |
| 1_Blank | Blank slide for custom layouts |

---

## Brand Standards

### Typography

| Usage | Weight | File | Size |
|---|---|---|---|
| Cover title | Bold | Gelion Bold.ttf | 44–56pt |
| Slide headline | SemiBold | Gelion SemiBold.ttf | 40–52pt |
| Subheading / column title | Medium | Gelion-Medium.otf | 28–36pt |
| Body text / bullets | Regular | Gelion-Regular.otf | 12–14pt |
| Captions / footnotes | Regular | Gelion-Regular.otf | 8–10pt |

**Chart slides:** Headline = the takeaway, not the label. Cite data source at bottom in Gelion Regular 8pt.
**Team slides:** Delete entire group (image + text boxes) for unused slots — never leave blanks.
**One idea per slide.** If you need a second main point, make a second slide.
**Headlines should state the insight**, not label the content. "Our customers grow 3x faster" beats "Customer Growth".

### Brand Colors

| Token | Hex | Role |
|---|---|---|
| dk1 | #160628 | Primary text — very dark purple |
| dk2 | #1E0469 | Dark accent / hyperlinks — deep indigo |
| lt1 | #FFFFFF | White backgrounds |
| lt2 | #F8F8F8 | Off-white / light panels |
| accent1 | #0559FA | Primary {{COMPANY_NAME}} blue — bullets, highlights, CTA |
| accent2 | #5827E3 | Purple — secondary accent |
| accent3 | #BA33CA | Magenta — tertiary / divider accents |
| accent4 | #FF5959 | Coral red — warnings, emphasis |
| accent5 | #FF8F77 | Peach orange |
| accent6 | #F6B941 | Amber gold |

Critical: Template uses _SchemeColor references (not hardcoded RGB). Never access run.font.color.rgb
in code — use XML-level rPr deepcopy to preserve scheme colors.

### Logos

| File | Use When |
|---|---|
| {{COMPANY_FILE}} | Light / white backgrounds (default) |
| {{COMPANY_FILE}} | Dark / navy backgrounds |
| {{COMPANY_FILE}} | Dark monochrome contexts |
| {{COMPANY_FILE}} | Light monochrome contexts |
| {{COMPANY_FILE}} | Compact spaces (footer, co-branding) |
| {{COMPANY_FILE}} | Compact + dark background |

### Asset Paths in Code

```python
SKILL_DIR = find_skill_dir()
TEMPLATE  = os.path.join(SKILL_DIR, '{{COMPANY_FILE}}
LOGO_DIR  = os.path.join(SKILL_DIR, 'assets/logos')
FONT_DIR  = os.path.join(SKILL_DIR, 'assets/fonts')
```

---

## Quick Reference

### Auto Build Slide Spec

```python
{'type': 'cover',    'title': '...', 'subtitle': '...', 'date': '...'}
{'type': 'content',  'heading': '...', 'body': ['bullet 1', 'bullet 2', ...]}
{'type': 'divider',  'number': '01', 'title': 'Section Name'}
{'type': 'three_col','heading': '...', 'cols': [
    ('Col 1 Title', ['line 1', 'line 2', 'line 3']),
    ('Col 2 Title', ['line 1', 'line 2', 'line 3']),
    ('Col 3 Title', ['line 1', 'line 2', 'line 3']),
]}
{'type': 'closing',  'message': '...', 'contact': '...'}
```

### Source Slide Map (Auto Build)

| Slide Type | Template Slide | Placeholders |
|---|---|---|
| cover | Slide 0 | idx=0 (title), idx=1 (subtitle/date) |
| divider | Slide 3 | idx=10 (section number), idx=14 (title) |
| content | Slide 7 | idx=10 (heading), idx=11 (body — delete TextBox 5 first) |
| three_col | Slide 44 | idx=10 (heading), idx=14/15/16 (col titles), idx=11/12/13 (col bodies) |
| closing | Slide 58 | idx=10 (main message), idx=11 (contact line) |

### Content Limits

| Rule | Limit |
|---|---|
| Bullets per content slide | 5 max — auto-splits with "cont'd" |
| Lines per column body | 6 max |
| Words per bullet | 10 max |
| Cover title | 80 chars |
| Heading | 80 chars |
| Column title | 60 chars |
| Closing message | 120 chars |
| Section number | "01", "02" — auto zero-padded |
| three_col per deck | 3 max |

---

## QA Checklist

```bash
# Text content check
python -m markitdown output.pptx

# Check for unfilled placeholders
python -m markitdown output.pptx | grep -iE "\bx{3,}\b|lorem|ipsum|\bTODO|\[insert|Title Heading|subtitle text|Agenda Here"

# Visual check
python /path/to/pptx/scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide && ls -1 "$PWD"/slide-*.jpg
```

**Visual inspection:**
- [ ] No text overflow or truncation visible
- [ ] No double-bullets (em-dash alongside a template bullet symbol)
- [ ] No blank or lorem ipsum placeholders
- [ ] No overlapping elements
- [ ] All headings are insight-statements, not labels
- [ ] Closing slide uses "For People, By People" tagline
- [ ] Font is Gelion throughout
- [ ] Logo present as placed by template
- [ ] File is .pptx and opens correctly in PowerPoint
