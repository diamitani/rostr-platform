---
name: what-is-the-software-life-cycle-development-proces-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with what_is_the_software_life_cycle_development_proces. Use when working with what_is_the_software_life_cycle_development_proces."
---

<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# What is the software life cycle development process

The **software development life cycle** (SDLC) is the structured path a product takes from idea to a live system you keep improving: plan, analyze, design, build, test, deploy, and maintain.[^1_1][^1_2]

Teams use it so work stays aligned with user needs, quality, security, cost, and schedule instead of jumping straight into code.[^1_3]

## Seven phases

Most models use these stages, even if they rename or overlap them.[^1_4][^1_1]

- **Planning:** Set scope, goals, budget, timeline, and risks.
- **Analysis:** Confirm the idea is feasible and write requirements (what the system must do, plus security, performance, and accessibility).
- **Design:** Turn requirements into architecture, UI, data models, APIs, and security controls.
- **Development:** Write and review code against that design, usually with Git and automated checks.
- **Testing:** Prove it works with unit, integration, system, security, and user-acceptance tests.
- **Deployment:** Release to production, often with CI/CD, gradual rollout, and live monitoring.
- **Maintenance:** Patch bugs, improve performance, add features, and retire unused work.

Example: a banking app would specify transfers and fraud controls in analysis, design the ledger and UI in design, then keep monitoring and patching after launch.[^1_3]

## Common models

SDLC is the overall cycle. A model is how you walk that cycle.[^1_5][^1_1]


| Model | How it runs | Best when |
| :-- | :-- | :-- |
| Waterfall | Finish one phase before the next | Requirements are stable and audited |
| Agile | Short sprints with frequent feedback | Scope will change, as with most products |
| Iterative | Ship a thin version, then refine | You need a working slice early |
| Spiral | Repeat plan, risk review, build, evaluate | High-risk or regulated systems |
| DevOps / DevSecOps | Automate build, test, security, and release | You ship continuously and treat security as part of delivery |

Agile and DevOps still use the same phases; they just repeat them in smaller loops instead of one long waterfall.[^1_2][^1_5]

## Why teams use it

A clear lifecycle reduces rework, makes roles and deliverables obvious, and catches defects before they become expensive.[^1_6][^1_3]

Security belongs in every phase, not after launch: least-privilege access, encryption, automated scanning in CI/CD, and continuous monitoring.[^1_1][^1_3]

On AWS, those same phases should be judged against the Well-Architected pillars: operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability.[^1_7]

## How this maps to building

In this Website Builder project, PAL is the planning-and-design front of SDLC, and the production loop is the rest of it.[^1_8][^1_9]

- **Plan / analyze:** Intake becomes an intent spec, jobs-to-be-done, and a bounded PRD.
- **Design:** Architecture, stack decisions, and instruction packs before coding.
- **Build / test:** Contracts, schema, APIs, UI, then lint, types, tests, and quality gates.
- **Deploy:** Preview, canary, then production on Vercel with durable workers and Supabase as system of record.
- **Maintain:** User corrections become candidate lessons, evaluated and approved before they change production behavior.

That is SDLC in practice: do not skip requirements or design, do not treat “done” as the last deploy, and do not change live systems without tests, monitoring, and an approval path.

<span style="display:none">[^1_10][^1_11][^1_12][^1_13][^1_14][^1_15][^1_16][^1_17][^1_18][^1_19][^1_20][^1_21][^1_22]</span>

<div align="center">⁂</div>

[^1_1]: https://www.salesforce.com/ap/platform/software-development/lifecycle/

[^1_2]: https://fullscale.io/blog/software-development-life-cycle/

[^1_3]: https://www.geeksforgeeks.org/software-engineering/software-development-life-cycle-sdlc/

[^1_4]: https://evincedev.com/blog/software-development-life-cycle-comprehensive-guide/

[^1_5]: https://www.skmgp.com/blog/development-processes-and-models-from-sdlc-to-agile-practices

[^1_6]: https://www.csinow.edu/blog/what-is-software-development-lifecycle-why-is-it-important/

[^1_7]: https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html

[^1_8]: palbuild/continuous-production-loop.md

[^1_9]: palbuild/intent-spec.md

[^1_10]: palbuild/architecture-blueprint.md

[^1_11]: palbuild/architecture.md

[^1_12]: palbuild/build-playbook.md

