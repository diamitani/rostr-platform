"""
ROSTR SaaS Backend — FastAPI server wrapping rostr-core.

Real SaaS functionality:
  POST /auth/register     — Create user with API key
  POST /auth/login        — Validate API key, return session token
  POST /agents            — Create new agent (auth required)
  GET  /agents            — List user's agents with status
  GET  /agents/{id}       — Get agent detail + logs
  DELETE /agents/{id}     — Remove agent
  POST /agents/{id}/run   — Execute agent with prompt (PAL compilation)
  POST /settings/key      — Save user's BYOK API key (encrypted)
  GET  /settings/key      — Check if user has custom key
  POST /pal/compile       — Compile natural language into agent manifest (LLM + fallback)
  POST /ragdal/search     — Multi-pass retrieval with credibility scoring
  POST /ragdal/ingest     — Ingest knowledge into persistent base
  POST /npao/classify     — Classify task into 5D phase + score priority
  GET  /hub/agents        — List registered agents
  POST /hub/agents        — Register a new agent
  GET  /hub/decisions     — List logged decisions
  POST /hub/decisions     — Log a decision
  GET  /hub/learnings     — List logged learnings
  POST /hub/learnings     — Log a learning
  GET  /hub/compound      — Knowledge compounding report
  GET  /stats             — Live system stats (not mock)
"""

import os
import sys
import time

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Add rostr-core to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "rostr-core", "src"))

from db.database import init_db
from routers import pal, ragdal, npao, hub, stats, auth, agents, settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database
    init_db()

    # Record startup time for stats
    stats.set_startup_time(time.time())

    # Restore users from SQLite into in-memory store
    try:
        from db.database import get_db
        from auth_utils import get_user_store
        conn = get_db()
        rows = conn.execute("SELECT * FROM users").fetchall()
        for row in rows:
            get_user_store()[row["id"]] = {
                "id": row["id"],
                "username": row["username"],
                "api_key": row["api_key"],
                "created_at": row["created_at"],
            }
        conn.close()
    except Exception:
        pass

    yield


app = FastAPI(
    title="ROSTR Agent OS — SaaS API",
    description="PAL · RAG DAL · NPAO · Rostr Hub — The Billion-Dollar Agent Operating System",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Router registration ─────────────────────────────────────────

# Auth (unprotected — registration and login don't need a token)
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

# Protected routes (require Bearer token via get_current_user dependency)
app.include_router(agents.router, prefix="/agents", tags=["Agents"])
app.include_router(settings.router, prefix="/settings", tags=["Settings"])

# Core ROSTR routers
app.include_router(pal.router, prefix="/pal", tags=["PAL"])
app.include_router(ragdal.router, prefix="/ragdal", tags=["RAG DAL"])
app.include_router(npao.router, prefix="/npao", tags=["NPAO"])
app.include_router(hub.router, prefix="/hub", tags=["Hub"])
app.include_router(stats.router, prefix="/stats", tags=["Stats"])


@app.get("/")
def root():
    return {
        "name": "ROSTR Agent OS",
        "version": "1.0.0",
        "components": ["PAL", "RAG DAL", "NPAO", "Rostr Hub"],
        "endpoints": {
            "auth": ["POST /auth/register", "POST /auth/login"],
            "agents": ["POST /agents", "GET /agents", "GET /agents/{id}", "DELETE /agents/{id}", "POST /agents/{id}/run"],
            "settings": ["POST /settings/key", "GET /settings/key"],
            "pal": ["POST /pal/compile"],
            "ragdal": ["POST /ragdal/search", "POST /ragdal/ingest", "GET /ragdal/knowledge"],
            "npao": ["POST /npao/classify", "POST /npao/tasks", "GET /npao/tasks"],
            "hub": ["GET/POST /hub/agents", "GET/POST /hub/decisions", "GET/POST /hub/learnings", "GET /hub/compound"],
            "stats": ["GET /stats"],
        },
        "docs": "/docs",
    }


# ── Entry point ─────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
