"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Circle,
  ArrowLeft,
  ArrowRight,
  Sparkle,
  Key,
  Robot,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { ApiKeyInput } from "./ApiKeyInput";

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    title: "Welcome to ROSTR",
    description: "Autonomous agents, simplified",
    icon: Sparkle,
  },
  {
    title: "API Configuration",
    description: "Choose your model provider",
    icon: Key,
  },
  {
    title: "Create Your First Agent",
    description: "Configure your first autonomous agent",
    icon: Robot,
  },
];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [useFreeTier, setUseFreeTier] = useState(true);
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const canProceedStep1 = true;
  const canProceedStep2 = useFreeTier || apiKey.length >= 20;
  const canProceedStep3 = agentName.trim().length > 0 && selectedTools.length > 0;

  const complete = () => {
    // In real app, save config and redirect
    window.location.href = "/";
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((step, i) => (
          <div key={i} className="flex-1 flex items-center">
            <div
              className={clsx(
                "h-1 rounded-full transition-all duration-500 flex-1",
                i <= currentStep
                  ? "bg-cyan"
                  : "bg-white/[0.06]"
              )}
            />
            {i < steps.length - 1 && <div className="w-2" />}
          </div>
        ))}
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                i < currentStep
                  ? "bg-cyan/20 text-cyan border border-cyan/30"
                  : i === currentStep
                  ? "bg-cyan/10 text-cyan border border-cyan/40"
                  : "bg-white/[0.03] text-white/25 border border-white/[0.06]"
              )}
            >
              {i < currentStep ? (
                <CheckCircle className="w-4 h-4" weight="fill" />
              ) : (
                <step.icon className="w-4 h-4" weight={i === currentStep ? "fill" : "regular"} />
              )}
            </div>
            <span
              className={clsx(
                "text-xs font-medium hidden sm:inline transition-colors",
                i === currentStep ? "text-white/80" : "text-white/30"
              )}
            >
              {step.title}
            </span>
            {i < steps.length - 1 && (
              <div className="w-6 h-px bg-white/[0.06] hidden sm:block" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ stiffness: 100, damping: 20 }}
          className="glass-card double-bezel p-8"
        >
          {/* Step 1: Welcome */}
          {currentStep === 0 && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, stiffness: 100, damping: 20 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                  <Sparkle className="w-10 h-10 text-cyan" weight="duotone" />
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Welcome to{" "}
                <span className="text-cyan font-mono tracking-tight">
                  ROSTR
                </span>
              </h1>
              <p className="text-white/40 max-w-md mx-auto leading-relaxed">
                Build, deploy, and manage autonomous AI agents. ROSTR gives you
                the infrastructure to run intelligent agents that can research,
                code, analyze, and automate workflows.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {["Autonomous", "Multi-agent", "Observable", "Extensible"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Step 2: API Key */}
          {currentStep === 1 && (
            <div className="py-4">
              <h2 className="text-xl font-bold text-white mb-2">
                Configure Your API
              </h2>
              <p className="text-white/40 text-sm mb-8">
                Connect to an LLM provider to power your agents. You can start
                with the free tier or bring your own API key.
              </p>
              <ApiKeyInput
                value={apiKey}
                onChange={setApiKey}
                useFreeTier={useFreeTier}
                onFreeTierChange={setUseFreeTier}
              />
            </div>
          )}

          {/* Step 3: First Agent */}
          {currentStep === 2 && (
            <div className="py-4">
              <h2 className="text-xl font-bold text-white mb-2">
                Create Your First Agent
              </h2>
              <p className="text-white/40 text-sm mb-8">
                Give your agent a name, describe what it does, and pick the
                tools it needs.
              </p>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g., Research Analyst"
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/15 focus:outline-none focus:border-cyan/30 focus:bg-white/[0.05] transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={agentDescription}
                    onChange={(e) => setAgentDescription(e.target.value)}
                    placeholder="What does this agent do?"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/15 focus:outline-none focus:border-cyan/30 focus:bg-white/[0.05] transition-all resize-none"
                  />
                </div>

                {/* Tools */}
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">
                    Select Tools
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "web_search",
                      "document_parser",
                      "summarizer",
                      "code_analysis",
                      "chat",
                      "reporting",
                    ].map((tool) => {
                      const selected = selectedTools.includes(tool);
                      return (
                        <button
                          key={tool}
                          onClick={() =>
                            setSelectedTools((prev) =>
                              selected
                                ? prev.filter((t) => t !== tool)
                                : [...prev, tool]
                            )
                          }
                          className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left border transition-all",
                            selected
                              ? "border-cyan/30 bg-cyan/[0.06] text-cyan"
                              : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:border-white/[0.12]"
                          )}
                        >
                          {selected ? (
                            <CheckCircle
                              className="w-3.5 h-3.5 flex-shrink-0"
                              weight="fill"
                            />
                          ) : (
                            <Circle className="w-3.5 h-3.5 flex-shrink-0" />
                          )}
                          <span className="truncate">{tool}</span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedTools.length === 0 && (
                    <p className="text-xs text-white/20 mt-2">
                      Select at least one tool for your agent
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
            <button
              onClick={goBack}
              disabled={currentStep === 0}
              className={clsx(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all",
                currentStep === 0
                  ? "text-white/15 cursor-not-allowed"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={goNext}
                disabled={
                  (currentStep === 1 && !canProceedStep2) ||
                  (currentStep === 2 && !canProceedStep3)
                }
                className={clsx(
                  "flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-all",
                  (currentStep === 1 && !canProceedStep2) ||
                  (currentStep === 2 && !canProceedStep3)
                    ? "bg-white/[0.04] text-white/20 cursor-not-allowed"
                    : "bg-cyan/15 text-cyan border border-cyan/20 hover:bg-cyan/20"
                )}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={complete}
                disabled={!canProceedStep3}
                className={clsx(
                  "flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-all",
                  canProceedStep3
                    ? "bg-cyan text-black hover:bg-cyan/90"
                    : "bg-white/[0.04] text-white/20 cursor-not-allowed"
                )}
              >
                <CheckCircle className="w-4 h-4" weight="fill" />
                Complete Setup
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
