---
name: list-questionnaire-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with List Creation — Question Flow. Use when working with list creation."
---

# List Creation — Question Flow

The exact questionnaire to run (via `AskUserQuestion`) **before** creating a HubSpot list,
and how each answer maps to a `hubspot_upload.py` flag. Run this only when the user wants
records pushed into HubSpot *and* added to a list. If they only want the file, skip it.

## When to ask

- Trigger: user says something like "upload these and add them to a list / send me the
  list link."
- Ask **after** formatting succeeds and **before** the upload call (the upload writes to
  production, so confirm intent first).
- If the user already specified everything in their message (e.g. "make a static list
  called 'Q2 EMEA' from these"), skip the questions you already have answers for — don't
  re-ask what's known.

## The questions

Ask these together in one `AskUserQuestion` call (Q4 only matters if Q3 = Active — you can
ask it in a follow-up once you know the answer to Q3, to avoid asking for filters on a
static list).

### Q1 — List name  *(header: "List name")*
- **Question:** "What should the list be called?"
- Free-text. The object type (" — Contacts" / " — Companies") is appended automatically,
  so a single name covers both when uploading both.
- → `--list-name "<answer>"`

### Q2 — Description  *(header: "Description")*
- **Question:** "What's this list for? (a short description for our records)"
- Free-text, optional.
- → `--list-description "<answer>"`
- ⚠️ HubSpot's v3 lists API has **no description field**, so this is recorded in the
  skill's output/KPI notes only — it is *not* stored on the list in HubSpot. If the
  description must live in HubSpot, fold it into the name. Tell the user this if they ask.

### Q3 — Static or active?  *(header: "List type")*
- **Question:** "Should this be a static or an active list?"
- Options:
  - **Static (snapshot) — Recommended** — "A fixed list of exactly the records you're
    uploading now. Doesn't change as your CRM grows." → `--list-type static` (HubSpot `MANUAL`)
  - **Active (auto-updating)** — "Membership is defined by a filter and updates
    automatically as records match or stop matching." → `--list-type active` (HubSpot `DYNAMIC`)
- Default recommendation is **Static**, because this skill's core job is importing a
  specific set of records — a snapshot of "what I just uploaded" is what most reps want.

### Q4 — Filters  *(header: "Filters")* — ONLY if Q3 = Active
- **Question:** "What should define membership? (e.g. industry is Software or Fintech;
  country is United States; or just the records in this import)"
- Translate the user's plain-English criteria into a HubSpot ILS `filterBranch`
  (see `hubspot_lists.md` for the format and operator rules) and pass it as
  `--filter-branch '<JSON>'`.
- If the user says "just these records" / has no criteria, **omit** `--filter-branch` —
  the script auto-builds an active filter on the uploaded emails/domains.

## Answer → command mapping (summary)

| Question | Answer | Flag |
|---|---|---|
| Q1 List name | text | `--list-name "text"` |
| Q2 Description | text | `--list-description "text"` (recorded only) |
| Q3 Type | Static | `--list-type static` |
| Q3 Type | Active | `--list-type active` |
| Q4 Filters (active only) | criteria → ILS JSON | `--filter-branch '<JSON>'` |
| Q4 Filters (active only) | "just these records" | *(omit — auto-built)* |
| (no list wanted) | — | `--no-list` |

## Worked examples

**Static, both objects:**
> Name: "Q2 EMEA Tech Prospects", Description: "From Apollo export, Q2 push", Type: Static
```bash
python3 scripts/hubspot_upload.py "<wb>.xlsx" --batch-id <ID> \
  --list-name "Q2 EMEA Tech Prospects" --list-description "From Apollo export, Q2 push" \
  --list-type static
```

**Active, filtered by industry (companies only):**
> Name: "Active — SaaS & Fintech Accounts", Type: Active, Filter: industry is Software or Fintech
```bash
python3 scripts/hubspot_upload.py "<wb>.xlsx" --batch-id <ID> --only companies \
  --list-name "Active — SaaS & Fintech Accounts" --list-type active \
  --filter-branch '{"filterBranchType":"OR","filterBranches":[{"filterBranchType":"AND","filterBranches":[],"filters":[{"filterType":"PROPERTY","property":"industry","operation":{"operationType":"ENUMERATION","operator":"IS_ANY_OF","values":["COMPUTER_SOFTWARE","FINANCIAL_SERVICES"],"includeObjectsWithNoValueSet":false}}]}],"filters":[]}'
```

**Active, "just these records":**
> Name: "This Week's Imports", Type: Active, Filter: just the records in this import
```bash
python3 scripts/hubspot_upload.py "<wb>.xlsx" --batch-id <ID> \
  --list-name "This Week's Imports" --list-type active   # filter auto-built on uploaded ids
```

## After creating

Relay back: the list **name**, **type** (static/active), **member count** (static) or
"auto-populates from filter" (active), the recorded **description**, and the **link**
(`https://app.hubspot.com/contacts/{portalId}/objectLists/{listId}`).
