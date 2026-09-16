---
name: monetization-strategy
description: "The exhaustive revenue-model taxonomy — 16 models with when-to-use, trade-offs, and typical margins — plus the intake template, model-mix scoring rubric, and master monetization plan template. Use when choosing how a product makes money: subscriptions, freemium, usage billing, API tiers, ads, affiliates, marketplace take-rate, licensing, DFY, courses, community, enterprise, and more."
---

# Monetization Strategy

The canonical reference for the Monetization Wizard's strategist
(Aurelius). It answers one question — *how does this thing make money?*
— with a taxonomy, a selection method, and a plan template. Use it in
this order: **intake → score → mix → master plan**.

## Hard rules (bind every agent on the team)

1. **Draft and guide only.** The wizard never sends, posts, publishes,
   pays, buys, or signs the user up for anything. It produces plans,
   copy, checklists, scripts, and setup guides; the user approves and
   acts.
2. **Budget reality.** Never recommend a tactic the user's budget can't
   afford. Every tactic carries a cost tag and a free alternative.
   Pennywise's tier ($0 / <$500 / $500–2k / $2k–10k / $10k+) governs
   everything.
3. **One primary engine.** A business gets one primary revenue model at a
   time. Secondary streams are welcome; second businesses are not.
4. **Math before momentum.** Ledger must show the unit economics close
   before the plan ships. A strategy that can't pay for itself is a hobby
   with branding.

---

## Part 1 — Intake template

Run intake before scoring anything. Never guess these answers.

```markdown
## Monetization Intake

### The product
1. What are you selling? (one sentence, plain words)
2. What painful problem does it remove, and for whom?
3. Stage: idea / prototype / MVP / launched / scaling?
4. What exists today: customers? revenue? waitlist? traffic?

### The buyer
5. Who pays? (role, not demographics — "freelance designers", not "25-40")
6. How do they buy today — what's the incumbent they pay now?
7. What does a win look like for them in 90 days? (the outcome they pay for)

### The economics
8. What does it cost you to serve one more customer? (marginal cost)
9. What have you charged before, if anything? What happened?
10. Budget tier: $0 / <$500 / $500–2k / $2k–10k / $10k+?

### Constraints
11. Time to first dollar needed? (survival math vs. patience math)
12. Anything you refuse to do? (ads, sales calls, enterprise, etc.)
13. Regulatory or platform constraints? (app stores, HIPAA, finance, etc.)
```

