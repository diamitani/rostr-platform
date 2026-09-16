---
name: credit-report-examiner
description: "Examine a consumer credit report line by line: categorize negatives, flag dispute-eligible items under FCRA, surface positive levers, and rank items by removal ROI. Educational analysis, not legal advice."
---

# Credit Report Examiner

Examine a credit report and produce a structured, educational analysis. This is analysis and education — not legal advice — and dispute theories should be reviewed with a licensed consumer-law attorney.

## Step 1 — Inventory everything

From the report text or parsed data, list every tradeline and public record with: creditor name, account type, open date, balance/limit, payment status, date of first delinquency (DOFD), date reported, and which bureau(s) show it.

Categorize into:
- **Negatives:** collections, charge-offs, late payments, repossessions, foreclosures, bankruptcies, judgments, tax liens
- **Positives:** open accounts in good standing, closed accounts with perfect history
- **Inquiries:** hard vs. soft, with dates and creditors
- **Personal info:** name variants, address variants, employer entries, SSN variants

## Step 2 — Flag dispute opportunities

Check every item against these rules (cite the statute when flagging):

- **Age:** past the 7-year reporting window from DOFD (10 years for Chapter 7 bankruptcy) → flag for removal under §1681c
- **Accuracy:** wrong balance, wrong dates, wrong status code, wrong creditor name, not-your-account → dispute under §1681e(b) (maximum possible accuracy)
- **Duplicates:** the same debt appearing as both original-creditor charge-off and collection, or the same collection twice → dispute the duplicate
- **Re-aging:** DOFD moved forward after sale to a collector → flag; the 7-year clock runs from the ORIGINAL delinquency
- **Medical debt:** medical collections under $500 are removable under current CFPB guidance; paid medical collections should not remain
- **Inquiries:** hard inquiries the consumer did not authorize → dispute under §1681b (permissible purpose)
- **Mixed files:** another person's tradeline on the report → dispute with identity documentation
- **Personal info variants:** wrong addresses or name spellings linked to disputed accounts → dispute to weaken furnisher matching

## Step 3 — Surface positive levers

- **Utilization:** per-card and overall revolving utilization; the 10% target and the 30% danger line
- **Age:** average age of accounts, oldest account — warn before closing old cards
- **Payment history:** streak of on-time payments; any single late dragging an otherwise clean file
- **Credit mix:** revolving vs. installment coverage

## Step 4 — Rank by ROI

Assign each negative item a priority tier:
- **Tier 1 — Immediate:** highest removal probability AND highest score impact
- **Tier 2 — Short-term (30–90 days)**
- **Tier 3 — Medium-term (90–180 days)**
- **Tier 4 — Ongoing (180+ days)**

For each item: dispute eligibility (yes/no + reason), estimated score impact if removed, recommended first action.

## Output format

```markdown
### Executive Summary
2–3 sentences on overall report health and primary issues.

### Score Killers (Ranked)
Per item: account name, type, balance, dispute eligibility + reason, estimated impact, priority tier.

### Positive Leverage
Utilization metrics, account age metrics, payment history status, quick wins.

### 30/60/90 Day Action Plan
Sequenced monthly milestones.

### Red Flags
Things that don't make sense — ask the consumer to clarify.
```

## Guardrails

- **Not legal advice.** Close with a reminder to review dispute theories with a consumer-law attorney.
- **Never fabricate citations, holdings, or report data.** Work only from the report in front of you.
- **Never advise** disputing items the consumer knows are accurately reported.
- Estimates are ranges, not guarantees — scoring formulas are proprietary.
- Do not shame the consumer for past financial decisions.
