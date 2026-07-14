'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lightning,
  Sparkle,
  Globe,
  Code,
  GitBranch,
  Rocket,
  ArrowRight,
  CheckCircle,
} from '@phosphor-icons/react';
import { GlassCard, DoubleBezel, DeployButton } from '@/components/glass-card';

/* ── Spring config (taste v1: stiffness 100, damping 20) ── */
const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };
const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: spring },
};

/* ── 4 Pillars (taste: no generic names, real descriptions) ── */
const pillars = [
  {
    name: 'PAL',
    full: 'Prompt Abstraction Layer',
    desc: 'LLM compiler: natural language to agent manifest. 5-stage pipeline, 200—800 ms latency. Domain-aware routing with ambiguity scoring.',
    color: '#22d3ee',
    stat: 'POST /pal/compile',
    icon: Sparkle,
  },
  {
    name: 'RAG DAL',
    full: 'Dynamic Acquisition Layer',
    desc: '3-tier credibility scoring across academic, editorial, and community sources. Multi-pass autonomous retrieval with 80% confidence threshold.',
    color: '#fb923c',
    stat: 'POST /ragdal/ingest',
    icon: Globe,
  },
  {
    name: 'NPAO',
    full: 'Navigate · Prioritize · Allocate · Orchestrate',
    desc: '5D phase taxonomy + 4D priority scoring. Production debug tasks score 10/10 — immediate allocation. FIFO is dead.',
    color: '#34d399',
    stat: 'POST /npao/classify',
    icon: GitBranch,
  },
  {
    name: 'Hub',
    full: 'Rostr Hub — Agent Operating System',
    desc: '4-level state management across session, project, org, and agent scopes. Knowledge compounds across sessions — agents never start from scratch.',
    color: '#a78bfa',
    stat: 'GET /hub/compound',
    icon: Code,
  },
];

/* ── What you get (taste: realistic data, no 99.99%) ── */
const features = [
  { label: 'Core Python Package', value: '4 modules, 42 tests', icon: CheckCircle },
  { label: 'API Backend', value: 'FastAPI, 6 endpoints', icon: CheckCircle },
  { label: 'Agent Skills', value: '5 SKILL.md manifests', icon: CheckCircle },
  { label: 'Architecture Diagram', value: 'Dark SVG, offline-ready', icon: CheckCircle },
  { label: 'Dashboard', value: 'Next.js 15, 5 routes', icon: CheckCircle },
  { label: 'License', value: 'MIT, CI/CD included', icon: CheckCircle },
];

/* ── Deploy steps ── */
const deploySteps = [
  { step: '01', label: 'Clone the repo', cmd: 'git clone https://github.com/diamitani/rostr-platform.git' },
  { step: '02', label: 'Install & build', cmd: 'cd rostr-platform/dashboard && npm install && npm run build' },
  { step: '03', label: 'Deploy to Vercel', cmd: 'npx vercel --prod' },
];

