# Changelog

## 1.0.1 (2026-11-18)

- Fix: whole-word keyword matching in NPAO phase classification and PAL domain
  classification. Substring matching misclassified tasks — "platforms" matched
  the "plan" design keyword, which sent research tasks to the Design phase and
  left PRED-only agents unallocated (the failing test_full_pipeline).
- Add: model-based phase classifier `rostr.npao.llm.LLMPhaseClassifier` for any
  OpenAI-compatible endpoint (OpenRouter, Groq, xAI, OpenAI, local), configured
  with `ROSTR_LLM_BASE_URL` / `ROSTR_LLM_API_KEY` / `ROSTR_LLM_MODEL`.
  Degrades to the keyword heuristic on any endpoint or parse failure and
  records which path answered in `last_source`.
- Add: `NPAO(phase_classifier=...)` wiring.
- Add: phase-classifier benchmark (`benchmarks/phase_classifier_benchmark.py`)
  with a 45-task labeled dataset (a third deliberately tricky). Keyword
  baseline on this dataset: 66.7% overall, 4/18 on the tricky subset.
- Tests: 49 passing (was 42 passing, 1 failing).
