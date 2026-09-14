---
name: table-schema-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Clay Table Schema Reference. Use when working with clay table schema reference."
---

# Clay Table Schema Reference

Update this file as you discover the actual column names in each {{COMPANY_NAME}} Clay table.
The `daily_report.py` script uses flexible field matching, but you can hardcode
the correct field names here for faster, more accurate pulls.

---

## How to discover your column names

Run this to see raw cell keys from any table:

```bash
python daily_report.py --debug-tables   # lists all workbooks + IDs
```

Then in Python:
```python
rows = get_all_rows(api_key, "YOUR_WORKBOOK_ID")
if rows:
    print(rows[0]["cells"].keys())  # shows all column names for first row
```

---

## Known Table Schemas (fill in as confirmed)

### Enrolled / Master Table
| Clay Column Name | Report Field | Notes |
|---|---|---|
| TBD | company_name | |
| TBD | domain | |
| TBD | created_at | |

### Director+ Contacts Table
| Clay Column Name | Report Field | Notes |
|---|---|---|
| TBD | full_name | |
| TBD | title | |
| TBD | email | |
| TBD | linkedin_url | |
| TBD | company_name | |

### ICP — No HR Contacts Table
| Clay Column Name | Report Field | Notes |
|---|---|---|
| TBD | company_name | |
| TBD | domain | |
| TBD | reason/notes | |

### Bad ICP Table
| Clay Column Name | Report Field | Notes |
|---|---|---|
| TBD | company_name | |
| TBD | domain | |
| TBD | disqualification_reason | |

### Contacts / People Table
| Clay Column Name | Report Field | Notes |
|---|---|---|
| TBD | full_name | |
| TBD | title | |
| TBD | company_name | |
| TBD | email | |
| TBD | linkedin_url | |

### Emails Sent Table
| Clay Column Name | Report Field | Notes |
|---|---|---|
| TBD | recipient email | |
| TBD | company | |
| TBD | sequence/campaign name | |
| TBD | sent_by / rep | |
| TBD | sent_at timestamp | |

---

## Notes

- If emails are tracked in Amplemarket (not Clay), the emails section will call the Amplemarket API instead
- Update `TABLE_PATTERNS` in `daily_report.py` if your table names don't match the defaults
- The `--debug-tables` flag prints all workbooks so you can map them manually
