> Source: diamitani PAE repos (merged into Rostr 2026-09-14). Sample/template content is illustrative — replace placeholders with your own verified data before production use.

# ICP Job Title Taxonomy & Reveal Filter Matrix

This reference documents job title clustering, seniority levels, and contact reveal filtering rules to maximize reveal match rates on Apollo, Clay, and ZoomInfo.

---

## 🎯 Primary B2B Job Title Clusters

### 1. Sales & Revenue Leadership
- `VP of Sales`, `Vice President of Sales`
- `Head of Revenue Operations`, `VP of RevOps`, `Director of RevOps`
- `Chief Commercial Officer (CCO)`, `Chief Revenue Officer (CRO)`
- `Director of Demand Generation`, `Head of Demand Gen`
- `SDR Manager`, `Director of Inside Sales`

### 2. Marketing & Growth Leadership
- `Chief Marketing Officer (CMO)`
- `VP of Growth`, `Head of Growth`
- `Director of Performance Marketing`
- `Head of Acquisition`, `Paid Media Director`
- `Creative Director`

### 3. Education & School Performing Arts
- `Drama Teacher`, `Theatre Director`
- `Fine Arts Department Chair`, `Performing Arts Head`
- `Auditorium Coordinator`, `Technical Theatre Director`
- `Musical Director`, `Artistic Director`

### 4. Healthcare & Medical Practices
- `Practice Manager`, `Medical Director`
- `Clinic Administrator`, `Managing Partner`
- `Operations Director`, `Chief Medical Officer`

---

## 🔍 Data Platform Filter Configuration Rules

When generating the contact reveal payload in Node 04:
1. **Title Array**: Pass exact strings rather than broad wildcards to prevent pulling irrelevant roles (e.g. `["VP of Sales", "Head of RevOps"]` vs `"Sales"`).
2. **Seniority Hierarchy**: Always restrict to decision-making tiers (`["senior", "director", "head", "manager", "c-level"]`).
3. **Verification**: Always set `reveal_personal_emails: true`, `reveal_phone_number: true`, and require email verification score > 85% to protect sequencer inbox reputation.
