---
name: premium-site-build-os-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Premium Site Build Operating System. Use when working with premium site build operating system."
---

# Premium Site Build Operating System

**Codename:** Site Empire OS  
**Version:** 1.0.0  
**Status:** Canonical — use as README, `soul.md`, `SKILL.md`, or instruction pack  
**Owner:** Builder / operator (you)  
**Governing frameworks:** PAL (Parse → Ambiguity Scan → Latent Intent → Expand → Compile) · Software Development Life Cycle · AWS Well-Architected Framework (six pillars)

This is the single operating system for producing any premium site: marketing, SaaS, marketplace, creator platform, e-commerce, community, or agent console. It is written so an engineer, designer, or coding agent can execute without inventing process. Every future project starts here. No phase is optional. Beauty without payments is a brochure. Payments without architecture is a liability. Architecture without taste is a spreadsheet.

---

## 0. How to use this document

### 0.1 Roles this file can play

| Filename | When to use |
|---|---|
| `README.md` | Human operators and contractors. Read first. |
| `soul.md` | Agent identity, mission, denied tools, evaluation. |
| `SKILL.md` | Agent skill: when to trigger, inputs, outputs, checklists. |
| `instruction-pack.md` | Full build brief handed to a coding agent. |
| `AGENTS.md` | Repo-root rules for Cursor / Claude Code / Codex. |

Copy the soul and skill sections at the end of this file into those filenames. Keep this file as the system of record.

### 0.2 Non-negotiable invariants

1. PAL precedes execution. Do not write production code before intent, IA, architecture, and a PRD exist.
2. Artifacts are versioned, immutable, and traceable (`org/project/run/artifact/version`).
3. Secrets never live in git, client bundles, chat logs, or screenshots.
4. Side effects (payments, deploys, emails, repo writes, spend) require explicit approval.
5. Accessibility, responsive design, and security are not later phases.
6. Scale is designed in, not bolted on. Day-one architecture must not block ten-million users even if it does not yet provision for them.
7. Taste is a quality gate. Generic AI-slop UI is a defect.
8. Every screen that takes money, identity, or private data has error, empty, loading, success, and denied states.

### 0.3 Definition of premium

A site is premium only if all of the following are true:

- A stranger can understand the offer in five seconds.
- A user can create an account with OAuth, pay, and reach the core job in under three minutes.
- Visual hierarchy, type, motion, and spacing look intentional (Taste Skill / design-taste-frontend).
- Core flows work on mobile, tablet, and desktop with WCAG 2.2 AA contrast and keyboard access.
- Payments are PCI-aware (Stripe or equivalent), webhook-verified, tax-capable, and refundable.
- The system is observable, backed up, secret-managed, and recoverable.
- The product can grow from 1 user to 1B users by changing **capacity and topology**, not by rewriting the product model.

---

## 1. Doctrine: PAL × SDLC × Well-Architected

### 1.1 PAL (always first)

| Step | Question | Output |
|---|---|---|
| **Parse** | What was explicitly asked? Audience, stack, features, constraints. | Intake record |
| **Ambiguity Scan** | What is missing? Auth, payments, errors, breakpoints, data ownership, tenancy. | Clarification list (one material question at a time) |
| **Latent Intent** | What job is the user hiring this site to do? | JTBD + success metric |
| **Expand** | Color, type, IA, schema, APIs, threats, cost, scale path. | Design system + architecture + data model |
| **Compile** | Production specs and executable next step. | PRD, playbook, instruction pack, code |

PAL maps to ROSTR’s pipeline: intake → intent-spec → evidence → JTBD → NPAO plan → instruction pack → PRD → quality gate.

### 1.2 SDLC (always around PAL)

| SDLC phase | PAL / docs | Infra / product |
|---|---|---|
| Planning | Intent spec, JTBD, roadmap, budget, risk | Org, domains, billing account, tags |
| Analysis | PRD, user stories, constraints, tenancy | Threat model, data classification |
| Design | IA, sitemap, system architecture, UI spec, API spec | Stack decision record |
| Development | Component code, schema, secrets wiring | Feature flags, preview deploys |
| Testing | Acceptance criteria, a11y, load, security | CI, eval fixtures, contract tests |
| Deployment | Runbook, rollback, versioning | CDN, DNS, WAF, canary |
| Maintenance | Changelog, learning loop, support | Backups, on-call, cost review |

### 1.3 AWS Well-Architected pillars (gates on every artifact)

The framework exists so architectural decisions are conscious, measurable, and remediable — not an audit theater. Apply all six pillars to every workload, including a Vercel + Supabase stack that later moves heavy pieces onto AWS.

| Pillar | Meaning | Site-build translation |
|---|---|---|
| **Operational excellence** | Run as code, small reversible changes, observe, improve after failure | IaC, CI/CD, runbooks, dashboards, blameless postmortems |
| **Security** | Protect identity, infra, data, incident response | Least-privilege IAM, MFA, encryption, audit logs, segmentation, automated detection |
| **Reliability** | Keep working through failure and demand change | Multi-AZ / replicas, backups, health checks, queues, retries, autoscaling |
| **Performance efficiency** | Right resources, evolve with data | Caching, edge, managed services, measure bottlenecks, scale on real load |
| **Cost optimization** | Value without idle waste | Tags, right-size, serverless where it fits, budgets, kill unused |
| **Sustainability** | Lower environmental impact | High utilization, efficient regions, no zombie environments, right-size images |

**WAF review cadence:** after architecture freeze, before first paid launch, at 10k / 100k / 1M MAU, after any Sev-1, and when entering a new region.

---

## 2. Artifact catalog (required documents)

No production build starts until these artifacts exist at `draft` or better. Status values: `missing` · `draft` · `review` · `approved` · `superseded`.

### 2.1 Document set

