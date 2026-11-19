#!/usr/bin/env python3
"""
NPAO phase-classifier benchmark
================================
Scores phase classification on a labeled dataset (benchmarks/datasets/
phase_tasks.jsonl: 45 tasks, 9 per phase, a third deliberately tricky).

Always runs the offline keyword baseline. When ROSTR_LLM_BASE_URL,
ROSTR_LLM_API_KEY and ROSTR_LLM_MODEL are set, also runs the model-based
classifier through any OpenAI-compatible endpoint and compares.

Usage:
    python benchmarks/phase_classifier_benchmark.py                # keywords only
    ROSTR_LLM_BASE_URL=... ROSTR_LLM_API_KEY=... ROSTR_LLM_MODEL=... \\
        python benchmarks/phase_classifier_benchmark.py            # both
"""

import json
import os
import sys
import time
from collections import defaultdict

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from rostr.npao import NPAO, PhaseType  # noqa: E402

DATASET = os.path.join(os.path.dirname(__file__), "datasets", "phase_tasks.jsonl")
RESULTS = os.path.join(os.path.dirname(__file__), "results", "phase_classifier_benchmark.json")


def load_dataset(path):
    rows = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def score(name, predict, rows):
    per_phase = defaultdict(lambda: [0, 0])  # phase -> [correct, total]
    confusions = defaultdict(int)
    correct = 0
    tricky = [0, 0]
    started = time.time()
    for row in rows:
        expected = PhaseType[row["phase"]]
        got = predict(row["task"])
        ok = got == expected
        correct += ok
        per_phase[row["phase"]][0] += ok
        per_phase[row["phase"]][1] += 1
        if row.get("tricky"):
            tricky[0] += ok
            tricky[1] += 1
        if not ok:
            confusions[f"{row['phase']}->{got.name}"] += 1
    elapsed = time.time() - started
    return {
        "classifier": name,
        "accuracy": round(correct / len(rows), 4),
        "correct": correct,
        "total": len(rows),
        "tricky_correct": tricky[0],
        "tricky_total": tricky[1],
        "per_phase": {p: {"correct": c, "total": t} for p, (c, t) in sorted(per_phase.items())},
        "confusions": dict(sorted(confusions.items(), key=lambda kv: -kv[1])),
        "seconds": round(elapsed, 2),
    }


def print_report(result):
    r = result
    print(f"\n== {r['classifier']} ==")
    print(f"accuracy: {r['correct']}/{r['total']} = {r['accuracy'] * 100:.1f}%"
          f"   (tricky subset: {r['tricky_correct']}/{r['tricky_total']})   [{r['seconds']}s]")
    for phase, d in r["per_phase"].items():
        print(f"  {phase:<12} {d['correct']}/{d['total']}")
    if r["confusions"]:
        print("  confusions:", ", ".join(f"{k} x{v}" for k, v in r["confusions"].items()))


def main():
    rows = load_dataset(DATASET)
    # Optional slice "start:end" lets a long paced model run be split across
    # processes; ROSTR_BENCH_OUT writes the raw result JSON for merging.
    sl = os.environ.get("ROSTR_BENCH_SLICE", "").strip()
    if sl:
        a, _, b = sl.partition(":")
        rows = rows[int(a or 0): int(b) if b else None]
    print(f"dataset: {len(rows)} tasks from {os.path.relpath(DATASET)}")
    delay = float(os.environ.get("ROSTR_BENCH_DELAY", "0"))

    results = []

    keyword_npao = NPAO()
    results.append(score("keyword-heuristic", keyword_npao.classify_phase, rows))

    if all(os.environ.get(k) for k in ("ROSTR_LLM_BASE_URL", "ROSTR_LLM_API_KEY")) and (
        os.environ.get("ROSTR_LLM_MODEL") or "openrouter" in os.environ["ROSTR_LLM_BASE_URL"]
    ):
        from rostr.npao.llm import LLMPhaseClassifier
        classifier = LLMPhaseClassifier.from_env(fallback=keyword_npao._classify_phase_keywords)
        model_npao = NPAO(phase_classifier=classifier)
        sources = []

        def model_predict(task):
            if delay:
                time.sleep(delay)
            phase = model_npao.classify_phase(task)
            sources.append(classifier.last_source)
            return phase

        result = score(f"model ({classifier.model})", model_predict, rows)
        result["keyword_fallbacks"] = sources.count("keyword")
        results.append(result)
    else:
        print("\n(model run skipped: set ROSTR_LLM_BASE_URL / ROSTR_LLM_API_KEY / ROSTR_LLM_MODEL)")

    for r in results:
        print_report(r)

    out = os.environ.get("ROSTR_BENCH_OUT", "").strip() or RESULTS
    os.makedirs(os.path.dirname(out), exist_ok=True)
    report = {"dataset": os.path.relpath(DATASET), "runs": results}
    with open(out, "w") as f:
        json.dump(report, f, indent=2)
    print(f"\nreport written to {os.path.relpath(RESULTS)}")


if __name__ == "__main__":
    main()
