---
name: report-template-skill
description: "LLM-agnostic data engineering and analytics skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Daily Session Recap — Report Template. Use when working with daily session recap."
---

# Daily Session Recap — Report Template

Use this exact structure when generating the daily recap. Adapt section content to what was actually found — omit sections with no content rather than leaving them empty.

---

## Template

```
# Daily Session Recap — [Day, Month DD, YYYY]
*[N] session(s) · [X] hours of work*

---

## TL;DR
[2-3 sentence plain English summary of the day. What was the overall theme? What's the most important thing that got done?]

---

## What We Built / Created
✅ [Completed item — specific name/description]
✅ [Completed item]
🔄 [In progress / partially done item]

## Key Decisions Made
- [Decision 1 — be specific about what was decided and why if known]
- [Decision 2]

## Outputs Produced
- **[Output name]** — [what it is, where it was saved if mentioned]
- **[Output name]** — [description]

## Tools & Integrations Used
- [Tool/MCP/integration name] — [what it was used for]

## Asana Activity
✅ [Task name] — completed ([project name])
🆕 [Task name] — created ([project name])
💬 [Task name] — [summary of comment or update] ([commenter name])
⚠️ [Task name] — [blocker or at-risk flag if mentioned in comments]

## Open Items & Next Steps
📌 [Deferred item or explicit next step]
📌 [Follow-up mentioned in session]
📌 [Something started but not finished]

---
*Recap generated [HH:MM] · [N] sessions read · [N Asana tasks reviewed] · [N sessions skipped if any]*
```

---

## Example (filled in)

```
# Daily Session Recap — Friday, June 5, 2026
*3 sessions · ~4 hours of work*

---

## TL;DR
Heavy build day focused on skill development. Shipped the Daily Session Recap skill and refined the {{COMPANY_NAME}} Proposal Builder. One open item: deploying the new skills to the team's plugin bundle.

---

## What We Built / Created
✅ Daily Session Recap skill (daily-session-recap) — full SKILL.md + references
✅ {{COMPANY_NAME}} Proposal Builder v2 — updated slide mapping logic
🔄 GTM Insider Report template — drafted, needs final brand review

## Key Decisions Made
- Daily Session Recap will use session_info MCP (not context-engine) for live data
- Proposal Builder v2 will clone template slides rather than generate from scratch
- Decided to scope GTM Insider to HTML output only (not PPTX) for this version

## Outputs Produced
- **daily-session-recap.skill** — packaged and saved to {{COMPANY_NAME}} Skill Builder folder
- **{{COMPANY_NAME}}-proposal-builder-v2/** — skill directory with updated SKILL.md
- **GTM Insider draft** — saved to Downloads/Claude Best Practices/

## Tools & Integrations Used
- {{COMPANY_NAME}}-agent-factory — primary builder for skill creation
- session_info MCP — session transcript access
- mcp__workspace__bash — file packaging and zipping

## Asana Activity
✅ "Build daily-session-recap skill" — completed (GTM AI & Automation)
🆕 "Review {{COMPANY_NAME}}-proposal-builder-v2 brand pass" — created (GTM AI & Automation)
💬 "Deploy skills to team plugin bundle" — Patrick commented: "blocking on IT approval, following up Monday" ({{USER_NAME}})

## Open Items & Next Steps
📌 Deploy daily-session-recap + proposal-builder-v2 to team plugin bundle
📌 Complete brand review on GTM Insider template
📌 Test daily-session-recap with a live multi-session day

---
*Recap generated 17:32 · 3 sessions read · 5 Asana tasks reviewed · 0 sessions skipped*
```

---

## Formatting Rules

- **Bold** output names for scannability
- Use ✅ for completed, 🔄 for in-progress, 📌 for open/deferred
- Keep each bullet to one line if possible — max two lines
- If a section has no content (e.g., no decisions were made), omit the section entirely
- The TL;DR should be written for someone who won't read the rest — make it count
- Times should use 24h format or local time if known
- Session count in the footer is the actual count read, not filtered
- Asana task count in the footer is the number of tasks reviewed (not total in workspace)
- Asana section status markers: ✅ completed, 🆕 new task, 💬 has comments, ⚠️ blocker/at-risk
- Omit the Asana section entirely if no tasks were modified or created today
