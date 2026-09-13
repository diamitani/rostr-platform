import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface DoubleBezelProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export function DoubleBezel({ children, className, glass = false }: DoubleBezelProps) {
  return (
    <div className={cn('db-outer', className)}>
      <div className={glass ? 'db-inner-glass' : 'db-inner'}>
        {children}
      </div>
    </div>
  );
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-white/[0.03] border border-white/[0.05] rounded-2xl p-6',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
