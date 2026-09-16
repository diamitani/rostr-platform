---
name: payments-setup
description: "Per-provider payment setup checklists (Stripe, Gumroad, Lemon Squeezy, Paddle, crypto via Coinbase Commerce/BTCPay) with fees, payout times, tax-form notes, checkout-flow patterns, licensing/entitlement patterns, and per-budget-tier recommendations."
---

# Payments Setup

The Monetization Wizard's collection craft, used by Tollbooth. One job:
get the user paid with the least friction and the right provider for
their budget tier. **Order: pick provider → setup checklist → checkout
pattern → entitlements → test.**

## Hard rules

1. **Draft and guide only.** Never send, post, publish, pay, buy, or
   sign the user up for anything. You write setup guides and checklists;
   the user creates their own accounts, enters their own credentials,
   and clicks their own buttons.
2. **Never ask for or handle API keys, logins, banking details, or any
   credential.** If the user offers one, refuse it and point them to the
   official setup flow.
3. **Budget reality.** Every tactic carries a cost tag and a free
   alternative.
4. **No custom payment code at launch.** Payment links and hosted
   checkouts first; engineering comes with volume.
5. **State fees, payout timing, and tax obligations plainly.**

---

## 1. Provider comparison

Fees change — verify on the provider's pricing page before launch day.
Figures below are typical US rates at time of writing.

| | Stripe | Gumroad | Lemon Squeezy | Paddle | Crypto (Coinbase Commerce / BTCPay) |
|---|---|---|---|---|---|
| Best for | scale, custom | creators, $0 start | SaaS, $0 start | SaaS, global tax | crypto-native buyers |
| Setup cost | FREE | FREE | FREE | FREE | FREE (BTCPay self-host ~$5–10/mo server) |
| Transaction fee | 2.9% + 30¢ | 10% flat (no monthly) | 5% + 50¢ | 5% + 50¢ | ~1% (Coinbase) / ~0% (BTCPay) |
| Merchant of record? | No (you handle tax) | Yes | Yes | Yes | No |
| Sales tax / VAT handled? | No (add Tax: 0.5–1%) | Yes | Yes | Yes | No |
| Payout time | 2–7 days | weekly | ~2x monthly | monthly | near-instant |
| Subscriptions | excellent | basic | good | good | recurring is manual |
| Digital delivery | via integrations | built-in | built-in (license keys) | built-in | manual |

**Merchant of record (MoR)** means the provider handles sales tax, VAT,
and invoices globally. If you sell internationally and hate tax
paperwork, an MoR (Gumroad, Lemon Squeezy, Paddle) is worth its higher
fee.

---

## 2. Per-budget-tier recommendation

| Tier | Recommendation | Why |
|---|---|---|
| **$0** | Gumroad or Lemon Squeezy free tier | $0 to start, MoR handles tax, built-in delivery; fees only when you sell |
| **<$500** | Lemon Squeezy (SaaS) or Gumroad (creator) | same as above; spend the budget on the product, not payments |
| **$500–2k** | Stripe Payment Links | lower fees at volume, still no code; add Stripe Tax if selling cross-border |
| **$2k–10k** | Stripe (Checkout/API) or Paddle (if global tax is a headache) | volume justifies the integration; MoR vs. control is the decision |
| **$10k+** | Stripe full stack (Billing, Radar, Tax) | you now have the volume and the team; optimize fees and fraud |

**Upgrade triggers (when to move):** monthly fees paid to an MoR exceed
the cost of Stripe + Stripe Tax (roughly: when monthly revenue passes
$8–10k for SaaS); you need custom checkout UX; you need usage-based
billing with complex metering.

---

## 3. Setup checklists

### Stripe (Payment Links — no code) [COST: FREE to set up]
- [ ] Create account at stripe.com; complete business verification
      (EIN/SSN, business address — the user does this themselves)
- [ ] Connect bank account for payouts (2–7 day first payout)
- [ ] Create Product → set price(s), one-time or recurring
- [ ] Generate Payment Link; set collect-tax or enable Stripe Tax
- [ ] Configure receipt emails and branding (logo, colors)
- [ ] Set up webhook/email notification for new sales (or check dashboard)
- [ ] **Test purchase** with a real card for $1 (refund after)
- [ ] Tax note: US — Stripe issues 1099-K at the reporting threshold;
      EU/UK VAT needs Stripe Tax or an MoR

### Gumroad [COST: FREE to set up, 10% per sale]
- [ ] Create account; complete payout setup (bank or PayPal)
- [ ] Create Product → upload files or set service tiers
- [ ] Set price; enable "pay what you want" floor if desired
- [ ] Customize product page (cover, description, preview)
- [ ] Set up license keys if selling software (built-in)
- [ ] Connect custom domain (optional, free)
- [ ] **Test purchase** ($1, refund after)
- [ ] Tax note: Gumroad is MoR — handles US sales tax and VAT

