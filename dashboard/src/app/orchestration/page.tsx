'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Lightning } from '@phosphor-icons/react';
import { DoubleBezel, GlassCard } from '@/components/glass-card';
import { StatusBadge } from '@/components/status-badge';
import { rostr, type Task } from '@/lib/api';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };
const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: spring },
};

const phaseColors: Record<string, string> = {
  PRED: '#22d3ee',
  PRE_PROCESSING: '#22d3ee',
  DESIGN: '#34d399',
  DEVELOPMENT: '#a78bfa',
  DEPLOYMENT: '#fbbf24',
  DEBUGGING: '#fb7185',
  DEBUG: '#fb7185',
};

export default function OrchestrationPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [desc, setDesc] = useState('');
  const [domain, setDomain] = useState('');
  const [classifying, setClassifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setTasks(await rostr.listTasks());
    } catch {
      setTasks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const classify = async () => {
    if (!desc.trim()) return;
    setClassifying(true);
    setError('');
    try {
      const r = await rostr.createTask(desc, domain);
      setResult(r);
      fetchTasks();
    } catch (e: any) {
      setError(e?.message || 'Backend not reachable');
    }
    setClassifying(false);
  };

  return (
    <motion.div className="space-y-10" variants={stagger} initial="initial" animate="animate">
      {/* ── Header ── */}
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold text-white tracking-tight">NPAO — Decision Engine</h1>
        <p className="text-sm text-white/30 mt-1 font-mono-data">
          Navigate · Prioritize · Allocate · Orchestrate
        </p>
      </motion.div>

      {/* ── Classifier ── */}
      <motion.div variants={fadeUp}>
        <DoubleBezel>
          <div className="flex items-center gap-3 mb-5">
            <span className="status-dot-active" />
            <h2 className="text-lg font-semibold text-white tracking-tight">Classify Task</h2>
            <span className="eyebrow-emerald">POST /npao/classify</span>
          </div>

          <p className="text-sm text-white/40 mb-4 font-mono-data">
            Describe a task — NPAO will route it through the phase logic and assign priority
          </p>

          <div className="flex gap-3">
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && classify()}
              placeholder="e.g. Research top 3 GTM automation platforms for B2B SaaS..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-400/30 transition-all"
            />
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Domain (optional)"
              className="w-40 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-400/30 transition-all"
            />
            <button
              onClick={classify}
              disabled={classifying || !desc.trim()}
              className="btn-pill disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="btn-pill-icon">
                <Lightning weight="fill" className="w-4 h-4" />
              </span>
              {classifying ? 'Classifying...' : 'Classify'}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-400/70 font-mono-data">{error}</p>
          )}

          {result && (
            <motion.div
              className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
            >
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-center">
                <div className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-1">Phase</div>
                <div
                  className="text-lg font-bold"
                  style={{ color: phaseColors[result.phase as string] || '#fff' }}
                >
                  {String(result.phase)}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-center">
                <div className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-1">Priority</div>
                <div className="text-lg font-bold text-white font-mono-data">
                  {Number(result.priority?.composite).toFixed(1)}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-center">
                <div className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-1">Status</div>
                <div
                  className="text-lg font-bold capitalize"
                  style={{
                    color:
                      result.priority?.status === 'immediate'
                        ? '#ef4444'
                        : result.priority?.status === 'queued'
                          ? '#f59e0b'
                          : '#94a3b8',
                  }}
                >
                  {String(result.priority?.status)}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-center">
                <div className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-1">Agent</div>
                <div className="text-sm font-bold text-white">
                  {String(result.allocation?.agent_name || 'unallocated')}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-center">
                <div className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-1">Pattern</div>
                <div className="text-sm font-bold text-white font-mono-data">
                  {String(result.orchestration)}
                </div>
              </div>
            </motion.div>
          )}
        </DoubleBezel>
      </motion.div>

      {/* ── Task Queue ── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-5">
          <GitBranch weight="fill" className="w-5 h-5 text-white/20" />
          <h2 className="text-lg font-semibold text-white tracking-tight">Task Queue</h2>
          <span className="text-xs text-white/20 font-mono-data">{tasks.length} tasks</span>
        </div>

        {loading ? (
          <GlassCard>
            <p className="text-sm text-white/25 text-center py-12 font-mono-data">Loading tasks...</p>
          </GlassCard>
        ) : tasks.length === 0 ? (
          <GlassCard>
            <div className="text-center py-12 space-y-3">
              <Lightning weight="thin" className="w-10 h-10 text-white/10 mx-auto" />
              <p className="text-sm text-white/25">No tasks yet.</p>
              <p className="text-xs text-white/15 font-mono-data">Classify one above to populate the queue.</p>
            </div>
          </GlassCard>
        ) : (
          <DoubleBezel>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="text-left py-3 pr-4 text-white/20 font-medium text-[10px] uppercase tracking-[0.15em]">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-white/20 font-medium text-[10px] uppercase tracking-[0.15em]">
                      Phase
                    </th>
                    <th className="text-right py-3 px-4 text-white/20 font-medium text-[10px] uppercase tracking-[0.15em]">
                      Score
                    </th>
                    <th className="text-left py-3 pl-4 text-white/20 font-medium text-[10px] uppercase tracking-[0.15em]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 pr-4 text-white font-medium">{t.description}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]"
                          style={{
                            backgroundColor: `${phaseColors[t.phase] || '#64748b'}15`,
                            color: phaseColors[t.phase] || '#94a3b8',
                          }}
                        >
                          {t.phase}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 tabular-nums text-white/70 font-mono-data">
                        {t.priority_score.toFixed(1)}
                      </td>
                      <td className="py-3 pl-4">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize"
                          style={{
                            backgroundColor:
                              t.priority_status === 'immediate'
                                ? '#ef444420'
                                : t.priority_status === 'queued'
                                  ? '#f59e0b20'
                                  : '#94a3b820',
                            color:
                              t.priority_status === 'immediate'
                                ? '#ef4444'
                                : t.priority_status === 'queued'
                                  ? '#f59e0b'
                                  : '#94a3b8',
                          }}
                        >
                          {t.priority_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DoubleBezel>
        )}
      </motion.div>
    </motion.div>
  );
}
