'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Robot, Plus, X } from '@phosphor-icons/react';
import { DoubleBezel, GlassCard } from '@/components/glass-card';
import { StatusBadge } from '@/components/status-badge';
import { rostr, type Agent } from '@/lib/api';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };
const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: spring },
};

const typeColors: Record<string, string> = {
  researcher: '#22d3ee',
  builder: '#34d399',
  deployer: '#fbbf24',
  debugger: '#fb7185',
  designer: '#a78bfa',
};

const agentTypes = ['researcher', 'builder', 'designer', 'deployer', 'debugger'];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [agentType, setAgentType] = useState('researcher');
  const [tools, setTools] = useState('');
  const [phases, setPhases] = useState('PreD');
  const [error, setError] = useState('');

  const fetchAgents = async () => {
    try {
      const data = await rostr.listAgents();
      setAgents(data);
    } catch {
      setAgents([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const register = async () => {
    if (!name.trim()) return;
    setError('');
    try {
      await rostr.registerAgent({
        name,
        agent_type: agentType,
        tools: tools.split(',').map((t) => t.trim()).filter(Boolean),
        phases: phases.split(',').map((p) => p.trim()).filter(Boolean),
      });
      setName('');
      setShowForm(false);
      fetchAgents();
    } catch (e: any) {
      setError(e?.message || 'Failed to register agent');
    }
  };

  const byType = agents.reduce<Record<string, Agent[]>>((acc, a) => {
    (acc[a.agent_type] = acc[a.agent_type] || []).push(a);
    return acc;
  }, {});

  return (
    <motion.div className="space-y-10" variants={stagger} initial="initial" animate="animate">
      {/* ── Header ── */}
      <motion.div className="flex items-center justify-between" variants={fadeUp}>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Agent Registry</h1>
          <p className="text-sm text-white/30 mt-1 font-mono-data">
            {agents.length} agents registered in the Rostr Hub
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-pill"
        >
          <span className="btn-pill-icon">
            <Plus weight="bold" className="w-4 h-4" />
          </span>
          Register Agent
        </button>
      </motion.div>

      {/* ── Register Form ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
          >
            <DoubleBezel>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white/80 uppercase tracking-[0.15em]">
                  Register New Agent
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <X weight="bold" className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Agent name"
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-400/30 transition-all"
                />
                <select
                  value={agentType}
                  onChange={(e) => setAgentType(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/30 transition-all appearance-none cursor-pointer"
                >
                  {agentTypes.map((t) => (
                    <option key={t} value={t} className="bg-[#0a0a0a] text-white">
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  placeholder="Tools: web_search,code_exec"
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-400/30 transition-all"
                />
                <input
                  value={phases}
                  onChange={(e) => setPhases(e.target.value)}
                  placeholder="Phases: PreD,Development"
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-400/30 transition-all"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400/70 mt-3 font-mono-data">{error}</p>
              )}

              <div className="flex gap-3 mt-4">
                <button onClick={register} className="btn-pill">
                  <span className="btn-pill-icon">
                    <Robot weight="fill" className="w-4 h-4" />
                  </span>
                  Register
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn-pill opacity-50 hover:opacity-100"
                >
                  Cancel
                </button>
              </div>
            </DoubleBezel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading State ── */}
      {loading && (
        <motion.div variants={fadeUp}>
          <GlassCard>
            <p className="text-sm text-white/25 text-center py-12 font-mono-data">
              Loading agents...
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* ── Empty State ── */}
      {!loading && agents.length === 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="text-center py-12 space-y-3">
              <Robot weight="thin" className="w-10 h-10 text-white/10 mx-auto" />
              <p className="text-sm text-white/25">No agents registered yet.</p>
              <p className="text-xs text-white/15 font-mono-data">Register one above to get started.</p>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ── Agents by Type ── */}
      {!loading &&
        Object.entries(byType).map(([type, typeAgents]) => (
          <motion.div key={type} variants={fadeUp}>
            <DoubleBezel>
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: typeColors[type] || '#64748b' }}
                />
                <h2 className="text-base font-semibold text-white capitalize">{type}</h2>
                <span className="text-xs text-white/20 font-mono-data">({typeAgents.length})</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="text-left py-3 pr-4 text-white/20 font-medium text-[10px] uppercase tracking-[0.15em]">
                        Agent
                      </th>
                      <th className="text-right py-3 px-4 text-white/20 font-medium text-[10px] uppercase tracking-[0.15em]">
                        Tasks
                      </th>
                      <th className="text-right py-3 px-4 text-white/20 font-medium text-[10px] uppercase tracking-[0.15em]">
                        Success
                      </th>
                      <th className="text-right py-3 px-4 text-white/20 font-medium text-[10px] uppercase tracking-[0.15em]">
                        Latency
                      </th>
                      <th className="text-right py-3 pl-4 text-white/20 font-medium text-[10px] uppercase tracking-[0.15em]">
                        Model
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeAgents.map((a) => (
                      <tr
                        key={a.id}
                        className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 pr-4">
                          <div className="font-medium text-white">{a.name}</div>
                          <div className="text-xs text-white/25 font-mono-data mt-0.5">{a.tools}</div>
                        </td>
                        <td className="text-right py-3 px-4 tabular-nums text-white/70 font-mono-data">
                          {a.tasks_completed.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 tabular-nums text-emerald-400 font-mono-data">
                          {(a.success_rate * 100).toFixed(1)}%
                        </td>
                        <td className="text-right py-3 px-4 tabular-nums text-white/50 font-mono-data">
                          {a.avg_latency_ms}ms
                        </td>
                        <td className="text-right py-3 pl-4 tabular-nums text-white/20 text-xs font-mono-data">
                          {a.model}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DoubleBezel>
          </motion.div>
        ))}
    </motion.div>
  );
}
