---
name: hubspot-upload-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with HubSpot Upload — Reference. Use when working with hubspot upload."
---

# HubSpot Upload — Reference

How `scripts/hubspot_upload.py` pushes formatted records into HubSpot and builds lists.

## What it does

1. Authenticates with a private-app token, reads the portal ID.
2. Reads the exact-template rows from the formatter's `*_HubSpot_Import.xlsx` (or a
   template CSV).
3. Fetches the portal's real property definitions — sends only properties that exist,
   validates enumeration values, coerces numerics.
4. Writes records (dedupe strategy below), creates a **static (MANUAL) list** per object
   type named after the Batch ID, adds the records, returns the list link(s).

## Dedupe strategy (why two paths)

- **Contacts → upsert by `email`.** Email is a HubSpot-unique property, so the
  `batch/upsert` API with `idProperty=email` works directly. Existing contacts are
  updated, new ones created — no duplicates.
- **Companies → search-then-update/create by `domain`.** Most portals do **not** flag
  company `domain` as a *unique* property, so `batch/upsert` by domain returns
  `Unable to perform update/upsert by non-unique property domain`. Instead the script
  bulk-searches existing companies by domain (`IN` filter, 100 at a time), updates the
  matches, and creates the rest. This mirrors how HubSpot's own importer dedupes
  companies.

The script picks the path automatically from each property's `hasUniqueValue` flag, so it
adapts if a portal later marks domain unique.

## Property map (template column → HubSpot internal name)

**Contacts**

| Template column | HubSpot property |
|---|---|
| Email | `email` |
| First Name | `firstname` |
| Last Name | `lastname` |
| Phone Number | `phone` |
| Mobile Phone Number | `mobilephone` |
| Job Title | `jobtitle` |
| Company Name | `company` |
| Lead Status | `hs_lead_status` *(enum)* |
| Lifecycle Stage | `lifecyclestage` *(enum)* |
| Country/Region | `country` |
| State/Region | `state` |
| City | `city` |
| LinkedIn URL | `hs_linkedin_url` |
| Contact Owner | *(omitted — it's a name, not an owner ID)* |

**Companies**

| Template column | HubSpot property |
|---|---|
| Company Name | `name` |
| Company Domain Name | `domain` |
| Industry | `industry` *(enum)* |
| Number of Employees | `numberofemployees` *(numeric)* |
| City | `city` |
| State/Region | `state` |
| Country/Region | `country` |
| LinkedIn Company Page | `linkedin_company_page` |
| Company Owner | *(omitted — name, not owner ID)* |

Enum fields (`hs_lead_status`, `lifecyclestage`, `industry`, `country`) are validated /
normalized against the portal's allowed options; values that don't match are dropped from
that record rather than failing the batch. `numberofemployees` is reduced to digits.
`country` normalizes common abbreviations (`US`→`United States`, `UK`→`United Kingdom`).

### NAICS enrichment (companies)

When a company's industry resolves, the uploader also writes NAICS data to these existing
portal properties (verified present in portal {{HUBSPOT_PORTAL_ID}}):

| Value | HubSpot property |
|---|---|
| NAICS 2-digit code (e.g. `51`) | `industry___naics_code__2_digit_` |
| NAICS sector label (e.g. `Information`) | `industry___naics_label___2_digit_` |

These are skipped automatically if the properties don't exist in the portal. The
read-only `naics_part*` / `naics_code_final` calculation fields are never written.

> **Industry note:** HubSpot's `industry` is a fixed dropdown (e.g. `COMPUTER_SOFTWARE`).
> Free-text industries from a source file usually won't match and will be dropped. If you
> need industry populated, map source values to HubSpot's option codes first.

## Resilience

- Batches of 100. If a batch errors, it retries each record individually so one bad row
  can't block the rest. Per-record failures are reported (id + status + message).
- List name clash → retries once with a time suffix.
- Membership add tries `PUT` then `POST` for tenant differences.

## Credentials & scopes

Token resolved from `HUBSPOT_PAT` (env) or `~/.{{COMPANY_NAME}}/hubspot.env`. Never hard-coded;
that file lives outside the skill folder and is git-ignored so a packaged skill ships no
secret. SSL uses `certifi`'s trust store.

Required private-app scopes:
`crm.objects.contacts.read/write`, `crm.objects.companies.read/write`,
`crm.lists.read/write`, plus `oauth`/account-info for the portal ID.

Uploads run **as the token owner** — imported records show that user as creator. For a
team rollout, give each rep their own private-app token rather than sharing one.

## List URLs

`https://app.hubspot.com/contacts/{portalId}/objectLists/{listId}`

## Flags

- `--batch-id ID` — names the list(s) and aligns with the KPI ledger.
- `--only contacts|companies` — limit scope.
- `--list-name NAME` — base list name (object type appended).
- `--list-description TEXT` — recorded in output (HubSpot v3 lists have no description field).
- `--list-type static|active` — MANUAL snapshot vs DYNAMIC filter-based (default static).
- `--filter-branch JSON` — ILS filter for active lists (see `hubspot_lists.md`); if omitted
  an active list is auto-built to capture the uploaded records.
- `--no-list` — upload only, don't create a list.
- `--dry-run` — validate + map, upload nothing.
