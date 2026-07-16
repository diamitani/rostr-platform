'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, X } from '@phosphor-icons/react';
import { DoubleBezel, GlassCard } from '@/components/glass-card';
import { rostr, type KnowledgeEntry } from '@/lib/api';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };
const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: spring },
};

const tierConfig: Record<string, { value: string; label: string; color: string }> = {
  '1.0': { value: '1.0', label: 'Tier 1 · Academic', color: '#22d3ee' },
  '0.75': { value: '0.75', label: 'Tier 2 · Editorial', color: '#34d399' },
  '0.4': { value: '0.4', label: 'Tier 3 · Community', color: '#fbbf24' },
};

function tierColor(t: number): string {
  return t >= 1.0 ? '#22d3ee' : t >= 0.75 ? '#34d399' : '#fbbf24';
}

function tierLabel(t: number): string {
  return t >= 1.0 ? 'Tier 1 · Academic' : t >= 0.75 ? 'Tier 2 · Editorial' : 'Tier 3 · Community';
}

export default function KnowledgePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIngest, setShowIngest] = useState(false);
  const [ingestForm, setIngestForm] = useState({
    content: '',
    summary: '',
    source_url: '',
    source_title: '',
    source_tier: '1.0',
    topics: '',
  });
  const [error, setError] = useState('');

  const fetch = async () => {
    try {
      setEntries(await rostr.listKnowledge());
    } catch {
      setEntries([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const ingest = async () => {
    if (!ingestForm.content.trim()) return;
    setError('');
    try {
      await rostr.ingestKnowledge({
        query_origin: ingestForm.content.slice(0, 80),
        content: ingestForm.content,
        summary: ingestForm.summary || undefined,
        source_url: ingestForm.source_url || undefined,
        source_title: ingestForm.source_title || undefined,
        source_tier: parseFloat(ingestForm.source_tier),
        credibility_score: parseFloat(ingestForm.source_tier),
        topics: ingestForm.topics.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setShowIngest(false);
      setIngestForm({
        content: '',
        summary: '',
        source_url: '',
        source_title: '',
        source_tier: '1.0',
        topics: '',
      });
      fetch();
    } catch (e: any) {
      setError(e?.message || 'Failed to ingest knowledge');
    }
  };

  return (
    <motion.div className="space-y-10" variants={stagger} initial="initial" animate="animate">
      {/* ── Header ── */}
      <motion.div className="flex items-center justify-between" variants={fadeUp}>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">RAG DAL — Knowledge Engine</h1>
          <p className="text-sm text-white/30 mt-1 font-mono-data">
            {entries.length} entries in the knowledge base
          </p>
        </div>
        <button onClick={() => setShowIngest(!showIngest)} className="btn-pill">
          <span className="btn-pill-icon">
            <Plus weight="bold" className="w-4 h-4" />
          </span>
          Ingest Knowledge
        </button>
      </motion.div>

      {/* ── Ingest Form ── */}
      <AnimatePresence>
        {showIngest && (
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
          >
            <DoubleBezel>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white/80 uppercase tracking-[0.15em]">
                  Ingest Knowledge
                </h2>
                <button
                  onClick={() => setShowIngest(false)}
                  className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <X weight="bold" className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                <textarea
                  value={ingestForm.content}
                  onChange={(e) => setIngestForm({ ...ingestForm, content: e.target.value })}
                  placeholder="Knowledge content to ingest..."
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-400/30 transition-all resize-none"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <input
                    value={ingestForm.summary}
                    onChange={(e) => setIngestForm({ ...ingestForm, summary: e.target.value })}
                    placeholder="Summary"
                    className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-400/30 transition-all"
                  />
                  <input
                    value={ingestForm.source_url}
                    onChange={(e) => setIngestForm({ ...ingestForm, source_url: e.target.value })}
                    placeholder="Source URL"
                    className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-400/30 transition-all"
                  />
                  <input
                    value={ingestForm.source_title}
                    onChange={(e) => setIngestForm({ ...ingestForm, source_title: e.target.value })}
                    placeholder="Source title"
                    className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-400/30 transition-all"
                  />
                  <select
                    value={ingestForm.source_tier}
                    onChange={(e) => setIngestForm({ ...ingestForm, source_tier: e.target.value })}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-400/30 transition-all appearance-none cursor-pointer"
                  >
                    {Object.values(tierConfig).map((t) => (
                      <option key={t.value} value={t.value} className="bg-[#0a0a0a] text-white">
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <input
                    value={ingestForm.topics}
                    onChange={(e) => setIngestForm({ ...ingestForm, topics: e.target.value })}
                    placeholder="Topics: gtm,ai,saas"
                    className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-400/30 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400/70 font-mono-data">{error}</p>
                )}

                <button onClick={ingest} className="btn-pill">
                  <span className="btn-pill-icon">
                    <Database weight="fill" className="w-4 h-4" />
                  </span>
                  Ingest
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
              Loading knowledge base...
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* ── Empty State ── */}
      {!loading && entries.length === 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="text-center py-12 space-y-3">
              <Database weight="thin" className="w-10 h-10 text-white/10 mx-auto" />
              <p className="text-sm text-white/25">No knowledge entries yet.</p>
              <p className="text-xs text-white/15 font-mono-data">Ingest content above to begin building the knowledge base.</p>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ── Knowledge List ── */}
      {!loading &&
        entries.map((e) => {
          const tc = tierColor(e.source_tier);
          let topics: string[] = [];
          try {
            topics = JSON.parse(e.topics);
          } catch {
            topics = [];
          }

          return (
            <motion.div key={e.entry_id} variants={fadeUp}>
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{
                      backgroundColor: `${tc}15`,
                      color: tc,
                      border: `1px solid ${tc}30`,
                    }}
                  >
                    {tierLabel(e.source_tier)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium leading-relaxed">
                      {e.summary || e.content.slice(0, 140)}
                    </p>
                    <p className="text-xs text-white/25 mt-1.5 font-mono-data">
                      {e.source_title || 'No source'}
                      {' · '}confidence: {e.confidence.toFixed(2)}
                    </p>
                    {topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {topics.map((t: string) => (
                          <span
                            key={t}
                            className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/[0.03] text-white/30 border border-white/[0.04]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
    </motion.div>
  );
}
