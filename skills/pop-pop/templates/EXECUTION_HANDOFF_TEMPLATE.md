# Execution Handoff: [PROJECT_NAME]

**Project:** [Project Name]  
**Handoff Date:** [Date]  
**From:** [Previous Owner/Agent]  
**To:** [Receiving Agent/Human]

---

## 1. Execution Context

### What's Been Done
[Summary of completed work]

### What's Being Handed Off
[Specific tasks/phase being transferred]

### Expected Output
[What should be delivered when this handoff is complete]

### Current State
- **Phase:** [PreD / D1 / D2 / D3 / D4]
- **Progress:** [% complete]
- **Blockers:** [Any current blockers]
- **Next Milestone:** [Next major milestone]

---

## 2. The Execution Prompt

**Copy-paste this prompt to the receiving agent:**

```
You are taking over [PROJECT_NAME] at [PHASE] phase.

CONTEXT:
- Project Goal: [One sentence goal]
- Current State: [State summary]
- Your Objective: [What you need to accomplish]

TASK LIST:
[First N and A tasks from Build Guide, copy-pasted here]

RESOURCES:
- Build Guide: [Path]
- Project Master Doc: [Path]
- Architecture Diagram: [Path]
- Key Scripts: [Paths]

CONSTRAINTS:
- [Key constraint 1]
- [Key constraint 2]

SUCCESS CRITERIA:
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

ESCALATION:
If you encounter [ABORT CONDITION], stop immediately and notify [HUMAN NAME].

Begin with Task [X.Y] from the Build Guide.
```

---

## 3. Guardrails

### Hard Stops (Agent MUST NOT do these without explicit human approval)

❌ **Never Autonomous:**
- Delete files outside the project directory
- Expose secrets, API keys, or credentials
- Push to production without instruction
- Write to Asana (v1 rule: read-only except comments)
- Send external messages (email, Slack, SMS)
- Execute destructive database commands (DROP, TRUNCATE)
- Modify files in other projects
- Install system-level packages without approval

### Confirm First (Ask before doing)

⚠️ **Requires Confirmation:**
- Batch operations affecting >10 records
- Writes to production systems
- Anything outside the Build Guide task list
- Sub-skill creation or modification
- External API calls with cost implications (>$1)
- Changes to deployment configuration
- Modifications to CI/CD pipelines

### Autonomous (Agent can do freely)

✅ **Fully Autonomous:**
- Read files/APIs within project scope
- Write new files to project folder
- Run tests
- Fill templates
- Generate artifacts (docs, diagrams, reports)
- Create branches and commits (not push to main)
- Run scripts in `/scripts/` folder
- Query databases (SELECT only)
- Call read-only APIs

---

## 4. Abort Conditions

**Stop immediately and escalate to [HUMAN NAME] if:**

1. **Technical blockers:** Missing credentials, API down, critical dependency unavailable
2. **Scope creep:** Task requires work not in the Build Guide
3. **Data integrity risk:** Operation could corrupt production data
4. **Security concerns:** Potential security vulnerability discovered
5. **Cost explosion:** Task would exceed budget by >20%
6. **Ambiguity:** Unclear requirements or conflicting instructions
7. **External dependency:** Requires input from person not available
8. **Time overrun:** Task taking >2x estimated time with no clear path forward

**Escalation Method:** [How to contact human - email, Slack, etc.]

---

## 5. Handoff Chain

### Previous Handoffs

| Date | From | To | Phase | Reason |
|------|------|----|-|--------|
| [Date 1] | [Agent A] | [Agent B] | [Phase] | [Reason] |
| [Date 2] | [Agent B] | [Human] | [Phase] | [Reason] |

### Current Handoff

**From:** [Previous Owner]  
**To:** [Receiving Agent]  
**Phase:** [Current Phase]  
**Reason:** [Why handoff is happening]

### Next Handoff (if planned)

**To:** [Next Owner]  
**When:** [Condition or date]  
**Trigger:** [What causes next handoff]

---

## 6. Key Resources

### Files

| File | Location | Purpose |
|------|----------|---------|
| Build Guide | [Path] | Task-by-task execution plan |
| Project Master Doc | [Path] | Complete project documentation |
| KPI Tracking | [Path] | Metrics and reporting framework |
| Architecture Diagram | [Path] | System design visual |
| JTBD Document | [Path] | Jobs-to-be-done framework |

### Scripts

| Script | Location | Purpose | Usage |
|--------|----------|---------|-------|
| [Script 1] | [Path] | [Purpose] | `python [script.py] [args]` |

### APIs / MCPs

| API | Purpose | Auth Method | Docs |
|-----|---------|-------------|------|
| [API 1] | [Purpose] | [Method] | [URL] |

### Credentials

**⚠️ Never include actual credentials here**

| Resource | Location | Owner |
|----------|----------|-------|
| [API Key 1] | 1Password vault: [Name] | [Owner] |
| [Database] | AWS Secrets Manager: [ID] | [Owner] |

---

## 7. Communication Protocol

### Status Updates

**Frequency:** [Daily / Weekly / Per milestone]

**Format:**
```
Project: [Name]
Phase: [Phase]
Progress: [% or summary]
Completed since last update: [List]
Planned for next period: [List]
Blockers: [Any blockers]
```

**Delivery Method:** [Email / Slack / Asana comment]

### Questions / Blockers

**Contact:** [Name]  
**Method:** [Email / Slack / Phone]  
**Response SLA:** [Expected response time]

---

## 8. Success Handoff Criteria

**This handoff is complete when:**

- [ ] Receiving agent has acknowledged receipt
- [ ] All resources accessible and verified
- [ ] First task from Build Guide started
- [ ] Status update protocol confirmed
- [ ] Escalation contact tested
- [ ] Questions answered
- [ ] Guardrails understood and accepted

---

## 9. Post-Handoff Review

**Scheduled for:** [Date]

**Review Questions:**
- Did the handoff provide sufficient context?
- Were guardrails appropriate?
- Were abort conditions clear?
- What would improve future handoffs?

---

**Handoff Prepared By:** [Name]  
**Date:** [Date]  
**Version:** 1.0
