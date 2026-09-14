---
name: exec-overview-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with HubSpot Import Formatter — Executive Overview. Use when working with hubspot import formatter."
---

# HubSpot Import Formatter — Executive Overview

**For:** {{COMPANY_NAME}} Executive Leadership Team (ELT) & GTM Leadership
**Owner:** {{USER_NAME}}, GTM AI & Automation
**Category:** GTM data-quality automation (RevOps)

---

## In one line

An AI skill that converts any rep's messy contact or company spreadsheet into {{COMPANY_NAME}}'s
standardized HubSpot import files automatically — eliminating the manual formatting that
has been polluting our CRM with duplicate records.

## The problem it solves

HubSpot has accumulated a significant volume of **duplicate Contacts and Companies**.
Root cause: reps bulk-import lists in inconsistent, hand-made formats, so HubSpot can't
reliably tell a new record from an existing one. Duplicates degrade:

- **Forecasting & reporting accuracy** — inflated counts, split activity history.
- **Rep productivity** — time wasted cleaning, merging, and chasing the wrong record.
- **Sequencing & deliverability** — the same person contacted twice from two records.

Sales Coordination introduced two standard import templates as the fix. This tool makes
following that standard effortless — and therefore actually adopted.

## What it does

A rep hands Claude any spreadsheet (Apollo, Sales Navigator, ZoomInfo, a partner list, a
hand-built sheet) and gets back, in seconds:

1. A **clean, import-ready file** matching the official template exactly — plus an Excel
   tab documenting how each column maps to its HubSpot property.
2. A **review file** that flags any rows missing required data or carrying values HubSpot
   would reject — nothing is lost or silently dropped.
3. A ready-to-use **CSV**, so no manual re-saving.

It automatically separates people from their companies, removes duplicates *before* they
ever reach HubSpot, and standardizes the unique identifiers (email, company domain) that
HubSpot relies on to dedupe. It also:

- **Standardizes industry semantically** — messy values ("SaaS", "Fintech") are mapped to
  the correct HubSpot industry and **enriched with NAICS sector + code** ({{COMPANY_NAME}}'s NAICS map).
- **Normalizes dropdown fields** (lifecycle stage, lead status, country) to valid values.
- **Uploads directly to HubSpot on request** — upserting (no duplicates), enriching, and
  building the **list** the rep specifies (static snapshot or active/auto-updating, with
  name, description, and filters captured up front), returning a shareable link.

## Why it matters (business value)

| Lever | Impact |
|---|---|
| **Cleaner CRM** | Fewer duplicates at the source → more trustworthy pipeline and reporting. |
| **Rep time saved** | Minutes-to-seconds on every import; no formatting, mapping, or re-saving. |
| **Scale** | Built for 50+ non-technical reps and marketers — no training or command line needed. |
| **Governance** | One enforced standard instead of dozens of personal formats. |
| **Measurable** | Every import is logged, so adoption and impact are tracked, not assumed. |

## How we measure it (KPIs)

Tracked automatically via a built-in run ledger and KPI report:

- **Adoption** — number of standardized imports run; active operators per month.
- **Volume** — total contacts and companies prepared through the standard process.
- **Data quality** — % of rows that were complete vs. flagged for missing required data.
- **Revenue attribution** *(via HubSpot)* — each import carries a Batch ID used as the
  HubSpot import name, so we can report **how many deals trace back to imports run through
  this process** — connecting clean-data discipline to pipeline and closed-won.

## Status & roadmap

- **Live now:** formatting, auto-split, dedup, validation, semantic industry + NAICS
  enrichment, dropdown/country normalization, CSV output, run-level KPIs, and direct
  HubSpot upload with static/active list creation.
- **Next:** automated deal-attribution reporting pulled directly from HubSpot; optional
  pre-import duplicate check against existing CRM records; richer guided filter-building
  for active lists.

## Cost & risk

Runs entirely locally — no new vendor, no license, no API keys, and **no customer data
leaves the machine**. Built on tooling already in place.

---

*Bottom line: a low-cost, high-leverage automation that turns a known CRM data-quality
liability into a standardized, measurable process the whole GTM org can use.*
