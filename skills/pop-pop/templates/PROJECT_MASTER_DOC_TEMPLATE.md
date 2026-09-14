# Project Master Doc: [PROJECT_NAME]

**Generated:** [DATE]  
**Status:** [Draft/Active/Complete]  
**Owner:** [NAME]

---

## 1. Overview

**Project Name:** [Name]

**Description:**  
[Plain-language description of what this project does and why it exists]

**Business Use Case:**  
[The business problem this solves and the value it delivers]

---

## 2. Project Goals (KPIs & Reporting)

### North-Star Outcome
[What success looks like in one sentence]

### KPI Tree

| KPI | Baseline | Target | Source | Cadence |
|-----|----------|--------|--------|---------|
| [Primary KPI] | [Current] | [Goal] | [System/Report] | [Daily/Weekly/Monthly] |
| [Supporting KPI 1] | [Current] | [Goal] | [System/Report] | [Daily/Weekly/Monthly] |
| [Supporting KPI 2] | [Current] | [Goal] | [System/Report] | [Daily/Weekly/Monthly] |

### Execution Metrics
- **Number of runs:** [Target]
- **Number of users:** [Target]
- **Number of requests processed:** [Target]
- **Number of reports generated:** [Target]

### Milestones

| Milestone | Target Date | Owner | Status |
|-----------|-------------|-------|--------|
| [Milestone 1] | [Date] | [Name] | [Not Started/In Progress/Complete] |
| [Milestone 2] | [Date] | [Name] | [Not Started/In Progress/Complete] |

---

## 3. KPI Reporting Framework

### Reporting Platforms
[Clay / HubSpot / Excel / HTML artifact / Custom dashboard / etc.]

### Source → Display Mapping

| Data Source | Display Location | KPI Type | Value Category |
|-------------|------------------|----------|----------------|
| [API/DB/Sheet] | [Dashboard/Report] | [Leading/Lagging] | [Money/Time/Quality] |

### Metrics Cadence
- **Daily:** [Metrics tracked daily]
- **Weekly:** [Metrics reviewed weekly]
- **Monthly:** [Metrics reported monthly]

### Dashboard Architecture
[Describe the reporting infrastructure: Excel workbook? HubSpot report? HTML page? Embedded widget?]

### Milestones & Wins Timeline

| Date | Milestone | Success Criteria | Status |
|------|-----------|------------------|--------|
| [Date] | [Milestone] | [Criteria] | [Status] |

### Profit & Loss Ownership
**Accountable Party:** [Name/Team]  
**Credit Attribution:** [Who takes credit for wins]  
**Responsibility:** [Who owns failures/pivots]

---

## 4. Features

| # | Feature | Description | NPAO Tag | 4Ds Phase | Status |
|---|---------|-------------|----------|-----------|--------|
| 1 | [Feature name] | [Brief description] | [N/A/P/O] | [PreD/D1/D2/D3/D4] | [Not Started/In Progress/Complete] |

---

## 5. End Users

| User Type | Count | Technical Level | Access Method |
|-----------|-------|-----------------|---------------|
| [Type 1] | [Number] | [Non-technical/Technical/Expert] | [Web/API/Email/etc.] |

---

## 6. Tech Stack

### Production Stack
- **Language:** [Python/Node/etc.]
- **Framework:** [FastAPI/Express/Next.js/etc.]
- **Database:** [PostgreSQL/DynamoDB/Airtable/etc.]
- **Hosting:** [AWS Lambda/Vercel/Railway/etc.]
- **APIs:** [List external APIs]

### Development/Staging Stack
- **Dev Environment:** [Local/Cloud/Docker]
- **Staging:** [Platform]
- **Testing:** [Framework]

### Key Sheet (Secrets & Credentials)
**⚠️ Never store actual secrets here — pointer map only**

| Resource | Location | Owner | Last Rotated |
|----------|----------|-------|--------------|
| [API Key 1] | [1Password vault: X] | [Name] | [Date] |
| [Database credentials] | [AWS Secrets Manager: Y] | [Name] | [Date] |

### Data Resources

| Resource | Type | URL/Location | Purpose |
|----------|------|--------------|---------|
| [API docs] | [Documentation] | [URL] | [Purpose] |
| [Data source] | [Database/Sheet/API] | [Location] | [Purpose] |

---

## 7. Build Plan

**Phase Summary:**

| Phase | Duration | Status | Completion % |
|-------|----------|--------|--------------|
| PreD (Research) | [Days] | [Status] | [%] |
| D1 (Design) | [Days] | [Status] | [%] |
| D2 (Development) | [Days] | [Status] | [%] |
| D3 (Deployment) | [Days] | [Status] | [%] |
| D4 (Debug/Iterate) | [Days] | [Status] | [%] |

**Detailed task breakdown lives in:** `BUILD_GUIDE.md`

---

## 8. Deployment Plan

### Method
[Describe deployment method: GitHub Actions → AWS Lambda / Vercel deploy / Manual upload / etc.]

### Environment
- **Production:** [URL/Environment]
- **Staging:** [URL/Environment]
- **Development:** [Local/Cloud]

### Rollback Procedure
[Step-by-step rollback if deployment fails]

### Access Control
[Who has production access, how is it managed]

---

## 9. Testing Plan

### Test Types

| Type | Framework | Pass Criteria | Owner |
|------|-----------|---------------|-------|
| Unit tests | [pytest/jest/etc.] | [>80% coverage] | [Name] |
| Integration tests | [Tool] | [All endpoints 200] | [Name] |
| Manual QA | [Checklist] | [All flows work] | [Name] |

### Definition of Done
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] QA signoff
- [ ] Production deploy

---

## 10. Tools & Scripts

### Tools

| Tool | Version | Purpose |
|------|---------|---------|
| [Tool 1] | [v1.2.3] | [Purpose] |

### Scripts

| Script | Location | Trigger | Purpose |
|--------|----------|---------|---------|
| [script.py] | [/scripts/] | [Manual/Cron/Webhook] | [Purpose] |

---

## 11. Documentation Needed

| Document | Audience | Owner | Status | Location |
|----------|----------|-------|--------|----------|
| User guide | [End users] | [Name] | [Not Started/Draft/Complete] | [Path/URL] |
| API docs | [Developers] | [Name] | [Status] | [Path/URL] |
| Runbook | [Ops team] | [Name] | [Status] | [Path/URL] |

---

## 12. Next Steps

### First Necessity (N)
[The first Navigate task from NPAO ordering]

### Ordered Next Actions
1. [Action 1]
2. [Action 2]
3. [Action 3]

---

## 13. Collaborators

| Role | Name | Responsibility |
|------|------|----------------|
| **Owner** | [Name] | [Overall accountability] |
| **Manager** | [Name] | [Day-to-day oversight] |
| **Builder(s)** | [Names] | [Implementation] |
| **Team** | [Team name] | [Support/integration] |
| **ELT/Function** | [Executive/Dept] | [Sponsor/stakeholder] |

---

## 14. PRD (Product Requirements Document)

### Problem Statement
[What problem are we solving? For whom? Why now?]

### Solution
[How does this project solve the problem?]

### In Scope
- [Feature 1]
- [Feature 2]

### Out of Scope
- [Non-feature 1]
- [Non-feature 2]

### Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

### Non-Functional Requirements
- **Performance:** [Response time, throughput]
- **Security:** [Authentication, authorization, data protection]
- **Scalability:** [User load, data volume]
- **Reliability:** [Uptime, error rates]

### Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | [High/Med/Low] | [High/Med/Low] | [Plan] |

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Next Review:** [Date]
