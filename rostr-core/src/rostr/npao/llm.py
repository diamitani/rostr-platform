"""
LLM-backed NPAO phase classifier
================================
Replaces the keyword heuristic in ``NPAO.classify_phase`` with a call to any
OpenAI-compatible chat endpoint (OpenRouter, Groq, xAI, OpenAI, a local
server). No new dependencies: stdlib urllib only.

Usage:
    from rostr.npao import NPAO
    from rostr.npao.llm import LLMPhaseClassifier

    classifier = LLMPhaseClassifier.from_env()   # reads ROSTR_LLM_* env vars
    npao = NPAO(phase_classifier=classifier)

Environment:
    ROSTR_LLM_BASE_URL  e.g. https://openrouter.ai/api/v1
    ROSTR_LLM_API_KEY   provider key (BYOK)
    ROSTR_LLM_MODEL     e.g. meta-llama/llama-3.3-70b-instruct:free

The classifier always degrades to the keyword heuristic when the endpoint is
unreachable, slow, or returns unusable output, and records which path
produced the last answer in ``last_source`` ("model" | "keyword").
"""

from __future__ import annotations

import json
import os
import re
import time
import urllib.request
import urllib.error
from typing import Callable, Optional

from . import PhaseType

PHASE_LABELS = {p.name: p for p in PhaseType}

SYSTEM_PROMPT = """You classify an engineering/business task into exactly one phase of the 5D taxonomy:
- PRED: research and feasibility ("is this worth building?")
- DESIGN: architecture and planning ("what exactly are we building?")
- DEVELOPMENT: implementation ("build it")
- DEPLOYMENT: shipping and release ("is it safe to ship?")
- DEBUGGING: investigate and fix ("what broke and why?")

Answer with JSON only: {"phase": "PRED"|"DESIGN"|"DEVELOPMENT"|"DEPLOYMENT"|"DEBUGGING"}
Pick the phase of the actual work requested, not words that merely appear in the task."""


class LLMPhaseClassifier:
    """Model-based phase classifier with keyword fallback."""

    def __init__(
        self,
        base_url: str,
        api_key: str,
        model: str,
        fallback=None,
        call_fn: Optional[Callable[[str, str], str]] = None,
        timeout_seconds: float = 15.0,
    ):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model
        self.timeout_seconds = timeout_seconds
        # fallback: callable(task_description, domain) -> PhaseType
        self._fallback = fallback
        # call_fn(system_prompt, user_prompt) -> raw response text; injectable for tests
        self._call_fn = call_fn or self._http_call
        self.last_source: str = "keyword"
        self.last_error: Optional[str] = None

    @classmethod
    def from_env(cls, fallback=None) -> "LLMPhaseClassifier":
        base_url = os.environ.get("ROSTR_LLM_BASE_URL", "").strip()
        api_key = os.environ.get("ROSTR_LLM_API_KEY", "").strip()
        model = os.environ.get("ROSTR_LLM_MODEL", "").strip()
        if not model and "openrouter" in base_url:
            # Free-tier default so the classifier costs nothing on OpenRouter.
            model = "inclusionai/ling-3.2-flash:free"
        if not (base_url and api_key and model):
            raise ValueError(
                "Set ROSTR_LLM_BASE_URL, ROSTR_LLM_API_KEY and ROSTR_LLM_MODEL "
                "to use the model-based classifier."
            )
        return cls(base_url=base_url, api_key=api_key, model=model, fallback=fallback)

    def classify(self, task_description: str, domain: str = "") -> PhaseType:
        """Classify via the model; fall back to keywords on any failure."""
        user_prompt = task_description if not domain else f"[domain: {domain}] {task_description}"
        try:
            raw = self._call_fn(SYSTEM_PROMPT, user_prompt)
            phase = self._parse(raw)
        except Exception as exc:  # network, timeout, parse — all degrade
            self.last_error = f"{type(exc).__name__}: {exc}"
            self.last_source = "keyword"
            if self._fallback is not None:
                return self._fallback(task_description, domain)
            raise
        self.last_error = None
        self.last_source = "model"
        return phase

    @staticmethod
    def _parse(raw: str) -> PhaseType:
        text = raw.strip()
        label = ""
        # Preferred: a complete JSON object (tolerate ```json fences/prose).
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                data = json.loads(text[start : end + 1])
                label = str(data.get("phase", "")).strip().upper()
            except json.JSONDecodeError:
                label = ""
        # Small models often truncate the object at the token cap; recover a
        # bare "phase": "LABEL" pair when no complete object parsed. Skip
        # schema echoes like "phase": "PRED"|"DESIGN"|... (the "|" tells).
        if not label:
            m = re.search(r'"phase"\s*:\s*"([A-Za-z]+)"(?!\s*\|)', text)
            if m:
                label = m.group(1).strip().upper()
        # Last resort: exactly one taxonomy label appears as a whole word in
        # the output (e.g. a bare '"DEPLOYMENT"'). More than one distinct
        # label means the model echoed the schema — ambiguous, refuse.
        if not label:
            found = {
                m.group(0)
                for m in re.finditer(
                    r"\b(PRED|DESIGN|DEVELOPMENT|DEPLOYMENT|DEBUGGING)\b",
                    text.upper(),
                )
            }
            if len(found) == 1:
                label = found.pop()
        if label not in PHASE_LABELS:
            raise ValueError(f"no usable phase label in model output: {text[:120]!r}")
        return PHASE_LABELS[label]

    def _http_call(self, system_prompt: str, user_prompt: str) -> str:
        body = json.dumps({
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0,
            # Generous cap: several hosted models spend leading tokens on
            # hidden reasoning before emitting content; a tight cap starves
            # the answer (null or truncated JSON).
            "max_tokens": 600,
            # Ask OpenRouter-style routers to skip the reasoning preamble.
            "reasoning": {"exclude": True},
        }).encode("utf-8")
        req = urllib.request.Request(
            f"{self.base_url}/chat/completions",
            data=body,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
            method="POST",
        )
        for attempt in range(2):
            try:
                with urllib.request.urlopen(req, timeout=self.timeout_seconds) as resp:
                    payload = json.loads(resp.read().decode("utf-8"))
                content = payload["choices"][0]["message"].get("content")
                if content is None:
                    # Reasoning-style models can return null content when the
                    # token cap is eaten by reasoning; treat as a real error
                    # so the caller falls back deliberately, not with a crash.
                    raise ValueError("model returned null content (token cap likely eaten by reasoning)")
                return content
            except urllib.error.HTTPError as exc:
                # Rate limit / transient server error: one retry after a pause.
                if exc.code in (429, 500, 502, 503, 504) and attempt == 0:
                    time.sleep(4)
                    continue
                raise