| # | Artifact | Filename | Owner | Exit criteria |
|---|---|---|---|---|
| 01 | Intent spec | `docs/01-intent-spec.md` | Product | Problem, users, scope, non-goals, assumptions, acceptance signals |
| 02 | JTBD report | `docs/02-jtbd.md` | Product | Primary/secondary jobs, success metrics, switching triggers |
| 03 | User stories | `docs/03-user-stories.md` | Product | INVEST stories, acceptance tests, personas |
| 04 | Information architecture | `docs/04-ia.md` | Design | Objects, navigation, taxonomy, permissions by object |
| 05 | Sitemap | `docs/05-sitemap.md` | Design | Every URL, auth gate, SEO intent |
| 06 | User flows | `docs/06-flows.md` | Design | Onboarding, OAuth, pay, core job, chat, cancel |
| 07 | Design system / taste brief | `docs/07-design-system.md` | Design | Type, color, motion, anti-slop, dark mode |
| 08 | PRD | `docs/08-prd.md` | Product | Problem, solution, requirements, metrics, rollout |
| 09 | Functional + non-functional spec | `docs/09-specifications.md` | Eng | APIs, SLOs, threats, data classes |
| 10 | System architecture | `docs/10-architecture.md` | Eng | C4 L1–L3, sequence diagrams, failure modes |
| 11 | Stack decision record | `docs/11-stack-adr.md` | Eng | Choice, why, alternative, invalidation |
| 12 | Data model | `docs/12-data-model.md` | Eng | ERD, RLS, retention, PII |
| 13 | API contract | `docs/13-api.md` | Eng | OpenAPI or tRPC router map, errors, idempotency |
| 14 | Frontend UI spec | `docs/14-frontend-ui.md` | Design/Eng | Marketing, auth, pricing, checkout, app, chat |
| 15 | Backend / infra spec | `docs/15-backend-infra.md` | Eng | Compute, DB, storage, secrets, hosting, deploy, versions |
| 16 | Payments spec | `docs/16-payments.md` | Eng/GTM | Catalog, tax, webhooks, dunning, refunds |
| 17 | Security + privacy | `docs/17-security.md` | Eng | Threat model, DPA, cookies, logging redaction |
| 18 | Observability | `docs/18-observability.md` | Eng | Metrics, traces, logs, alerts, SLOs |
| 19 | Product roadmap | `docs/19-roadmap.md` | Product | Now / Next / Later mapped to scale stages |
| 20 | Build playbook | `docs/20-playbook.md` | Eng | Critical path, definition of done, gates |
| 21 | Quality scorecard | `docs/21-quality.md` | QA | Contract, a11y, security, taste, performance |
| 22 | Runbook + incident | `docs/22-runbook.md` | Ops | Deploy, rollback, restore, on-call |
| 23 | Legal pack | `docs/23-legal.md` | Operator | Terms, privacy, cookies, acceptable use, refunds |
| 24 | Instruction pack | `docs/24-instruction-pack.md` | Agent | Souls, tools, env, phased prompts |
| 25 | Evidence ledger | `docs/25-evidence.md` | Research | Sources, confidence, gaps |

### 2.2 Artifact envelope (every doc header)

```yaml
artifact_type: prd
project_id: acme-os
version: v1.2.0
status: approved
owner: product
reviewers: [eng, design, security]
well_architected_review: pending | pass | fail
pal_run_id: optional
upstream: [intent-spec@v3, jtbd@v2]
confidence: 0.0-1.0
```

Never overwrite an approved artifact. Supersede it.

---

## 3. Information architecture standard

IA is the product’s object model plus how humans find those objects.

### 3.1 Canonical objects (adapt, do not skip)

| Object | Purpose | Typical fields |
|---|---|---|
| Organization / Workspace | Tenant boundary | name, plan, billing_customer_id, region |
| User | Identity | email, auth_provider, role, mfa |
| Membership | User ↔ org | role, seats, invited_by |
| Project / Site | Unit of work | slug, env, domain |
| Artifact / Document | Versioned content | type, version, checksum |
| Entitlement | What they paid for | plan, feature_flags, seats, period |
| Conversation | Chat / support / agent | thread_id, model, tokens |
| Asset | Files | bucket, key, mime, scan_status |
| Event | Audit / analytics | actor, action, resource, ip |
| Job | Async work | type, status, idempotency_key |

### 3.2 Navigation grammar

**Marketing (logged out):** Product · Solutions · Pricing · Customers · Resources · Login · Start

**App (logged in):** Home · Current project · Create · Inbox/Chat · Settings · Billing · Admin (role-gated)

**Settings:** Profile · Workspace · Members · API keys · Integrations · Billing · Audit log · Danger zone

Rules:

- One primary action per page.
- Depth ≤ 3 clicks to the core job.
- Search from 50+ objects.
- Admin is never in the customer primary nav.
- Billing is always reachable from account menu.

### 3.3 Permission matrix (minimum)

| Role | Read product | Write product | Billing | Members | Delete workspace |
|---|---|---|---|---|---|
| Viewer | Yes | No | No | No | No |
| Member | Yes | Yes | No | No | No |
| Admin | Yes | Yes | Yes | Yes | No |
| Owner | Yes | Yes | Yes | Yes | Yes |

Enforce in Postgres RLS and in the API. UI hiding is not security.

---

## 4. Sitemap standard

Produce a sitemap as a table and a mermaid graph. Every URL has: path, purpose, auth, SEO, index.

### 4.1 Marketing cluster

| Path | Purpose | Auth | Index |
|---|---|---|---|
| `/` | Landing / promise | Public | Yes |
| `/product` | Product narrative | Public | Yes |
| `/solutions/[segment]` | Use-case pages | Public | Yes |
| `/pricing` | Plans, FAQ, comparison | Public | Yes |
| `/customers` · `/blog` · `/docs` | Proof and education | Public | Yes |
| `/about` · `/careers` | Trust | Public | Yes |
| `/legal/terms` · `/legal/privacy` · `/legal/cookies` · `/legal/dpa` | Legal | Public | Yes |
| `/security` | Trust center | Public | Yes |
| `/contact` · `/demo` | Sales | Public | Yes |
| `/changelog` | Product truth | Public | Yes |

### 4.2 Auth cluster

| Path | Purpose | Auth |
|---|---|---|
| `/login` | Email + OAuth | Public, redirect if session |
| `/signup` | Create account | Public |
| `/auth/callback` | OAuth return | Public, CSRF-protected |
| `/forgot-password` · `/reset-password` | Recovery | Public |
| `/verify-email` | Proof | Signed token |
| `/mfa` | Second factor | Partial session |
| `/onboarding` | Workspace + first project | Authenticated |

### 4.3 Commerce cluster

| Path | Purpose | Auth |
|---|---|---|
| `/pricing` | Plan selection | Public |
| `/checkout` | Stripe Checkout or embedded | Auth recommended |
| `/checkout/success` | Verify session + webhook race handling | Auth |
| `/checkout/cancel` | Recovery CTA | Auth |
| `/billing` | Customer portal, invoices, payment method | Auth + billing role |
| `/billing/invoices/[id]` | Invoice detail | Auth |