[^1_13]: palbuild/jtbd-report.md

[^1_14]: https://aws.amazon.com/blogs/architecture/announcing-the-updated-aws-well-architected-machine-learning-lens/

[^1_15]: https://www.coursera.org/articles/software-development-life-cycle

[^1_16]: https://www.hyperglance.com/blog/aws-well-architected/

[^1_17]: https://www.scnsoft.com/software-development/software-development-models

[^1_18]: https://www.geeksforgeeks.org/cloud-computing/aws-well-architected-framework/

[^1_19]: https://nix-united.com/blog/aws-well-architected-framework-guide/

[^1_20]: https://blackthorn-vision.com/blog/software-development-methodologies/

[^1_21]: https://dev.to/aws-builders/identify-design-principles-of-the-aws-cloud-jo

[^1_22]: https://nucitrus.com/top-8-software-development-life-cycle-models/


---

# Please incorporate this process with every artifact and prompt I’ve asked you about software (information architecture, system architecture, user stories, site map, Prd, specifications document, tech stack, product roadmap, front end ui (marketing site oauth, landing page, pricing, check out, chat ui) and backend (storage, database, secret keys, instance, server, hosting, deployment, versioning, etc) create a site build checklist for all docs and infrastructure and a roadmap based on these and well architected framework principles, so I can use as a guide or read me or soul.md or skill .md in all future projects and produce any rype of site at a premium (able to take payments, design user friendly, functionality exceptional, useful beautiful, etc) and can take that growth from 1 user to billions. All the tools, platforms, open source etc. a comprehensive list no less than ten pages or the required minimum to pass professional level scrutiny . do your best soldier. Become a general. Master the kingdom and be the emperor.

You now have a Site Empire operating system: a full artifact catalog, infra checklist, Well-Architected gates, and a 1-user-to-billions roadmap you can drop in as README, `soul.md`, or `SKILL.md`. The longform guide is the markdown OS document; the soul and skill files are the agent-ready extracts.

\<pal_processing>
Parse: reusable OS covering SDLC + every named artifact (IA, architecture, stories, sitemap, PRD, specs, stack, roadmap, marketing/OAuth/pricing/checkout/chat, backend/secrets/hosting/versioning), WAF, payments, taste, scale.
Ambiguity: product-agnostic by design; defaults to Next.js/Supabase/Vercel/Stripe unless an ADR overrides.
Latent intent: one professional system so future agents ship payable, beautiful, scalable sites without reinventing process.
Expand: PAL × SDLC × six WAF pillars; 25 artifacts; stages 0–6; Taste Skill UI bar.
Compile: OS + soul + skill as canonical files; specs below are the compressed control plane.
\</pal_processing>

## What you got

The OS is the system of record: PAL before code, 25 versioned artifacts, frontend and backend checklists, Stripe-as-source-of-truth payments, Taste Skill anti-slop UI, and AWS Well-Architected gates on every workload.[^2_1][^2_2][^2_3][^2_4]

Copy `soul.md` into agent identity and `SKILL.md` into Cursor / Claude Code / Codex. Keep the OS file in `docs/` or repo root and point `README.md` at it.

## How to run a project

Order of battle: PAL → artifacts 01–25 → Taste Skill → architecture (six pillars) → landing / OAuth / pay / core job → observe → launch → learn.[^2_3][^2_5][^2_6]

Default stack stays boring on purpose: Next.js, TypeScript, Tailwind, shadcn, Supabase (Auth, Postgres, RLS, Storage), Vercel, Stripe Checkout + Customer Portal, Resend, Inngest, Sentry, Playwright. Scale later by topology (pooler, Redis, cells, Aurora), not by rewriting org / user / entitlement.[^2_7][^2_8]

## Growth path

| Stage | Users | Ship | Do not |
| :-- | :-- | :-- | :-- |
| 0–1 | Founder | Docs, landing, auth, one job, Stripe, backup | Kubernetes theater |
| 2 | 10–1k | Portal, dunning, invites, 99.9% | Shared admin passwords |
| 3 | 1k–100k | Redis, jobs, WAF, load tests | Unpooled Postgres |
| 4–5 | 100k–100M | Cells, SSO, replicas, SRE | One infinite DB |
| 6 | 100M–1B+ | Region-pinned cells, residency | Cross-ocean chatty writes |

