<div align="center">

<img src="https://img.shields.io/badge/ROSTR-Platform-22d3ee?style=for-the-badge" alt="ROSTR Platform">
<img src="https://img.shields.io/badge/license-MIT-34d399?style=for-the-badge" alt="MIT License">
<img src="https://img.shields.io/badge/python-3.10+-a78bfa?style=for-the-badge" alt="Python 3.10+">
<img src="https://img.shields.io/badge/FastAPI-SaaS%20Backend-009688?style=for-the-badge" alt="FastAPI">
<img src="https://img.shields.io/badge/Docusaurus-Docs%20Site-3ECC5F?style=for-the-badge" alt="Docusaurus">

<br><br>

# 🧠 ROSTR Platform — Agent Operating System Monorepo

**Runtime · Orchestration · State · Tools · Reference**

*The full-stack platform powering ROSTR — the production-grade multi-agent operating system. Includes the SaaS backend API, the open-source core library, the documentation site, and deployment configs.*

<br>

[Website](https://rostr-framework.vercel.app) · [API Docs](https://rostr-framework.vercel.app/docs) · [Paper](https://arxiv.org/abs/2604.XXXXX) · [rostr-core on PyPI](https://pypi.org/project/rostr-core)

</div>

---

## 📦 Monorepo Structure

```
rostr-platform/
├── backend/          # FastAPI SaaS API — wraps rostr-core for production use
│   ├── main.py       # App entrypoint, router registration
│   ├── routers/      # PAL, RAG DAL, NPAO, Hub, Stats endpoints
│   ├── db/           # SQLite/persistent database layer
│   └── requirements.txt
├── rostr-core/       # Open-source Python library (pip install rostr-core)
│   ├── src/          # PAL, RAGDAL, NPAO, RostrHub implementations
│   ├── examples/     # Working agent demos
│   ├── tests/        # Test suite
│   └── pyproject.toml
├── pal-site/         # Docusaurus documentation website (deployed on Vercel)
│   ├── docs/         # Markdown documentation pages
│   └── src/          # React components and pages
├── deploy/           # Deployment configs (Railway, Docker, etc.)
└── Dockerfile        # Monorepo Docker build (backend + rostr-core)
```

---

## 🔥 What Is ROSTR?

ROSTR is a **modular agent operating system** — four integrated components that solve the hardest problems in production multi-agent AI:

| Problem | ROSTR Component | What It Does |
|---------|----------------|--------------|
| Prompting bottleneck | **PAL** — Prompt Abstraction Layer | Compiles natural language into precise Agent Manifests via a 5-stage LLM compiler |
| Retrieval brittleness | **RAG DAL** — Dynamic Acquisition Layer | Multi-pass autonomous retrieval with 3-tier source credibility scoring |
| Context loss | **Rostr Hub** | 4-level persistent state (Session → Project → Org → Agent) with knowledge compounding |
| Naive task routing | **NPAO** | Phase-aware orchestration using 5D workflow taxonomy + 4D priority scoring |

```
User Input → PAL (Compiler) → NPAO (Orchestrator) → Agents + RAG DAL + Hub → Output
```

---

## 🚀 Quick Start

### Run the SaaS Backend

```bash
git clone https://github.com/diamitani/rostr-platform.git
cd rostr-platform

# Install dependencies
pip install fastapi uvicorn pydantic

# Start the API server
cd backend
uvicorn main:app --reload
```

API will be live at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Or Use Docker

```bash
docker build -t rostr-platform .
docker run -p 8000:8000 rostr-platform
```

### Install the Core Library Only

```bash
pip install rostr-core
```

```python
from rostr import PALCompiler, NPAO, RAGDAL, RostrHub

pal = PALCompiler()
intent, _, manifest, phase = pal.compile_intent('Research top 3 GTM automation platforms')
print(f'Phase: {phase}, Agent: {manifest.agent_type.value}, Model: {manifest.model}')
```

---

## 🛠 API Endpoints

The `backend/` FastAPI server exposes the full ROSTR stack as a REST API:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/pal/compile` | Compile natural language → Agent Manifest |
| `POST` | `/ragdal/search` | Multi-pass retrieval with credibility scoring |
| `POST` | `/ragdal/ingest` | Ingest knowledge into persistent base |
| `POST` | `/npao/classify` | Classify task into 5D phase + priority score |
| `GET` | `/hub/agents` | List registered agents |
| `POST` | `/hub/agents` | Register a new agent |
| `GET` | `/hub/decisions` | List logged decisions |
| `POST` | `/hub/decisions` | Log a decision |
| `GET` | `/hub/learnings` | List logged learnings |
| `POST` | `/hub/learnings` | Log a learning |
| `GET` | `/hub/compound` | Knowledge compounding report |
| `GET` | `/stats` | Live system stats |

---

## 🏗 Component Deep Dive

### PAL — The LLM Compiler

Transforms raw natural language into structured, reproducible Agent Manifests through 5 deterministic stages:

```
Raw NL Input → Intent Extraction → Context Injection → Semantic Enhancement
             → Runtime Compilation → Output Routing (to NPAO)
```

### RAG DAL — The Knowledge Engine

Iterative multi-pass retrieval with autonomous gap detection and cross-source validation:

- **Tier 1** (credibility 1.0) — Academic: arXiv, PubMed, .gov, journals
- **Tier 2** (credibility 0.75) — Editorial: Reuters, Gartner, McKinsey, trade pubs
- **Tier 3** (credibility 0.40) — Community: Blogs, forums, social media

Passes continue until confidence ≥ 0.8 or all gaps resolved.

### NPAO — The Decision Engine

Routes, prioritizes, and allocates work across agents using:

- **5D Phase Taxonomy**: PreD → Design → Development → Deployment → Debugging
- **4D Priority Formula**: `(Phase_Urgency × 0.35) + (Dependency_Impact × 0.30) + (Business_Impact × 0.25) + (Resource_Efficiency × 0.10)`
- **Orchestration Patterns**: Sequential, Parallel Fan-Out, Aggregation Fan-In, Conditional Branch

### Rostr Hub — Persistent State

```
rostr-hub/
├── projects/{id}/   → README, goals, decisions, architecture, learnings
├── orgs/{id}/       → Identity, ICP, positioning, playbooks
├── teams/{id}/      → Agents, conventions, shared context
└── global/          → Knowledge base, agent templates
```

---

## 📚 Documentation Site

The `pal-site/` directory is a [Docusaurus](https://docusaurus.io/) site deployed to Vercel at [rostr-framework.vercel.app](https://rostr-framework.vercel.app).

```bash
cd pal-site
npm install
npm start        # dev server at localhost:3000
npm run build    # production build
```

---

## 🌐 Deployment

### Backend — Railway

```bash
cd backend
railway up
```

Railway config is at `backend/railway.json`.

### Backend — Docker

```bash
docker build -t rostr-platform .
docker run -p 8000:8000 rostr-platform
```

### Docs Site — Vercel

Deploy `pal-site/` to Vercel. Config is at `pal-site/vercel.json`.

---

## 📊 Research

**"ROSTR: A Unified Architecture for Production-Grade Multi-Agent Systems with Phase-Aware Orchestration and Persistent Knowledge Compounding"**

Patrick Diamitani · April 2026 · 22,000 words · 27 references

- **arXiv**: [2604.XXXXX](https://arxiv.org/abs/2604.XXXXX)
- **Keywords**: multi-agent systems, agent orchestration, RAG, prompt engineering, knowledge management, workflow automation

---

## 🤝 Contributing

This monorepo is MIT-licensed. See [`rostr-core/CONTRIBUTING.md`](rostr-core/CONTRIBUTING.md) for contribution guidelines.

```bash
git clone https://github.com/diamitani/rostr-platform.git
cd rostr-platform/rostr-core
pip install -e ".[dev]"
pytest
```

---

## 📜 License

MIT © Patrick Diamitani, 2026

---

<div align="center">
<b>ROSTR Platform</b> — The full-stack monorepo powering the billion-dollar agent operating system.
<br><br>
<a href="https://rostr-framework.vercel.app">Website</a> · <a href="https://arxiv.org/abs/2604.XXXXX">Paper</a> · <a href="https://github.com/rostr-ai/rostr">rostr-core</a>
</div>