**Red flags in intake** — say them out loud: no identifiable buyer;
marginal cost higher than plausible price; "everyone" as the audience;
refusal to sell anything (then it's not a business yet); a budget of $0
paired with a model that needs paid acquisition.

---

## Part 2 — The taxonomy (16 revenue models)

For each: what it is, when to use it, the trade-offs, typical margins,
and the cost tag to start.

### 1. Subscriptions (recurring)
Charge a flat fee per period for continued access.
**Use when:** ongoing value delivered repeatedly (software, content,
services with cadence); retention is achievable; predictable revenue is
worth the churn fight.
**Trade-offs:** the gold standard of compounding revenue — and a churn
treadmill. Requires continuous delivery and dunning (failed-payment
recovery).
**Typical margins:** SaaS 70–90% gross; content subscriptions 60–85%.
**Start cost:** $0 (Gumroad/Stripe payment links) to ~$50/mo tooling.

### 2. One-time purchase
Single payment for perpetual ownership or a fixed deliverable.
**Use when:** the value is delivered once (templates, books, tools with
no ongoing cost); buyers resist commitment; you need cash fast.
**Trade-offs:** cash up front, zero predictability. Every month starts
at $0. Best paired with a volume or upsell engine.
**Typical margins:** digital 85–97%; physical 20–50%.
**Start cost:** $0 (Gumroad/Lemon Squeezy free tier).

### 3. Freemium → paid conversion
Free tier with real value; paid tier unlocks more.
**Use when:** the product spreads by trying; free users create network
effects or content; conversion math works (typically 2–5% convert).
**Trade-offs:** free users cost support and infra. The free tier must be
good enough to spread, limited enough to convert — the hardest line in
monetization.
**Typical margins:** same as subscription, minus free-tier drag
(5–15% of revenue often goes to serving free users).
**Start cost:** $0 to launch; infra costs scale with free users.

### 4. Usage / metered billing
Pay per unit consumed: API calls, seats, credits, minutes, rows.
**Use when:** value scales with consumption; heavy and light users differ
10x+; costs scale with use (infrastructure, AI tokens).
**Trade-offs:** aligns price with value beautifully — and makes bills
unpredictable, which buyers hate. Needs usage metering and clear
overage communication.
**Typical margins:** 60–85% after COGS; watch AI/infra pass-through.
**Start cost:** $0 (Stripe metered billing exists; metering code is the
real cost — engineering time).

### 5. API access tiers
Tiered plans for programmatic access: free/dev, pro, enterprise.
**Use when:** developers are the buyer; the product is infrastructure or
data; usage is spiky.
**Trade-offs:** developers demand docs, uptime, and honest rate limits.
Land-and-expand is natural; support burden per dollar can be high at the
low end.
**Typical margins:** 70–90%.
**Start cost:** $0 to launch; docs and status pages are free-stack.

### 6. Ads / sponsorships
Sell attention: display ads, sponsorships, newsletter placements.
**Use when:** you have (or can build) a large free audience; the audience
is valuable to specific advertisers; you don't want to charge users.
**Trade-offs:** you need scale — meaningful ad revenue starts around
50k+ monthly engaged users. You trade user experience for revenue and
become dependent on platforms and CPM cycles.
**Typical margins:** 60–90% on owned inventory (after ad-server costs,
which can be $0).
**Start cost:** $0 (sponsorships are just emails and a media kit).

### 7. Affiliate revenue
Earn commissions recommending others' products.
**Use when:** you have trusted distribution (newsletter, channel, SEO);
the products fit your audience; you want revenue before your own product
exists.
**Trade-offs:** commissions are 5–50% and controlled by someone else —
programs get cut. Great bridge revenue; fragile primary revenue.
**Typical margins:** 100% of the commission (no COGS), but lumpy.
**Start cost:** $0.

### 8. Marketplace take-rate
Take a percentage of transactions between others on your platform.
**Use when:** you can aggregate supply and demand; transactions are
frequent; you solve trust, discovery, or payments for both sides.
**Trade-offs:** the hardest model to start (chicken-and-egg) and among
the best at scale. Typical take rates: 5–20%. Fraud, disputes, and
support are your permanent tenants.
**Typical margins:** 60–80% of take after payment processing and ops.
**Start cost:** $0 to $500 (no-code marketplace builders exist).

### 9. White-label / licensing
Let others sell your product under their brand, or license IP for a fee.
**Use when:** partners have distribution you lack; the product is
complete and stable; enterprise buyers want "our" solution.
**Trade-offs:** high revenue per deal, long cycles, customization demands
that can fork your roadmap. Protect IP in writing before the first call.
**Typical margins:** 80–95% (near-pure IP rent).
**Start cost:** $0 (contracts are the cost — templates, then a lawyer
when a deal is real).

### 10. Done-for-you (DFY) services
Sell the outcome as a service: you do the work, they pay.
**Use when:** buyers want the result, not the tool; you need revenue
now; the service reveals what the product should be.
**Trade-offs:** revenue is immediate and high-touch; it doesn't scale
without hiring. The classic path: DFY → productized service → software.
**Typical margins:** 40–70% (your time is the COGS).
**Start cost:** $0 (a calendar link and a contract).

### 11. Courses / cohorts
Sell knowledge as a packaged curriculum, self-paced or live.
**Use when:** you have a repeatable transformation to teach; the
audience pays to learn faster; you can sell before you build (presell
the cohort).
**Trade-offs:** launches are spiky; evergreen decays without updates.
Cohorts command 5–10x self-paced prices but cost your live time.
**Typical margins:** 85–95% digital; cohorts 60–80% after your time.
**Start cost:** $0 (Gumroad/Teachable free tiers; live cohorts need only
a video call link).

### 12. Paid community
Charge for access to a curated group: network, accountability, access
to you.
**Use when:** the value is the other members; the topic sustains daily
conversation; you can seed the first 50 members personally.
**Trade-offs:** communities die without curation — you are the
entertainment until the culture holds. Churn is emotional, not just
economic.
**Typical margins:** 80–95%.
**Start cost:** $0 (Discord/Slack/WhatsApp + a payment link).

### 13. Data licensing
Sell aggregated, anonymized data or insights derived from your product.
**Use when:** your product naturally accumulates valuable data; buyers
(publishers, funds, enterprises) pay for benchmarks and signals.
**Trade-offs:** privacy and consent are non-negotiable — get them in
writing in your terms from day one. Long sales cycles; high contract
values.
**Typical margins:** 85–95%.
**Start cost:** $0 (the data pipeline is the cost — engineering time).

### 14. Tip jar / donations
Voluntary payments: tips, "buy me a coffee," patronage.
**Use when:** the work is public-good-ish (open source, art, free
tools); the audience feels gratitude; anything else would corrupt the
thing.
**Trade-offs:** unreliable by design. Works as a supplement, rarely as
the engine — unless the audience is large and devoted.
**Typical margins:** ~95% after platform fees.
**Start cost:** $0 (Ko-fi/Buy Me a Coffee free tiers).

### 15. Enterprise contracts
Annual deals with companies: licenses, pilots, procurement.
**Use when:** the buyer has budget and a committee; the problem is
expensive; you can survive 3–9 month sales cycles.
**Trade-offs:** the highest ACVs and the slowest everything — sales,
legal, onboarding. One lost champion can kill a year's pipeline.
**Typical margins:** 70–90% on software; lower with services attached.
**Start cost:** $0 to start selling; real cost is founder time.

### 16. Revenue-share partnerships
Split revenue with a partner who brings distribution, product, or
capital.
**Use when:** a partner's reach 10x's yours; the economics only work
together; incentives must stay aligned long-term.
**Trade-offs:** alignment is everything and paperwork is destiny. Get
the split, the accounting, and the exit terms in writing before dollar
one.
**Typical margins:** whatever your share is, minus your delivery cost.
**Start cost:** $0 (the agreement is the cost — lawyer when real).

---

## Part 3 — Model-mix scoring rubric

Score 2–3 candidate models, 1–5 each. Highest total usually wins, but
read the notes — a 5 on "time to first dollar" can override a higher
total when survival is at stake.

| Criterion | 1 | 3 | 5 |
|---|---|---|---|
| Buyer clarity | "everyone" | a segment | a named buyer with budget |
| Time to first $ | 6+ months | 1–3 months | < 30 days |
| Margin at scale | < 30% | 50–70% | 80%+ |
| Budget fit | needs $10k+ | needs <$2k | $0 start |
| Founder fit | hate doing it | neutral | love doing it |
| Defensibility | commodity | some moat | network effects / IP |
| Predictability | pure one-off | mixed | recurring |

**Mix rules:**
- Default mix: **one primary engine + one bridge** (bridge = affiliate,
  DFY, or presale that funds the engine).
- Never mix two high-touch models (DFY + enterprise) at $0 budget.
- Freemium only if free-tier cost per user is near $0 or the rubric
  still wins at 2% conversion.
- Ads only with existing audience or a credible 6-month path to 50k+
  engaged users.

---

## Part 4 — Master plan template

```markdown
# Monetization Plan — [Product] — [Date]

## 1. Verdict
Primary engine: [model]. Bridge revenue: [model]. Why this mix in two
sentences.

## 2. Intake summary
Buyer: [who pays]. Problem: [pain removed]. Stage: [x]. Budget tier: [x].

## 3. Model scores
| Model | Buyer | Time$ | Margin | Budget | Fit | Moat | Predict | Total |
|---|---|---|---|---|---|---|---|---|

## 4. Pricing (Priceline)
[Tier table, anchor logic, discount guardrails — or "handed to Priceline".]

## 5. Unit economics (Ledger)
[CAC, LTV, LTV:CAC, payback, break-even — or "handed to Ledger".]

## 6. Launch motion (Closer + Megaphone)
[Offer, funnel, channel, 30-day calendar — or "handed to Closer/Megaphone".]

## 7. Collection (Tollbooth)
[Provider, checkout flow, fees, payout timing.]

## 8. Budget review (Pennywise)
| Tactic | Cost tag | Verdict: BUY / DEFER / FREE-ALT |
Total monthly burn implied: $X. Deferred items and triggers.

## 9. First week actions
1. [ ] [owner] [action] [cost]
2. [ ] ...
3. [ ] ...

## 10. Kill/continue rules
Metric that proves it works: [x] by [date]. If missed: [pivot or kill].
```

**Cost-tag format** (used everywhere): `[COST: $X/mo | $Y one-time |
FREE]` — every tactic in every section carries one.

---

## Quick selector (when intake is thin)

- Audience but no product → affiliate / sponsorships (bridge), then
  courses or community.
- Product but no audience → DFY services (cash + learning), then
  productized tiers.
- Tool people already use → freemium or usage billing.
- Expertise, no product → cohort course (presell), then evergreen.
- Two-sided idea → marketplace take-rate, but start with DFY matching
  to fake the marketplace (concierge MVP).
- $0 budget, need money this month → DFY, presales, affiliates. In
  that order.