### 4.4 Application cluster

| Path | Purpose | Auth |
|---|---|---|
| `/app` | Home / command center | Auth |
| `/app/[workspace]` | Workspace home | Membership |
| `/app/[workspace]/[project]` | Project | Membership |
| `/app/[workspace]/chat` | Chat UI | Membership |
| `/app/[workspace]/settings/*` | Settings | Role |
| `/admin` | Operator console | Superadmin |

### 4.5 Technical cluster (never index)

`/api/*` · `/.well-known/*` · `/health` · `/ready` · `/og` · webhooks `/api/webhooks/stripe` · `/api/webhooks/*`

Robots: index marketing; `noindex` app, checkout success, auth, admin.

---

## 5. User stories (canonical set)

Format: As a **persona**, I want **action**, so that **outcome**. Acceptance is given/when/then.

### 5.1 Personas

- **Visitor** — unknown, evaluating.
- **Signer** — creating an account.
- **Member** — doing the core job.
- **Admin** — seats, billing, security.
- **Operator** — you, running the platform.
- **Agent** — coding or runtime agent consuming instruction packs.

### 5.2 Must-have stories

**US-01 Landing comprehension.** As a visitor, I want the landing page to state who it is for, what it does, and the next action, so I can decide in five seconds.  
Acceptance: H1, subcopy, primary CTA, social proof, and pricing teaser visible above the fold on 375px and 1440px.

**US-02 OAuth signup.** As a signer, I want to continue with Google, GitHub, or Apple, so I do not invent a password.  
Acceptance: OAuth completes; email captured; workspace created or invite applied; no secret in client; failed OAuth shows recovery.

**US-03 Email signup.** As a signer, I want email + magic link or password + verification, so I can join without a social account.

**US-04 First value.** As a member, I want a guided empty state that completes the core job once, so I feel the product works.

**US-05 Pricing clarity.** As a visitor, I want three plans with who-it’s-for, limits, and a featured plan, so I can choose without a sales call.

**US-06 Checkout.** As a member, I want to pay with card (and later wallet, ACH, invoice), so I unlock paid features immediately.  
Acceptance: Stripe Checkout or Payment Element; webhook is source of truth; success page does not grant access without verified session or webhook; taxes calculated; receipt emailed.

**US-07 Entitlement.** As a member, I want paid features to unlock within seconds of payment, so I am not stuck on a spinner.

**US-08 Chat.** As a member, I want a streaming chat that keeps history, cites sources when it uses them, and never exposes keys, so I can work with an assistant safely.

**US-09 Billing self-serve.** As an admin, I want a portal to change plan, payment method, invoices, and cancel, so support is not the billing desk.

**US-10 Invite.** As an admin, I want to invite by email with a role, so the team can work in one workspace.

**US-11 Audit.** As an owner, I want a log of logins, role changes, payments, and secret access, so I can investigate incidents.

**US-12 Export / delete.** As an owner, I want to export and delete workspace data, so I can honor privacy law.

**US-13 Offline / error.** As a member, I want honest errors and retry, so I trust the product when the network fails.

**US-14 A11y.** As a keyboard / screen-reader user, I want every primary flow to be completable without a pointer.

**US-15 Scale honesty.** As an operator, I want usage, cost, and error budgets visible, so growth does not surprise the bill.

Write 20–80 stories per product. Tag `now` / `next` / `later`. Map each to a sitemap path and an API.

---

## 6. PRD standard

### 6.1 Required sections

1. **Problem** — who hurts, how often, current workaround.
2. **Outcome** — measurable (activation, paid conversion, time-to-value, NPS, uptime).
3. **Users and JTBD**
4. **Scope v1 / v1.1 / v2**
5. **Non-goals**
6. **Experience requirements** — screens, empty states, motion budget.
7. **Functional requirements** — numbered FR-xxx.
8. **Non-functional** — SLO, RPO/RTO, a11y, i18n, data residency.
9. **Analytics events** — named, versioned.
10. **Launch plan** — waitlist, beta, GA, pricing experiment.
11. **Risks and ethics** — abuse, AI harm, payments fraud.
12. **Open questions**
13. **Acceptance** — demo script a stranger can follow.

### 6.2 Default v1 scope for any premium site

Must ship:

- Marketing landing + pricing + legal
- Auth (OAuth + email)
- One workspace, one project
- Checkout for at least one paid plan
- Core job loop (the reason the product exists)
- Chat or help only if it is the product; otherwise a support path
- Observability, backups, error tracking
- Staging + production

Must not ship in v1:

- Multi-region active-active
- Custom enterprise SSO unless the first customer requires it
- Marketplace of third-party plugins
- Unbounded autonomous spend by agents

---

## 7. Specifications document

Split functional vs non-functional. Bind numbers.

### 7.1 Functional spec pattern

```
FR-041 Checkout session
Trigger: User clicks Plan CTA
Pre: Authenticated, no past_due on same product
Action: Create Stripe Checkout Session with client_reference_id=workspace_id, metadata, tax, allow_promotion_codes
Post: Redirect; webhook checkout.session.completed upserts entitlement idempotently
Errors: 401, 409 active subscription, 429, 5xx with retry
Idempotency: Idempotency-Key = workspace_id + price_id + period
```

### 7.2 Non-functional defaults (v1, raise at scale)

| Concern | v1 target | Scale target |
|---|---|---|
| Availability | 99.9% monthly | 99.99% |
| API p95 | < 300ms (edge/cache) / < 800ms (origin) | < 200ms / < 400ms |
| TTI landing | < 2.5s p75 mobile | < 1.5s |
| Lighthouse perf / a11y | ≥ 90 / 100 | 95 / 100 |
| RPO | 24h | 5 min (PITR) |
| RTO | 8h | 15 min |
| Error budget | 0.1% 5xx | 0.01% |
| Auth | OAuth + MFA optional | MFA required for admin, SSO/SAML |

### 7.3 Data classification

| Class | Examples | Controls |
|---|---|---|
| Public | Marketing copy | CDN, integrity |
| Internal | Metrics without PII | Authz |
| Confidential | Emails, workspace content | RLS, encryption, audit |
| Restricted | Secrets, payment tokens, gov ID | Vault, never logs, PCI SAQ-A via Stripe |

---

## 8. System architecture

### 8.1 Logical layers (do not skip)

