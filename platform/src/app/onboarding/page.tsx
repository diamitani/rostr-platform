"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightning, Key, Robot, CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { GlassCard } from "@/components/GlassCard";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, label: "Welcome", icon: Lightning },
  { id: 2, label: "API Key", icon: Key },
  { id: 3, label: "First Agent", icon: Robot },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [useFreeTier, setUseFreeTier] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentDesc, setAgentDesc] = useState("");
  const [complete, setComplete] = useState(false);

  return (
    <div className="max-w-2xl mx-auto min-h-[70dvh] flex flex-col justify-center">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
              step > s.id ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30" :
              step === s.id ? "bg-cyan/20 text-cyan border border-cyan/30" :
              "bg-white/[0.03] text-white/20 border border-white/[0.05]"
            }`}>
              {step > s.id ? <CheckCircle weight="fill" className="w-4 h-4" /> : s.id}
            </div>
            <span className={`text-[10px] uppercase tracking-[0.12em] hidden sm:inline ${
              step >= s.id ? "text-white/40" : "text-white/15"
            }`}>{s.label}</span>
            {s.id < 3 && <div className={`w-8 h-px ${step > s.id ? "bg-emerald-400/30" : "bg-white/[0.06]"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!complete && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ stiffness: 100, damping: 20 }}
          >
            <GlassCard>
              {step === 1 && (
                <div className="text-center space-y-6 py-8">
                  <div className="w-16 h-16 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mx-auto">
                    <Lightning weight="fill" className="w-8 h-8 text-cyan" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Welcome to ROSTR</h2>
                    <p className="text-sm text-white/35 mt-2 max-w-sm mx-auto">
                      Build, deploy, and manage autonomous AI agents — all from one dashboard.
                      Get started in under two minutes.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 text-[10px] text-white/20 font-mono uppercase tracking-[0.15em]">
                    <span>5 components</span><span>·</span><span>4-level state</span><span>·</span><span>MIT license</span>
                  </div>
                  <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan text-black font-semibold text-sm hover:shadow-[0_0_24px_rgba(34,211,238,0.25)] transition-all active:scale-[0.98]">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 py-4">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white">API Configuration</h2>
                    <p className="text-sm text-white/35 mt-1">Connect your LLM provider or use the free tier</p>
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
                          <div className="text-[11px] text-white/30">Use our DeepSeek API key — $0/month, rate limited</div>
                        </div>
                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">$0</span>
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
                          <div className="text-[11px] text-white/30">Use your own API key — no rate limits, your billing</div>
                        </div>
                      </div>
                    </button>
                    {!useFreeTier && (
                      <motion.input
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        type="password"
                        placeholder="sk-... your API key"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan/30 transition-all"
                      />
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-full border border-white/[0.08] text-white/50 text-sm hover:text-white/80 transition-colors">Back</button>
                    <button onClick={() => setStep(3)} className="flex-1 px-4 py-2.5 rounded-full bg-cyan text-black font-semibold text-sm hover:shadow-[0_0_24px_rgba(34,211,238,0.25)] transition-all active:scale-[0.98]">Continue</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 py-4">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white">Create Your First Agent</h2>
                    <p className="text-sm text-white/35 mt-1">Give it a name and purpose</p>
                  </div>
                  <input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Agent name (e.g. Research Analyst)"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan/30 transition-all"
                  />
                  <textarea
                    value={agentDesc}
                    onChange={(e) => setAgentDesc(e.target.value)}
                    placeholder="What should this agent do?"
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan/30 transition-all resize-none"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="px-4 py-2.5 rounded-full border border-white/[0.08] text-white/50 text-sm hover:text-white/80 transition-colors">Back</button>
                    <button
                      onClick={() => setComplete(true)}
                      disabled={!agentName}
                      className="flex-1 px-4 py-2.5 rounded-full bg-cyan text-black font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_24px_rgba(34,211,238,0.25)] transition-all active:scale-[0.98]"
                    >
                      Create Agent
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {complete && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ stiffness: 100, damping: 20 }}>
            <GlassCard>
              <div className="text-center space-y-6 py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-400/15 border border-emerald-400/25 flex items-center justify-center mx-auto">
                  <CheckCircle weight="fill" className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">You're all set!</h2>
                  <p className="text-sm text-white/35 mt-2">
                    {agentName} is ready. {useFreeTier ? "Running on the free tier." : "Connected to your API key."}
                  </p>
                </div>
                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan text-black font-semibold text-sm hover:shadow-[0_0_24px_rgba(34,211,238,0.25)] transition-all active:scale-[0.98]"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
