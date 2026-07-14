---
sidebar_position: 1
---

# Quick Start

Deploy the ROSTR agent operating system in under 60 seconds.

## Prerequisites

- Node.js >= 20
- A Vercel account (free tier works)
- Git

## One-Click Deploy

```bash
# 1. Clone the platform
git clone https://github.com/diamitani/rostr-platform.git

# 2. Build the dashboard
cd rostr-platform/dashboard
npm install
npm run build

# 3. Deploy to Vercel
npx vercel --prod
```

That's it. You now have a live ROSTR dashboard at your Vercel URL.

## What Ships

| Component | Description | Location |
|-----------|-------------|----------|
| **rostr-core** | Python package (PAL, RAG DAL, NPAO, Hub) | `rostr-core/src/` |
| **Backend** | FastAPI server, 6 endpoints | `backend/` |
| **Dashboard** | Next.js 15, dark theme, 5 routes | `dashboard/` |
| **Skills** | 5 agent skill manifests | `skills/` |
| **Architecture** | Dark SVG diagram | `architecture/` |

## Verify

```bash
# Check backend health
curl http://localhost:8420/health

# Check dashboard
curl https://your-app.vercel.app
```

## Next Steps

- Read the [ROSTR Architecture](/docs/rostr-architecture) overview
- Dive into the [PAL White Paper](/docs/pal-whitepaper)
- Explore the [RAG DAL knowledge engine](/docs/ragdal-knowledge)
