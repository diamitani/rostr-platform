---
name: brand-system-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with {{COMPANY_NAME}} Brand System — Dashboard Reference. Use when working with {{company_name}} brand system."
---

# {{COMPANY_NAME}} Brand System — Dashboard Reference

## CSS Variables (include in every dashboard)

```css
:root {
  /* Primary Palette */
  --navy:       #1E1244;
  --lavender:   #E8DEFF;
  --white:      #FFFFFF;
  --off-white:  #F7F5FC;

  /* Accent Colors */
  --purple:     #7C3AED;
  --blue:       #2563EB;
  --green:      #10B981;
  --amber:      #F59E0B;

  /* Supporting */
  --border:     #D4C5F9;
  --muted:      #6B7280;

  /* Typography */
  --font:       'Calibri', 'Arial', sans-serif;

  /* Spacing */
  --radius:     8px;
  --radius-lg:  12px;
  --shadow:     0 2px 8px rgba(30,18,68,0.08);
  --shadow-md:  0 4px 16px rgba(30,18,68,0.12);
}
```

---

## Logo HTML Pattern

### Full Header Bar (standard)
```html
<header class="{{COMPANY_NAME}}-header">
  <div class="{{COMPANY_NAME}}-logo">
    <span class="dot dot-purple">●</span>
    <span class="dot dot-blue">●</span>
    <span class="dot dot-green">●</span>
    <span class="wordmark">{{COMPANY_NAME}}<sup>HXM</sup></span>
  </div>
  <div class="header-title">
    <h1>Dashboard Title</h1>
    <span class="header-subtitle">Subtitle / Date / Period</span>
  </div>
  <div class="header-meta">
    <!-- optional: badge, last updated, etc -->
  </div>
</header>
```

### Header CSS
```css
.{{COMPANY_NAME}}-header {
  background: var(--navy);
  color: white;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 32px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.{{COMPANY_NAME}}-logo {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 22px;
  font-weight: 700;
}
.dot { font-style: normal; line-height: 1; }
.dot-purple { color: #7C3AED; }
.dot-blue   { color: #2563EB; }
.dot-green  { color: #10B981; }
.wordmark {
  color: white;
  font-family: var(--font);
  font-weight: 700;
  font-size: 18px;
  margin-left: 6px;
  letter-spacing: -0.3px;
}
.wordmark sup {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.5px;
  vertical-align: super;
  opacity: 0.8;
}
.header-title h1 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: white;
}
.header-subtitle {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}
.header-meta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}
```

---

## Footer HTML Pattern

```html
<footer class="{{COMPANY_NAME}}-footer">
  <span class="footer-tagline">For People, By People</span>
  <div class="footer-dots">
    <span style="color:#7C3AED">●</span>
    <span style="color:#2563EB">●</span>
    <span style="color:#10B981">●</span>
  </div>
</footer>
```

```css
.{{COMPANY_NAME}}-footer {
  background: var(--navy);
  color: rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
  font-size: 12px;
  margin-top: auto;
}
.footer-dots { font-size: 14px; display: flex; gap: 4px; }
```

---

## Status Badge System

```html
<span class="badge badge-green">Active</span>
<span class="badge badge-amber">Pending</span>
<span class="badge badge-red">Failed</span>
<span class="badge badge-purple">Highlight</span>
<span class="badge badge-navy">Inactive</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.badge-green  { background: rgba(16,185,129,0.12); color: #065f46; }
.badge-amber  { background: rgba(245,158,11,0.12); color: #92400e; }
.badge-red    { background: rgba(239,68,68,0.12);  color: #991b1b; }
.badge-purple { background: rgba(124,58,237,0.12); color: #5b21b6; }
.badge-navy   { background: rgba(30,18,68,0.08);   color: #1E1244; }
```

---

## Stat Card Pattern

```html
<div class="stat-card">
  <div class="stat-label">Open Rate</div>
  <div class="stat-value">42.7%</div>
  <div class="stat-delta positive">↑ 3.2% vs last week</div>
</div>
```

```css
.stat-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  box-shadow: var(--shadow);
  transition: transform 0.15s, box-shadow 0.15s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--navy);
  line-height: 1;
  margin-bottom: 6px;
}
.stat-delta {
  font-size: 12px;
  color: var(--muted);
}
.stat-delta.positive { color: var(--green); }
.stat-delta.negative { color: #ef4444; }
```

---

## Table Pattern

```html
<table class="{{COMPANY_NAME}}-table">
  <thead>
    <tr>
      <th>Rep Name</th>
      <th>Enrolled</th>
      <th>Open Rate</th>
      <th>Replies</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>James Apps</td>
      <td>142</td>
      <td>48.2%</td>
      <td>12</td>
      <td><span class="badge badge-green">Active</span></td>
    </tr>
  </tbody>
</table>
```

```css
.{{COMPANY_NAME}}-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.{{COMPANY_NAME}}-table thead th {
  background: var(--navy);
  color: white;
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.3px;
  white-space: nowrap;
}
.{{COMPANY_NAME}}-table thead th:first-child { border-radius: var(--radius) 0 0 0; }
.{{COMPANY_NAME}}-table thead th:last-child  { border-radius: 0 var(--radius) 0 0; }
.{{COMPANY_NAME}}-table tbody tr:nth-child(even) { background: var(--off-white); }
.{{COMPANY_NAME}}-table tbody tr:hover { background: var(--lavender); }
.{{COMPANY_NAME}}-table tbody td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--navy);
}
```

---

## Chart.js CDN + {{COMPANY_NAME}} Color Config

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

```javascript
// {{COMPANY_NAME}} Color Sequences
const {{COMPANY_PREFIX}}_COLORS = {
  primary:     ['#7C3AED', '#2563EB', '#10B981', '#F59E0B', '#1E1244'],
  backgrounds: [
    'rgba(124,58,237,0.25)',
    'rgba(37,99,235,0.25)',
    'rgba(16,185,129,0.25)',
    'rgba(245,158,11,0.25)',
    'rgba(30,18,68,0.25)'
  ]
};

// {{COMPANY_NAME}} Chart Defaults
Chart.defaults.font.family = "'Calibri', 'Arial', sans-serif";
Chart.defaults.color = '#6B7280';
Chart.defaults.plugins.tooltip.backgroundColor = '#1E1244';
Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
Chart.defaults.plugins.tooltip.bodyColor = 'rgba(255,255,255,0.8)';
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 6;
```

---

## Page Shell (full reset + base styles)

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: var(--font);
  background: var(--off-white);
  color: var(--navy);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.page-body {
  flex: 1;
  padding: 28px 32px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}
.section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--navy);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--lavender);
}
.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  box-shadow: var(--shadow);
}
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }
.mb-4 { margin-bottom: 16px; }
.mb-6 { margin-bottom: 24px; }
.mb-8 { margin-bottom: 32px; }
```