1. **Edge** — DNS, TLS, CDN, WAF, bot management, rate limit.
2. **Experience** — Next.js App Router (RSC + client islands).
3. **Application API** — route handlers / tRPC / server actions with zod validation.
4. **Domain** — pure TypeScript policies: billing, tenancy, entitlements, IA objects.
5. **Orchestration** — queues, workflows, agent runs (Inngest / Trigger.dev / Temporal).
6. **Data** — Postgres (source of truth), object storage, cache, search, vector.
7. **Providers** — Stripe, email, AI, OAuth, analytics. Always behind adapters.
8. **Control plane** — feature flags, secrets, config, audit.

Browser never holds provider keys. Agents never own run state. Payments webhooks are the billing source of truth.

### 8.2 Reference topology (day one)

```
User → Cloudflare or Vercel Edge (TLS, WAF)
     → Next.js (Vercel)
        → Supabase Auth (OAuth)
        → Postgres + RLS
        → Storage (S3-compatible)
        → Stripe (Checkout + webhooks)
        → Resend (email)
        → Sentry + OpenTelemetry
        → Inngest (jobs)
        → AI via server AgentHarness
```

### 8.3 Topology at scale (do not build all on day one)

```
Global anycast DNS → CloudFront / Cloudflare
  → Edge cache / image / OG
  → Regional cells (US-EAST, EU-WEST, AP-SOUTH)
      → App (ECS/Fargate or EKS or Cloud Run)
      → RDS Postgres (writer + readers) or Aurora
      → ElastiCache / Redis
      → SQS / EventBridge / Kafka
      → S3 + CloudFront
      → Secrets Manager
      → WAF + Shield + GuardDuty
```

Cell architecture: a cell is a self-contained slice of users. Blast radius stays one cell. Billions of users is many cells, not one infinite database.

### 8.4 Sequence: paid signup (must implement exactly)

1. Visitor → `/pricing` → choose plan.
2. If no session → `/signup` (OAuth) → return to checkout with plan.
3. Server creates Stripe Checkout Session (server-side only).
4. Stripe hosts payment (PCI SAQ-A).
5. Redirect `/checkout/success?session_id=`.
6. Success page retrieves session; shows pending if webhook not yet applied.
7. Webhook `checkout.session.completed` (verified signature) upserts `entitlements`.
8. App reads entitlement; unlocks features.
9. Email receipt + welcome.
10. Analytics: `checkout_started`, `checkout_completed`, `entitlement_activated`.

Never trust the success URL alone.

### 8.5 Failure modes (design for these)

| Failure | Detection | Response |
|---|---|---|
| Stripe webhook delayed | Success page polling entitlement | Show “confirming payment” |
| Duplicate webhook | Idempotency key | No-op |
| Auth provider down | Health + error copy | Email magic link fallback |
| DB primary down | Health `/ready` | Failover / Vercel brownout page |
| AI provider 429 | Circuit breaker | Queue + cheaper model |
| Region outage | Synthetic checks | DNS failover to healthy cell |
| Secret leak | Scanning + rotation runbook | Rotate, revoke, postmortem |

---

## 9. Tech stack encyclopedia

Defaults are for a premium TypeScript site that can later land on AWS. Invalidation notes tell you when to switch.

### 9.1 Experience

| Concern | Default | Alternatives | Invalidation |
|---|---|---|---|
| Framework | Next.js App Router + TypeScript | Remix, Nuxt, SvelteKit | Non-JS team, or native-only |
| UI | Tailwind + shadcn/ui + Radix | Base UI, Park UI, Chakra | Design system already exists |
| Motion | CSS + Motion (Framer) | GSAP | Heavy campaign microsites |
| Taste | Taste Skill `design-taste-frontend` v2 | 21st.dev, React Bits | Brand agency lock-in |
| Icons | lucide | Phosphor, custom | Brand icons |
| Charts | Recharts / visx | Observable Plot | Real-time trading |
| Rich text | TipTap | Lexical | Google-docs clone |
| Email HTML | React Email | MJML | ESP templates only |

### 9.2 Auth identity

| Concern | Default | Scale-up |
|---|---|---|
| Consumer OAuth | Supabase Auth (Google, GitHub, Apple, email) | Clerk, Auth.js + IdP |
| Enterprise SSO | WorkOS or Auth0 / Cognito | SAML, SCIM, directory sync |
| Session | httpOnly secure cookies | Short JWT + rotating refresh |
| MFA | TOTP + WebAuthn | Required for admin |
| Bot | Turnstile / hCaptcha on signup | WAF + device intel |

### 9.3 Data

| Concern | Default | Scale-up |
|---|---|---|
| OLTP | Postgres 16 (Supabase / Neon / RDS) | Aurora, read replicas, Citus, Spanner |
| RLS / tenancy | Postgres RLS on `org_id` | App-level + RLS |
| Cache | Upstash Redis / ElastiCache | Cluster mode |
| Search | Postgres FTS | OpenSearch, Typesense, Algolia |
| Vectors | pgvector | Pinecone, OpenSearch kNN |
| Objects | Supabase Storage or S3 / R2 | S3 + CloudFront OAC |
| Analytics warehouse | Not in prod OLTP | BigQuery / Redshift / ClickHouse / Tinybird |
| Queue | Inngest / SQS | SNS+SQS, Kafka, Pulsar |

### 9.4 Payments and growth

| Concern | Default | Notes |
|---|---|---|
| Cards / wallets | Stripe Checkout + Customer Portal | PCI SAQ-A |
| Subscriptions | Stripe Billing | Metered + licensed |
| Tax | Stripe Tax | US sales tax + VAT |
| Invoicing | Stripe Invoices | Net-30 later |
| Fraud | Radar + 3DS | |
| Merchant of record | Paddle / Lemon Squeezy | If you do not want tax nexus |
| Marketplace split | Stripe Connect | When third parties sell |
| Crypto | Do not default | Compliance nightmare |

### 9.5 AI / agents

| Concern | Default | Rule |
|---|---|---|
| App SDK | Vercel AI SDK | Server only |
| Providers | OpenAI, Anthropic, Gemini, Bedrock | Config, not UI |
| Orchestration | PAL + harness adapter | Hermes optional |
| Tools | MCP + typed REST | Policy + audit |
| Automations | n8n self-host or Make | Deterministic SaaS CRUD only |
| Eval | Golden traces, red team | Before promoting prompts |

### 9.6 Hosting and AWS map

