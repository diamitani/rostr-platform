// PAL — Prompt Abstraction Layer. Compiles raw intent into a structured
// Manifest in five stages:
//   1. extract — pull the verb, the target, and any constraints from the goal
//   2. inject  — merge caller-supplied context into the manifest
//   3. enhance — strip hedging, add skill-specific guidance keywords
//   4. compile — build the Manifest object
//   5. route   — pick the model from the agent definition

import type { AgentDef, Manifest } from "./types";

export interface CompileInput {
  projectId: string;
  agent: AgentDef;
  goal: string;
  skillName?: string;
  skillText?: string;
  context?: string;
  allowedTools?: string[];
  maxSteps?: number;
}

const HEDGES = [
  "maybe ",
  "perhaps ",
  "i think we should ",
  "could we ",
  "might be good to ",
  "it would be nice to ",
];

const CONSTRAINT_MARKERS = [
  "without ",
  "only if ",
  "as long as ",
  "must not ",
  "never ",
  "but first ",
];

const SKILL_KEYWORDS: Record<string, string[]> = {
  research: ["cite sources", "verify claims against the sources", "note what is unknown"],
  write: ["clear structure", "plain language", "complete draft, no placeholders"],
  code: ["working code", "handle errors", "brief comments only"],
  design: ["clear hierarchy", "consistent layout", "readable at a glance"],
  analyze: ["state assumptions", "show the numbers", "note limitations"],
  default: ["be specific", "be complete", "note assumptions explicitly"],
};

// -- Stage 1: extract ---------------------------------------------------------

function stripHedges(text: string): string {
  let out = text.trim();
  const low = out.toLowerCase();
  for (const h of HEDGES) {
    if (low.startsWith(h)) {
      out = out.slice(h.length);
      break;
    }
  }
  out = out.trim();
  if (out) {
    out = out[0].toUpperCase() + out.slice(1);
  }
  if (out && !/[.!?:]$/.test(out)) {
    out += ".";
  }
  return out;
}

function extractConstraints(goal: string): string[] {
  const found: string[] = [];
  const low = goal.toLowerCase();
  for (const marker of CONSTRAINT_MARKERS) {
    const idx = low.indexOf(marker);
    if (idx >= 0) {
      const tail = goal.slice(idx).split(/[.;]/)[0].trim();
      if (tail) {
        found.push(tail);
      }
    }
  }
  return found;
}

// -- Stage 3: enhance ----------------------------------------------------------

function guidanceFor(skillName: string | undefined, goal: string): string[] {
  const hay = `${skillName ?? ""} ${goal}`.toLowerCase();
  for (const key of Object.keys(SKILL_KEYWORDS)) {
    if (key !== "default" && hay.includes(key)) {
      return SKILL_KEYWORDS[key];
    }
  }
  return SKILL_KEYWORDS["default"];
}

// -- Full pipeline --------------------------------------------------------------

export function compileManifest(input: CompileInput): Manifest {
  // Stage 1 — extract: verb + target + constraints from the raw goal text.
  const cleaned = stripHedges(input.goal);
  const constraints = extractConstraints(input.goal);

  // Stage 2 — inject: merge the caller-supplied context.
  // CRITICAL: retrievedContext must be populated — the Python version built
  // the prompt but dropped it from the manifest, starving workers of context.
  const retrievedContext = input.context ?? "";

  // Stage 3 — enhance: skill-specific guidance keywords.
  const guidance = guidanceFor(input.skillName, input.goal);

  // Stage 4 — compile the manifest.
  // CRITICAL: skillText must be populated — the Python version dropped it,
  // so workers never received the skill they were supposed to follow.
  const manifest: Manifest = {
    projectId: input.projectId,
    agentId: input.agent.id,
    skillName: input.skillName,
    goal: cleaned,
    skillText: input.skillText ?? "",
    retrievedContext,
    constraints: [...constraints, ...guidance.map((g) => `guidance: ${g}`)],
    allowedTools: input.allowedTools ?? ["read_file", "write_file", "list_dir"],
    maxSteps: input.maxSteps ?? 12,
    model: input.agent.model, // Stage 5 — route: model comes from the agent def.
  };

  return manifest;
}
