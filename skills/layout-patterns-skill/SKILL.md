---
name: layout-patterns-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with {{COMPANY_NAME}} Dashboard — Layout Patterns. Use when working with {{company_name}} dashboard."
---

# {{COMPANY_NAME}} Dashboard — Layout Patterns

## Pattern A: KPI + Chart Grid (General Purpose)

Best for: Weekly reports, automation summaries, executive overviews

```
┌─────────────────────────────────────────────────────────┐
│  ●●● {{COMPANY_NAME}}   [Dashboard Title]        [Date / Meta] │  ← navy header
├─────────────────────────────────────────────────────────┤
│  [KPI Card 1] [KPI Card 2] [KPI Card 3] [KPI Card 4]   │  ← stat row
├───────────────────────────┬─────────────────────────────┤
│  Bar/Line Chart           │  Donut / Secondary Chart     │  ← chart row
├───────────────────────────┴─────────────────────────────┤
│  Detail Table (rep-level or record-level data)          │  ← table
├─────────────────────────────────────────────────────────┤
│  For People, By People                            ● ● ● │  ← footer
└─────────────────────────────────────────────────────────┘
```

HTML skeleton:
```html
<div class="page-body">
  <!-- KPI Row -->
  <div class="mb-6">
    <div class="section-title">Key Metrics</div>
    <div class="grid-4">
      <!-- stat cards here -->
    </div>
  </div>

  <!-- Charts Row -->
  <div class="grid-2 mb-6">
    <div class="card">
      <div class="section-title">Trend Over Time</div>
      <canvas id="mainChart" height="220"></canvas>
    </div>
    <div class="card">
      <div class="section-title">Breakdown</div>
      <canvas id="breakdownChart" height="220"></canvas>
    </div>
  </div>

  <!-- Table -->
  <div class="card">
    <div class="section-title">Detail View</div>
    <table class="{{COMPANY_NAME}}-table">...</table>
  </div>
</div>
```

---

## Pattern B: Prospect Automation / Batch Report

Best for: n8n batch run reports, Clay enrichment results, ICP filter outcomes

```
┌─────────────────────────────────────────────────────────┐
│  ●●● {{COMPANY_NAME}}   Prospect Automation Report   Batch #X  │
├─────────────────────────────────────────────────────────┤
│  [Total In] → [ICP Pass] → [Enriched] → [Enrolled]     │  ← pipeline funnel
├─────────────────────────────────────────────────────────┤
│  [Open Rate] [Reply Rate] [Meetings] [Bounce] [Unsub]   │  ← sequence KPIs
├───────────────────────────┬─────────────────────────────┤
│  Enrollments by Rep (bar) │  Open Rate Trend (line)     │
├───────────────────────────┴─────────────────────────────┤
│  Contact Records Table                                  │
├─────────────────────────────────────────────────────────┤
│  For People, By People                            ● ● ● │
└─────────────────────────────────────────────────────────┘
```

Funnel component:
```html
<div class="pipeline-funnel">
  <div class="funnel-stage">
    <div class="funnel-num">1,240</div>
    <div class="funnel-label">Contacts Pulled</div>
    <div class="funnel-arrow">→</div>
  </div>
  <div class="funnel-stage">
    <div class="funnel-num">387</div>
    <div class="funnel-label">ICP Pass</div>
    <div class="funnel-arrow">→</div>
  </div>
  <!-- etc. -->
</div>
```

```css
.pipeline-funnel {
  display: flex;
  align-items: center;
  gap: 0;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  margin-bottom: 24px;
}
.funnel-stage {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}
.funnel-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--navy);
}
.funnel-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.funnel-arrow {
  font-size: 20px;
  color: var(--purple);
  margin-left: auto;
  padding-right: 16px;
}
```

---

## Pattern C: Rep Performance / Leaderboard

Best for: AE sequence activity, quota tracking, rep comparison

```
┌─────────────────────────────────────────────────────────┐
│  ●●● {{COMPANY_NAME}}   Rep Performance          Week of [date]│
├─────────────────────────────────────────────────────────┤
│  [Total Enrolled] [Avg Open Rate] [Total Replies] [Mtgs]│
├─────────────────────────────────────────────────────────┤
│  Rep Leaderboard Table (sortable by metric)             │
│  Rank │ Rep │ Enrolled │ Open % │ Reply % │ Meetings    │
├─────────────────────────────────────────────────────────┤
│  Enrolled by Rep (horizontal bar chart)                 │
├─────────────────────────────────────────────────────────┤
│  For People, By People                            ● ● ● │
└─────────────────────────────────────────────────────────┘
```

Rank badge:
```html
<td><span class="rank rank-1">1</span></td>
```
```css
.rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
}
.rank-1 { background: var(--purple); color: white; }
.rank-2 { background: var(--blue);   color: white; }
.rank-3 { background: var(--green);  color: white; }
```

---

## Pattern D: Pipeline / Revenue Dashboard

Best for: HubSpot deal pipeline, stage distribution, AE quota

```
┌─────────────────────────────────────────────────────────┐
│  ●●● {{COMPANY_NAME}}   Pipeline Dashboard        Q2 2026      │
├─────────────────────────────────────────────────────────┤
│  [Total Pipeline $] [Deals Open] [Avg Deal Size] [CWR]  │
├───────────────────────────┬─────────────────────────────┤
│  Stage Distribution (bar) │  Deals by AE (donut)        │
├───────────────────────────┴─────────────────────────────┤
│  Deal Table: Company │ Stage │ AE │ Value │ Close Date  │
├─────────────────────────────────────────────────────────┤
│  For People, By People                            ● ● ● │
└─────────────────────────────────────────────────────────┘
```

---

## Pattern E: Presentation / Slide View

Best for: Stakeholder decks, ELT updates, initiative overviews

Use when user asks for "a slide" or "something to present" — output looks like a PowerPoint slide, not a data dashboard.

```
┌─────────────────────────────────────────────────────────┐
│  [Full navy cover with {{COMPANY_NAME}} logo centered, large title]│
├─────────────────────────────────────────────────────────┤
│  [Content slide: lavender sidebar + white main body]    │
│  Title on left panel (navy) │ Content on right (white)  │
├─────────────────────────────────────────────────────────┤
│  For People, By People                            ● ● ● │
└─────────────────────────────────────────────────────────┘
```

Cover slide pattern:
```css
.slide-cover {
  background: var(--navy);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 60px;
}
```

---

## Pattern F: Data Table / Tracker

Best for: Territory maps, account lists, task trackers, territory assignments

```
┌─────────────────────────────────────────────────────────┐
│  ●●● {{COMPANY_NAME}}   Territory Tracker        Last Updated  │
├─────────────────────────────────────────────────────────┤
│  [Search input] [Filter: Region ▼] [Filter: Status ▼]  │
├─────────────────────────────────────────────────────────┤
│  Full-width sortable, filterable table                  │
├─────────────────────────────────────────────────────────┤
│  For People, By People                            ● ● ● │
└─────────────────────────────────────────────────────────┘
```

Filter bar:
```html
<div class="filter-bar">
  <input type="text" class="filter-input" placeholder="Search...">
  <select class="filter-select"><option>All Regions</option></select>
  <select class="filter-select"><option>All Statuses</option></select>
</div>
```
```css
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.filter-input, .filter-select {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-family: var(--font);
  font-size: 13px;
  color: var(--navy);
  background: white;
}
.filter-input { flex: 1; }
.filter-input:focus, .filter-select:focus {
  outline: none;
  border-color: var(--purple);
  box-shadow: 0 0 0 2px rgba(124,58,237,0.15);
}
```
