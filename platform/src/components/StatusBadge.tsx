"use client";

import clsx from "clsx";

type Status = "live" | "idle" | "error" | "deploying" | "offline";

const statusConfig: Record<
  Status,
  { label: string; dotClass: string; textClass: string }
> = {
  live: {
    label: "Live",
    dotClass: "bg-emerald-400 status-pulse",
    textClass: "text-emerald-400",
  },
  idle: {
    label: "Idle",
    dotClass: "bg-amber-400",
    textClass: "text-amber-400",
  },
  error: {
    label: "Error",
    dotClass: "bg-red-400 status-pulse",
    textClass: "text-red-400",
  },
  deploying: {
    label: "Deploying",
    dotClass: "bg-cyan animate-pulse",
    textClass: "text-cyan",
  },
  offline: {
    label: "Offline",
    dotClass: "bg-white/20",
    textClass: "text-white/30",
  },
};

interface StatusBadgeProps {
  status: Status;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function StatusBadge({
  status,
  showLabel = true,
  size = "sm",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const dotSize = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={clsx(
          dotSize,
          "rounded-full",
          config.dotClass
        )}
        aria-hidden="true"
      />
      {showLabel && (
        <span
          className={clsx(
            "font-medium",
            size === "sm" ? "text-xs" : "text-sm",
            config.textClass
          )}
        >
          {config.label}
        </span>
      )}
    </span>
  );
}
