# Build Guide: [PROJECT_NAME]

**Project:** [Project Name]  
**Generated:** [Date]  
**Owner:** [Name]

---

## Introduction

This Build Guide is the complete executable breakdown for [PROJECT_NAME]. It follows the ROSTR 5D phase taxonomy (PreD → D1 → D2 → D3 → D4) with NPAO ordering (Navigate → Allocate → Prioritize → Orchestrate) within each phase.

**Rules:**
- Tasks are ordered N→A→P→O within each phase
- Every subtask has a "Done when" condition
- Tasks requiring APIs/MCP include exact usage instructions
- Tasks requiring scripts include the script path and run command
- Testing tasks are embedded within each phase (not saved for D3)
- Check off boxes as you complete each item

---

## Phase 0: PreD (Pre-Development)

**Purpose:** Determine IF to build before deciding HOW

**Critical Question:** "Is this worth building?"

**Completion Criteria:**
- [ ] Problem stated in one sentence
- [ ] Target user identified
- [ ] ≥3 alternatives considered and rejected
- [ ] Success criteria defined (measurable)
- [ ] Known unknowns documented
- [ ] Decision: build now / later / don't build

### Task 0.1: [Task Name] [N]

**Objective:** [What this task accomplishes]

**Subtasks:**
- [ ] **Subtask 0.1.1:** [Description]
  - **Done when:** [Specific completion criteria]
  - **Tools:** [Tools/APIs needed]
  - **Micro-steps:**
    1. [Detailed step 1]
    2. [Detailed step 2]

- [ ] **Subtask 0.1.2:** [Description]
  - **Done when:** [Specific completion criteria]
  - **API/MCP Usage:** `[command]` → [Expected output]

### Task 0.2: [Task Name] [A]

[Follow same structure...]

---

## Phase 1: Design (D1)

**Purpose:** Define WHAT to build and HOW it should behave

**Critical Question:** "What exactly are we building?"

**Completion Criteria:**
- [ ] Architecture diagram exists
- [ ] User flows documented
- [ ] Data models defined
- [ ] Interfaces specified
- [ ] Tech choices made with rationale
- [ ] Edge cases identified

### Task 1.1: [Task Name] [N]

**Objective:** [What this task accomplishes]

**Subtasks:**
- [ ] **Subtask 1.1.1:** [Description]
  - **Done when:** [Specific completion criteria]
  - **Micro-steps:**
    1. [Step]
    2. [Step]

### Task 1.2: [Task Name] [A]

[Follow same structure...]

---

## Phase 2: Development (D2)

**Purpose:** Build it

**Critical Question:** "Does it work?"

**Completion Criteria:**
- [ ] All features implemented
- [ ] Test coverage ≥ threshold
- [ ] Code review passed
- [ ] No blocking bugs
- [ ] Documentation updated

### Task 2.1: [Task Name] [N]

**Objective:** [What this task accomplishes]

**Subtasks:**
- [ ] **Subtask 2.1.1:** [Description]
  - **Done when:** [Specific completion criteria]
  - **Script:** `[path/to/script.py]`
  - **Run command:** `python [script.py] [args]`
  - **Expected output:** [Description]
  - **Micro-steps:**
    1. [Step]

- [ ] **Subtask 2.1.2:** [Testing]
  - **Done when:** All tests pass
  - **Test command:** `pytest tests/test_[feature].py`
  - **Pass criteria:** [Criteria]

### Task 2.2: [Task Name] [A]

[Follow same structure...]

---

## Phase 3: Deployment (D3)

**Purpose:** Ship it safely

**Critical Question:** "Is it safe to ship?"

**Completion Criteria:**
- [ ] Staging QA passed
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Monitoring active
- [ ] Rollback procedure tested
- [ ] Production deploy verified

### Task 3.1: [Task Name] [N]

**Objective:** [What this task accomplishes]

**Subtasks:**
- [ ] **Subtask 3.1.1:** [Description]
  - **Done when:** [Specific completion criteria]
  - **Deployment command:** `[command]`
  - **Verification:** `curl [endpoint]` → [Expected response]
  - **Micro-steps:**
    1. [Step]

### Task 3.2: [Task Name] [P]

[Follow same structure...]

---

## Phase 4: Debugging (D4)

**Purpose:** Fix what's broken + iterate

**Critical Question:** "What broke, why, how do we prevent it?"

**Completion Criteria:**
- [ ] Bug reproduced reliably
- [ ] Root cause identified (not just symptom)
- [ ] Fix implemented and tested
- [ ] Regression test added
- [ ] Post-mortem written (if P0/P1)

### Task 4.1: [Task Name] [N]

**Objective:** [What this task accomplishes]

**Subtasks:**
- [ ] **Subtask 4.1.1:** [Description]
  - **Done when:** [Specific completion criteria]
  - **Investigation steps:**
    1. [Step]
    2. [Step]

- [ ] **Subtask 4.1.2:** [Fix implementation]
  - **Done when:** Bug no longer reproducible
  - **Test command:** `[command]`
  - **Regression test:** `[path/to/test]`

---

## API/MCP Usage Reference

### [API/Tool Name]

**Purpose:** [What this API does]

**Authentication:** [Method]

**Example Usage:**
```bash
[command] [args]
```

**Expected Output:**
```json
{
  "field": "value"
}
```

**Common Errors:**
- **Error 1:** [Description] → [Solution]
- **Error 2:** [Description] → [Solution]

---

## Scripts Reference

### [script_name.py]

**Location:** `/path/to/script.py`

**Purpose:** [What this script does]

**Usage:**
```bash
python script.py [args]
```

**Required Environment Variables:**
- `VAR_1`: [Description]
- `VAR_2`: [Description]

**Output:** [Description]

---

## Progress Tracking

### Overall Completion

| Phase | Tasks Total | Tasks Complete | % Complete |
|-------|-------------|----------------|------------|
| PreD | [N] | [N] | [%] |
| D1 (Design) | [N] | [N] | [%] |
| D2 (Dev) | [N] | [N] | [%] |
| D3 (Deploy) | [N] | [N] | [%] |
| D4 (Debug) | [N] | [N] | [%] |

### Current Phase: [Phase Name]

**Current Task:** [Task X.Y]  
**Status:** [In Progress / Blocked / Complete]  
**Next Task:** [Task X.Z]

---

## Notes & Learnings

[Document discoveries, gotchas, and learnings as you work through the guide]

---

**Version:** 1.0  
**Last Updated:** [Date]
