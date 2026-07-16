"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Robot,
  ChartLine,
  Clock,
  Desktop,
  Lightning,
  Pulse,
  ArrowRight,
  Plus,
} from "@phosphor-icons/react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { AgentCard } from "@/components/AgentCard";
import { StatusBadge } from "@/components/StatusBadge";
import {
  mockAgents,
  mockSystemStatus,
  type Agent,
  type SystemStatus,
} from "@/lib/mockData";

function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  subtitle?: string;
}) {
  return (
    <GlassCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-white font-mono tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-white/25 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-cyan" weight="duotone" />
        </div>
      </div>
    </GlassCard>
  );
}

function SystemStatusPanel({ status }: { status: SystemStatus }) {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <Pulse className="w-4 h-4 text-cyan" weight="duotone" />
        <h3 className="text-sm font-semibold text-white">System Status</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35">API Connection</span>
          <StatusBadge
            status={status.apiStatus === "connected" ? "live" : "offline"}
            size="sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35">Uptime</span>
          <span className="text-xs font-mono text-white/60">
            {status.uptime}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35">CPU</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan/60 transition-all"
                style={{ width: `${status.cpuUsage}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white/50 w-8 text-right">
              {status.cpuUsage}%
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35">Memory</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan/60 transition-all"
                style={{ width: `${status.memoryUsage}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white/50 w-8 text-right">
              {status.memoryUsage}%
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35">Version</span>
          <span className="text-xs font-mono text-white/40">
            {status.version}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

function RecentActivity() {
  const recent = mockAgents
    .filter((a) => a.status !== "offline")
    .slice(0, 4);

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <ChartLine className="w-4 h-4 text-cyan" weight="duotone" />
        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
      </div>
      <div className="space-y-3">
        {recent.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="flex items-center justify-between py-2 -mx-2 px-2 rounded-lg hover:bg-white/[0.03] transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <StatusBadge status={agent.status} showLabel={false} />
              <div className="min-w-0">
                <p className="text-sm text-white/80 truncate group-hover:text-cyan transition-colors">
                  {agent.name}
                </p>
                <p className="text-[10px] text-white/25">{agent.lastActive}</p>
              </div>
            </div>
            <ArrowRight className="w-3 h-3 text-white/15 group-hover:text-cyan/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setAgents(mockAgents);
        setStatus(mockSystemStatus);
      } catch {
        setError("Failed to load dashboard data");
      }
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-shimmer h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 animate-shimmer h-24 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-3 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-shimmer h-32 rounded-2xl" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="glass-card p-6 animate-shimmer h-48 rounded-2xl" />
            <div className="glass-card p-6 animate-shimmer h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center mb-4">
          <Pulse className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Failed to Load Dashboard
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

  const liveAgents = agents.filter((a) => a.status === "live").length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ stiffness: 100, damping: 20 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/35 mt-1">
            {liveAgents} agent{liveAgents !== 1 ? "s" : ""} running
          </p>
        </div>
        <Link
          href="/agents"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan/10 border border-cyan/20 text-cyan text-sm font-medium hover:bg-cyan/15 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Agent
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, stiffness: 100, damping: 20 }}
          className="lg:col-span-1"
        >
          <StatCard
            label="Active Agents"
            value={String(liveAgents)}
            icon={Robot}
            subtitle={`of ${agents.length} total`}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, stiffness: 100, damping: 20 }}
          className="lg:col-span-1"
        >
          <StatCard
            label="Total Tasks"
            value={status ? String(status.totalTasks) : "0"}
            icon={Lightning}
            subtitle="All time"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, stiffness: 100, damping: 20 }}
          className="lg:col-span-2"
        >
          <StatCard
            label="System Uptime"
            value={status?.uptime || "\u2014"}
            icon={Desktop}
            subtitle={`v${status?.version || "\u2014"}  \u00b7  ${status?.apiStatus === "connected" ? "Connected" : "Disconnected"}`}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Robot className="w-4 h-4 text-white/30" weight="duotone" />
              <h2 className="text-sm font-semibold text-white/70">
                Your Agents
              </h2>
            </div>
            <Link
              href="/agents"
              className="text-xs text-white/30 hover:text-cyan/60 transition-colors flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {agents.length === 0 ? (
            <GlassCard>
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
                  <Robot className="w-6 h-6 text-white/20" />
                </div>
                <h3 className="text-sm font-medium text-white/60 mb-1">
                  No agents yet
                </h3>
                <p className="text-xs text-white/30 mb-4">
                  Create your first agent to get started
                </p>
                <Link
                  href="/agents"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan/10 border border-cyan/20 text-cyan text-sm font-medium hover:bg-cyan/15 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Create Agent
                </Link>
              </div>
            </GlassCard>
          ) : (
            agents.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))
          )}
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, stiffness: 100, damping: 20 }}
          >
            <SystemStatusPanel status={status!} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, stiffness: 100, damping: 20 }}
          >
            <RecentActivity />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
