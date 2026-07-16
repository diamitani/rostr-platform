"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeSlash, Lightning, Key } from "@phosphor-icons/react";
import clsx from "clsx";

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  useFreeTier: boolean;
  onFreeTierChange: (free: boolean) => void;
}

export function ApiKeyInput({
  value,
  onChange,
  useFreeTier,
  onFreeTierChange,
}: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  const isValid = value.length >= 20 || useFreeTier;

  return (
    <div className="space-y-4">
      {/* Free tier toggle */}
      <button
        onClick={() => onFreeTierChange(!useFreeTier)}
        className={clsx(
          "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left",
          useFreeTier
            ? "border-cyan/30 bg-cyan/[0.04]"
            : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
        )}
      >
        <div
          className={clsx(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
            useFreeTier ? "bg-cyan/15 text-cyan" : "bg-white/[0.04] text-white/30"
          )}
        >
          <Lightning className="w-5 h-5" weight={useFreeTier ? "fill" : "regular"} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-white">
            Free Tier
          </div>
          <div className="text-xs text-white/40 mt-0.5">
            100 requests/day, community model access, no key required
          </div>
        </div>
        <motion.div
          animate={{
            backgroundColor: useFreeTier
              ? "rgba(34, 211, 238, 0.2)"
              : "rgba(255, 255, 255, 0.06)",
          }}
          className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0"
        >
          {useFreeTier && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2.5 h-2.5 rounded-full bg-cyan"
            />
          )}
        </motion.div>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[10px] text-white/25 uppercase tracking-wider">
          or bring your own key
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* API key input */}
      <div className={clsx("transition-opacity", useFreeTier && "opacity-40 pointer-events-none")}>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">
            <Key className="w-4 h-4" />
          </div>
          <input
            type={showKey ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={useFreeTier}
            placeholder="sk-... or deepseek-..."
            className={clsx(
              "w-full pl-10 pr-10 py-3 rounded-xl text-sm font-mono",
              "bg-white/[0.03] border border-white/[0.08]",
              "text-white placeholder:text-white/15",
              "focus:outline-none focus:border-cyan/30 focus:bg-white/[0.05]",
              "transition-all duration-200",
              "disabled:cursor-not-allowed"
            )}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            disabled={useFreeTier}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors disabled:opacity-30"
            tabIndex={-1}
          >
            {showKey ? (
              <EyeSlash className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Validation */}
        <AnimatePresence>
          {value.length > 0 && value.length < 20 && !useFreeTier && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-red-400/70 mt-2"
            >
              API key appears too short. Keys should be at least 20 characters.
            </motion.p>
          )}
        </AnimatePresence>
        <p className="text-xs text-white/25 mt-2">
          Your key is stored locally and never sent to ROSTR servers.
        </p>
      </div>
    </div>
  );
}