### Lemon Squeezy [COST: FREE to set up, 5% + 50¢ per sale]
- [ ] Create account; complete business details and payout method
- [ ] Create Product → digital, subscription, or usage-based
- [ ] Configure license-key delivery for software
- [ ] Set up checkout overlay or hosted checkout link
- [ ] Enable dunning (failed-payment recovery) for subscriptions
- [ ] Connect to email tool via webhook/Zapier for onboarding
- [ ] **Test purchase** in test mode, then one live $1 charge
- [ ] Tax note: Lemon Squeezy is MoR — global tax handled

### Paddle [COST: FREE to set up, 5% + 50¢ per sale]
- [ ] Apply for Paddle account (approval required — have business docs ready)
- [ ] Complete compliance verification (can take days — plan ahead)
- [ ] Create Product → prices per currency/region
- [ ] Integrate hosted checkout or API
- [ ] Configure subscription billing and dunning
- [ ] **Test purchase** in sandbox, then live
- [ ] Tax note: Paddle is MoR — strongest global tax coverage of the list

### Crypto — Coinbase Commerce [COST: FREE, ~1% fee]
- [ ] Create account; verify identity
- [ ] Create checkout or payment button; select accepted coins
- [ ] Set settlement: crypto wallet or auto-convert to fiat
- [ ] Add the pay button/link to the sales page
- [ ] **Test purchase** with a small amount
- [ ] Tax note: crypto revenue is taxable income; track cost basis;
      consult a tax pro — this skill is not tax advice

### Crypto — BTCPay Server [COST: ~$5–10/mo server, ~0% fees]
- [ ] Deploy BTCPay (1-click on LunaNode / self-host)
- [ ] Connect wallet (hardware wallet recommended)
- [ ] Create store; generate payment buttons/invoices
- [ ] **Test purchase** with a small amount
- [ ] Tax note: same as above — track everything

---

## 4. Checkout-flow patterns

**Pattern A — Payment link (default at $0–2k tier).** Sales page →
payment link → provider checkout → automatic delivery email. No code,
no cart, no account system. Use until volume hurts.

**Pattern B — Hosted checkout with order bump.** Same as A, plus a
one-click add-on at checkout (template pack, setup call). Lifts average
order value 10–30%. Available on Lemon Squeezy, Stripe, Gumroad.

**Pattern C — Trial → paid (SaaS).** 14-day trial, card up front vs. no
card: card-upfront converts fewer trials but higher-quality; no-card
converts more trials, lower take. Test it (Priceline's territory).
Dunning emails on day 1, 3, 7 of failure — recover 20–40% of failed
payments.

**Pattern D — Application / invoice (high-ticket).** Application form →
sales call → invoice link (Stripe invoice) or contract + ACH. For
$1k+ offers. Never automate the relationship at this price.

**Checkout rules:** one page, one offer; guest checkout always; total
fields under 7; show the guarantee beside the pay button; mobile-first
(most traffic is a phone).

---

## 5. Licensing / entitlement patterns (digital products)

- **License keys** (software, templates): provider generates key at
  purchase (Lemon Squeezy/Gumroad built-in); app validates on launch.
  Pattern: key → validate → activate → allow 2–3 seats.
- **Email-gated access** (courses, communities): purchase webhook adds
  buyer email to the platform (Teachable, Circle, Discord). Pattern:
  pay → webhook → invite email → access.
- **Signed download links** (files, packs): expiring links (24–72h),
  limited downloads. Built into Gumroad/Lemon Squeezy.
- **API keys** (API products): purchase → provision key via provider
  webhook → tier maps to rate limits. Start manual; automate at volume.
- **Honor + watermark** (art, music): light DRM (watermarked previews,
  named licenses). Heavy DRM punishes buyers more than pirates.

**Anti-piracy stance:** make buying easier than pirating; don't build
DRM before you have a piracy problem.

---

## 6. Pre-launch payments checklist

- [ ] Provider chosen per budget tier (Pennywise sign-off)
- [ ] Account created and verified by the USER (never by the wizard)
- [ ] Payout method connected; payout timing known
- [ ] Fees calculated into pricing (Ledger's worksheet updated)
- [ ] Tax handling decided (MoR vs. self + Stripe Tax)
- [ ] Checkout flow tested end-to-end with a real $1 purchase
- [ ] Refund policy written and visible (30-day standard for digital)
- [ ] Failed-payment recovery (dunning) enabled for subscriptions
- [ ] Purchase notification routed (email/Slack/webhook)
- [ ] Post-purchase email: receipt + what happens next + support contact
