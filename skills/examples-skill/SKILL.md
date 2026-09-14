---
name: examples-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Worked Example — full vs redacted (abbreviated). Use when working with worked example."
---

# Worked Example — full vs redacted (abbreviated)

A reference for the voice, depth, and the full→redacted transform. This is intentionally
short; real outputs follow the full templates.

---

## Source artifacts (what the user dropped)
- An n8n workflow export (JSON) showing HubSpot → Clay → HubSpot.
- A Claude chat thread where the prompts for list-building were iterated.
- A screenshot of a `.env` file (contained a Clay API key and a HubSpot token — **scrubbed**).
- A Slack message: "this saved the SDRs like a full day a week each."

---

## Case Study — FULL version (excerpt)

**From a Day a Week to Minutes: An Automated Prospect-List Pipeline for Acme's SDR Team**

**At a glance**
- *Challenge:* Acme's 12 SDRs each spent ~a day a week hand-building prospect lists.
- *What I built:* A hands-off pipeline that turns a list of target companies into enriched,
  CRM-ready contact lists automatically.
- *Result:* ~1 day/week saved per rep; lists now build in minutes, unattended.
- *Stack:* Claude Opus · n8n · HubSpot API · Clay

**What I built (how it worked)**
The pipeline runs on **n8n** — an automation platform that chains apps together so steps fire
on their own. When a rep drops a company list, **n8n** sends it to **Clay** (a data-enrichment
tool that finds and verifies business contacts), then writes the finished records straight
into **HubSpot** through **HubSpot's API** (the direct software connection that lets the
workflow update the CRM without anyone exporting a spreadsheet). Authentication used a
HubSpot private-app token and a Clay API key, both kept in a secret store — never in the
workflow itself…

---

## Case Study — REDACTED version (same excerpt)

**From a Day a Week to Minutes: An Automated Prospect-List Pipeline**

**At a glance**
- *Challenge:* A go-to-market team of ~12 reps each spent about a day a week hand-building prospect lists.
- *What I built:* A hands-off pipeline that turns a list of target companies into enriched,
  CRM-ready contact lists automatically.
- *Result:* ~1 day/week saved per rep; lists now build in minutes, unattended.
- *Stack:* Claude Opus · n8n · CRM API · data-enrichment tool

> Opening line: *"A go-to-market team at a mid-sized company needed to turn a manual,
> day-a-week prospecting chore into an automated pipeline. Here's what I built."*

Note what changed: "Acme" → "a mid-sized company"; "HubSpot" kept as a category ("CRM") in
the redacted at-a-glance to reduce fingerprinting (naming it in full prose is a judgment call —
keep generic tool categories when the client+tool combo could identify them). Everything that
makes the work *impressive* — the architecture, the automation, the result — is preserved.

---

## Troubleshooting Report — FULL version (excerpt)

**Issue 2: Duplicate contacts created on re-runs**
- *Symptom:* Re-running a list created duplicate HubSpot contacts.
- *Severity:* Major — polluted the CRM.
- *Root cause:* The write step had no idempotency check (nothing stopped it re-creating a
  record that already existed — "idempotent" means a re-run produces the same result, no doubles).
- *Fix:* Added a search-before-write step keyed on email; existing contacts update instead of duplicate.
- *Prevention:* Always put a dedupe/idempotency gate before any CRM write.

**Overall work entailed**
This was a multi-system integration: orchestration logic in n8n, prompt design for the
enrichment step, API auth across two services, and several rounds of debugging around data
quality and idempotency. Roughly two weeks of iterative build-and-test, with the hardest
judgment calls around making it safe to re-run and reliable at the scale of a full SDR team.

---

## Troubleshooting Report — REDACTED version (same excerpt)
Identical, except: "HubSpot" → "the CRM", "Acme" never appears, and the credential-rotation
recommendation (if any) is dropped from the redacted twin. The competence on display is
unchanged.
