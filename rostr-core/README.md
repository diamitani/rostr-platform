<div align="center">

<img src="https://img.shields.io/badge/ROSTR-v1.0-22d3ee?style=for-the-badge" alt="ROSTR v1.0">
<img src="https://img.shields.io/badge/license-MIT-34d399?style=for-the-badge" alt="MIT License">
<img src="https://img.shields.io/badge/python-3.10+-a78bfa?style=for-the-badge" alt="Python 3.10+">
<img src="https://img.shields.io/badge/arXiv-2604.XXXXX-fbbf24?style=for-the-badge" alt="arXiv">

<br><br>

# 🧠 ROSTR — The Billion-Dollar Agent Operating System

**Runtime · Orchestration · State · Tools · Reference**

*A Unified Architecture for Production-Grade Multi-Agent Systems with Phase-Aware Orchestration and Persistent Knowledge Compounding*

<br>

[Website](https://rostr-framework.vercel.app) · [Paper](https://arxiv.org/abs/2604.XXXXX) · [Docs](https://rostr-framework.vercel.app/docs) · [Skills](https://github.com/rostr-ai/skills)

</div>

---

## 🔥 The Problem

Modern multi-agent AI systems face four critical challenges:

1. **The Prompting Bottleneck** — Translating user intent into precise agent instructions requires expertise most users don't have
2. **Retrieval Brittleness** — Agents do shallow, single-pass information gathering without source validation or gap detection
3. **Context Loss** — Agents operate statelessly, losing knowledge across sessions and failing to compound organizational learning
4. **Naive Task Routing** — Orchestration routes work by keyword matching rather than workflow phase or priority scoring

## 🎯 The Solution: ROSTR

ROSTR is a **modular agent operating system** — four integrated components that solve each challenge:

```
User Input → PAL (Compiler) → NPAO (Orchestrator) → Agents + RAG DAL + Hub → Output
```

| Component | What It Does | Open-Source |
|-----------|-------------|-------------|
| **PAL** | Prompt Abstraction Layer — Natural Language → Agent Manifest (the "LLM Compiler") | `pip install rostr-core` |
| **RAG DAL** | Dynamic Acquisition Layer — Multi-pass autonomous retrieval with 3-tier source credibility | `pip install rostr-core` |
| **NPAO** | Navigate, Prioritize, Allocate, Orchestrate — 5D phase taxonomy + 4D priority scoring | `pip install rostr-core` |
| **Rostr Hub** | Persistent reference architecture — 4-level state management with knowledge compounding | `pip install rostr-core` |

## ⚡ Quick Start

```bash
# Install
pip install rostr-core

# Run the demo
python -c "
from rostr import PALCompiler, NPAO, RAGDAL, RostrHub

# Compile intent
pal = PALCompiler()
intent, _, manifest, phase = pal.compile_intent('Research top 3 GTM automation platforms')

print(f'Phase: {phase}, Agent: {manifest.agent_type.value}, Model: {manifest.model}')
"
```

Or run the full working example:

```bash
git clone https://github.com/rostr-ai/rostr.git
cd rostr
python examples/gtm_research_agent.py
```

## 📦 Architecture

### PAL — The LLM Compiler
```
Raw NL Input
    ↓
Stage 1: Intent Extraction      → {domain, subject, constraints, urgency, ambiguity_score}
    ↓
Stage 2: Context Injection      → Load session/project/org state from reference hub
    ↓
Stage 3: Semantic Enhancement   → Expand verbs, decompose goals, inject precision
    ↓
Stage 4: Runtime Compilation    → Agent type, model, tools, memory, output format
    ↓
Stage 5: Output Routing         → Route to NPAO by domain (research→PreD, code→Dev, bug→Debug)
```

### RAG DAL — The Knowledge Engine
```
Query
    ↓
Pass 1: Broad Sweep → Decompose into sub-topics → Assess coverage
    ↓ (if confidence < 0.8)
Pass 2: Gap Fill → Target low-confidence sub-topics with Tier 1-2 sources
    ↓ (if confidence < 0.8)
Pass 3: Deep Verification → Tier 1 only for remaining gaps
    ↓
Knowledge Base Ingestion → Persistent, provenance-tracked
```

**3-Tier Source Credibility:**
- **Tier 1** (1.0): Academic — arXiv, PubMed, .gov, journals
- **Tier 2** (0.75): Editorial — Reuters, Gartner, McKinsey, trade pubs
- **Tier 3** (0.40): Community — Blogs, forums, social media

### NPAO — The Decision Engine
```
Navigate → 5D Phase Taxonomy
    PreD: Research & Feasibility  ("Is this worth building?")
    Design: Architecture & Planning ("What exactly?")
    Development: Build & Test      ("Does it work?")
    Deployment: Ship & Monitor     ("Is it safe?")
    Debugging: Investigate & Fix   ("What broke?")

Prioritize → 4D Priority Formula
    Priority = (Phase_Urgency × 0.35) + (Dependency_Impact × 0.30)
             + (Business_Impact × 0.25) + (Resource_Efficiency × 0.10)

    ≥7.0: Immediate  |  4.0-6.9: Queued  |  <4.0: Backlog

Allocate → Agent Scoring
    Score = context(0.50) + specialization(0.35) + load(0.15)

Orchestrate → Pattern Selection
    Sequential · Parallel Fan-Out · Aggregation Fan-In · Conditional Branch
```

### Rostr Hub — The Agent OS
```
rostr-hub/
├── projects/{id}/  → README, goals, decisions, architecture, knowledge-base, learnings
├── orgs/{id}/      → Identity, ICP, positioning, playbooks, knowledge-base
├── teams/{id}/     → Agents, conventions, shared-context
└── global/         → Knowledge-base, agent-templates

4-Level State: Session → Project → Organization → Agent
```

## 🛠 Open-Source Skills

Each ROSTR component is also available as a standalone skill — loadable into Claude Code, Codex, Hermes, and any skill-compatible agent platform:

| Skill | Description | Install |
|-------|-------------|---------|
| `pal-compiler` | 5-stage intent-to-manifest compilation | `hermes skills install pal-compiler` |
| `ragdal-knowledge` | Multi-pass retrieval with credibility scoring | `hermes skills install ragdal-knowledge` |
| `npao-orchestrator` | Phase-aware task routing and priority scoring | `hermes skills install npao-orchestrator` |
| `rostr-hub` | Persistent state and knowledge compounding | `hermes skills install rostr-hub` |
| `rostr-agent-builder` | Full 7-phase agent construction pipeline | `hermes skills install rostr-agent-builder` |

## 📊 Research

**"ROSTR: A Unified Architecture for Production-Grade Multi-Agent Systems with Phase-Aware Orchestration and Persistent Knowledge Compounding"**

Patrick Diamitani · April 2026 · 22,000 words · 27 references

- **arXiv**: [2604.XXXXX](https://arxiv.org/abs/2604.XXXXX)
- **Keywords**: multi-agent systems, agent orchestration, retrieval-augmented generation, prompt engineering, knowledge management, workflow automation

## 🌟 Key Innovations

1. **LLM Compiler Pattern** — First framework to treat prompt generation as a compilation problem: source code (NL) → AST (Intent) → optimization (Enhancement) → binary (Agent Manifest) → target architecture (Agent Type)

2. **5D Phase Taxonomy** — Formalized workflow lifecycle from Pre-Development through Debugging, with phase-specific completion criteria and agent specialization

3. **Multi-Pass Credibility-Weighted Retrieval** — Autonomous iterative search with convergence criteria based on confidence thresholds and cross-source validation

4. **Knowledge Compounding** — Persistent multi-namespace architecture where learnings from one agent/session are available to all others

5. **Agent Manifest as Infrastructure-as-Code** — Versioned, reproducible, auditable agent definitions

## 🤝 Contributing

ROSTR is MIT-licensed and open for contribution. See [CONTRIBUTING.md](CONTRIBUTING.md).

```bash
git clone https://github.com/rostr-ai/rostr.git
cd rostr
pip install -e ".[dev]"
pytest
```

## 📜 License

MIT © Patrick Diamitani, 2026

## 🔗 Links

- 🌐 [Website](https://rostr-framework.vercel.app)
- 📄 [Research Paper](https://arxiv.org/abs/2604.XXXXX)
- 💻 [GitHub](https://github.com/rostr-ai/rostr)
- 🛠 [Skills Marketplace](https://github.com/rostr-ai/skills)
- 🎛 [Dashboard](https://rostr-dashboard.vercel.app)

---

<div align="center">
<b>ROSTR</b> — The billion-dollar framework powering the next trillion AI agents.
</div>
