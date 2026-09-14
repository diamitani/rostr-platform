---
name: templates-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with {{COMPANY_NAME}} HubSpot Import Templates — Reference. Use when working with {{company_name}} hubspot import templates."
---

# {{COMPANY_NAME}} HubSpot Import Templates — Reference

Source of truth for the two official templates. The script `scripts/format_import.py`
encodes all of this; edit both together if HubSpot's templates change.

## Header styling

| Type | Hex fill | Meaning |
|------|----------|---------|
| Required | `EE4266` (red) | Cannot be blank |
| Optional | `222B40` (dark navy) | Fill if available |

Font: bold, white, left-aligned. Row 1 frozen.

## Contacts template

Sheet name: `Contacts`. **Unique identifier: `Email`.**

| # | Column | Required |
|---|--------|----------|
| 1 | Email | ✅ |
| 2 | First Name | ✅ |
| 3 | Last Name | ✅ |
| 4 | Phone Number | |
| 5 | Mobile Phone Number | |
| 6 | Job Title | |
| 7 | Company Name | |
| 8 | Lead Status | |
| 9 | Lifecycle Stage | |
| 10 | Contact Owner | |
| 11 | Country/Region | |
| 12 | State/Region | |
| 13 | City | |
| 14 | LinkedIn URL | |

## Companies template

Sheet name: `Companies`. **Unique identifier: `Company Domain Name`.**

| # | Column | Required |
|---|--------|----------|
| 1 | Company Name | ✅ |
| 2 | Company Domain Name | ✅ |
| 3 | Industry | |
| 4 | Number of Employees | |
| 5 | City | |
| 6 | State/Region | |
| 7 | Country/Region | |
| 8 | LinkedIn Company Page | |
| 9 | Company Owner | |

## Column matching

Matching is done on a normalized header (lowercased, all non-alphanumerics removed):
1. **Exact normalized match** against an alias list (e.g. `e-mail`, `Email Address`,
   `work_email` all normalize toward `email`).
2. **Substring fallback** — alias contained in the header or vice versa, longest aliases
   first, each source column used at most once.

Key alias groups (see script for the full lists):
- **Email** ← email, e-mail, work email, contact email, mail
- **Company Domain Name** ← domain, website, url, web address, homepage, company domain
- **Number of Employees** ← employees, headcount, company size, # employees
- **Contact/Company Owner** ← owner, rep, AE, SDR, BDR, assigned to, account owner

## Normalization rules

- **Domain cleanup**: `https://www.Acme.com/about?x=1` → `acme.com`.
- **Domain from email**: when a company has no website column, derive the domain from a
  work email; free-mail providers (gmail.com, yahoo.com, etc.) are ignored.
- **Email**: trimmed + lowercased.
- **Dedup**: by the unique identifier, keeping the first occurrence; rows with a blank
  unique id are kept (and flagged as incomplete).

## Outputs

- `<stem>_HubSpot_Import.xlsx` — `Contacts`/`Companies` (exact) + `*_Extended` tabs.
- `<stem>_Contacts_HubSpot.csv`, `<stem>_Companies_HubSpot.csv` — exact template, CSV.
