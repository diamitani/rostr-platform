"""SQLite database layer for ROSTR Hub persistent state."""

import sqlite3
import os
import json
import time

DB_PATH = os.path.join(os.path.dirname(__file__), "rostr.db")


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS agents (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            agent_type TEXT NOT NULL,
            capabilities TEXT DEFAULT '[]',
            tools TEXT DEFAULT '[]',
            phases TEXT DEFAULT '[]',
            model TEXT DEFAULT 'claude-sonnet-4-6',
            max_parallel_tasks INTEGER DEFAULT 3,
            current_tasks INTEGER DEFAULT 0,
            tasks_completed INTEGER DEFAULT 0,
            success_rate REAL DEFAULT 0.0,
            avg_latency_ms REAL DEFAULT 0.0,
            status TEXT DEFAULT 'idle',
            created_at REAL NOT NULL,
            last_active_at REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS decisions (
            id TEXT PRIMARY KEY,
            context TEXT NOT NULL,
            decision TEXT NOT NULL,
            rationale TEXT DEFAULT '',
            alternatives TEXT DEFAULT '[]',
            namespace TEXT DEFAULT '',
            created_at REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS learnings (
            id TEXT PRIMARY KEY,
            context TEXT NOT NULL,
            insight TEXT NOT NULL,
            outcome TEXT DEFAULT 'observation',
            source TEXT DEFAULT '',
            tags TEXT DEFAULT '[]',
            created_at REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS knowledge_entries (
            id TEXT PRIMARY KEY,
            query_origin TEXT NOT NULL,
            content TEXT NOT NULL,
            summary TEXT DEFAULT '',
            source_url TEXT DEFAULT '',
            source_title TEXT DEFAULT '',
            source_tier REAL DEFAULT 0.4,
            credibility_score REAL DEFAULT 0.0,
            topics TEXT DEFAULT '[]',
            entities TEXT DEFAULT '[]',
            data_type TEXT DEFAULT 'factual',
            confidence REAL DEFAULT 0.0,
            created_at REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            phase TEXT NOT NULL,
            priority_score REAL DEFAULT 0.0,
            priority_status TEXT DEFAULT 'backlog',
            allocated_agent_id TEXT,
            orchestration_pattern TEXT DEFAULT 'sequential',
            status TEXT DEFAULT 'pending',
            created_at REAL NOT NULL,
            completed_at REAL
        );
    """)
    conn.commit()

    # Seed default agents if empty
    cur = conn.execute("SELECT COUNT(*) FROM agents")
    if cur.fetchone()[0] == 0:
        now = time.time()
        default_agents = [
            ("pal-researcher-001", "PAL Research Compiler", "researcher", "PreD", "web_search,file_system:read"),
            ("ragdal-indexer-001", "RAG DAL Indexer", "researcher", "PreD", "web_search"),
            ("npao-scheduler-001", "NPAO Phase Scheduler", "researcher", "PreD", "web_search,file_system:read"),
            ("builder-001", "Full-Stack Builder", "builder", "Development", "code_execution,file_system:write"),
            ("deployer-001", "Production Deployer", "deployer", "Deployment", "api:deploy"),
            ("debugger-001", "Debug Investigator", "debugger", "Debugging", "code_execution,file_system:read"),
        ]
        for agent_id, name, atype, phase, tools in default_agents:
            conn.execute(
                """INSERT INTO agents (id, name, agent_type, capabilities, tools, phases, created_at, last_active_at)
                   VALUES (?, ?, ?, '[]', ?, ?, ?, ?)""",
                (agent_id, name, atype, tools, json.dumps([phase]), now, now),
            )
        conn.commit()

    conn.close()
