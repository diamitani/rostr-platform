---
name: components-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with {{COMPANY_NAME}} Dashboard — Component Library. Use when working with {{company_name}} dashboard."
---

# {{COMPANY_NAME}} Dashboard — Component Library

Quick-copy components for building dashboards fast.

---

## Progress Bar

```html
<div class="progress-wrap">
  <div class="progress-label">
    <span>Open Rate</span>
    <span class="progress-val">42%</span>
  </div>
  <div class="progress-track">
    <div class="progress-fill" style="width:42%; background:var(--purple)"></div>
  </div>
</div>
```

```css
.progress-wrap { margin-bottom: 12px; }
.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 4px;
}
.progress-val { font-weight: 700; color: var(--navy); }
.progress-track {
  height: 6px;
  background: var(--lavender);
  border-radius: 999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}
```

---

## Section Divider

```html
<div class="divider-with-label">
  <span class="divider-text">Sequence Performance</span>
</div>
```

```css
.divider-with-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 16px;
}
.divider-with-label::before,
.divider-with-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}
.divider-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
}
```

---

## Trend Indicator

```html
<span class="trend up">↑ 4.2%</span>
<span class="trend down">↓ 1.8%</span>
<span class="trend flat">→ Flat</span>
```

```css
.trend {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
}
.trend.up   { background: rgba(16,185,129,0.12); color: #065f46; }
.trend.down { background: rgba(239,68,68,0.10);  color: #991b1b; }
.trend.flat { background: rgba(107,114,128,0.10); color: #4b5563; }
```

---

## Info Callout / Insight Box

```html
<div class="insight-box">
  <div class="insight-icon">💡</div>
  <div class="insight-text">
    <strong>Top Performer:</strong> James Apps leads with a 52% open rate this week,
    up 8% from last period.
  </div>
</div>
```

```css
.insight-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--lavender);
  border: 1px solid var(--border);
  border-left: 4px solid var(--purple);
  border-radius: var(--radius);
  padding: 14px 16px;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--navy);
}
.insight-icon { font-size: 16px; flex-shrink: 0; }
```

---

## Last Updated Timestamp

```html
<span class="last-updated">Last updated: <strong>March 22, 2026 · 9:00 AM CT</strong></span>
```

```css
.last-updated {
  font-size: 11px;
  color: rgba(255,255,255,0.55);
}
```

---

## Tab Navigation

```html
<div class="tab-bar">
  <button class="tab active" onclick="switchTab('overview')">Overview</button>
  <button class="tab" onclick="switchTab('sequences')">Sequences</button>
  <button class="tab" onclick="switchTab('reps')">By Rep</button>
</div>
```

```css
.tab-bar {
  display: flex;
  gap: 2px;
  background: var(--lavender);
  padding: 4px;
  border-radius: var(--radius);
  margin-bottom: 20px;
  width: fit-content;
}
.tab {
  padding: 6px 16px;
  border-radius: calc(var(--radius) - 2px);
  border: none;
  background: transparent;
  color: var(--muted);
  font-family: var(--font);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.tab.active {
  background: white;
  color: var(--navy);
  box-shadow: var(--shadow);
}
.tab:hover:not(.active) { color: var(--navy); }
```

---

## Chart Wrapper Card

```html
<div class="chart-card">
  <div class="chart-header">
    <span class="chart-title">Enrollments by Rep</span>
    <span class="chart-subtitle">Current batch · 142 total</span>
  </div>
  <canvas id="repChart" height="200"></canvas>
</div>
```

```css
.chart-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  box-shadow: var(--shadow);
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
}
.chart-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.chart-subtitle {
  font-size: 11px;
  color: var(--muted);
}
```

---

## Empty State

```html
<div class="empty-state">
  <div class="empty-icon">📊</div>
  <div class="empty-title">No data for this period</div>
  <div class="empty-sub">Try adjusting your filters or date range</div>
</div>
```

```css
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--muted);
}
.empty-icon { font-size: 32px; margin-bottom: 12px; }
.empty-title { font-size: 15px; font-weight: 600; color: var(--navy); margin-bottom: 4px; }
.empty-sub { font-size: 13px; }
```

---

## Loading Skeleton

```html
<div class="skeleton-card">
  <div class="skeleton-line short"></div>
  <div class="skeleton-line tall"></div>
  <div class="skeleton-line medium"></div>
</div>
```

```css
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skeleton-line {
  height: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  background: linear-gradient(90deg, var(--lavender) 25%, var(--off-white) 50%, var(--lavender) 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite;
}
.skeleton-line.short  { width: 40%; }
.skeleton-line.medium { width: 70%; }
.skeleton-line.tall   { height: 32px; width: 55%; }
```

---

## Copy-to-Clipboard Button

```html
<button class="copy-btn" onclick="copyToClipboard('stat-value-id')">Copy</button>
```

```css
.copy-btn {
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: white;
  color: var(--muted);
  font-family: var(--font);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}
.copy-btn:hover {
  border-color: var(--purple);
  color: var(--purple);
}
```

```javascript
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // optionally show a toast
  });
}
```

---

## Toast Notification

```html
<div id="toast" class="toast" style="display:none">✓ Copied to clipboard</div>
```

```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--navy);
  color: white;
  padding: 10px 18px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 600;
  box-shadow: var(--shadow-md);
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

```javascript
function showToast(msg = '✓ Done') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 2000);
}
```
