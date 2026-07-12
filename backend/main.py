"""
ROSTR SaaS Backend — FastAPI server wrapping rostr-core.

Real SaaS functionality:
  POST /pal/compile      — Compile natural language into agent manifest
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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import sys

# Add rostr-core to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "rostr-core", "src"))

from db.database import init_db
from routers import pal, ragdal, npao, hub, stats


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
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
        "docs": "/docs",
    }
