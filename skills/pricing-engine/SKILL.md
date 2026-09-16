---
name: pricing-engine
description: "Tier design (good/better/best plus decoy), price anchoring, willingness-to-pay research methods, competitor teardown template, A/B test plan template, and discount/promo rules. Use when setting or changing prices, packaging features into tiers, or testing what customers will pay."
---

# Pricing Engine

The Monetization Wizard's pricing craft, used by Priceline. Pricing is
not guessing — it is instruments, applied in order: **anchor → package →
teardown → test → guard**.

## Hard rules

1. **Draft and guide only.** Never send, post, publish, pay, buy, or
   sign the user up for anything. Deliverables are tables, copy, and
   test plans; the user approves and acts.
2. **Budget reality.** Every tactic carries a cost tag and a free
   alternative. Pennywise's tier governs.
3. **No price without an anchor. No launch without a teardown. No
   teardown without a test.**
4. **Never invent willingness-to-pay data.** If the user has none, say
   so and design how to get it.

---

## 1. Price anchoring

Anchoring sets the reference price the buyer compares you against. You
always choose the anchor — if you don't, the buyer anchors on the
cheapest thing they've seen.

**Anchor types:**
- **Internal anchor:** your own higher tier. The $99 plan makes the $49
  plan feel reasonable. Always show prices high-to-low or with the
  premium tier first.
- **Competitor anchor:** "Agencies charge $5k/mo for this; we charge
  $99." Name the expensive alternative explicitly on the pricing page.
- **Cost-of-inaction anchor:** "Every month without this costs you ~$2k
  in lost [outcome]." Quantify the pain in dollars on the sales page.
- **Decoy anchor:** a tier designed to make the target tier look right
  (see tier design).

**Rules:**
- The anchor must be real or honestly framed ("typical agency retainer",
  not a fabricated competitor price).
- Round anchors up, prices down: anchor $1,000, price $79–$99 (charm
  pricing below $100; round numbers above $1,000 signal premium).
- Never anchor on your own cost. Buyers don't care what it costs you.

---

## 2. Tier design — good / better / best (+ decoy)

Three tiers beat one price and beat five tiers. Structure:

| | Good | Better (target) | Best |
|---|---|---|---|
| Price | $X | $2.2–2.5X | $5X+ |
| Position | the floor | **highlighted** | the anchor |
| Job | catch price-sensitive | where 60–70% land | make Better look sane |

**Packaging rules:**
- **One value metric per tier ladder.** Seats, projects, contacts,
  revenue processed — the thing that grows as the customer's success
  grows. Never gate on arbitrary limits ("5 PDFs") when a value metric
  exists.
- **Differentiate on value, not cost.** The jump between tiers must buy
  a visibly bigger outcome, not just "more of the same."
- **Gate the power features, not the core.** Core value in Good (so it
  spreads); automation, integrations, and team features in Better/Best.
- **The decoy:** price Best so high it exists to be compared against,
  not bought — or load Good with just enough friction that Better feels
  inevitable. Mark it honestly in your internal notes: "decoy — anchor
  duty."

**Worked example (SaaS, value metric = projects):**
- Starter $29/mo — 3 projects, core features, community support.
- **Pro $79/mo** — 25 projects, automations, integrations, priority
  support. ← target, highlighted
- Scale $249/mo — unlimited projects, SSO, dedicated manager, SLA.

---

## 3. Willingness-to-pay research

In order of reliability. Use the best the budget allows.

### a) Van Westendorp (free, survey-based)
Ask four questions of 50+ target buyers:
1. At what price is this so cheap you'd doubt its quality?
2. At what price is it a bargain?
3. At what price is it getting expensive but you'd still consider it?
4. At what price is it too expensive to consider?
Plot the curves; the acceptable range sits between the "bargain" and
"expensive" intersections. **Cost: FREE** (Google Forms + 2 hours).

### b) Gabor-Granger (free, direct)
Name a price; ask buy / no-buy. Walk the price up or down per respondent.
Finds the demand curve fast. Weaker on premium positioning.
**Cost: FREE.**

### c) Conjoint / MaxDiff (paid tooling, $$$)
Trade-off exercises that isolate feature value. Use when packaging is
the question and the budget is $500+. **Cost: $200–$2k** in tooling or
panel costs — Pennywise tags this DEFER below the $500–2k tier.

### d) The 10-conversation test (free, best for $0 budgets)
Ten sales conversations with the script: "If this existed today at
$X/mo, would you buy?" Raise X until half flinch. The flinch point minus
20% is your launch price. Record exact words — they're your sales copy.
**Cost: FREE.**

### e) Fake-door / presale (free, strongest signal)
A landing page with a buy button (that explains it's a presale or
waitlist) or actual presale collection. Clicks lie; credit cards don't.
**Cost: FREE** (payment link + landing page).

