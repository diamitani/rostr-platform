import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

/* ── Liquid Glass Card ──
   Taste v1 compliant: 1px inner border, tinted shadow, no purple/neon glows */
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-[2rem] border border-white/[0.06]',
        'bg-white/[0.02] backdrop-blur-3xl',
        'p-6 md:p-8',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]',
        'transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
        hover &&
          'hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-[0_12px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]',
        className,
      )}
    >
      {/* 1px inner refraction border — taste v1 "Liquid Glass" directive */}
      <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/[0.04] pointer-events-none" />
      {children}
    </div>
  );
}

/* ── Double Bezel Card ──
   Outer ring + inner card for nested glass effect */
interface DoubleBezelProps {
  children: ReactNode;
  className?: string;
}

export function DoubleBezel({ children, className }: DoubleBezelProps) {
  return (
    <div
      className={cn(
        'rounded-[2rem] bg-white/[0.02] p-[1.5px]',
        'border border-white/[0.04]',
        'shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_8px_32px_rgba(0,0,0,0.4)]',
        'transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
        'hover:border-white/[0.08] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_48px_rgba(0,0,0,0.5)]',
        className,
      )}
    >
      <div className="rounded-[calc(2rem-0.375rem)] bg-white/[0.03] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
        {children}
      </div>
    </div>
  );
}

/* ── Deploy Button ── */
interface DeployButtonProps {
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

export function DeployButton({ children, onClick, loading, className }: DeployButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        'group relative inline-flex items-center gap-3 rounded-full px-8 py-4',
        'text-sm font-semibold tracking-tight',
        'bg-white/[0.06] border border-white/[0.10]',
        'text-white/90 hover:text-white',
        'backdrop-blur-2xl',
        'transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
        'hover:bg-white/[0.10] hover:border-white/[0.18]',
        'hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]',
        'active:scale-[0.98]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none',
        className,
      )}
    >
      {/* Inner icon ring */}
      <span
        className={cn(
          'inline-flex items-center justify-center w-9 h-9 rounded-full',
          'bg-cyan-400/15 border border-cyan-400/20',
          'text-cyan-400',
          'transition-all duration-700',
          'group-hover:bg-cyan-400/25 group-hover:border-cyan-400/35',
          'group-hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]',
          loading && 'animate-shimmer',
        )}
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L8 10M8 10L4 6M8 10L12 6M3 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}
