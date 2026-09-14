# Asana Export: [PROJECT_NAME]

**Project:** [Project Name]  
**Generated:** [Date]  
**Export Format:** Copy-Paste + CSV

---

## Export Formats

This document provides Asana task exports in two formats:

1. **Copy-Paste Format** — Manual entry into Asana
2. **CSV Format** — Bulk import via Asana CSV importer

---

## Format 1: Copy-Paste (Markdown)

### Section: [Phase Name - e.g., "PreD (Research)"]

#### Task: [Task Name] [NPAO Tag]

**Description:**  
[Task description]

**Assignee:** [Name]  
**Due Date:** [Date]  
**Priority:** [High/Medium/Low]

**Subtasks:**
- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

**Custom Fields:**
- NPAO: [N/A/P/O]
- Phase: [PreD/D1/D2/D3/D4]

---

#### Task: [Next Task Name] [NPAO Tag]

[Follow same structure...]

---

### Section: [Next Phase Name]

[Continue for all phases...]

---

## Format 2: CSV Import

### Instructions

1. Copy the CSV content below
2. Save as `[project-name]-tasks.csv`
3. In Asana: Project → ... → Import → CSV
4. Map columns:
   - Name → Task Name
   - Notes → Description
   - Assignee → Assignee
   - Due Date → Due Date
   - Section → Section
   - Priority → Priority
   - Parent → Parent Task (for subtasks)

### CSV Content

```csv
Section,Name,Description,Assignee,Due Date,Priority,NPAO,Phase,Parent
"PreD (Research)","[Task 1 Name]","[Description]","[Assignee]","[YYYY-MM-DD]","High","N","PreD",""
"PreD (Research)","[Subtask 1.1]","[Description]","[Assignee]","[YYYY-MM-DD]","Medium","N","PreD","[Task 1 Name]"
"PreD (Research)","[Subtask 1.2]","[Description]","[Assignee]","[YYYY-MM-DD]","Medium","N","PreD","[Task 1 Name]"
"PreD (Research)","[Task 2 Name]","[Description]","[Assignee]","[YYYY-MM-DD]","High","A","PreD",""
"D1 (Design)","[Task 3 Name]","[Description]","[Assignee]","[YYYY-MM-DD]","High","N","D1",""
"D1 (Design)","[Subtask 3.1]","[Description]","[Assignee]","[YYYY-MM-DD]","Medium","N","D1","[Task 3 Name]"
"D2 (Development)","[Task 4 Name]","[Description]","[Assignee]","[YYYY-MM-DD]","High","N","D2",""
"D3 (Deployment)","[Task 5 Name]","[Description]","[Assignee]","[YYYY-MM-DD]","High","P","D3",""
"D4 (Debug)","[Task 6 Name]","[Description]","[Assignee]","[YYYY-MM-DD]","Medium","O","D4",""
```

---

## Format 3: Asana Task Creation via MCP (Optional)

**⚠️ v1 Rule:** Read-only Asana access by default. Only enable MCP writes on explicit user request.

If using `asana_create_task` MCP:

```python
# Example task creation
task_data = {
    "name": "[Task Name]",
    "notes": "[Description]",
    "assignee": "[Assignee Email]",
    "due_on": "YYYY-MM-DD",
    "projects": ["[Project GID]"],
    "custom_fields": {
        "[NPAO Field GID]": "[N/A/P/O]",
        "[Phase Field GID]": "[PreD/D1/D2/D3/D4]"
    }
}
```

**Steps:**
1. Get project GID: `asana_get_projects()`
2. Get custom field GIDs: `asana_get_custom_fields(project_gid)`
3. Create section: `asana_create_section(project_gid, "PreD (Research)")`
4. Create tasks: Loop through task list and call `asana_create_task()`
5. Create subtasks: `asana_create_subtask(parent_task_gid, subtask_data)`

---

## Task List Summary

### Phase Breakdown

| Phase | Task Count | Subtask Count | Total |
|-------|------------|---------------|-------|
| PreD | [N] | [N] | [N] |
| D1 (Design) | [N] | [N] | [N] |
| D2 (Development) | [N] | [N] | [N] |
| D3 (Deployment) | [N] | [N] | [N] |
| D4 (Debug) | [N] | [N] | [N] |
| **Total** | **[N]** | **[N]** | **[N]** |

### NPAO Distribution

| NPAO | Task Count | % of Total |
|------|------------|------------|
| Navigate (N) | [N] | [%] |
| Allocate (A) | [N] | [%] |
| Prioritize (P) | [N] | [%] |
| Orchestrate (O) | [N] | [%] |

---

## Custom Fields Setup

To use NPAO and Phase tags in Asana, create these custom fields in your project:

### Custom Field: NPAO
- **Type:** Single-select dropdown
- **Options:**
  - N (Navigate)
  - A (Allocate)
  - P (Prioritize)
  - O (Orchestrate)

### Custom Field: Phase
- **Type:** Single-select dropdown
- **Options:**
  - PreD (Pre-Development)
  - D1 (Design)
  - D2 (Development)
  - D3 (Deployment)
  - D4 (Debug)

---

**Version:** 1.0  
**Generated:** [Date]  
**Format:** Markdown + CSV  
**Compatibility:** Asana CSV Import + Manual Entry
