// NPAO — Necessity, Priority, Anxiety, Opportunity.
// Classifies every task before execution, then orders the queue N -> A -> P -> O.
// Anxiety runs before Priority on purpose: unresolved friction degrades the
// quality of mission work. v1 is rule-based; the upgrade path is an LLM
// classifier with the same signature.

import type { NpaoClass } from "./types";

const NECESSITY_WORDS = ["blocked", "blocking", "required", "must", "urgent", "deadline", "broken", "blocker"];
const ANXIETY_WORDS = ["risk", "worried", "liability", "dispute", "shutoff", "lawsuit"];
const PRIORITY_WORDS = ["revenue", "launch", "customer", "pay", "sale"];
const OPPORTUNITY_WORDS = ["idea", "explore", "maybe", "improve"];

const RANK: Record<NpaoClass, number> = {
  necessity: 0,
  anxiety: 1,
  priority: 2,
  opportunity: 3,
};

function hasWord(text: string, words: string[]): boolean {
  return words.some((w) => new RegExp(`\\b${w}\\b`).test(text));
}

export function classify(text: string): NpaoClass {
  const t = text.toLowerCase();
  if (hasWord(t, NECESSITY_WORDS)) return "necessity";
  if (hasWord(t, ANXIETY_WORDS)) return "anxiety";
  if (hasWord(t, PRIORITY_WORDS)) return "priority";
  // Opportunity covers the growth words and everything else.
  if (hasWord(t, OPPORTUNITY_WORDS)) return "opportunity";
  return "opportunity";
}

export function orderByNpao<T extends { title: string }>(
  tasks: T[]
): { task: T; npao: NpaoClass }[] {
  return tasks
    .map((task) => ({ task, npao: classify(task.title) }))
    .sort((a, b) => RANK[a.npao] - RANK[b.npao]);
}
