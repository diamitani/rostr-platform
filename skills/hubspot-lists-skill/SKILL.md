---
name: hubspot-lists-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with HubSpot Lists — Static vs Active + Filter Format. Use when working with hubspot lists."
---

# HubSpot Lists — Static vs Active + Filter Format

The uploader can create a list after pushing records. Conduct the questionnaire (name,
description, static/active, filters) with the user first, then pass the answers as flags.

## Static (MANUAL) vs Active (DYNAMIC)

| | Static (`--list-type static`) | Active (`--list-type active`) |
|---|---|---|
| HubSpot processingType | `MANUAL` | `DYNAMIC` |
| Membership | exactly the records just uploaded (added explicitly) | whatever matches the filter, now and going forward |
| Use when | "a snapshot of this import" | "everyone who is X, kept up to date" |
| Filter | none | required (`filterBranch`); auto-built on uploaded ids if omitted |

Re-uploading the same file updates the same records (idempotent), so a static list
re-run just re-adds the same members.

## Description

HubSpot's v3 lists API has **no description field** — the list object doesn't store one.
`--list-description` is captured in the script's output (and useful for our own records),
but it is not written to HubSpot. Put context in the **name** if it must live in HubSpot.

## The `filterBranch` format (active lists)

HubSpot uses the ILS filter shape. Top level is an OR of AND-branches:

```json
{
  "filterBranchType": "OR",
  "filterBranches": [
    {
      "filterBranchType": "AND",
      "filterBranches": [],
      "filters": [
        {
          "filterType": "PROPERTY",
          "property": "industry",
          "operation": {
            "operationType": "ENUMERATION",
            "operator": "IS_ANY_OF",
            "values": ["COMPUTER_SOFTWARE", "FINANCIAL_SERVICES"],
            "includeObjectsWithNoValueSet": false
          }
        }
      ]
    }
  ],
  "filters": []
}
```

### operationType → valid operators (the ones we use)

- **MULTISTRING** (string props like `email`, `domain`, `name`): `IS_EQUAL_TO`,
  `IS_NOT_EQUAL_TO`, `CONTAINS`, `CONTAINS_EXACTLY`, `DOES_NOT_CONTAIN`, `STARTS_WITH`,
  `ENDS_WITH`. **No `IS_ANY_OF`** — to match a set, use an OR of `IS_EQUAL_TO` branches.
- **ENUMERATION** (dropdowns like `industry`, `lifecyclestage`, `hs_lead_status`,
  `country`): `IS_ANY_OF`, `IS_NONE_OF`. Pass canonical option values.
- **NUMBER** (`numberofemployees`): `IS_EQUAL_TO`, `IS_GREATER_THAN`, `IS_LESS_THAN`, …
- **BOOLEAN**: `IS_EQUAL_TO`.

`AND` within one branch = all conditions; multiple `filterBranches` at the OR level = any.

### Examples

**Tech companies in the import** (enumeration, multiple values):
```json
{"filterBranchType":"OR","filterBranches":[{"filterBranchType":"AND","filterBranches":[],
"filters":[{"filterType":"PROPERTY","property":"industry","operation":{"operationType":"ENUMERATION",
"operator":"IS_ANY_OF","values":["COMPUTER_SOFTWARE","INFORMATION_TECHNOLOGY_AND_SERVICES"],
"includeObjectsWithNoValueSet":false}}]}],"filters":[]}
```

**Exactly the uploaded companies** (auto-built when no filter is given) — OR of
`IS_EQUAL_TO` on `domain`:
```json
{"filterBranchType":"OR","filterBranches":[
 {"filterBranchType":"AND","filterBranches":[],"filters":[{"filterType":"PROPERTY","property":"domain",
   "operation":{"operationType":"MULTISTRING","operator":"IS_EQUAL_TO","values":["acme.com"],"includeObjectsWithNoValueSet":false}}]},
 {"filterBranchType":"AND","filterBranches":[],"filters":[{"filterType":"PROPERTY","property":"domain",
   "operation":{"operationType":"MULTISTRING","operator":"IS_EQUAL_TO","values":["globex.io"],"includeObjectsWithNoValueSet":false}}]}
],"filters":[]}
```

The script provides `simple_filter_branch(prop, operator, values, op_type)` and
`id_filter_branch(kind, ids)` helpers for building these programmatically.

## List URL

`https://app.hubspot.com/contacts/{portalId}/objectLists/{listId}`
