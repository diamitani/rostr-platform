---
name: budget-router
description: "THE tier router: maps every recommendation to five budget tiers ($0 / <$500 / $500-2k / $2k-10k / $10k+), defines what each tier unlocks, the canonical free-stack, the cost-tag format every tactic must use, and defer/buy/replace decision rules."
---

# Budget Router

The Monetization Wizard's personalization engine, used by Pennywise —
and consulted by every agent before recommending anything that costs
money. One job: **no tactic ships without a tier it belongs to.**

## Hard rules

1. **Draft and guide only.** Never send, post, publish, pay, buy, or
   sign the user up for anything.
2. **Never recommend a tactic the user's budget can't afford.** Every
   tactic carries a cost tag and a free alternative. At $0, the word
   "paid" does not appear in the plan.
3. **Ask for the budget early.** Until the user answers, plan for the
   $0 tier — a plan that works for free works everywhere.
4. **Annual billing is earned, not default.** Monthly first; annual only
   after the tool proves its worth.
5. **One subscription per job.** Two tools doing the same thing = the
   cheaper one wins until revenue says otherwise.

---

## 1. The five tiers

### Tier 0 — $0 (free-stack only)
**Unlocks:** everything that costs $0 — organic content, DMs, manual
outreach, free-tier tools, presales, payment links with per-sale fees.
**Locked:** all ad spend, all paid tools, all contractors.
**Posture:** founder does everything manually. Speed comes from effort,
not spend. The plan must produce first dollars before any tier upgrade.
**Typical stack cost:** $0/mo.

### Tier 1 — under $500/mo
**Unlocks:** one paid test at a time (a $15–50/mo tool, or a $100–200
micro ad/outreach test), a custom domain, basic email tooling.
**Locked:** multi-channel paid, contractors/retainers, annual plans.
**Posture:** prove one channel, then fund the next from revenue.
**Typical stack cost:** $50–300/mo.

### Tier 2 — $500–2k/mo
**Unlocks:** always-on paid test ($20–50/day), 2–3 core tools, a VA or
freelancer for defined tasks, cold-email infrastructure.
**Locked:** full-time hires, agency retainers, big annual commits.
**Posture:** test + scale the winner; kill losers monthly.
**Typical stack cost:** $800–1,800/mo.

### Tier 3 — $2k–10k/mo
**Unlocks:** multi-channel paid, part-time SDR or contractor bench,
proper CRM + sequencing, creative testing budget.
**Locked:** full-time team, brand campaigns, anything without a CAC
target and kill rule.
**Posture:** portfolio of bets, each with a kill rule and a date.
**Typical stack cost:** $3k–9k/mo.

### Tier 4 — $10k+/mo
**Unlocks:** full-funnel paid, hires, agencies, intent data, brand
spend — all still gated by Ledger's math (LTV:CAC ≥ 3:1, payback ≤ 12
mo).
**Locked:** nothing categorically — but every line item still needs a
cost tag and a kill rule.
**Posture:** scale what works; the risk is bloat, not starvation.

---

## 2. Canonical free-stack ($0 tier)

The default toolkit. If a paid tool is recommended, its free-stack
replacement must be named alongside it.

| Job | Free-stack pick | Paid upgrade (Pennywise tags) |
|---|---|---|
| Landing page | Carrd free / ConvertKit landing / Gumroad page | Webflow, Framer ($20+/mo) |
| Email list + sends | ConvertKit free (1k subs) / Mailchimp free | ConvertKit paid ($29+/mo) |
| Payments | Gumroad / Lemon Squeezy (per-sale fee) | Stripe + Tax at volume |
| Scheduling | Cal.com free / Calendly free | — |
| Design | Canva free | Canva Pro ($15/mo) |
| Video | phone + CapCut free / Loom free | Descript ($24/mo) |
| Social scheduling | native schedulers / Buffer free (3 channels) | Buffer/Typefully ($15+/mo) |
| Analytics | Google Analytics / Plausible free trial | Plausible ($9/mo) |
| CRM | Notion / Sheets / HubSpot free | Pipedrive ($24/mo) |
| Outreach | manual DMs + email | Instantly/MillionVerify ($37+/mo) |
| Community | Discord / Slack free / WhatsApp | Circle ($89/mo) |
| Course hosting | Gumroad / YouTube unlisted + email | Teachable ($59/mo) |
| Automation | Zapier free (100 tasks) / manual | Zapier/Make ($20+/mo) |
| Forms/surveys | Google Forms / Tally free | Typeform ($25/mo) |