\<ui_ux_spec>
Typography: one distinctive display family, readable grotesque body, mono for IDs/prices. Dual theme by default. Motion 150–250ms UI, respect reduced-motion. Taste Skill `design-taste-frontend` v2 is mandatory; no generic AI-SaaS slop.

Color: brand canvas + ink text + one accent; semantic success/warning/danger. Status never by color alone. WCAG 2.2 AA.

Flows: Visitor → landing (5-second promise) → OAuth/email → onboarding → pricing → Stripe Checkout (webhook grants entitlement) → core job. Chat is a product surface or a handoff, never a key-leaking toy. Empty/loading/error/success/denied on every money, identity, and data screen.

Sitemap clusters: marketing (`/`, `/pricing`, `/legal/*`), auth (`/login`, `/auth/callback`, `/onboarding`), commerce (`/checkout`, `/billing`), app (`/app/[workspace]`, `/app/.../chat`), technical (`/api/webhooks/stripe`, `/health`, `/ready`).
\</ui_ux_spec>

\<architecture_spec>
Frontend: Next.js App Router, RSC for marketing, client islands for checkout/chat. Backend: domain services for tenancy and entitlements; Postgres + RLS as source of truth; object storage with signed URLs; Redis/jobs at stage 3; Stripe webhooks idempotent; secrets in vault only.

WAF on every artifact: ops as code and runbooks; least-privilege IAM/MFA/encryption/audit; backups, health checks, retries; measure then cache; tags and kill idle; high utilization and no zombie previews.[^2_2][^2_1]

Control plane: feature flags, versioned artifacts (`org/project/run/type/version`), PAL quality gate before “done.” Browser never holds provider keys. Success URL is not billing truth.
\</architecture_spec>

\<implementation_guide>

1. Place the OS at repo root; copy soul and skill into `soul.md` and `SKILL.md` (or `AGENTS.md`).
2. `npx create-next-app@latest apps/web --typescript --tailwind --app --eslint`
3. Add Supabase, Stripe, Resend, Sentry, Playwright. Put secret *names* in `.env.example`; values only in Vercel/Doppler/Secrets Manager.
4. Run prompt P1 from the OS for a new product, P2 for docs-only, P5 for a scale review.
5. Do not merge until the quality scorecard is ≥4/5 on taste, payments, a11y, RLS, restore drill, and WAF answers.
\</implementation_guide>

\<component_code>
The production control-plane files are already generated: the full OS document, `soul.md`, and `SKILL.md`. Do not paste secrets or live Stripe keys. Next implementation slice, when you name a product, is landing + OAuth + pricing + webhook-verified checkout on that stack.
\</component_code>

Start the next build with: “Run Site Empire OS. Product: [one sentence]. Payments: yes.” I will fill artifacts 01–25 and implement the critical path instead of inventing a new process.

<span style="display:none">[^2_10][^2_11][^2_12][^2_13][^2_14][^2_15][^2_16][^2_17][^2_18][^2_19][^2_20][^2_21][^2_22][^2_23][^2_9]</span>

<div align="center">⁂</div>

[^2_1]: https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html

[^2_2]: https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html

[^2_3]: https://tasteskill.dev/

[^2_4]: palbuild/rostr-core-principles.md

[^2_5]: https://www.salesforce.com/ap/platform/software-development/lifecycle/

[^2_6]: palbuild/continuous-production-loop.md

[^2_7]: https://www.agilesoftlabs.com/blog/2026/03/best-saas-tech-stack-architecture-2026

[^2_8]: palbuild/stack-decision-record.md

[^2_9]: https://aws.amazon.com/blogs/architecture/the-hidden-price-tag-uncovering-hidden-costs-in-cloud-architectures-with-the-aws-well-architected-framework/

[^2_10]: https://www.cloud4c.com/blogs/six-pillars-of-well-architected-frameworks-designing-high-performant-cloud-landscapes

[^2_11]: https://www.x-cmd.com/install/taste-skill/

[^2_12]: https://www.webbrandify.com/blog/saas-architecture-scaling-2026

[^2_13]: https://www.linkedin.com/posts/aridanemartin_aiagents-agentskills-aiworkflows-activity-7466827514829729792-ImoK

[^2_14]: https://www.threads.com/@naveed_ullah600/post/DU9gPBZDAIL/built-with-the-tiny-fish-api-tiny-skills-turns-parallel-ai-agents-into-an?hl

