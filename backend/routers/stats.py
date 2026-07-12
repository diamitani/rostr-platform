"""Live stats API — real system metrics, not mock data."""

from fastapi import APIRouter
import sys, os

router = APIRouter()


def _db():
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    from db.database import get_db
    return get_db()


@router.get("/")
def live_stats():
    """Return live system stats from the database."""
    conn = _db()
    agents_count = conn.execute("SELECT COUNT(*) FROM agents").fetchone()[0]
    active_agents = conn.execute(
        "SELECT COUNT(*) FROM agents WHERE status = 'active'"
    ).fetchone()[0]
    decisions_count = conn.execute("SELECT COUNT(*) FROM decisions").fetchone()[0]
    learnings_count = conn.execute("SELECT COUNT(*) FROM learnings").fetchone()[0]
    knowledge_count = conn.execute("SELECT COUNT(*) FROM knowledge_entries").fetchone()[0]
    tasks_count = conn.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
    completed_tasks = conn.execute(
        "SELECT COUNT(*) FROM tasks WHERE status = 'completed'"
    ).fetchone()[0]

    avg_success = conn.execute(
        "SELECT AVG(success_rate) FROM agents WHERE tasks_completed > 0"
    ).fetchone()[0] or 0.0

    conn.close()

    return {
        "active_agents": active_agents,
        "total_agents": agents_count,
        "knowledge_sources": knowledge_count,
        "orchestrations": tasks_count,
        "completed_orchestrations": completed_tasks,
        "skills_available": 5,  # The 5 ROSTR core skills
        "avg_success_rate": round(avg_success, 4),
        "uptime": "operational",
    }
