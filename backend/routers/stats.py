"""Live stats API — real system metrics with compilations, uptime, and agent counts."""

import time
from fastapi import APIRouter

router = APIRouter()

# ── Startup time (set by main.py) ───────────────────────────────
_startup_time: float = time.time()


def set_startup_time(t: float):
    global _startup_time
    _startup_time = t


def _db():
    import sys, os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    from db.database import get_db
    return get_db()


@router.get("/")
def live_stats():
    """Return live system stats from the database and in-memory counters."""
    conn = _db()

    # Hub agents (legacy)
    agents_count = conn.execute("SELECT COUNT(*) FROM agents").fetchone()[0]
    active_agents = conn.execute(
        "SELECT COUNT(*) FROM agents WHERE status = 'active'"
    ).fetchone()[0]

    # User agents (new)
    user_agents_count = conn.execute("SELECT COUNT(*) FROM user_agents").fetchone()[0]
    user_active_agents = conn.execute(
        "SELECT COUNT(*) FROM user_agents WHERE status = 'active'"
    ).fetchone()[0]

    # Compilations
    total_compilations = conn.execute(
        "SELECT COUNT(*) FROM compilations"
    ).fetchone()[0]
    llm_compilations = conn.execute(
        "SELECT COUNT(*) FROM compilations WHERE source = 'llm'"
    ).fetchone()[0]

    # Other counts
    decisions_count = conn.execute("SELECT COUNT(*) FROM decisions").fetchone()[0]
    learnings_count = conn.execute("SELECT COUNT(*) FROM learnings").fetchone()[0]
    knowledge_count = conn.execute("SELECT COUNT(*) FROM knowledge_entries").fetchone()[0]
    tasks_count = conn.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
    completed_tasks = conn.execute(
        "SELECT COUNT(*) FROM tasks WHERE status = 'completed'"
    ).fetchone()[0]
    users_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]

    avg_success = conn.execute(
        "SELECT AVG(success_rate) FROM agents WHERE tasks_completed > 0"
    ).fetchone()[0] or 0.0

    conn.close()

    # Uptime
    uptime_seconds = time.time() - _startup_time
    hours, remainder = divmod(int(uptime_seconds), 3600)
    minutes, seconds = divmod(remainder, 60)
    uptime_str = f"{hours}h {minutes}m {seconds}s"

    # In-memory compilation counters from PAL router
    from routers.pal import compilation_count, llm_compilation_count, rule_based_count

    return {
        # Hub agents (legacy)
        "total_hub_agents": agents_count,
        "active_hub_agents": active_agents,
        # User agents
        "total_user_agents": user_agents_count,
        "active_user_agents": user_active_agents,
        # Totals for display
        "total_agents": agents_count + user_agents_count,
        "active_agents": active_agents + user_active_agents,
        # Compilations
        "total_compilations": total_compilations,
        "llm_compilations": llm_compilations,
        "rule_based_compilations": total_compilations - llm_compilations,
        "session_compilations": compilation_count,
        "session_llm_compilations": llm_compilation_count,
        "session_rule_based": rule_based_count,
        # Other
        "knowledge_sources": knowledge_count,
        "orchestrations": tasks_count,
        "completed_orchestrations": completed_tasks,
        "decisions": decisions_count,
        "learnings": learnings_count,
        "users": users_count,
        "skills_available": 5,  # The 5 ROSTR core skills
        "avg_success_rate": round(avg_success, 4),
        # Uptime
        "uptime_seconds": round(uptime_seconds, 1),
        "uptime": uptime_str,
    }
