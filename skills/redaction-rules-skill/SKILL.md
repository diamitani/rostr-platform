---
name: redaction-rules-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Redaction Rules — full vs redacted, and secret scrubbing. Use when working with redaction rules."
---

# Redaction Rules — full vs redacted, and secret scrubbing

Two jobs live here: (A) producing the **redacted twin** of every document, and (B) the
**secret-scrubbing** that applies to *both* versions. Read this before Stage 6.

---

## A. The redacted twin

Goal: a version that is **genuinely un-attributable** — a stranger reading it could not figure
out who the client was — while staying **just as impressive**. The work shines; the identity
disappears.

### Swap named entities for category descriptors
| Full version | Redacted version |
|---|---|
| "Acme Fintech, a Series B lender in Austin" | "a Series B fintech lender in the US" |
| "their CMO, Dana Liu" | "their marketing leader" |
| "the Nexus onboarding portal" | "their customer onboarding platform" |
| "{{COMPANY_NAME}}'s SDR team" | "a 12-person SDR team" (or "the go-to-market team") |
| Specific product names you built *for* a client | the function it served ("a lead-routing tool") |

### Keep the shape, lose the tells
- **Keep:** industry, rough company size/stage, the problem class, the full technical
  approach, the architecture, the results (as ranges if exact numbers are identifying).
- **Remove:** company names, people names, product/brand names, logos, domains, URLs,
  account IDs, region if uniquely identifying, and any unique anecdote that fingerprints them.
- **Generalize numbers if they identify:** "$2.3M ARR" → "mid-seven-figure ARR"; an exact
  headcount tied to a known org → a range.

### Branding differences
- **Full** branded docx: {{COMPANY_NAME}} logo + Patrick's attribution are fine (it's his record).
- **Redacted** branded docx: **remove the client logo entirely**; {{COMPANY_NAME}} branding optional —
  if the piece is for Patrick's personal portfolio, use neutral professional styling instead
  of {{COMPANY_NAME}} branding so it reads as *his* work, not an {{COMPANY_NAME}} client deliverable. Ask if unsure.

### The opening line convention
Redacted case studies open with the pattern the user asked for:
> *"A [size/stage] company in [industry] needed [problem]. Here's what I built…"*
e.g., *"A mid-sized company in the logistics industry needed to turn a manual, error-prone
prospecting process into an automated pipeline. Here's what I built."*

---

## B. Secret scrubbing — applies to BOTH versions, always

Never reproduce a secret value in any output. Replace the **value** with a **description of
the capability**. This is Rule 2 from SKILL.md and it is absolute.

### Patterns to detect and scrub
Scan all artifacts (especially pasted configs, `.env` dumps, chat threads, screenshots) for:

- **API keys** — long random strings, often prefixed: `sk-…`, `pk_…`, `key-…`, `AKIA…` (AWS),
  `xoxb-…` (Slack), `ghp_…` (GitHub), `pat-…`, `AIza…` (Google), Bearer tokens.
- **OAuth tokens / access tokens / refresh tokens.**
- **Webhook URLs** with embedded tokens (e.g., `hooks.slack.com/services/…`, n8n/Zapier hook URLs).
- **Connection strings** — `postgres://user:pass@host`, Mongo URIs, anything with `user:password@`.
- **Passwords, client secrets, private keys** (`-----BEGIN PRIVATE KEY-----`), JWTs.
- **Account identifiers** that are sensitive — portal IDs, tenant IDs, internal account numbers.

### How to describe instead
| Found (never print) | Write this |
|---|---|
| `sk-proj-abc123…` in a config | "an OpenAI API key, stored as an environment variable" |
| `xoxb-…` Slack token | "a Slack bot token with `chat:write` scope" |
| HubSpot private-app token | "a HubSpot private-app token, scoped to read deals and write contacts" |
| n8n webhook URL with token | "a secured n8n webhook (the trigger URL is kept private)" |
| `postgres://admin:hunter2@…` | "a PostgreSQL connection managed via a secret store" |

Always name **(tool + auth method + purpose)** and stop there. The capability is the
impressive part; the value is just a liability.

### If a secret was clearly exposed in the source material
Add a quiet, non-judgmental note in the **full** Troubleshooting Report (not the redacted one)
under prevention: *"Recommendation: rotate any credentials that appeared in shared logs/threads
and move them to a managed secret store."* This is helpful, shows security awareness, and is
itself a portfolio-positive signal.
