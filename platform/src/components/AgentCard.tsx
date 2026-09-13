"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Robot, ArrowRight } from "@phosphor-icons/react";
import { GlassCard } from "./GlassCard";
import { StatusBadge } from "./StatusBadge";
import type { Agent } from "@/lib/mockData";

interface AgentCardProps {
  agent: Agent;
  index?: number;
}

export function AgentCard({ agent, index = 0 }: AgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        stiffness: 100,
        damping: 20,
      }}
    >
      <GlassCard hover>
        <Link
          href={`/agents/${agent.id}`}
          className="block group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              {/* Agent icon */}
              <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Robot className="w-5 h-5 text-cyan" weight="duotone" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white text-sm group-hover:text-cyan transition-colors truncate">
                    {agent.name}
                  </h3>
                  <StatusBadge status={agent.status} />
                </div>
                <p className="text-white/40 text-xs mt-1 line-clamp-2">
                  {agent.description}
                </p>

                {/* Tool chips */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {agent.tools.slice(0, 3).map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/30"
                    >
                      {tool}
                    </span>
                  ))}
                  {agent.tools.length > 3 && (
                    <span className="text-[10px] text-white/20">
                      +{agent.tools.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-[10px] text-white/20 font-mono uppercase">
                {agent.type}
              </span>
              <span className="text-[10px] text-white/25">
                {agent.lastActive}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-cyan/60 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Bottom stats bar */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/25">Tasks</span>
              <span className="text-xs font-mono text-white/60">
                {agent.taskCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/25">Success</span>
              <span className="text-xs font-mono text-white/60">
                {agent.successRate}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/25">Model</span>
              <span className="text-xs font-mono text-white/60">
                {agent.model}
              </span>
            </div>
          </div>
        </Link>
      </GlassCard>
    </motion.div>
  );
}