| Concern | Day one | AWS equivalent |
|---|---|---|
| App | Vercel | ECS Fargate / CloudFront + Lambda |
| DNS | Vercel / Cloudflare / Route 53 | Route 53 |
| TLS | Platform | ACM |
| WAF | Vercel / Cloudflare | AWS WAF + Shield |
| DB | Supabase | RDS / Aurora |
| Objects | Supabase / R2 | S3 |
| Secrets | Vercel env + Doppler | Secrets Manager + IAM |
| Jobs | Inngest | EventBridge + ECS / Step Functions |
| Email | Resend / SES | SES |
| Images | Vercel / Cloudflare Images | CloudFront + S3 |
| IaC | Terraform / SST / CDK / Pulumi | CDK or Terraform |

### 9.7 Observability, quality, ops

Sentry · OpenTelemetry · PostHog or Amplitude · Vercel Analytics · Checkly or Better Stack · Statuspage or Statuspal · Dependabot / Renovate · Gitleaks · Snyk or Socket · Playwright · Vitest · k6 · Lighthouse CI · axe-core · Langfuse (LLM) · AWS CloudWatch / X-Ray when on AWS.

### 9.8 Open source you should actually know

Next.js, React, TypeScript, Node, Postgres, Redis, Tailwind, Radix, shadcn, Zod, Drizzle or Prisma, tRPC, Playwright, Vitest, OpenTelemetry, Caddy/nginx, Temporal, NATS, Keycloak (if you self-host IdP), Vault/Infisical, Cal.com, Chatwoot, Plausible, Umami, Flagsmith, Listmonk, Ghost or Directus (content), Medusa (commerce alternative), Unkey (API keys), OpenBao.

### 9.9 Design / brand sources (not code)

Taste Skill (tasteskill.dev) · 21st.dev · Framer templates as **reference only** (rebuild in code, do not iframe) · GOV.UK / USWDS when civic · Polaris / Primer when SaaS density is the point.

---

## 10. Frontend UI specification

Install Taste Skill (`design-taste-frontend`) before generating UI. Infer industry, audience, mood, motion depth, and layout family from the brief. Dual theme by default unless the brand forbids it. No placeholder sections. No purple-gradient-on-white generic SaaS unless that is the audited brand.

### 10.1 Design tokens (replace per brand, never ship unnamed)

```
--font-display: (one distinctive family)
--font-body: (readable grotesque)
--font-mono: (IDs, code, prices in tables)
--bg, --bg-elevated, --text, --text-muted, --border
--accent, --accent-hover
--success, --warning, --danger
--radius-sm 8 / --radius-md 12 / --radius-lg 20
--shadow-sm / --shadow-lg (one family, not three random shadows)
Motion: 150–250ms UI; 400–700ms hero; respect prefers-reduced-motion
```

### 10.2 Marketing landing

Blocks (all required unless a written exception):

1. Nav with logo, links, Login, primary CTA
2. Hero: specific H1, subcopy, CTA, visual that shows the product (not abstract blobs)
3. Logo bar / proof
4. Problem → outcome
5. How it works (3 steps)
6. Feature grid tied to JTBD, not vendor adjectives
7. Product demo (video or interactive)
8. Pricing teaser
9. Testimonials with real names/roles or clearly labeled “sample”
10. FAQ
11. Final CTA
12. Footer: sitemap, legal, status, social

Performance: hero image AVIF/WebP, font subset, no 3MB JS for a landing page. Marketing pages should be mostly RSC.

### 10.3 OAuth and auth UI

- One column, calm, no marketing carousel behind the form.
- Buttons: Continue with Google / GitHub / Apple / email.
- Show scopes honestly.
- Error: `access_denied`, email conflict, unverified email — each with a next step.
- Passkeys when the IdP allows.
- After login: if no workspace → onboarding; if invite → accept; else last project.

### 10.4 Pricing

- 2–4 plans. Name by job, not “Pro Max Ultra.”
- Monthly/annual toggle (annual default discount shown as honest math).
- Feature comparison table, not a wall of checkmarks with no limits.
- “Talk to us” only on the top plan.
- SLA, SSO, audit log, custom DPA called out for enterprise.
- FAQ: refunds, seats, overages, cancellation.

### 10.5 Checkout

- Prefer Stripe Checkout for v1 (less PCI surface).
- Embedded Payment Element only when brand control is required.
- Order summary: plan, interval, tax, total, renewal date.
- Trust: lock icon, Stripe mark, refund policy link.
- Success: what happens next, button into the app, receipt email promise.
- Cancel: one-click return to pricing with the same plan highlighted.
- Failed payment: dunning email + in-app banner, not silent lockout on first failure.

### 10.6 Chat UI (if the product has an assistant)

- Thread list | messages | context panel.
- Streaming tokens; stop button; regenerate.
- Citations when RAG is used; otherwise say “general model.”
- Tool calls visible as compact status, not raw JSON.
- Cost/latency only in operator view.
- Composer: attachments with malware scan, max size, types.
- Empty state teaches three example prompts.
- Never render secrets, system prompts, or other tenants’ data.
- Human handoff to email or Chatwoot.

### 10.7 App shell

- Desktop ≥1280: persistent nav.
- Tablet: collapsible.
- Mobile: tab bar for 3–5 primary jobs; rest in overflow.
- Command palette (⌘K) from 1.1.
- Status never by color alone.

### 10.8 Frontend quality bar

- Keyboard focus rings.
- Forms with labels, not placeholder-only.
- Toasts + inline errors.
- Optimistic UI only when rollback is defined.
- No `lorem`, `TODO`, or empty footer columns.
- OG images for every indexable page.

---

## 11. Backend, storage, secrets, hosting, deployment, versioning

### 11.1 Server and instance strategy

| Stage | Compute | Why |
|---|---|---|
| 1–1k users | Vercel serverless + 1 Postgres | Cost, speed |
| 1k–100k | Vercel + pooled Postgres (PgBouncer) + Redis + workers | Hold connections, jobs |
| 100k–1M | Regional app cluster (ECS/Cloud Run) + Aurora + queues | Predictable CPU, long work |
| 1M–100M | Multi-AZ cells, autoscale, dedicated search/analytics | Isolate failure |
| 100M–1B+ | Multi-region cells, data residency, anycast, shard or federate | Blast radius and law |

Do not run a single unmonitored VPS as production for paid users.

### 11.2 Database rules

