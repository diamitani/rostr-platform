'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PuzzlePiece, Brain, Scales, CheckCircle, Terminal } from '@phosphor-icons/react';
import { DoubleBezel, GlassCard } from '@/components/glass-card';
import { rostr, type Compound } from '@/lib/api';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };
const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: spring },
};

const coreSkills = [
  { name: 'pal-compiler', desc: '5-stage intent-to-manifest compiler. 200-800ms.', color: '#22d3ee' },
  { name: 'ragdal-knowledge', desc: '3-tier credibility scoring, multi-pass retrieval.', color: '#fb923c' },
  { name: 'npao-orchestrator', desc: '5D phase + 4D priority, agent allocation.', color: '#34d399' },
  { name: 'rostr-hub', desc: '4-level state management, knowledge compounding.', color: '#a78bfa' },
  { name: 'rostr-agent-builder', desc: '7-phase agent construction pipeline.', color: '#ec4899' },
];

const installCommands = [
  'hermes skills install pal-compiler',
  'hermes skills install ragdal-knowledge',
  'hermes skills install npao-orchestrator',
  'hermes skills install rostr-hub',
  'hermes skills install rostr-agent-builder',
  'pip install rostr-core',
];

export default function SkillsPage() {
  const [compound, setCompound] = useState<Compound | null>(null);
  const [logForm, setLogForm] = useState({ context: '', insight: '', outcome: 'observation' });
  const [decisionForm, setDecisionForm] = useState({ context: '', decision: '', rationale: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    rostr.compound().then(setCompound).catch(() => {});
  }, []);

  const logLearning = async () => {
    if (!logForm.insight.trim()) return;
    setError('');
    try {
      await rostr.logLearning(logForm);
      setLogForm({ context: '', insight: '', outcome: 'observation' });
      setMsg('Learning logged!');
      setTimeout(() => setMsg(''), 2000);
      rostr.compound().then(setCompound);
    } catch (e: any) {
      setError(e?.message || 'Failed to log learning');
    }
  };

  const logDecision = async () => {
    if (!decisionForm.decision.trim()) return;
    setError('');
    try {
      await rostr.logDecision(decisionForm);
      setDecisionForm({ context: '', decision: '', rationale: '' });
      setMsg('Decision logged!');
      setTimeout(() => setMsg(''), 2000);
      rostr.compound().then(setCompound);
    } catch (e: any) {
      setError(e?.message || 'Failed to log decision');
    }
  };

  const compoundStats = compound
    ? [
        { label: 'Agents', value: compound.total_agents, color: '#22d3ee', icon: PuzzlePiece },
        { label: 'Decisions', value: compound.total_decisions, color: '#34d399', icon: Scales },
        { label: 'Learnings', value: compound.total_learnings, color: '#a78bfa', icon: Brain },
        { label: 'Knowledge', value: compound.total_knowledge_entries, color: '#fbbf24', icon: CheckCircle },
      ]
    : [];

  return (
    <motion.div className="space-y-10" variants={stagger} initial="initial" animate="animate">
      {/* ── Header ── */}
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold text-white tracking-tight">ROSTR Platform Hub</h1>
        <p className="text-sm text-white/30 mt-1 font-mono-data">
          Live API endpoints · Knowledge compounding · Agent management
        </p>
      </motion.div>

      {/* ── Compound Stats ── */}
      {compound && (
        <motion.div variants={fadeUp}>
          <DoubleBezel>
            <div className="flex items-center gap-3 mb-5">
              <Brain weight="fill" className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white tracking-tight">Compound Report</h2>
              <span className="eyebrow-violet">GET /hub/compound</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {compoundStats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 text-center"
                  >
                    <Icon
                      weight="fill"
                      className="w-6 h-6 mx-auto mb-2"
                      style={{ color: s.color }}
                    />
                    <div className="text-2xl font-bold tracking-tight" style={{ color: s.color }}>
                      {s.value}
                    </div>
                    <div className="text-[10px] text-white/25 mt-1 uppercase tracking-[0.15em]">
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </DoubleBezel>
        </motion.div>
      )}

      {/* ── Core Skills ── */}
      <motion.div variants={fadeUp}>
        <h2 className="text-lg font-semibold text-white tracking-tight mb-5">ROSTR Core Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreSkills.map((s) => (
            <DoubleBezel key={s.name}>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <h3 className="font-semibold text-white text-sm font-mono-data">{s.name}</h3>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
                <div className="pt-3 border-t border-white/[0.04]">
                  <code className="text-xs text-cyan-400/60 font-mono-data">
                    hermes skills install {s.name}
                  </code>
                </div>
              </div>
            </DoubleBezel>
          ))}
        </div>
      </motion.div>

      {/* ── Log Learning ── */}
      <motion.div variants={fadeUp}>
        <DoubleBezel>
          <div className="flex items-center gap-2.5 mb-4">
            <Brain weight="fill" className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-[0.15em]">
              Log Learning
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={logForm.context}
              onChange={(e) => setLogForm({ ...logForm, context: e.target.value })}
              placeholder="Context"
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-400/30 transition-all"
            />
            <input
              value={logForm.insight}
              onChange={(e) => setLogForm({ ...logForm, insight: e.target.value })}
              placeholder="What was learned"
              className="flex-[2] bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-400/30 transition-all"
            />
            <select
              value={logForm.outcome}
              onChange={(e) => setLogForm({ ...logForm, outcome: e.target.value })}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-400/30 transition-all appearance-none cursor-pointer"
            >
              <option value="observation" className="bg-[#0a0a0a]">Observation</option>
              <option value="success" className="bg-[#0a0a0a]">Success</option>
              <option value="failure" className="bg-[#0a0a0a]">Failure</option>
              <option value="insight" className="bg-[#0a0a0a]">Insight</option>
            </select>
            <button onClick={logLearning} className="btn-pill flex-shrink-0">
              <span className="btn-pill-icon">
                <Brain weight="fill" className="w-4 h-4" />
              </span>
              Log
            </button>
          </div>
        </DoubleBezel>
      </motion.div>

      {/* ── Log Decision ── */}
      <motion.div variants={fadeUp}>
        <DoubleBezel>
          <div className="flex items-center gap-2.5 mb-4">
            <Scales weight="fill" className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-[0.15em]">
              Log Decision
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={decisionForm.context}
              onChange={(e) => setDecisionForm({ ...decisionForm, context: e.target.value })}
              placeholder="Context"
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-400/30 transition-all"
            />
            <input
              value={decisionForm.decision}
              onChange={(e) => setDecisionForm({ ...decisionForm, decision: e.target.value })}
              placeholder="Decision"
              className="flex-[2] bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-400/30 transition-all"
            />
            <input
              value={decisionForm.rationale}
              onChange={(e) => setDecisionForm({ ...decisionForm, rationale: e.target.value })}
              placeholder="Rationale"
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-400/30 transition-all"
            />
            <button onClick={logDecision} className="btn-pill flex-shrink-0">
              <span className="btn-pill-icon">
                <CheckCircle weight="fill" className="w-4 h-4" />
              </span>
              Log
            </button>
          </div>

          {error && <p className="text-xs text-red-400/70 mt-3 font-mono-data">{error}</p>}
          {msg && (
            <motion.p
              className="text-xs text-emerald-400 mt-3 font-mono-data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {msg}
            </motion.p>
          )}
        </DoubleBezel>
      </motion.div>

      {/* ── Quick Install ── */}
      <motion.div variants={fadeUp}>
        <DoubleBezel>
          <div className="flex items-center gap-2.5 mb-4">
            <Terminal weight="fill" className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-[0.15em]">
              Quick Install
            </h3>
          </div>
          <div className="space-y-2">
            {installCommands.map((cmd) => (
              <div
                key={cmd}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]"
              >
                <code className="text-xs text-cyan-400/70 font-mono-data">{cmd}</code>
                <button
                  onClick={() => navigator.clipboard?.writeText(cmd)}
                  className="text-white/15 hover:text-white/50 transition-colors text-[10px] uppercase tracking-[0.15em]"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </DoubleBezel>
      </motion.div>
    </motion.div>
  );
}
