---
name: nlp-intake-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with NLP Intake Playbook — PAL for {{COMPANY_NAME}} Video Studio. Use when working with nlp intake playbook."
---

# NLP Intake Playbook — PAL for {{COMPANY_NAME}} Video Studio

This file is loaded by the skill whenever a user submits a casual video prompt.
It is the "compiler" between natural language and the JSON brief that drives
rendering. Follow these steps every time, silently, then show the user the
compiled brief before rendering.

---

## The 5-pass compile

**Pass 1 — Normalize.**
Lowercase, strip punctuation spam, preserve numbers and proper nouns (country
names, competitor names, {{COMPANY_NAME}} product terms).

**Pass 2 — Detect the archetype.**
Match on the strongest signal (in this priority order):
1. Explicit type word: "ad", "explainer", "demo", "testimonial", "quote",
   "announcement", "spotlight"
2. Destination cue: "linkedin" → `social_ad`; "internal" / "all hands" →
   `internal_announce`; "website hero" → `sales_explainer`
3. Content cue: named country → `country_spotlight`; named customer → `testimonial`;
   "platform" / "how it works" → `product_demo`; "quote from [name]" →
   `thought_leadership`; event name or date → `event_promo`
4. Fallback: if duration ≤ 20s → `social_ad`; if ≥ 60s → `sales_explainer`

**Pass 3 — Extract parameters.**
| Extract | Regex/cue | Default |
|---|---|---|
| duration_s | "\\d+\\s?(s|sec|second)" | archetype default |
| aspect | "linkedin"→1:1, "tiktok/ig story"→9:16, "youtube/website"→16:9 | archetype default |
| country | proper noun matching {{COMPANY_NAME}} supported-country list | — |
| accent | "blue/purple/magenta/coral" or design-system default | blue |
| CTA | "book a demo", "talk to us", "learn more", "visit [url]" | design-system default |
| voiceover persona | "exec" / "ceo"→exec; "rep" / "sales"→upbeat-rep; "warm" / "brand"→warm-brand; "narrator"→neutral-narrator | warm-brand |

**Pass 4 — Write the script.**
Based on duration_s, compute the word budget: `word_budget = duration_s * 2.5`.
Write a voiceover that fits. Structure:
- Hook (12-20% of duration)
- Proof or problem (30-40%)
- Solution (20-30%)
- CTA (10-15%)

Enforce: sentences ≤ 12 words. One idea per sentence. No jargon the ICP wouldn't
recognize. Always end with a concrete next action.

**Pass 5 — Emit the JSON brief.**
Conform to `video-brief.schema.json`. Validate before returning.

---

## The before/after the user sees

Always show this after compiling:

```
You said:
  "<raw user prompt verbatim>"

I'm building:
  • Archetype: <archetype>
  • Duration: <n>s
  • Aspect: <aspect>  (<destination, e.g. LinkedIn feed>)
  • Voiceover: <yes/no> · persona: <persona>
  • Hook: "<headline>"
  • CTA: "<cta>" → <cta_url>
  • Brand lock: {{COMPANY_NAME}} <accent> + <dark/light>, Gelion font, primary logo
  • Output: <preview | MP4 | both>

Say 'go' to build, or tell me what to change.
```

---

## Edge cases

- **Too vague** ("make a cool video"): ask one focused question — destination
  (LinkedIn/email/internal) — and infer the rest from the design system default.
- **Missing CTA**: pull from `~/{{COMPANY_NAME}}-video-studio/.design-system.json`.
  If no design system yet, ask during the brand-system template flow.
- **Over-long script**: hard trim to `word_budget` and tell the user which
  sentences got cut and why.
- **Off-brand color request** ("make it green"): refuse politely — "{{COMPANY_NAME}}
  palette is blue / purple / magenta / coral only. Want me to go with
  [nearest accent]?"
- **User provides JSON directly**: skip the compile, validate against schema,
  render.

---

## Tone

Confident and crisp. Never over-explain the compile — show it, ship it, iterate.
The user should feel like they dropped a one-liner and got a precise briefing
back in seconds.
