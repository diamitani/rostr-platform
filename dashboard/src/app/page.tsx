'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkle, Lightning, Globe, Code } from '@phosphor-icons/react';
import { DoubleBezel, GlassCard } from '@/components/glass-card';
import { StatusBadge } from '@/components/status-badge';
import { rostr, type Stats, type CompileResult } from '@/lib/api';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };
const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: spring },
};

const pillars = [
  { name: 'PAL', full: 'Prompt Abstraction Layer', desc: 'LLM Compiler. NL → agent manifest. 5-stage pipeline, 200-800ms.', color: '#22d3ee', stat: 'POST /pal/compile', icon: Sparkle },
  { name: 'RAG DAL', full: 'Dynamic Acquisition Layer', desc: '3-tier credibility scoring, multi-pass autonomous retrieval.', color: '#fb923c', stat: 'POST /ragdal/ingest', icon: Globe },
  { name: 'NPAO', full: 'Navigate, Prioritize, Allocate, Orchestrate', desc: '5D phase + 4D priority. Debug=10 score, immediate allocation.', color: '#34d399', stat: 'POST /npao/classify', icon: Lightning },
  { name: 'Hub', full: 'Rostr Hub', desc: '4-level state, knowledge compounding across sessions.', color: '#a78bfa', stat: 'GET /hub/compound', icon: Code },
];

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<CompileResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    rostr.stats().then(setStats).catch(() => {});
  }, []);

  const handleCompile = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    try {
      const r = await rostr.compile(input);
      setResult(r);
    } catch {
      setError('Backend not reachable. Start with: cd backend && PYTHONPATH=../rostr-core/src python3 -m uvicorn main:app --port 8420');
    }
    setLoading(false);
  };

  const statCards = [
    { label: 'Agents', value: stats?.total_agents ?? '—', color: '#22d3ee' },
    { label: 'Knowledge', value: stats?.knowledge_sources ?? '—', color: '#fb923c' },
    { label: 'Tasks', value: stats?.orchestrations ?? '—', color: '#34d399' },
    { label: 'Uptime', value: stats?.uptime ?? '—', color: '#a78bfa' },
  ];

  return (
    <motion.div className="space-y-10" variants={stagger} initial="initial" animate="animate">
      {/* ── PAL Compiler ── */}
      <motion.div variants={fadeUp}>
        <DoubleBezel>
          <div className="flex items-center gap-3 mb-5">
            <span className="status-dot-active" />
            <h2 className="text-lg font-semibold text-white tracking-tight">PAL Compiler</h2>
            <span className="eyebrow-cyan">POST /pal/compile</span>
          </div>

          <p className="text-sm text-white/40 mb-4 font-mono-data">Natural Language → Agent Manifest</p>

          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCompile()}
              placeholder="e.g. Build a Python REST API for user management with JWT auth..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-400/30 transition-all duration-500"
            />
            <button
              onClick={handleCompile}
              disabled={loading || !input.trim()}
              className="btn-pill disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="btn-pill-icon">
                <Sparkle weight="fill" className="w-4 h-4" />
              </span>
              {loading ? 'Compiling...' : 'Compile'}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-400/70 font-mono-data">{error}</p>
          )}

          {result && (
            <motion.div
              className="mt-5 space-y-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
            >
              {/* Stat grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Agent', value: result.agent_type, color: '#22d3ee' },
                  { label: 'Phase', value: result.routing_phase, color: '#34d399' },
                  { label: 'Model', value: result.model, color: '#a78bfa' },
                  { label: 'Domain', value: result.domain, color: '#fbbf24' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3"
                  >
                    <div className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-1">
                      {s.label}
                    </div>
                    <div className="text-sm font-bold" style={{ color: s.color }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced instruction */}
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4">
                <div className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-2">
                  Enhanced Instruction
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  {result.enhanced_instruction}
                </p>
              </div>

              {/* Tools + Criteria */}
              <div className="flex flex-wrap gap-2">
                {result.tools_allow.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-[10px] font-medium bg-cyan-400/[0.06] text-cyan-400 border border-cyan-400/[0.12]"
                  >
                    {t}
                  </span>
                ))}
                {result.completion_criteria.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1 rounded-full text-[10px] font-medium bg-emerald-400/[0.06] text-emerald-400 border border-emerald-400/[0.12]"
                  >
                    ✓ {c}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </DoubleBezel>
      </motion.div>

      {/* ── Live Stats ── */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={fadeUp}>
        {statCards.map((s) => (
          <GlassCard key={s.label}>
            <div className="text-center">
              <div className="text-2xl font-bold tracking-tight" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs text-white/25 mt-1.5 uppercase tracking-[0.15em]">{s.label}</div>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* ── 4 Pillars ── */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" variants={fadeUp}>
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <DoubleBezel key={p.name}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      weight="fill"
                      className="w-5 h-5"
                      style={{ color: p.color }}
                    />
                    <h3 className="text-lg font-bold text-white tracking-tight">{p.name}</h3>
                  </div>
                  <code className="text-[10px] text-white/20 font-mono-data">{p.stat}</code>
                </div>
                <p className="text-xs text-white/30 uppercase tracking-[0.1em]">{p.full}</p>
                <p className="text-sm text-white/50 leading-relaxed">{p.desc}</p>
              </div>
            </DoubleBezel>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