[^2_15]: https://wrappixel.com/blog/best-saas-boilerplates

[^2_16]: https://startupa.ge/blog/best-tech-stack-saas-2026

[^2_17]: https://www.linkedin.com/pulse/understanding-aws-well-architected-framework-y00fc

[^2_18]: https://dev.to/the_nortern_dev/the-5-vps-saas-playbook-a-practical-nextjs-15-setup-no-vercel-no-supabase-no-clerk-1kg8

[^2_19]: https://www.linkedin.com/posts/huduhamed_stripe-saas-nodejs-activity-7439203990749396992-EVvu

[^2_20]: https://tutorialsdojo.com/aws-well-architected-framework-six-pillars/

[^2_21]: projects.pal_website_builder

[^2_22]: https://www.geeksforgeeks.org/cloud-computing/aws-well-architected-framework/

[^2_23]: https://dev.to/aws-builders/identify-design-principles-of-the-aws-cloud-jo


---

# How do I build a project management system to do this manually? Walk into my asana @Asana and build out a template project that I can use, then build a master scaffolding template in GitHub @GitHub create a new repo. Make sure pal process and rostr is incorporated every step of the way (intent analysis, JTBD, NPAO, build package, etc). Then create a master skill directory. Use the principles and framework and template and checklist you created and make it adaptable or downloadable and upload able to cursor, GitHub, perplexity, Claude, codex, Hermes, OpenClaw, etc. then push it to fit as a master website infrastructure skill, where the user selects only type (ecommerce , marketing/agency site, chat/agent app, web app, saas, B2B, mobile app, directory, gallery/portfolio site, etc), uploads docs, files, reference links etc, prompts their goal mission keys value proposition (or you help them build it) then compiled on top of that a GTM road map (ICP user persona, sales channels, tech stack, marketing channels, strategy, messaging playbook, campaign plays, inbound SLA, brand playbook, design system etc) for a full stack product builder app. Built for non technical users in mind. The process is : intake, documentation, scaffolding of directory, writing all scripts, connecting, deploying, testing, refining, maintaining. Call it: Delali Development Cycle/Framework. Then write a white paper about it. And a Facebook and LinkedIn post announcing it. What it is, what it does, how it works, why it’s important. Fund the best compatible open source harness and build this framework as an agent and corresponding skills on top of it and test it until it is true and fact. In Jesus name: I bless you with peace. With courage. With success. And above all. With Love. Also, don’t just let the agent build without education. Once done, break down each section of the build (as it does in the thinking node) and explain what each section is and why and what it does so the user can learn as they grow and build. A setting set to default that can be turned off. You must guide them to build. Intake must be comprehensive but not overwhelming. To a user with the average reading level of a 7th grader. But output must be executive and professional, to the level of the masters of the universe and infinite wealth intelligence and duty. Also needs ui template library and resource map to track top performing sites in its field and matches against quality (is my freelance site the same level as Upwork?) and SEO. Now redesign in great faith and multitude. Aida copywriting. Marketing intelligence and psychology . I need an easy one click button to install or push. Being able to say the necessary prompt every time is too cumbersome for non technical people. Command must be hard coded in or flexible enough to read and use PAL to extract intent. So it operates on build. When you’re done, project 2 is to scaffold the web app agent portal and electron desktop app to compete with Claude Hermes and OpenAI.

Create a new GitHub repository diamitani/delali-development-cycle (private) for the Delali Development Cycle framework?

```
name: delali-development-cycle
organization: (personal account diamitani)
private: true
autoInit: true
description: Delali Development Cycle (DDC) — PAL + ROSTR master website infrastructure skill, agent pack, and one-click product builder for non-technical operators.
```

Reply **yes** to proceed or **no** to cancel.

<span style="display:none">[^4_1][^4_10][^4_11][^4_12][^4_13][^4_14][^4_15][^4_2][^4_3][^4_4][^4_5][^4_6][^4_7][^4_8][^4_9]</span>

<div align="center">⁂</div>

[^4_1]: https://blogs.nvidia.com/blog/what-openclaw-agents-mean-for-every-organization/

[^4_2]: https://github.com/0xNyk/awesome-hermes-agent

[^4_3]: https://github.com/microsoft/openclaw-dev

[^4_4]: https://github.com/NousResearch/hermes-agent/issues/413

[^4_5]: https://composio.dev/content/hermes-agent-alternatives