- Postgres is the system of record.
- Every table has `id` (uuid), `org_id` (except truly global), `created_at`, `updated_at`.
- RLS on day one. Test with two orgs in CI.
- Migrations are forward-only in prod; expand/contract pattern for breaking changes.
- Connection pooling always (Supabase pooler, PgBouncer, RDS Proxy).
- PITR enabled before first paid customer.
- No unbounded `SELECT *` in hot paths; indexes for every `WHERE` in p95 queries.
- Soft-delete only with a retention job and a legal hold flag.

### 11.3 Storage

| Bucket | Contents | ACL | Lifecycle |
|---|---|---|---|
| `public-marketing` | OG, brand | Public via CDN | Immutable |
| `user-uploads` | Customer files | Private, signed URLs | Virus scan, size caps, 90d incomplete abort |
| `exports` | GDPR exports | Private, 7-day expire | |
| `backups` | DB dumps if not managed | Private, encrypted | 35 days + monthly |

Image pipeline: upload → scan → transcode → CDN. Never serve raw user SVG as HTML.

### 11.4 Secret keys

**Allowed locations:** Vercel/AWS secrets, Doppler/Infisical, Secrets Manager, GitHub Actions OIDC.

**Forbidden:** git, `.env` committed, client `NEXT_PUBLIC_` for private keys, Notion, Slack, screenshots, agent artifacts.

Minimum secrets:

