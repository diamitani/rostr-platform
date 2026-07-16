import { cn } from '@/lib/utils';

type Status =
  | 'active' | 'idle' | 'error' | 'offline'
  | 'healthy' | 'indexing' | 'stale'
  | 'completed' | 'running' | 'waiting' | 'blocked' | 'failed' | 'queued';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const baseClasses = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.15em] border';

const styleMap: Record<string, string> = {
  active: 'bg-cyan-400/[0.08] text-cyan-400 border-cyan-400/[0.15]',
  idle: 'bg-white/[0.03] text-white/30 border-white/[0.06]',
  error: 'bg-red-400/[0.08] text-red-400 border-red-400/[0.15]',
  offline: 'bg-white/[0.02] text-white/20 border-white/[0.04]',
  healthy: 'bg-emerald-400/[0.08] text-emerald-400 border-emerald-400/[0.15]',
  indexing: 'bg-amber-400/[0.08] text-amber-400 border-amber-400/[0.15]',
  stale: 'bg-orange-400/[0.08] text-orange-400 border-orange-400/[0.15]',
  completed: 'bg-emerald-400/[0.08] text-emerald-400 border-emerald-400/[0.15]',
  running: 'bg-cyan-400/[0.08] text-cyan-400 border-cyan-400/[0.15]',
  waiting: 'bg-white/[0.03] text-white/30 border-white/[0.06]',
  blocked: 'bg-red-400/[0.08] text-red-400 border-red-400/[0.15]',
  failed: 'bg-red-400/[0.08] text-red-400 border-red-400/[0.15]',
  queued: 'bg-white/[0.03] text-white/40 border-white/[0.06]',
};

const dotMap: Record<string, string> = {
  active: 'status-dot-active',
  idle: 'status-dot-idle',
  error: 'status-dot-error',
  offline: 'status-dot-idle',
  healthy: 'status-dot-healthy',
  indexing: 'status-dot-indexing',
  stale: 'status-dot-idle',
  completed: 'status-dot-healthy',
  running: 'status-dot-active',
  waiting: 'status-dot-idle',
  blocked: 'status-dot-error',
  failed: 'status-dot-error',
  queued: 'status-dot-idle',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(baseClasses, styleMap[status] || styleMap.idle, className)}>
      <span className={cn(dotMap[status] || dotMap.idle)} />
      {status}
    </span>
  );
}

export function PillarBadge({ pillar }: { pillar: 'PAL' | 'RAG' | 'NPAO' | 'HUB' }) {
  const colors: Record<string, string> = {
    PAL: 'bg-cyan-400/[0.08] text-cyan-400 border-cyan-400/[0.15]',
    RAG: 'bg-orange-400/[0.08] text-orange-400 border-orange-400/[0.15]',
    NPAO: 'bg-emerald-400/[0.08] text-emerald-400 border-emerald-400/[0.15]',
    HUB: 'bg-violet-400/[0.08] text-violet-400 border-violet-400/[0.15]',
  };
  return (
    <span className={cn(baseClasses, colors[pillar])}>
      {pillar}
    </span>
  );
}