**Rule:** stated preference ("I'd pay $100") is worth 10% of revealed
preference (a card charged). Weight accordingly.

---

## 4. Competitor teardown template

Teardown 3–5 competitors. Fill one row each.

```markdown
## Competitor Teardown — [Date]

| | Us (planned) | Comp A | Comp B | Comp C |
|---|---|---|---|---|
| Entry price | | | | |
| Flagship price | | | | |
| Value metric | | | | |
| Free tier? limits? | | | | |
| Annual discount | | | | |
| Overage model | | | | |
| Anchor used | | | | |
| Positioning vs. us | — | | | |

### Findings
- Price umbrella: [where the market clusters]
- Gap: [underserved segment or price point]
- Our move: [undercut / match / premium — and why]
- Trap to avoid: [their mistake we won't repeat]
```

**Positioning moves:**
- **Undercut** only with a cost or focus advantage; otherwise it's a
  race to the bottom.
- **Match** when the market has settled and you win on product.
- **Premium** (10–30% above) when you can name the reason in one
  sentence — and prove it in the trial.

---

## 5. A/B test plan template

```markdown
## Pricing Test Plan — [Date]

**Hypothesis:** [Changing X will move metric Y because Z.]
**Variants:** A (control): [current]. B: [change — ONE variable only].
**Primary metric:** [conversion rate / revenue per visitor / take rate].
**Guardrail metric:** [churn / refund rate — must not worsen].
**Sample size:** [visitors or trials needed — use a calculator, FREE online].
**Duration:** [min 1–2 full business cycles; never end early on a peek].
**Traffic split:** [50/50 unless volume is low — then 80/20 to limit risk].

**What we will NOT test:** [list — protects focus]
**Decision rule:** Ship B if primary metric lifts ≥ [x]% with 95%
confidence and guardrail holds. Otherwise keep A and log the learning.
```

**Test order (highest leverage first):**
1. Price level (±20%) on the flagship tier.
2. Anchor presence (with vs. without the premium tier shown).
3. Trial length and card-upfront vs. no-card.
4. Annual vs. monthly default.
5. Discount depth (rarely — see rules).

**Never test:** more than one variable at once; prices on tiny traffic
(<100 conversions per variant — use qualitative research instead);
anything during a launch spike or holiday anomaly.

---

## 6. Discount and promo rules

Discounts are instruments, not habits. Every discount needs a reason,
an expiry, and a fence.

**Allowed discounts:**
- **Annual prepay:** 15–20% off (2 months free). Rewards commitment,
  improves cash flow. Always offered, never negotiated further.
- **Founding / beta:** up to 30–40% off, locked for life OR for 12
  months — in writing. Fenced by cohort ("first 50 customers").
- **Volume:** published tiers, not back-room deals. If it's not on the
  pricing page, it doesn't exist.
- **Win-back:** one targeted offer to churned customers, time-boxed
  14 days. Then the door closes.
- **Nonprofit / education:** 20–50%, verified simply (email domain or
  one document). Goodwill with a fence.

**Banned:**
- Blanket site-wide sales on core SaaS (trains waiting).
- Negotiated one-off discounts without a fence (every customer becomes
  a negotiator).
- Discounts deeper than 40% except founding cohorts.
- Discounting to close this quarter at the cost of next year's renewals.

**Promo calendar rule:** max 2–3 promos per year, each with a named
reason (launch, anniversary, Black Friday). Scarcity must be real —
fake countdowns are a trust fire.

---

## 7. Packaging checklist (pre-launch)

- [ ] One value metric chosen; tiers scale on it.
- [ ] Better tier highlighted; 60–70% expected to land there.
- [ ] Anchor present (premium tier, competitor, or cost-of-inaction).
- [ ] Free tier/trial has a conversion path, not just generosity.
- [ ] Overage behavior defined and communicated before the bill.
- [ ] Annual option priced (2 months free standard).
- [ ] Discount policy written; fences defined.
- [ ] Teardown of 3+ competitors on file.
- [ ] First pricing test planned with decision rule.
- [ ] Cost tags on any pricing tooling (Pennywise sign-off).

---

## Quick reference — price points by model

| Model | Typical entry | Typical flagship | Notes |
|---|---|---|---|
| SaaS SMB | $19–49/mo | $79–199/mo | per value metric |
| SaaS prosumer | $9–19/mo | $29–49/mo | annual default |
| Course (self-paced) | $99–299 | $499–999 | cohort 5–10x |
| Paid community | $19–49/mo | $199–499/yr | founding rates lower |
| DFY service | $1k–3k project | $3k–10k/mo retainer | price the outcome |
| Templates/digital | $19–79 | $149–299 bundle | bundle the flagship |
| API/dev tool | $0–29/mo dev | $99–499/mo pro | usage overage above |
| Newsletter (paid) | $5–15/mo | $100–150/yr | annual push hard |