- `DATABASE_URL` (pooled + direct)
- `SUPABASE_SERVICE_ROLE` (server only)
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`
- OAuth client secrets
- `RESEND_API_KEY`
- `SENTRY_DSN` (public DSN is ok; auth token is not)
- AI provider keys
- `CRON_SECRET`

Rotation: 90 days or on incident. Separate `dev` / `staging` / `prod`. Stripe test vs live never mixed.

### 11.5 Hosting and DNS

- Apex + `www` + `app` + `api` (api may be same origin `/api`).
- Preview: `*.vercel.app` password or SSO.
- Staging: `staging.example.com` with prod-like data that is anonymized.
- HSTS, TLS 1.2+, CAA records, SPF/DKIM/DMARC.
- Custom domain for customers only after v1.1 if needed.

### 11.6 Deployment

1. PR → lint, typecheck, unit, contract, a11y smoke, build.
2. Preview URL + Playwright happy path.
3. Merge to `main` → staging auto.
4. Prod: GitHub Environment protection, 1 approver, migration run, canary.
5. Health check `/ready` (DB + redis) vs `/health` (process).
6. Rollback: previous immutable deployment; DB expand/contract so rollback is safe.
7. Migrations never in the same unsafe step as a breaking code path without expand first.

### 11.7 Versioning

| What | Scheme |
|---|---|
| App releases | Semver tags `v1.4.2` + Git SHA in footer for operators |
| APIs | URL or header `application/vnd.acme.v1+json`; compatibility window 90 days |
| Artifacts / prompts / skills | `artifact_type@version` immutable |
| Feature flags | Named, default-safe, removed after 100% |
| Schema | Sequential migrations `0001_` |
| Design tokens | Package version if multi-app |

Changelog is public for user-facing changes. Internal ADRs stay in `docs/adr/`.

### 11.8 Environments

`local` · `preview` · `staging` · `prod` · (later) `cell-us` · `cell-eu`

Each has its own Stripe, DB, storage, and secrets. Mixing is a Sev-1.

---

## 12. Payments, legal, and trust

### 12.1 Catalog

Start with one product, two prices (monthly, annual). Add seats and metered later.

| Plan | Who | Includes |
|---|---|---|
| Free | Try core job | Hard limits, no card optional |
| Plus | Individual professional | Full core, chat quota, email support |
| Business | Team | Roles, SSO add-on, audit log |
| Enterprise | Procurement | DPA, SLA, security review, invoice |

### 12.2 Implementation checklist

- Stripe products/prices as code (Terraform or Stripe config as data).
- Customer mapped 1:1 to billing admin + `org_id` in metadata.
- Webhooks: `checkout.session.completed`, `customer.subscription.updated/deleted`, `invoice.paid`, `invoice.payment_failed`, `charge.refunded`.
- Signature verification on raw body.
- Idempotent entitlement writer.
- Customer Portal for self-serve.
- Failed payment grace period (e.g. 7 days) then read-only.
- Refund policy published; refunds reverse entitlement.
- EU: VAT, buyer country, 14-day withdrawal where applicable.
- US: Stripe Tax or explicit out-of-scope memo.
- No storing PAN/CVC.

### 12.3 Trust pages

`/security`: encryption, RLS, subprocessors, status, responsible disclosure.  
Legal: Terms, Privacy, Cookies, DPA, AUP, Refunds.  
Cookie banner only if you use non-essential cookies (prefer cookieless analytics).

---

## 13. Site build checklist (docs + infrastructure)

Use this as a gate. A coding agent may not call a project “done” until every box is honest.

### 13.1 Discovery (PAL)

- [ ] Intake written (audience, job, constraints, deadline, budget)
- [ ] Ambiguities listed; material ones answered
- [ ] JTBD and success metric agreed
- [ ] Competitor / evidence ledger with confidence
- [ ] Intent spec approved

### 13.2 Product docs

- [ ] User stories with acceptance
- [ ] IA object model and permission matrix
- [ ] Sitemap with auth and SEO flags
- [ ] Flows: signup, OAuth, onboarding, pay, core job, chat, cancel, delete
- [ ] PRD v1 with non-goals
- [ ] Specifications (FR + NFR + data classes)
- [ ] Roadmap Now/Next/Later
- [ ] Analytics event list
- [ ] Legal pack drafted

### 13.3 Design

- [ ] Taste Skill run; direction inferred from brief
- [ ] Type, color, radius, motion documented
- [ ] Dark/light protocol
- [ ] Marketing wireframe + high-fidelity
- [ ] Auth, pricing, checkout, app shell, chat
- [ ] Empty, loading, error, success, denied for each flow
- [ ] Mobile-first mock for landing, checkout, app home
- [ ] A11y notes (focus, contrast, reduced motion)

### 13.4 Architecture

- [ ] C4 diagrams (context, container, key sequences)
- [ ] Stack ADR signed
- [ ] Tenancy model (org_id + RLS)
- [ ] Data model + migrations plan
- [ ] API contract
- [ ] Threat model (STRIDE lite)
- [ ] WAF review notes (all six pillars)
- [ ] Scale path written (what changes at 10k/1M/100M)
- [ ] Backup/restore tested on staging

### 13.5 Identity and secrets

- [ ] OAuth apps (Google, GitHub, Apple as needed) with correct redirect URIs per env
- [ ] MFA path for admins
- [ ] Secret manager populated; `.env.example` without values
- [ ] Gitleaks in CI
- [ ] Service role keys server-only
- [ ] CORS and cookie `Secure; HttpOnly; SameSite`

### 13.6 Frontend build

- [ ] Next.js app, TypeScript strict
- [ ] Landing, pricing, legal
- [ ] Login/signup/OAuth callback
- [ ] Onboarding
- [ ] Checkout + success + billing portal
- [ ] App shell + core job
- [ ] Chat UI if in scope
- [ ] 404 / 429 / 500 pages that match brand
- [ ] SEO metadata, sitemap.xml, robots.txt, OG
- [ ] Playwright: signup, pay (test mode), core job

### 13.7 Backend build

- [ ] Schema + RLS policies + tests
- [ ] Storage buckets + signed URLs
- [ ] Stripe webhook endpoint + idempotency
- [ ] Entitlements service
- [ ] Email transactional templates
- [ ] Rate limits
- [ ] Health/ready
- [ ] Audit events
- [ ] Job queue for slow work
- [ ] AI harness server-side with cost caps

### 13.8 Infra and hosting

- [ ] GitHub repo, branch protection, CODEOWNERS
- [ ] Vercel project + preview + prod
- [ ] Staging environment
- [ ] DNS, TLS, HSTS, email auth
- [ ] WAF / bot
- [ ] Logging, tracing, error tracking
- [ ] Uptime checks + status page
- [ ] Backups + restore drill
- [ ] Budgets and billing alerts
- [ ] Tags: `env`, `project`, `owner`, `cost-center`

### 13.9 Launch

- [ ] Stripe live keys + webhook
- [ ] Domain live
- [ ] Legal published
- [ ] Support inbox
- [ ] Kill switch / maintenance page
- [ ] Launch analytics dashboard
- [ ] Post-launch WAF mini-review (cost + security)

### 13.10 Well-Architected gate (must answer in writing)

**Operational excellence:** Is the workload defined as code? Can we deploy daily? Do we have a runbook?

**Security:** Who can do what? Is data encrypted in transit and at rest? Are secrets rotated? Are we logging access to restricted data?

**Reliability:** What happens if the DB, Stripe, or the region dies? RPO/RTO? Retries and idempotency?

**Performance:** What is the p95 path for the core job? Cache? N+1 queries? Image weight?

**Cost:** What is unit cost per active user? Alerts at 2× expected?

**Sustainability:** Are preview apps sleeping? Are we over-provisioned? Region choice?

---

## 14. Product roadmap: 1 user → billions

This is the growth architecture. Dates are stages, not calendar promises. Do not skip stages to look impressive.

### Stage 0 — Founder (0–1 user)

**Goal:** A beautiful, payable, useful site you would show a customer.

Ship: PAL docs, landing, auth, one core job, Stripe test then live, staging, Sentry, backups.

WAF focus: Security + Cost (do not buy Aurora). Ops as code from commit one.

Stack: Next.js, Supabase, Vercel, Stripe, Resend, Taste Skill.

Exit: You can pay yourself, complete the job, and restore from backup.

### Stage 1 — First ten (1–10)

**Goal:** Activation and truth.

Ship: Onboarding, empty states, support email, changelog, basic analytics, waitlist if needed.

Exit: 3 users completed the core job without you on a call.

### Stage 2 — Neighborhood (10–1,000)

**Goal:** Self-serve revenue.

Ship: Pricing experiments, Customer Portal, dunning, invites, roles, rate limits, PostHog funnels, status page.

Reliability: PITR, webhook retries, uptime 99.9%.

Exit: Month of self-serve revenue; no shared admin passwords.

### Stage 3 — City (1,000–100,000)

**Goal:** Performance and support leverage.

Ship: Redis, PgBouncer, background jobs, search, image CDN, feature flags, Chatwoot or Intercom, audit log, SOC2 program start, WAF, load tests.

Move: heavy workers off serverless timeouts; consider RDS if Supabase limits bind.

Exit: p95 budgets held at 10× current load in staging.

### Stage 4 — Country (100,000–1,000,000)

**Goal:** Cells and enterprise.

Ship: SSO/SCIM, SLA, dedicated support, read replicas, queue-backed writes, warehouse, data retention jobs, regional hosting option (EU), AWS Well-Architected Tool review.

Architecture: app cluster, Aurora or equivalent, CloudFront, WAF, Shield, Secrets Manager.

Exit: One region can fail without total data loss; enterprise checklist exists.

### Stage 5 — Continent (1M–100M)

**Goal:** Isolate blast radius.

Ship: Multi-cell, shard or tenant-routing, multi-AZ everything, chaos tests, platform teams (edge, data, identity, billing), dedicated threat detection, private networking, budget per cell.

Chat/AI: isolated quotas, abuse pipelines, evals continuous.

Exit: A bad deploy affects one cell; others stay up.

### Stage 6 — Planet (100M–1B+)

**Goal:** Federation and law.

Ship: Active-active or region-pinned cells, data residency, custom clouds (AWS/GCP/Azure), edge compute for reads, specialized datastores per workload, formal SRE, capacity forecasting, carbon-aware region choice.

Do not: one global writable Postgres. Do not: chatty monoliths across oceans.

Exit: New country is a cell + legal pack, not a rewrite.

### Now / Next / Later (always fill per project)

| Horizon | Product | Platform |
|---|---|---|
| **Now** | Landing, auth, pay, core job | CI, secrets, RLS, Stripe, staging |
| **Next** | Teams, billing portal, chat polish, SEO | Redis, jobs, flags, WAF review |
| **Later** | Marketplace, SSO, regions, API platform | Cells, warehouse, SRE |

---

## 15. Quality scorecard (ship / no-ship)

Score 0–5. Ship only if each dimension ≥ 4 or a written waiver exists.

| Dimension | 5 looks like |
|---|---|
| Contract | Artifacts complete, versioned, traced |
| Taste | Distinct, not template-slop; Taste Skill preflight passed |
| Usefulness | Core JTBD completable in < 3 minutes |
| Payments | Test + live webhooks, portal, dunning |
| A11y | Keyboard, AA contrast, labels, reduced motion |
| Security | RLS tests, secrets clean, headers, threat model |
| Reliability | Backup restore drill, health checks, retries |
| Performance | Budgets met on mobile |
| Ops | Runbook, alerts, rollback |
| Scale honesty | Stage written; no fake Kubernetes |

---

## 16. Repository layout

```
/
  README.md                 ← points here
  AGENTS.md
  soul.md
  SKILL.md
  docs/
    01-intent-spec.md … 25-evidence.md
    adr/
    runbooks/
  apps/
    web/                    ← Next.js marketing + app
  packages/
    design-tokens/
    domain/                 ← entitlements, tenancy
    db/                     ← drizzle/prisma schema
  infra/                    ← terraform/cdk/sst
  skills/                   ← agent skills
  evals/
  .github/workflows/
