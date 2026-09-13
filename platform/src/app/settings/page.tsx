"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Key, FloppyDisk, CheckCircle } from "@phosphor-icons/react";
import { GlassCard, DoubleBezel } from "@/components/GlassCard";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { stiffness: 100, damping: 20 } },
};

export default function SettingsPage() {
  const [useFreeTier, setUseFreeTier] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <motion.div initial="initial" animate="animate" className="max-w-2xl space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-white/35 mt-1">API configuration and preferences</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <DoubleBezel>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                <Key className="w-4 h-4 text-cyan" weight="duotone" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">API Key</h3>
                <p className="text-[11px] text-white/25">Choose how your agents connect to LLMs</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setUseFreeTier(true)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  useFreeTier ? "border-cyan/30 bg-cyan/[0.06]" : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${useFreeTier ? "border-cyan" : "border-white/[0.15]"}`}>
                    {useFreeTier && <div className="w-2.5 h-2.5 rounded-full bg-cyan" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Free Tier</div>
                    <div className="text-[11px] text-white/30">Powered by ROSTR · rate limited · $0/month</div>
                  </div>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">ACTIVE</span>
                </div>
              </button>
              <button
                onClick={() => setUseFreeTier(false)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  !useFreeTier ? "border-cyan/30 bg-cyan/[0.06]" : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!useFreeTier ? "border-cyan" : "border-white/[0.15]"}`}>
                    {!useFreeTier && <div className="w-2.5 h-2.5 rounded-full bg-cyan" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Bring Your Own Key</div>
                    <div className="text-[11px] text-white/30">Unlimited usage · your API billing</div>
                  </div>
                </div>
              </button>
            </div>

            {!useFreeTier && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                <input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password"
                  placeholder="sk-... your API key"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan/30 transition-all"
                />
                <button
                  onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                  disabled={!apiKey}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/15 border border-cyan/25 text-cyan text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan/25 transition-all"
                >
                  {saved ? <CheckCircle weight="fill" className="w-4 h-4" /> : <FloppyDisk className="w-4 h-4" />}
                  {saved ? "Saved" : "Save Key"}
                </button>
              </motion.div>
            )}
          </div>
        </DoubleBezel>
      </motion.div>
    </motion.div>
  );
}
