---
sidebar_position: 9
---

# One-Click Deploy

Deploy the full ROSTR platform in under 60 seconds.

## Deploy to Vercel

```bash
# 1. Clone
git clone https://github.com/diamitani/rostr-platform.git

# 2. Build
cd rostr-platform/dashboard
npm install
npm run build

# 3. Ship
npx vercel --prod
```

## What Gets Deployed

| Component | Stack | Endpoint |
|-----------|-------|----------|
| Dashboard | Next.js 15, React 19 | `/` |
| Agents page | Static export | `/agents` |
| Knowledge page | Static export | `/knowledge` |
| Orchestration | Static export | `/orchestration` |
| Skills page | Static export | `/skills` |

## Design System

- **Theme**: Dark (#050505 background, #22d3ee cyan accent)
- **Fonts**: Geist Sans + Geist Mono
- **Cards**: Liquid glass with inner refraction borders
- **Motion**: Framer Motion spring physics (stiffness 100, damping 20)
- **Layout**: Asymmetric split hero, 2-column zigzag pillars
- **Icons**: Phosphor (no emojis)

## Verification

```bash
# Check deployment
curl -s -o /dev/null -w "%{http_code}" https://your-app.vercel.app
# Expected: 200

# Check content markers
curl -s https://your-app.vercel.app | grep -q "ROSTR" && echo "OK"
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails with "No Next.js version detected" | Set `"framework": null` in `vercel.json` |
| npm install ENOSPC | `rm -rf node_modules && npm install` |
| Vercel 404 on routes | Check `next.config.ts` has `output: 'export'` |
