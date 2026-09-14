---
name: pal-depth-guide-skill
description: "LLM-agnostic AI agent development skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with PAL Depth Guide — name-then-translate. Use when working with pal depth guide."
---

# PAL Depth Guide — name-then-translate

The reader is a high-level decision-maker assessing technical AI talent. They are smart,
busy, and **not necessarily technical**. The failure modes to avoid are equal and opposite:

- **Too shallow** → "I used some AI tools to automate a process." (Sounds like anyone. No credibility.)
- **Too deep** → "Implemented an idempotent webhook consumer with exponential backoff against the HubSpot v3 batch API." (Loses the reader. They can't tell if it's impressive.)

The fix is the **name-then-translate** pattern: state the real thing precisely, then gloss it
in one plain sentence. This is the default depth for this skill — "glass-box."

## The name-then-translate pattern

> **Name it** (accurate, specific, credible to a technical interviewer)
> **→ Translate it** (one sentence a non-technical exec understands)

Worked examples:

| Don't write | Write this |
|---|---|
| "Used n8n" | "**n8n** — an automation platform that wires apps together so steps run on their own — orchestrated the whole pipeline." |
| "Called the API" | "Pulled live deal data through **HubSpot's API** (the connection that lets software read a CRM directly instead of exporting spreadsheets)." |
| "Set up MCP servers" | "Connected Claude to live company systems via **MCP servers** — the standard plumbing that lets an AI assistant safely act inside tools like HubSpot and Asana." |
| "Used Clay for enrichment" | "Used **Clay** — a data-enrichment tool that finds and verifies contact and company info — to turn a bare list of company names into a complete prospect list." |
| "Prompt engineering with Opus" | "Wrote precise instructions (**prompt engineering**) for **Claude Opus**, Anthropic's most capable model, so the AI produced consistent, on-brand output every time." |
| "Webhook-triggered" | "The process started automatically the moment new data arrived (a **webhook** — a digital tripwire between systems), with no one clicking a button." |

## Depth dials (set per run in Stage 2)

| Dial | Default | When to change |
|---|---|---|
| **Jargon density** | Glass-box (name + translate) | Pure-exec audience → translate more, name less. Technical panel → name more, translate lighter. |
| **Architecture detail** | One diagram + prose | Multi-system project → keep the diagram. Single script → drop the diagram, use a numbered flow. |
| **Metrics prominence** | Lead with them if they exist | No hard metrics → lead with the qualitative outcome and scope instead. Never fabricate a number. |
| **Systems-thinking section** | Include if ≥2 probes hit | See intake-questionnaire.md probes. |

## Translate these common technical concepts on first use

Keep a one-line gloss ready for anything a non-technical reader won't know. A few staples:

- **API** — a direct software-to-software connection (no manual exports).
- **MCP (Model Context Protocol)** — the standard that lets an AI assistant safely use real tools and data.
- **Webhook** — an automatic trigger that fires when something happens in another system.
- **Pipeline / workflow** — a chain of steps that runs start-to-finish on its own.
- **Enrichment** — automatically filling in missing data (emails, company size, etc.).
- **Idempotent / dedupe** — built so re-running it can't create duplicates or double-charge.
- **Environment variable / secret store** — where credentials are kept so they're never hard-coded or exposed.
- **Token / OAuth** — secure ways software proves it's allowed to access an account.

The rule: **never make the reader feel dumb, never make yourself sound shallow.** Name it,
then make it click.
