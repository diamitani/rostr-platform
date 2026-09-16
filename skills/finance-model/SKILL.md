---
name: finance-model
description: "Unit-economics worksheet (CAC, LTV, LTV:CAC, payback), P&L template, runway calculator, budget-tier math formulas, and break-even analysis. Use when checking whether a monetization plan actually pays for itself."
---

# Finance Model

The Monetization Wizard's math room, used by Ledger (and Pennywise for
budget-tier math). One job: prove the plan pays for itself on paper
before anyone spends a dollar. **Order: unit economics → P&L → runway →
break-even.**

## Hard rules

1. **Draft and guide only.** Never send, post, publish, pay, buy, or
   sign the user up for anything. Deliverables are worksheets and
   projections; the user approves and acts.
2. **Budget reality.** Every tactic carries a cost tag and a free
   alternative.
3. **Label every assumption.** A projection is not a promise. Show
   ranges where ranges are honest.
4. **No fake precision.** Round to what the data supports.

---

## 1. Unit-economics worksheet

Fill per revenue model. All figures monthly unless noted.

```markdown
## Unit Economics — [Product] — [Date]

### Revenue per customer
- ARPU (avg revenue per user/mo): $____
- Gross margin %: ____%  (= (revenue − COGS) / revenue)
- Contribution per customer/mo: $____ (= ARPU × gross margin)

### Acquisition
- CAC (fully loaded: ad spend + tools + time valued at $/hr): $____
- Payback period: ____ months (= CAC / contribution per customer)
- LTV (lifetime value): $____
  - Subscription: ARPU × gross margin × avg lifetime months
  - One-time: price × gross margin × expected repeat purchases
- LTV:CAC ratio: ____ : 1

### Health check
- [ ] LTV:CAC ≥ 3:1 (below 3 = fix acquisition or price before scaling)
- [ ] Payback ≤ 12 months (≤ 3 months if budget tier < $500)
- [ ] Gross margin ≥ 70% for digital, ≥ 40% for services
```

**Formulas:**
- `LTV = ARPU × gross margin × (1 / monthly churn rate)` (subscription)
- `CAC payback = CAC / (ARPU × gross margin)`
- `Break-even customers = fixed monthly costs / contribution per customer`

**Worked example:**
ARPU $49, gross margin 80% → contribution $39.20. CAC $120 →
payback 3.1 months. Churn 5%/mo → lifetime 20 months → LTV $784.
LTV:CAC = 6.5:1. Healthy — scale acquisition.

**If the math fails, change in this order:** price (fastest) → CAC
(channel mix) → churn (retention) → COGS (delivery cost) → the model
itself (slowest, most honest).

---

## 2. P&L template (12-month projection)

```markdown
## P&L Projection — [Product] — [Date]
Assumptions: [list every one — growth %, churn, price, CAC]

| Month | 1 | 2 | 3 | ... | 12 |
|---|---|---|---|---|---|
| Customers (start) | | | | | |
| New customers | | | | | |
| Churned | | | | | |
| Customers (end) | | | | | |
| Revenue | $ | $ | $ | | $ |
| COGS (delivery) | $ | $ | $ | | $ |
| Gross profit | $ | $ | $ | | $ |
| CAC spend | $ | $ | $ | | $ |
| Tools / fixed | $ | $ | $ | | $ |
| Net | $ | $ | $ | | $ |
| Cumulative net | $ | $ | $ | | $ |
```

**Sensitivity table** — rerun the P&L with each key assumption ±30% and
record which one kills the plan:

| Assumption stressed | Net at month 12 | Verdict |
|---|---|---|
| Churn +30% | | |
| CAC +30% | | |
| Conversion −30% | | |

The assumption with the worst "verdict" is the plan's load-bearing wall.
Watch it weekly.

---

## 3. Runway calculator

```markdown
## Runway — [Date]
- Cash on hand: $____
- Monthly burn (all-in: tools + spend + founder draw): $____
- Monthly net new revenue (conservative): $____
- Net burn: $____ (= burn − net new revenue)
- Runway: ____ months (= cash / net burn)
- Date runway hits zero: ____
```

**Rules:**
- Runway < 6 months → survival mode: cut to $0-tier tactics, sell DFY
  or presales, no experiments.
- Runway 6–12 months → one big bet allowed; everything else must pay
  back in < 3 months.
- Runway > 12 months → portfolio of bets, but each still gets a
  kill rule and a date.
- Founder time is burn. Value it at a real hourly number or the runway
  is fiction.

---

## 4. Budget-tier math formulas

Pennywise's tiers with what the math allows at each:

| Tier | Monthly spend cap | CAC payback allowed | Growth posture |
|---|---|---|---|
| $0 | $0 | must be ~0 (organic only) | manual, founder-led |
| <$500 | ≤ $500 | ≤ 3 months | one paid test at a time |
| $500–2k | ≤ $2k | ≤ 6 months | test + scale winner |
| $2k–10k | ≤ $10k | ≤ 9 months | multi-channel |
| $10k+ | set by P&L | ≤ 12 months | portfolio |

**Formulas:**
- `Max affordable CAC = (monthly acquisition budget / expected new customers)` — then check payback.
- `Test budget per channel = 3 × target CAC` (enough to learn, little
  enough to kill).
- `Scale rule: increase spend 30–50% per week only while CAC stays
  within 20% of target.`
- `Kill rule: pause any channel at 2× target CAC with no conversion
  trend improving.`

---

## 5. Break-even analysis

```markdown
## Break-even — [Date]
- Fixed monthly costs: $____ (tools, rent, salaries, founder draw)
- Contribution per customer/mo: $____
- Break-even customers: ____ (= fixed / contribution)
- Current customers: ____
- Gap: ____ customers
- At current growth rate: break-even in ____ months
```

**Break-even levers, ranked by speed:**
1. Raise price 10–20% (immediate, if churn allows).
2. Cut the most expensive tool that the free-stack replaces.
3. Add a bridge revenue stream (DFY, affiliate, presale).
4. Improve conversion (funnel work — Closer's territory).
5. Grow volume (slowest — do the above first).

---

## 6. Model-specific math notes

- **Freemium:** model free-user cost explicitly. `Free users × cost per
  free user / mo` is a line item. Conversion below 2% usually kills it.
- **Usage billing:** revenue is spiky — project on p50 usage, stress on
  p10. Watch COGS pass-through (AI tokens, infra).
- **Marketplace:** two CACs (supply + demand). Take-rate × GMV must
  exceed both. Liquidity (matches per user) is the leading metric.
- **Ads/sponsorships:** `revenue = audience × sell-through % × CPM /
  1000`. Sell-through under 50% is normal early.
- **Courses/cohorts:** launch math: `revenue = list size × conversion %
  × price`. 1–3% conversion on a warm list is typical.
- **Enterprise:** `pipeline × win rate × ACV`, with 3–9 month lag. Never
  count a deal before signature.

---

## 7. Monthly finance review checklist

- [ ] Unit economics recomputed with real numbers (not launch guesses).
- [ ] LTV:CAC and payback vs. targets — trend, not snapshot.
- [ ] Runway updated; zero-date still acceptable.
- [ ] Load-bearing assumption checked against reality.
- [ ] Spend summary from Pennywise reconciled to the P&L.
- [ ] Kill/continue decisions made on every active test.
- [ ] Next month's one metric that matters, named.