[^4_6]: https://www.reddit.com/r/SideProject/comments/1r2mbai/i_built_4_openclaws_in_4_hours_heres_the/

[^4_7]: https://alphasignalai.substack.com/p/you-should-install-hermes-agent-this

[^4_8]: https://sfailabs.com/guides/openclaw-ai-agent-framework

[^4_9]: https://aiskill.market/blog/openclaw-vs-hermes-vs-claude-code-three-runtimes-2026

[^4_10]: https://skillsllm.com/skill/hermes-mcp

[^4_11]: https://www.linkedin.com/pulse/hermes-just-made-codex-engine-itself-shell-alphasignal-8m1xc

[^4_12]: https://marily.substack.com/p/hermes-agent-a-pms-field-guide-and

[^4_13]: https://www.kdnuggets.com/10-github-repositories-to-master-openclaw

[^4_14]: https://forums.developer.nvidia.com/t/agent-harnesses-that-run-really-good-local-ai-for-gb10-systems/371167

[^4_15]: https://www.dsebastien.net/hermes-agent/


---

# Create a system, a harness or runtime template (I don’t know what this means) that takes a prompts and goes through every level of this checklist to develop the best in class project at every time. So that the agent simply takes inputs and walks through these steps. Like the planning mode in the agent harness, but this becomes the structured and systematized planning architecture for any website build in eternity, until the factors change

A **harness** is the car around the AI engine: it steers, brakes, and keeps a map so the model cannot skip steps. This DDC Planning Runtime is that map. Paste a normal sentence like “I need a site for my studio,” and the agent walks every gate before it is allowed to build.[^5_1][^5_2]

\<pal_processing>
Parse: planning-mode runtime that walks the full checklist from any prompt.
Ambiguity: GitHub/Asana writes still wait on the earlier confirmation; this turn ships the harness itself.
Latent intent: stop relying on a long magic prompt; make planning the default architecture for every site.
Expand: state machine, education default on, one-click skill, Hermes as compatible OSS host.
Compile: harness doc, skill, AGENTS.md, TypeScript walker.
\</pal_processing>

## What this is

The model writes documents. The runtime decides the **stage**, stores the run, and refuses to jump to code until Quality Plan scores at least 4/5. That is what “planning mode” is in Claude-style harnesses, made strict and reusable.[^5_3][^5_1]

Drop these in Cursor, Claude Code, Codex, Hermes, OpenClaw, or a Perplexity Space: the planning harness, `SKILL-ddc-plan`, `AGENTS.md`, and `ddc-planning-runtime.ts`. Nous Hermes is the best open-source host for this planner (skills, memory, MCP) without replacing DDC.[^5_4][^5_3]

## How a prompt walks the road

Education mode is **on** by default. Each step speaks simply, then writes a board-level artifact.


| Stage | What it is | Why skip it fails |
| :-- | :-- | :-- |
| Intake | Write down what you said | Tomorrow we invent a different product |
| PAL | Parse, holes, real job, expand, compile | We confuse guesses with facts |
| Intent / JTBD / NPAO | Fence, job, Now vs Later | We build a mall for a shop |
| Docs | Stories, sitemap, PRD, specs | No one can build the same thing twice |
| Architecture + WAF | How it runs and survives | Beauty with no backup is a toy [^5_5] |
| GTM + AIDA | Who, message, channels | A pretty unpaid site is a hobby |
| Taste + resource map | Look vs category leaders | “Is this Upwork-level?” stays a feeling |
| Quality lock | Score the plan | Fast building of a weak plan |
| Build stages | Scaffold → scripts → connect → deploy → test → refine → maintain | Locked until the plan passes |

The agent asks at most **one** real question when money, login, or data ownership is unclear. You never have to paste the long command. `/ddc educate off` is the only switch most people need.

## What you do next

Put `AGENTS.md` at the repo root. The next message can be the product in one sentence. I will start Intake and walk the machine. The GitHub template repo is still waiting on your yes from the earlier create step if you want this pushed to `diamitani/delali-development-cycle`.

\<ui_ux_spec>
Intake: one prompt box, site-type chips (auto-detected), education toggle default on, progress rail of stages, one clarification card. No 40-field forms. Teach strip above each executive document. AIDA on landing/pricing copy only after GTM stage.
\</ui_ux_spec>

