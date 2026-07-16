"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Robot } from "@phosphor-icons/react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { StatusBadge } from "@/components/StatusBadge";
import { mockAgents, mockLogs } from "@/lib/mockData";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { stiffness: 100, damping: 20 } },
};

export function AgentDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agent = mockAgents.find((a) => a.id === id) || mockAgents[0];
  const logs = mockLogs.filter((l) => l.agentId === id);

  return (
    <motion.div initial="initial" animate="animate" className="max-w-3xl space-y-6">
      <motion.div variants={fadeUp}>
        <Link href="/agents" className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to agents
        </Link>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                <Robot className="w-6 h-6 text-cyan" weight="duotone" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                  <StatusBadge status={agent.status} />
                </div>
                <p className="text-sm text-white/40 mt-1">{agent.description}</p>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-white/20 font-mono uppercase tracking-[0.1em]">
                  <span>Type: {agent.type}</span>
                  <span>Model: {agent.model}</span>
                  <span>Created: {agent.createdAt.slice(0, 10)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/[0.04]">
            {[
              { label: "Tasks", value: agent.taskCount },
              { label: "Success Rate", value: `${agent.successRate}%` },
              { label: "Last Active", value: agent.lastActive },
              { label: "API Key", value: agent.apiKeyConfigured ? "Configured" : "None" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[10px] text-white/25 uppercase tracking-[0.1em]">{s.label}</div>
                <div className="text-sm font-semibold text-white mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {agent.tools.map((tool) => (
              <span key={tool} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/35 font-mono">
                {tool}
              </span>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-[0.12em] mb-3">Activity Log</h2>
        <GlassCard>
          {logs.length > 0 ? (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-2 border-b border-white/[0.03] last:border-0">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    log.level === "error" ? "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.4)]" :
                    log.level === "warn" ? "bg-amber-400" :
                    "bg-white/20"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/50">{log.message}</p>
                    <span className="text-[10px] text-white/15 font-mono">{log.timestamp}</span>
                  </div>
                  <span className={`text-[9px] uppercase font-mono ${
                    log.level === "error" ? "text-red-400/60" : log.level === "warn" ? "text-amber-400/60" : "text-white/20"
                  }`}>{log.level}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/20 text-center py-4">No activity yet</p>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