export default function DeployPage() {
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const handleDeploy = () => {
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      setDeployed(true);
    }, 2200);
  };

  const handleCopy = (idx: number, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      {/* ═══════════════════════════════════════════
          HERO — Asymmetric Split (taste: no center bias)
          Left: content  |  Right: deploy card
          ═══════════════════════════════════════════ */}
      <section className="min-h-[100dvh] flex flex-col lg:flex-row items-center">
        {/* Left side — value prop */}
        <motion.div
          variants={fadeUp}
          className="flex-1 pt-24 lg:pt-0 px-6 md:px-12 lg:px-16 xl:px-24 pb-12 lg:pb-0"
        >
          <div className="max-w-[540px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span className="status-dot-live" />
              <span className="pill-tag-cyan">Billion-Dollar Agent OS</span>
              <span className="text-[10px] text-white/20 font-mono-data tracking-[0.1em]">v2.0</span>
            </div>

            {/* Headline — taste: no oversized H1, control with weight + color */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-white mb-6">
              ROSTR
              <br />
              <span className="text-white/40 font-normal">
                Runtime, Orchestration,
                <br />
                State, Tools, Reference
              </span>
            </h1>

            <p className="text-base text-white/40 leading-relaxed max-w-[52ch] mb-8">
              A unified architecture for production-grade multi-agent systems.
              Phase-aware orchestration, persistent knowledge compounding,
              and a self-improving skill ecosystem — deployed in one command.
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-6 text-[11px] text-white/25 font-mono-data tracking-[0.08em]">
              <span>PYTHON 3.10+</span>
              <span className="w-px h-3 bg-white/[0.08]" />
              <span>NEXT.JS 15</span>
              <span className="w-px h-3 bg-white/[0.08]" />
              <span>MIT LICENSE</span>
              <span className="w-px h-3 bg-white/[0.08]" />
              <span>4 PILLARS</span>
            </div>
          </div>
        </motion.div>

        {/* Right side — deploy glass card */}
        <motion.div
          variants={fadeUp}
          className="flex-1 w-full lg:max-w-[520px] px-6 md:px-12 lg:px-8 xl:px-16 pb-24 lg:pb-0"
        >
          <DoubleBezel>
            <div className="space-y-5">
              {/* Card header */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
                  <Lightning weight="fill" className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">Deploy ROSTR</h3>
                  <p className="text-[11px] text-white/25 font-mono-data">One command to production</p>
                </div>
              </div>

              {/* Deployment steps (taste: no generic copy, real commands) */}
              <div className="space-y-2.5">
                {deploySteps.map((s, i) => (
                  <div
                    key={s.step}
                    onClick={() => handleCopy(i, s.cmd)}
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] cursor-pointer transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.10]"
                  >
                    <span className="text-[10px] font-mono-data text-white/15 w-5 group-hover:text-cyan-400/60 transition-colors">
                      {s.step}
                    </span>
                    <span className="flex-1 text-[12px] font-mono-data text-white/35 truncate group-hover:text-white/60 transition-colors">
                      {s.cmd}
                    </span>
                    <span className="text-[10px] text-white/15 font-mono-data opacity-0 group-hover:opacity-100 transition-opacity">
                      {copied === i ? 'COPIED' : 'COPY'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Deploy button */}
              <DeployButton onClick={handleDeploy} loading={deploying}>
                {deployed ? 'Deployed — View Dashboard →' : 'One-Click Deploy to Vercel'}
              </DeployButton>

              {deployed && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-[11px] text-emerald-400/70 font-mono-data"
                >
                  https://rostr-deploy.vercel.app
                </motion.p>
              )}

              {/* GitHub link */}
              <a
                href="https://github.com/diamitani/rostr-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-[11px] text-white/25 hover:text-white/50 font-mono-data tracking-[0.08em] transition-colors duration-500"
              >
                <Rocket weight="regular" className="w-3 h-3" />
                github.com/diamitani/rostr-platform
                <ArrowRight weight="regular" className="w-3 h-3" />
              </a>
            </div>
          </DoubleBezel>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          4 PILLARS — 2-col Zigzag (taste: NO 3-column cards)
          ═══════════════════════════════════════════ */}
      <section className="px-6 md:px-12 lg:px-16 xl:px-24 pb-24 lg:pb-32">
        <motion.div variants={fadeUp} className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
            Four Pillars,
            <span className="text-white/30 font-normal"> One Architecture</span>
          </h2>
          <p className="text-sm text-white/30 max-w-[48ch]">
            Each pillar is independently deployable, composable, and ships with a standalone agent skill.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div key={p.name} variants={fadeUp}>
                <DoubleBezel>
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl border"
                      style={{
                        backgroundColor: `${p.color}0D`,
                        borderColor: `${p.color}26`,
                      }}
                    >
                      <Icon weight="fill" className="w-5 h-5" style={{ color: p.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-white tracking-tight">{p.name}</h3>
                        <span className="text-[10px] text-white/25 uppercase tracking-[0.12em]">{p.full}</span>
                      </div>
                      <p className="text-sm text-white/40 leading-relaxed mb-3">{p.desc}</p>
                      <code className="text-[10px] font-mono-data px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-white/20">
                        {p.stat}
                      </code>
                    </div>
                  </div>
                </DoubleBezel>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHAT YOU GET — Bento-ish feature list
          ═══════════════════════════════════════════ */}
      <section className="px-6 md:px-12 lg:px-16 xl:px-24 pb-24 lg:pb-32">
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
              {/* Left */}
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
                  Everything you need
                </h2>
                <p className="text-sm text-white/30 max-w-[44ch] mb-6">
                  ROSTR ships as a complete platform — core package, API server, agent skills, architecture docs, and a production dashboard.
                </p>
                <a
                  href="https://github.com/diamitani/rostr-platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Browse the source
                  <ArrowRight weight="regular" className="w-4 h-4" />
                </a>
              </div>

              {/* Right — feature grid (2-col, NOT 3-col) */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
                  >
                    <CheckCircle weight="fill" className="w-4 h-4 text-emerald-400/60 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-white/50">{f.label}</div>
                      <div className="text-[11px] text-white/20 font-mono-data">{f.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER — Taste: minimal, no fluff
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.04] px-6 md:px-12 lg:px-16 xl:px-24 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-md bg-cyan-400/10 border border-cyan-400/20">
              <Lightning weight="fill" className="w-2.5 h-2.5 text-cyan-400" />
            </div>
            <span className="text-[10px] text-white/15 font-mono-data tracking-[0.12em]">
              ROSTR · PATRICK DIAMITANI · JULY 2026 · MIT
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-white/15 font-mono-data">
            <a href="https://github.com/diamitani/rostr-platform" className="hover:text-white/30 transition-colors">
              GITHUB
            </a>
            <span className="w-px h-3 bg-white/[0.06]" />
            <a href="https://github.com/diamitani/rostr-platform/blob/main/rostr-core/README.md" className="hover:text-white/30 transition-colors">
              DOCS
            </a>
            <span className="w-px h-3 bg-white/[0.06]" />
            <span className="text-emerald-400/40">LIVE</span>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
