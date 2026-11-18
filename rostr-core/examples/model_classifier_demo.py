#!/usr/bin/env python3
"""
ROSTR — Model-based phase classifier demo
==========================================
Runs the keyword baseline on three tasks, then the model-based classifier
when ROSTR_LLM_BASE_URL / ROSTR_LLM_API_KEY / ROSTR_LLM_MODEL are set
(any OpenAI-compatible endpoint: OpenRouter, Groq, xAI, OpenAI, local).

Usage:
    python examples/model_classifier_demo.py
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from rostr.npao import NPAO

TASKS = [
    "Research B2B SaaS GTM automation platforms",   # contains 'plan' inside 'platforms'
    "The export button does nothing for some accounts; find out why",
    "Roll out the new pricing page to ten percent of traffic",
]


def main():
    npao = NPAO()
    print("Keyword baseline:")
    for task in TASKS:
        print(f"  {npao.classify_phase(task).name:<12} {task}")

    if all(os.environ.get(k) for k in ("ROSTR_LLM_BASE_URL", "ROSTR_LLM_API_KEY", "ROSTR_LLM_MODEL")):
        from rostr.npao.llm import LLMPhaseClassifier
        classifier = LLMPhaseClassifier.from_env(fallback=npao._classify_phase_keywords)
        model_npao = NPAO(phase_classifier=classifier)
        print(f"\nModel-based ({classifier.model}):")
        for task in TASKS:
            phase = model_npao.classify_phase(task)
            print(f"  {phase.name:<12} {task}   [{classifier.last_source}]")
    else:
        print("\nSet ROSTR_LLM_BASE_URL / ROSTR_LLM_API_KEY / ROSTR_LLM_MODEL to compare with a model.")


if __name__ == "__main__":
    main()