**Free-stack rule:** a paid tool is approved only when (a) the free
alternative is provably blocking revenue, and (b) the tool pays for
itself in one month at current volume. Both conditions, in writing.

---

## 3. Cost-tag format (mandatory)

Every tactic in every deliverable carries one:

```
[COST: FREE]                        — no money, only time
[COST: $X/mo]                       — recurring subscription
[COST: $Y one-time]                 — single purchase
[COST: Z% per sale]                 — transaction fee (no upfront)
[COST: $X/mo after 30-day trial]    — trial converting to paid
```

**Examples in context:**
- "Run the 10-conversation WTP test [COST: FREE]"
- "Cold-email infra: domain + warmup + verifier [COST: ~$80/mo]"
- "Sell via Gumroad [COST: 10% per sale]"
- "Boost top post [COST: $10/day test, kill rule at 2× target CAC]"

A tactic without a cost tag is an unfinished tactic. Pennywise rejects
it.

---

## 4. Defer / buy / replace decision rules

Every recommended spend gets a verdict:

- **BUY** — fits the tier, passes the free-stack rule, has a kill rule
  and a review date. Approved.
- **DEFER** — right tactic, wrong time. Name the trigger: "buy when
  monthly revenue passes $X" or "revisit after [test] proves [metric]."
  Deferred items live in Pennywise's memory with their triggers.
- **REPLACE-WITH-FREE** — the free-stack covers it. Name the
  replacement. The paid version becomes a DEFER with a trigger.

**Decision tree:**
```
Does the tier allow any spend?
├─ No ($0) → REPLACE-WITH-FREE, always.
└─ Yes ↓
    Does the free-stack alternative block revenue today?
    ├─ No → REPLACE-WITH-FREE (revisit when it does).
    └─ Yes ↓
        Does it pay for itself in one month at current volume?
        ├─ No → DEFER with a named trigger.
        └─ Yes → BUY (monthly billing, kill rule, review date).
```

---

## 5. Spend summary template

Pennywise closes every plan with this:

```markdown
## Spend Summary — [Date]
Budget tier: [$0 / <$500 / $500–2k / $2k–10k / $10k+]

| Tactic | Verdict | Cost | Trigger / review date |
|---|---|---|---|
| [tactic] | BUY | [cost tag] | review [date] |
| [tactic] | DEFER | [cost tag] | buy when [trigger] |
| [tactic] | FREE-ALT | [cost tag] | [free-stack pick] |

**Implied monthly burn:** $____
**Burn vs. tier cap:** [within / over — if over, cut list]
**Deferred total (if bought today):** $____
```

**Burn rule:** implied monthly burn must sit under the tier cap with
20% headroom. Over = cut the lowest-leverage BUY first.

---

## 6. Tier-upgrade playbook

Move up a tier only on evidence, never on optimism:

| From → To | Upgrade trigger |
|---|---|
| $0 → <$500 | first $500 in revenue banked; one channel proven manually |
| <$500 → $500–2k | a paid test returns ≥ 3:1 within the kill window, twice |
| $500–2k → $2k–10k | LTV:CAC ≥ 3:1 at $1k/mo spend for 60 days |
| $2k–10k → $10k+ | payback ≤ 6 months at current scale; ops can absorb volume |

**Downgrade rule:** if runway < 6 months (Ledger's number), drop one
tier immediately and re-run the spend summary. Survival beats
optimization.
