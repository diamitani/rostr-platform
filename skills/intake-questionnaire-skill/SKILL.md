---
name: intake-questionnaire-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Intake Questionnaire — the 12 facts every case study needs. Use when working with intake questionnaire."
---

# Intake Questionnaire — the 12 facts every case study needs

Run this against the uploaded artifacts in Stage 1. For each fact, try to **extract it from
the evidence first**. Only ask the user about facts you genuinely cannot infer. Batch all
questions into one short message — never interrogate one question at a time.

For each fact, internally tag the source as **[E]videnced** (stated in an artifact),
**[R]ecalled** (user told you directly), or **[I]nferred** (you reasoned it out). This tagging
feeds the RAG/DAL provenance step so you never overstate.

| # | Fact | What to look for | If missing |
|---|------|------------------|-----------|
| 1 | **Problem / trigger** | What pain or goal started this? A request, a broken process, a manual slog. | Ask: "What problem kicked this off?" |
| 2 | **Client / context** | Company, team, or internal stakeholder. Industry + rough size. | Ask: "Who was this for? Industry + size is enough." (needed for redaction) |
| 3 | **Actor / role** | Who did the work and in what capacity (you solo, a team, which hat). | Infer from threads; confirm if unclear. |
| 4 | **The solution** | What was actually built or done — in one sentence, then in detail. | Core — reconstruct from artifacts. |
| 5 | **Tech stack** | Languages, frameworks, no-code/low-code platforms, databases. | Scan configs, code, threads. |
| 6 | **APIs & integrations** | Which APIs/services were called; auth method (token/OAuth/key) — value NEVER captured. | Scan for endpoints, SDK names, key *names*. |
| 7 | **MCPs / agents / AI tools** | MCP servers, Claude skills, agents, models used (Opus/Sonnet, etc.). | Scan threads + tool names. |
| 8 | **Automation platforms** | n8n, Zapier, Make, Clay, HubSpot workflows, schedulers, webhooks. | Scan for workflow exports/screenshots. |
| 9 | **Data** | What data flowed through — sources, volume, shape, sensitivity. | Scan CSVs/schemas. Note PII presence. |
| 10 | **Timeline / effort** | How long, how many iterations, rough hours or sprints. | Infer from thread timestamps; confirm. |
| 11 | **Blockers & fixes** | What broke, what was tricky, how it got solved. → feeds Troubleshooting Report. | Scan for errors, retries, "didn't work", debugging. |
| 12 | **Outcome & impact** | Result. Metrics if any (time saved, $ , volume, accuracy, adoption). | Ask if no metric is evidenced — but never invent one. |

## Systems-thinking probes (surface these if the evidence supports them)

These are what separate a "I built a script" story from a "I architected a system" story.
Look for evidence that the project reasoned about:

- **Data flow** — how information moved end-to-end, transformations, sources of truth.
- **Failure modes** — retries, fallbacks, error handling, what happens when a step fails.
- **Scale** — designed for one run or for 50+ reps / thousands of records?
- **Handoffs** — human-in-the-loop gates, approvals, where control passes between systems.
- **Feedback loops** — logging, monitoring, learning from outputs, iteration based on results.
- **Tradeoffs** — choices made and why (cost vs speed, build vs buy, model selection).

If two or more of these are evidenced, the Case Study gets a dedicated **"Systems Thinking"**
section. If only one, fold it into the "How it worked" narrative.

## When to ask vs infer

**Ask** only when: a fact is critical to the narrative (problem, outcome, client/industry for
redaction) AND there is no reasonable basis to infer it. **Infer** (and tag [I]) for
everything reconstructable from the artifacts. The goal is a fast, low-friction intake — the
user dropped files because they want a document, not a survey.
