"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Robot,
  Plus,
  MagnifyingGlass,
  Funnel,
} from "@phosphor-icons/react";
import { GlassCard } from "@/components/GlassCard";
import { AgentCard } from "@/components/AgentCard";
import { mockAgents, type Agent } from "@/lib/mockData";

export default function AgentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setAgents(mockAgents);
      } catch {
        setError("Failed to load agents");
      }
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: agents.length,
    live: agents.filter((a) => a.status === "live").length,
    idle: agents.filter((a) => a.status === "idle").length,
    error: agents.filter((a) => a.status === "error").length,
    deploying: agents.filter((a) => a.status === "deploying").length,
    offline: agents.filter((a) => a.status === "offline").length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-shimmer h-8 w-36 rounded-lg" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-shimmer h-8 w-16 rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-shimmer h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center mb-4">
          <Robot className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Failed to Load Agents
        </h2>
        <p className="text-sm text-white/40 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm hover:bg-white/[0.08] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ stiffness: 100, damping: 20 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Agents</h1>
          <p className="text-sm text-white/35 mt-1">
            {agents.length} agent{agents.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan/10 border border-cyan/20 text-cyan text-sm font-medium hover:bg-cyan/15 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Agent
        </button>
      </motion.div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ stiffness: 100, damping: 20 }}
        >
          <GlassCard className="mb-4">
            <h3 className="text-sm font-semibold text-white mb-4">
              Create New Agent
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Agent name"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/15 focus:outline-none focus:border-cyan/30 transition-all"
              />
              <textarea
                placeholder="Description"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/15 focus:outline-none focus:border-cyan/30 transition-all resize-none"
              />
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-lg bg-cyan text-black text-sm font-medium hover:bg-cyan/90 transition-all">
                  Create Agent
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm hover:bg-white/[0.08] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/15 focus:outline-none focus:border-cyan/30 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Funnel className="w-4 h-4 text-white/25 flex-shrink-0" />
          {(["all", "live", "idle", "error", "deploying", "offline"] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  statusFilter === s
                    ? "bg-cyan/10 border border-cyan/20 text-cyan"
                    : "bg-white/[0.02] border border-white/[0.06] text-white/40 hover:text-white/60"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                <span className="ml-1 text-white/20">
                  {statusCounts[s]}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <GlassCard>
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
              <Robot className="w-6 h-6 text-white/20" />
            </div>
            <h3 className="text-sm font-medium text-white/60 mb-1">
              {search ? "No matching agents" : "No agents yet"}
            </h3>
            <p className="text-xs text-white/30">
              {search
                ? "Try adjusting your search or filters"
                : "Create your first agent to get started"}
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredAgents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