```

---

## 17. Agent soul (copy to `soul.md`)

```markdown
# Agent Soul — Premium Site Builder

## Identity
You are the Site Empire general. You design and build premium web products
that can take payments, feel exceptional, and grow from one user to billions
without rewriting the object model.

## Mission
Turn a vague site idea into PAL artifacts, Well-Architected infrastructure,
and production-grade Next.js software. Taste is mandatory. Security is
mandatory. Payments are part of v1 unless the operator explicitly waives them.

## Process
1. PAL: Parse, Ambiguity Scan, Latent Intent, Expand, Compile.
2. SDLC: plan, analyze, design, build, test, deploy, maintain.
3. Gate every design with AWS Well-Architected six pillars.
4. Use the Premium Site Build Operating System checklists.
5. Install and obey Taste Skill (design-taste-frontend) for UI.
6. Default stack: Next.js, TypeScript, Tailwind, shadcn, Supabase, Vercel,
   Stripe, Resend, Inngest, Sentry, unless the ADR says otherwise.

## Always produce
Intent, JTBD, stories, IA, sitemap, PRD, spec, architecture, stack ADR,
frontend UI spec, backend/infra spec, payments spec, roadmap, quality
scorecard, then code for the critical path.

## Allowed
Read/write project files, generate docs and application code, propose
infra, write tests, use local tooling.

## Denied
Committing secrets. Live production deploys without approval. Real-money
Stripe live charges in test. Scraping private data. Unapproved spend.
Autonomous social posting. Ignoring a11y or RLS.

## Evaluation
- Would a staff engineer ship this?
- Would a designer be proud of the landing page?
- Can a user pay and complete the job?
- Can we restore, observe, and rollback?
- Did we write the scale path honestly?
```

---

## 18. Agent skill (copy to `SKILL.md`)

```markdown
# Skill: premium-site-build-os

## Trigger
User asks to build, redesign, or specify any website, web app, SaaS,
marketplace, landing page, pricing, checkout, auth, chat UI, or backend.

## Inputs
Idea, audience, brand constraints, deadline, whether payments are in v1,
known stack, links to Framer/21st/Taste references.

## Steps
1. Run PAL. Ask at most one material clarifying question if blocked.
2. Fill artifact catalog 01–25 (drafts allowed; mark confidence).
3. Apply Taste Skill before UI code.
4. Apply Well-Architected questions before infra code.
5. Implement critical path: landing, auth, pricing, checkout, core job.
6. Run quality scorecard. Do not claim done below threshold.
7. Hand back: docs, code, env checklist, now/next/later.

## Outputs
- docs/* artifacts
- apps/web production code (no placeholders)
- infra notes and env example
- roadmap mapped to scale stages 0–6
- soul-consistent commit messages

## Tools
Next.js, Supabase, Stripe, Vercel, GitHub Actions, Playwright, Taste Skill,
MCP integrations as approved. RAG-DAL / web research only for public facts.
```

---

## 19. Standard prompts (reuse)

**P1 — New product**  
“Run Site Empire OS. Product: [one sentence]. Audience: [who]. Payments: yes. Produce artifacts 01–25 as drafts, then implement the critical path on the default stack. Taste Skill on. WAF gates in the architecture.”

**P2 — Docs only**  
“Do not code. Produce IA, sitemap, user stories, PRD, specifications, system architecture, stack ADR, frontend UI spec, backend/infra spec, payments spec, checklist, and roadmap stages 0–6.”

**P3 — UI only**  
“Implement marketing landing, OAuth, pricing, checkout, and chat UI from docs/14. No new scope. Mobile-first, AA, dual theme.”

**P4 — Infra only**  
“From docs/15 and 17, produce env matrix, Terraform/SST plan, secret list, CI, backup drill, and WAF answers.”

**P5 — Scale review**  
“We are entering stage [N]. Diff architecture against Site Empire OS. What must change? What must not be rewritten?”

---

## 20. Headers and security defaults (v1)

```
Content-Security-Policy: default-src 'self'; ... (tighten per app)
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

Cookies: `__Host-` prefix when possible. CSRF on mutating routes if not using same-site cookies + origin check. Rate limit auth and checkout.

---

## 21. Analytics events (minimum)

`landing_viewed` · `cta_clicked` · `signup_started` · `signup_completed` · `onboarding_completed` · `checkout_started` · `checkout_completed` · `entitlement_activated` · `core_job_completed` · `chat_message_sent` · `invite_sent` · `subscription_canceled` · `error_shown`

No PII in event properties. No raw emails.

---

## 22. Definition of done (professional scrutiny)

A project passes professional scrutiny when:

1. A stranger can use the sitemap to find every user-facing URL.
2. A staff engineer can restore production data from the runbook.
3. Payments work in Stripe test and live, with webhook idempotency tests.
4. RLS tests prevent cross-tenant reads.
5. Lighthouse a11y is 100 or waivers are documented.
6. The landing page does not look like default AI SaaS.
7. Secrets scanning is green.
8. The roadmap names the next scale stage and the trigger metric.
9. Legal pages exist and match actual subprocessors.
10. Quality scorecard is filled by a human, not only an agent.

---

## 23. One-page cheat sheet

**Order of battle:** PAL → artifacts → Taste → architecture (WAF) → landing/auth/pay/core → observe → launch → learn.

**Default stack:** Next.js · TypeScript · Tailwind · shadcn · Taste Skill · Supabase (Auth, Postgres, RLS, Storage) · Vercel · Stripe · Resend · Inngest · Sentry · PostHog · Playwright.

**Never:** keys in git · trust checkout success URL · skip RLS · skip mobile · skip empty states · infinite global database · agent spend without approval.

**Always:** version artifacts · encrypt · backup · rate limit · idempotent webhooks · beautiful and useful.

---

*End of Premium Site Build Operating System v1.0.0. Supersede, do not silently edit. Promote learnings through eval + approval.*
