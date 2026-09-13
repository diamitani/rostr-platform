"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hover = false,
  onClick,
}: GlassCardProps) {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      onClick={onClick}
      className={clsx(
        "glass-card double-bezel p-6",
        hover &&
          "cursor-pointer transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]",
        className
      )}
      whileHover={hover ? { scale: 1.01, y: -1 } : undefined}
      transition={{ stiffness: 100, damping: 20 }}
    >
      {children}
    </Component>
  );
}

export function DoubleBezel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("double-bezel relative", className)}>
      <div className="glass-card p-6">{children}</div>
    </div>
  );
}