\<architecture_spec>
Orchestrator owns `stage`. Agents submit artifacts; `submitStage()` is the only advance. Statuses: completed, needs_clarification, awaiting_approval, blocked. Build stages require `build_eligible`. Connecting/deploying require approval. Contracts match ROSTR run_context (no raw secrets).[^5_2]
\</architecture_spec>

\<implementation_guide>

1. Copy the four generated files into a repo or Hermes/Cursor skills folder.
2. Treat any site-shaped message as `/ddc`.
3. Do not run scaffolding until the quality gate unlocks build.
4. Host long loops in Hermes (or similar); keep this planner provider-neutral.
\</implementation_guide>

\<component_code>
The walker is in `ddc-planning-runtime.ts` (`createRun`, `teach`, `submitStage`). The law is `ddc-planning-harness.md`. The auto-trigger is `SKILL-ddc-plan.md` plus `AGENTS.md`.
\</component_code>

<div align="center">⁂</div>

[^5_1]: palbuild/pal-runs-orchestrator.soul.md

[^5_2]: palbuild/runtime-contract.json

[^5_3]: https://aiskill.market/blog/openclaw-vs-hermes-vs-claude-code-three-runtimes-2026

[^5_4]: https://www.dsebastien.net/hermes-agent/

[^5_5]: https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html


---

# How do I build a project management system to do this manually? Walk into my asana @Asana and build out a template project that I can use, then build a master scaffolding template in GitHub @GitHub create a new repo. Make sure pal process and rostr is incorporated every step of the way (intent analysis, JTBD, NPAO, build package, etc). Then create a master skill directory. Use the principles and framework and template and checklist you created and make it adaptable or downloadable and upload able to cursor, GitHub, perplexity, Claude, codex, Hermes, OpenClaw, etc. then push it to fit as a master website infrastructure skill, where the user selects only type (ecommerce , marketing/agency site, chat/agent app, web app, saas, B2B, mobile app, directory, gallery/portfolio site, etc), uploads docs, files, reference links etc, prompts their goal mission keys value proposition (or you help them build it) then compiled on top of that a GTM road map (ICP user persona, sales channels, tech stack, marketing channels, strategy, messaging playbook, campaign plays, inbound SLA, brand playbook, design system etc) for a full stack product builder app. Built for non technical users in mind. The process is : intake, documentation, scaffolding of directory, writing all scripts, connecting, deploying, testing, refining, maintaining. Call it: Delali Development Cycle/Framework. Then write a white paper about it. And a Facebook and LinkedIn post announcing it. What it is, what it does, how it works, why it’s important. Fund the best compatible open source harness and build this framework as an agent and corresponding skills on top of it and test it until it is true and fact. In Jesus name: I bless you with peace. With courage. With success. And above all. With Love. Also, don’t just let the agent build without education. Once done, break down each section of the build (as it does in the thinking node) and explain what each section is and why and what it does so the user can learn as they grow and build. A setting set to default that can be turned off. You must guide them to build. Intake must be comprehensive but not overwhelming. To a user with the average reading level of a 7th grader. But output must be executive and professional, to the level of the masters of the universe and infinite wealth intelligence and duty. Also needs ui template library and resource map to track top performing sites in its field and matches against quality (is my freelance site the same level as Upwork?) and SEO. Now redesign in great faith and multitude. Aida copywriting. Marketing intelligence and psychology . I need an easy one click button to install or push. Being able to say the necessary prompt every time is too cumbersome for non technical people. Command must be hard coded in or flexible enough to read and use PAL to extract intent. So it operates on build. When you’re done, project 2 is to scaffold the web app agent portal and electron desktop app to compete with Claude Hermes and OpenAI.

Create Asana project “Delali Development Cycle — Master Template” in the Product Development workspace so you can duplicate it for every site build?

```
workspace: Product Development (1209554147627141)
team: none (personal workspace)
name: Delali Development Cycle — Master Template
notes: Duplicate this project for every site. Nine stages: Intake → Documentation (PAL/ROSTR) → Scaffolding → Scripts → Connecting → Deploying → Testing → Refining → Maintaining. Education on by default. Quality gate before code. Approvals required for connect/deploy.
color: dark-purple
icon: rocket
start_on: 2026-08-27
due_on: 2026-12-31
privacy_setting: private
default_view: list
default_access_level: editor
```

Reply **yes** to proceed or **no** to cancel.

