---
name: rostr-hub
description: ROSTR Hub — Central state management with 4-level persistence, multi-namespace architecture, agent registry, decision/learning logging, knowledge compounding, and cross-namespace access control for the entire ROSTR ecosystem.
version: 1.0.0
author: Patrick Diamitani
tags: [rostr, hub, state-management, agent-registry, decision-logging, knowledge-compounding, access-control, namespaces]
dependencies:
  - rostr-core>=0.1.0
trigger_conditions:
  - any ROSTR component needs state persistence
  - agent registration or discovery
  - decision logging or audit trail requirements
  - cross-namespace access or collaboration
  - knowledge compounding or learning from past executions
  - system initialization or recovery
---

# ROSTR Hub — Central State Management & Coordination

## Overview

The ROSTR Hub is the central nervous system of the ROSTR framework. It provides 4-level state management, a multi-namespace architecture for isolation and collaboration, an agent registry for discovery and capability tracking, decision and learning logging for continuous improvement, knowledge compounding across sessions, and cross-namespace access control for secure multi-tenant operations.

Every ROSTR component — PAL, RAG DAL, NPAO, and the agent builder — connects to the Hub for state persistence, event logging, and inter-component communication. The Hub is not a passive database; it is an active coordination layer that enables the ROSTR ecosystem to learn, adapt, and scale.

### Why the Hub Exists

Distributed agent systems face fundamental challenges:

1. **State Fragmentation**: Each component maintains its own state, leading to inconsistency
2. **Agent Discovery**: No central registry means agents cannot find each other
3. **Learning Amnesia**: Each session starts from scratch — past lessons are lost
4. **Access Chaos**: No unified access control across components
5. **Debugging Blindness**: No single source of truth for what happened

The ROSTR Hub solves all five through centralized, structured, and queryable state management.

## 4-Level State Management Architecture

The Hub implements a hierarchical state management system with four levels of persistence, each optimized for different types of state with different consistency guarantees and performance characteristics.

### Level 1: Ephemeral State (In-Memory)

Ultra-fast, non-persistent state for active session data.

**Characteristics:**
- Storage: Process memory
- Access Latency: < 1ms
- Persistence: Lost on process restart
- Consistency: Immediate (single process)
- Capacity: Limited by available RAM

**Use Cases:**
- Active conversation context
- Current execution state (in-progress tasks)
- Transient cache (recently accessed data)
- Live metrics and counters
- Lock state and mutexes

**Implementation:**
```python
class EphemeralStore:
    """
    Level 1: In-memory state store.
    Optimized for sub-millisecond access.
    """
    def __init__(self):
        self._store: Dict[str, Any] = {}
        self._ttl_registry: Dict[str, float] = {}
        self._subscriptions: Dict[str, List[Callable]] = {}
    
    def set(self, key: str, value: Any, ttl_ms: Optional[int] = None):
        self._store[key] = value
        if ttl_ms:
            self._ttl_registry[key] = time.monotonic() + (ttl_ms / 1000)
        self._notify(key, "set", value)
    
    def get(self, key: str) -> Optional[Any]:
        # Check TTL expiry
        if key in self._ttl_registry:
            if time.monotonic() > self._ttl_registry[key]:
                del self._store[key]
                del self._ttl_registry[key]
                return None
        return self._store.get(key)
    
    def subscribe(self, key: str, callback: Callable):
        """Subscribe to changes on a key."""
        if key not in self._subscriptions:
            self._subscriptions[key] = []
        self._subscriptions[key].append(callback)
    
    def _notify(self, key: str, event: str, value: Any):
        for callback in self._subscriptions.get(key, []):
            try:
                callback(key, event, value)
            except Exception as e:
                logger.error(f"Subscription callback failed: {e}")
```

### Level 2: Session State (File-Backed)

Persistent state scoped to the current session, surviving process restarts.

**Characteristics:**
- Storage: SQLite database + file system
- Access Latency: 5–20ms
- Persistence: Survives process restart within session
- Consistency: ACID (SQLite guarantees)
- Capacity: Limited by disk space

**Use Cases:**
- Conversation history
- Task execution history within session
- Intermediate computation results
- Session configuration overrides
- Decision logs for current session
- Agent invocation records

**Implementation:**
```python
class SessionStore:
    """
    Level 2: Session-persistent state store.
    Uses SQLite for structured data and file system for large objects.
    """
    def __init__(self, session_id: str, base_path: Path):
        self.session_id = session_id
        self.db_path = base_path / f"session_{session_id}.db"
        self.files_path = base_path / f"session_{session_id}_files"
        self._init_db()
    
    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS state (
                    key TEXT PRIMARY KEY,
                    value TEXT,
                    value_type TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    access_count INTEGER DEFAULT 0,
                    size_bytes INTEGER DEFAULT 0,
                    metadata TEXT
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    component TEXT,
                    event_type TEXT,
                    event_data TEXT,
                    correlation_id TEXT
                )
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_events_component ON events(component)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_events_correlation ON events(correlation_id)")
    
    def set(self, key: str, value: Any, metadata: dict = None):
        serialized = json.dumps(value)
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                INSERT INTO state (key, value, value_type, size_bytes, metadata)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET
                    value = excluded.value,
                    value_type = excluded.value_type,
                    updated_at = CURRENT_TIMESTAMP,
                    size_bytes = excluded.size_bytes,
                    metadata = excluded.metadata
            """, (key, serialized, type(value).__name__, len(serialized), 
                  json.dumps(metadata) if metadata else None))
    
    def get(self, key: str) -> Optional[Any]:
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                "SELECT value, value_type FROM state WHERE key = ?", (key,)
            ).fetchone()
            if row:
                # Update access count
                conn.execute(
                    "UPDATE state SET access_count = access_count + 1 WHERE key = ?", (key,)
                )
                return json.loads(row[0])
        return None
```

### Level 3: Cross-Session State (Profile-Persistent)

State that persists across multiple sessions within the same profile.

**Characteristics:**
- Storage: SQLite database per profile
- Access Latency: 10–50ms
- Persistence: Survives all processes, persists across sessions
- Consistency: ACID with optimistic locking
- Capacity: Larger, intended for months of data

**Use Cases:**
- User preferences and defaults
- Agent capability registry
- Knowledge base index
- Learning history and patterns
- Cross-session task relationships
- Performance statistics and benchmarks

**Implementation:**
```python
class ProfileStore:
    """
    Level 3: Profile-persistent state store.
    Shared across sessions within a profile.
    """
    def __init__(self, profile_path: Path):
        self.db_path = profile_path / "hub_state.db"
        self._init_db()
    
    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS profile_state (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    schema_version INTEGER DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_by_session TEXT,
                    version INTEGER DEFAULT 1,
                    metadata TEXT
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS agent_registry (
                    agent_id TEXT PRIMARY KEY,
                    agent_type TEXT NOT NULL,
                    capabilities TEXT NOT NULL,
                    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status TEXT DEFAULT 'active',
                    metadata TEXT
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS learning_log (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    session_id TEXT,
                    pattern_type TEXT,
                    pattern_data TEXT,
                    confidence REAL,
                    application_count INTEGER DEFAULT 0,
                    last_applied TIMESTAMP
                )
            """)
    
    def set(self, key: str, value: Any, session_id: str, metadata: dict = None):
        serialized = json.dumps(value)
        with sqlite3.connect(self.db_path) as conn:
            current = conn.execute(
                "SELECT version FROM profile_state WHERE key = ?", (key,)
            ).fetchone()
            
            if current:
                new_version = current[0] + 1
                conn.execute("""
                    UPDATE profile_state 
                    SET value = ?, updated_at = CURRENT_TIMESTAMP, 
                        updated_by_session = ?, version = ?, metadata = ?
                    WHERE key = ?
                """, (serialized, session_id, new_version, 
                      json.dumps(metadata) if metadata else None, key))
            else:
                conn.execute("""
                    INSERT INTO profile_state (key, value, updated_by_session, metadata)
                    VALUES (?, ?, ?, ?)
                """, (key, serialized, session_id, 
                      json.dumps(metadata) if metadata else None))
```

### Level 4: Global State (Cross-Profile, Shared)

State shared across all profiles, enabling cross-profile learning and collaboration.

**Characteristics:**
- Storage: Central SQLite or PostgreSQL database
- Access Latency: 20–100ms
- Persistence: Permanent, global scope
- Consistency: ACID with strict versioning
- Capacity: Enterprise-scale

**Use Cases:**
- Global knowledge base (anonymized patterns)
- Cross-profile agent performance benchmarks
- Shared skill effectiveness metrics
- Global configuration and feature flags
- Anonymized learning that benefits all users

**Implementation:**
```python
class GlobalStore:
    """
    Level 4: Global shared state store.
    Cross-profile, opt-in, anonymized.
    """
    def __init__(self, global_path: Path):
        self.db_path = global_path / "rostr_global.db"
        self._init_db()
    
    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            # Anonymized pattern store — no PII
            conn.execute("""
                CREATE TABLE IF NOT EXISTS global_patterns (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    pattern_hash TEXT UNIQUE NOT NULL,
                    pattern_type TEXT NOT NULL,
                    pattern_signature TEXT NOT NULL,
                    effectiveness_score REAL DEFAULT 0.5,
                    observation_count INTEGER DEFAULT 1,
                    first_observed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_observed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    source_profile_count INTEGER DEFAULT 1
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS skill_metrics (
                    skill_id TEXT NOT NULL,
                    profile_hash TEXT NOT NULL,
                    invocations INTEGER DEFAULT 1,
                    successes INTEGER DEFAULT 0,
                    avg_latency_ms REAL,
                    avg_satisfaction REAL,
                    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (skill_id, profile_hash)
                )
            """)
    
    def contribute_pattern(self, pattern_type: str, signature: str, 
                          effectiveness: float, profile_hash: str):
        """Contribute an anonymized pattern to the global store."""
        pattern_hash = hashlib.sha256(signature.encode()).hexdigest()
        
        with sqlite3.connect(self.db_path) as conn:
            existing = conn.execute(
                "SELECT id, observation_count, effectiveness_score, source_profile_count "
                "FROM global_patterns WHERE pattern_hash = ?",
                (pattern_hash,)
            ).fetchone()
            
            if existing:
                # Update existing pattern
                new_count = existing[1] + 1
                new_score = ((existing[2] * existing[1]) + effectiveness) / new_count
                conn.execute("""
                    UPDATE global_patterns 
                    SET effectiveness_score = ?, observation_count = ?,
                        last_observed = CURRENT_TIMESTAMP
                    WHERE id = ?
                """, (new_score, new_count, existing[0]))
            else:
                conn.execute("""
                    INSERT INTO global_patterns 
                    (pattern_hash, pattern_type, pattern_signature, 
                     effectiveness_score, source_profile_count)
                    VALUES (?, ?, ?, ?, ?)
                """, (pattern_hash, pattern_type, signature, effectiveness, 1))
```

### Level Selection Logic

```python
def select_level(key: str, metadata: dict = None) -> StateLevel:
    """
    Automatically select the appropriate state level based on key patterns and metadata.
    """
    # Explicit overrides
    if metadata and "level" in metadata:
        return metadata["level"]
    
    # High-frequency, short-lived keys → Level 1
    if key.startswith("transient.") or key.startswith("cache."):
        return StateLevel.EPHEMERAL
    
    # Session-scoped keys → Level 2
    if key.startswith("session.") or key.startswith("conversation."):
        return StateLevel.SESSION
    
    # Profile-persistent keys → Level 3
    if key.startswith("profile.") or key.startswith("agent.") or key.startswith("learning."):
        return StateLevel.PROFILE
    
    # Global shared keys → Level 4
    if key.startswith("global.") or key.startswith("shared."):
        return StateLevel.GLOBAL
    
    # Default to session
    return StateLevel.SESSION
```

## Multi-Namespace Architecture

The Hub supports multiple namespaces for isolation, organization, and collaboration.

### Namespace Types

| Namespace Type | Scope | Isolation | Sharing |
|---------------|-------|-----------|---------|
| `session` | Single conversation session | Full isolation | None |
| `profile` | All sessions in a profile | Profile boundary | Within profile |
| `project` | Specific project/workspace | Project boundary | Cross-session, same project |
| `global` | All profiles and projects | Minimal | Full sharing (anonymized) |
| `custom` | User-defined scope | Configurable | Configurable |

### Namespace Addressing

All Hub keys follow a namespace-prefixed addressing scheme:

```
namespace://resource_type/resource_id/attribute
```

Examples:
- `session://conversation/abc123/messages`
- `profile://user/preferences/editor`
- `project://myapp/state/build_status`
- `global://patterns/code_review/effective_responses`
- `custom://team-backend/shared/current_sprint`

### Namespace Resolution

```python
class NamespaceResolver:
    """
    Resolve namespace-prefixed keys to the correct state store and access level.
    """
    def resolve(self, key: str, context: dict) -> ResolvedKey:
        # Parse namespace
        match = re.match(r'^(\w+)://(.+)$', key)
        if not match:
            raise InvalidKeyFormat(f"Key '{key}' does not follow namespace://resource format")
        
        namespace, resource_path = match.groups()
        
        if namespace == "session":
            return ResolvedKey(
                level=StateLevel.SESSION,
                store=context["session_store"],
                path=resource_path,
                access=self._session_access(context)
            )
        elif namespace == "profile":
            return ResolvedKey(
                level=StateLevel.PROFILE,
                store=context["profile_store"],
                path=resource_path,
                access=self._profile_access(context)
            )
        elif namespace == "global":
            # Requires opt-in
            if not context.get("allow_global_sharing"):
                raise AccessDenied("Global sharing not enabled for this profile")
            return ResolvedKey(
                level=StateLevel.GLOBAL,
                store=context["global_store"],
                path=resource_path,
                access=AccessLevel.READ_ONLY  # Global is read-only for writes
            )
        # ... etc
```

## Agent Registry

The Hub maintains a comprehensive agent registry for discovery, capability matching, and lifecycle management.

### Agent Registration

```python
class AgentRegistry:
    """
    Central registry for all ROSTR agents.
    """
    def register(self, agent: Agent) -> RegistrationResult:
        """
        Register an agent with the Hub.
        """
        # Validate agent
        self._validate_agent(agent)
        
        # Check for duplicates
        existing = self._find_by_id(agent.id)
        if existing:
            return self._update_registration(existing, agent)
        
        # Store registration
        registration = {
            "agent_id": agent.id,
            "agent_type": agent.type,
            "version": agent.version,
            "capabilities": agent.capabilities.to_dict(),
            "status": "active",
            "registered_at": datetime.utcnow().isoformat(),
            "last_heartbeat": datetime.utcnow().isoformat(),
            "endpoint": agent.endpoint,
            "metadata": agent.metadata
        }
        
        self.profile_store.set(
            f"profile://agents/registry/{agent.id}",
            registration,
            metadata={"event": "agent_registered"}
        )
        
        # Announce to subscribers
        self._publish_event("agent.registered", registration)
        
        return RegistrationResult(success=True, agent_id=agent.id)
    
    def discover(self, requirements: AgentRequirements) -> List[Agent]:
        """
        Discover agents matching capability requirements.
        Used by NPAO for agent allocation.
        """
        all_agents = self._get_all_active_agents()
        
        matching = []
        for agent in all_agents:
            score = self._match_score(agent, requirements)
            if score >= requirements.min_score:
                matching.append(DiscoveredAgent(agent=agent, match_score=score))
        
        matching.sort(key=lambda x: x.match_score, reverse=True)
        return matching[:requirements.max_results]
    
    def heartbeat(self, agent_id: str) -> bool:
        """
        Update agent heartbeat. Agents that miss heartbeats are marked inactive.
        """
        agent = self._find_by_id(agent_id)
        if not agent:
            return False
        
        self.profile_store.set(
            f"profile://agents/registry/{agent_id}/last_heartbeat",
            datetime.utcnow().isoformat()
        )
        return True
    
    def _match_score(self, agent: Agent, requirements: AgentRequirements) -> float:
        """
        Compute match score between agent capabilities and requirements.
        """
        scores = []
        
        # Domain match
        domain_overlap = set(agent.capabilities.domains) & set(requirements.domains)
        if requirements.domains:
            scores.append(len(domain_overlap) / len(requirements.domains))
        
        # Phase match
        phase_overlap = set(agent.capabilities.phases) & set(requirements.phases)
        if requirements.phases:
            scores.append(len(phase_overlap) / len(requirements.phases))
        
        # Tool match
        tool_overlap = set(agent.capabilities.tools) & set(requirements.required_tools)
        if requirements.required_tools:
            scores.append(len(tool_overlap) / len(requirements.required_tools))
        
        # Performance
        if agent.performance.success_rate:
            scores.append(agent.performance.success_rate)
        
        if not scores:
            return 0.0
        
        return sum(scores) / len(scores)
```

### Agent Lifecycle States

```
[Registered] → [Active] ⇄ [Idle]
                 ↓
              [Degraded] → [Active] (recovery)
                 ↓
              [Inactive] → [Active] (heartbeat restored)
                 ↓
              [Retired] (manual)
```

## Decision and Learning Logging

The Hub records every significant decision for audit, debugging, and learning.

### Decision Log Schema

```json
{
  "decision_id": "uuid-v4",
  "timestamp": "ISO-8601",
  "session_id": "session-uuid",
  "component": "NPAO | PAL | RAG_DAL | AGENT",
  "decision_type": "allocation | routing | compilation | retrieval | execution",
  "context": {
    "task_summary": "...",
    "phase": "DEVELOPMENT",
    "priority_score": 0.75
  },
  "options_considered": [
    {"option": "agent_A", "score": 0.88, "selected": true},
    {"option": "agent_B", "score": 0.72, "selected": false},
    {"option": "agent_C", "score": 0.45, "selected": false}
  ],
  "decision_rationale": "Agent A scored highest on domain match (1.0) and phase fit (1.0)...",
  "outcome": {
    "success": true,
    "duration_ms": 3400,
    "quality_score": 0.92,
    "user_feedback": "positive"
  },
  "learning_signal": {
    "pattern_type": "allocation_success",
    "reinforcement": 0.05,
    "notes": "Agent A + Python + Development = high success"
  }
}
```

### Learning Loop

The Hub implements a continuous learning loop:

```python
class LearningEngine:
    """
    Extracts patterns from decision logs and reinforces successful behaviors.
    """
    def process_outcome(self, decision: Decision, outcome: Outcome):
        """
        Process a decision outcome and update learning models.
        """
        # Extract learning signal
        signal = self._extract_learning_signal(decision, outcome)
        
        # Store in learning log
        self.profile_store.set(
            f"profile://learning/decisions/{decision.decision_id}",
            {
                "decision": decision.to_dict(),
                "outcome": outcome.to_dict(),
                "signal": signal.to_dict()
            }
        )
        
        # Update pattern effectiveness
        pattern_key = self._derive_pattern_key(decision)
        current = self.profile_store.get(
            f"profile://learning/patterns/{pattern_key}"
        ) or {"effectiveness": 0.5, "observations": 0}
        
        new_observations = current["observations"] + 1
        new_effectiveness = (
            (current["effectiveness"] * current["observations"]) + 
            signal.reinforcement
        ) / new_observations
        
        self.profile_store.set(
            f"profile://learning/patterns/{pattern_key}",
            {
                "effectiveness": new_effectiveness,
                "observations": new_observations,
                "last_updated": datetime.utcnow().isoformat()
            }
        )
        
        # Contribute to global patterns (anonymized)
        if signal.effectiveness > 0.7 and self.allow_global_sharing:
            self.global_store.contribute_pattern(
                pattern_type=signal.pattern_type,
                signature=self._anonymize_signature(pattern_key),
                effectiveness=signal.effectiveness,
                profile_hash=self.profile_hash
            )
```

### Knowledge Compounding

Knowledge compounds across sessions through three mechanisms:

1. **Pattern Reinforcement**: Successful patterns increase in confidence and are more likely to be reused
2. **Cross-Session Memory**: Learning from session A improves decisions in session B
3. **Anonymized Global Learning**: Patterns from many users improve the system for everyone

```
Knowledge(t) = Knowledge(t-1) + α × Learning(t) + β × GlobalLearning(t)
```

Where:
- α (local learning rate) = 0.3
- β (global learning rate) = 0.1

## Cross-Namespace Access Control

### Access Control Model

The Hub implements a capability-based access control system:

```python
class AccessController:
    """
    Controls cross-namespace access based on capabilities.
    """
    def check_access(self, source_namespace: str, target_key: str, 
                    operation: str, context: dict) -> bool:
        """
        Check if source namespace can perform operation on target key.
        """
        # Same namespace — full access
        if self._same_namespace(source_namespace, target_key):
            return True
        
        # Session → Profile: allowed for shared data
        if source_namespace == "session" and target_key.startswith("profile://"):
            return self._check_session_profile_access(source_namespace, target_key)
        
        # Profile → Global: read-only, opt-in required
        if target_key.startswith("global://"):
            return operation == "read" and context.get("allow_global_sharing", False)
        
        # Cross-profile: denied by default
        if source_namespace.startswith("profile") and target_key.startswith("profile"):
            return False  # Explicitly denied: profiles are isolated
        
        # Custom namespaces: check access policies
        if self._is_custom_namespace(target_key):
            return self._check_custom_policy(source_namespace, target_key, operation)
        
        return False  # Deny by default
```

### Access Policies

```yaml
access_policies:
  # Session isolation: sessions cannot access other sessions
  session_isolation:
    rule: "session:* → session:*"
    policy: "deny unless same session_id"
  
  # Profile boundaries: profiles are isolated by default
  profile_isolation:
    rule: "profile:A → profile:B"
    policy: "deny"
  
  # Project sharing: same project can share across sessions
  project_sharing:
    rule: "session:* → project:shared_project"
    policy: "allow if session is part of project"
  
  # Global read access: anyone can read global patterns
  global_read:
    rule: "* → global://patterns/*"
    policy: "allow read if global_sharing enabled"
  
  # Global write: only Hub itself can write to global
  global_write:
    rule: "* → global://*"
    policy: "deny write"
```

## Using ROSTR Hub

### Basic Usage

```python
from rostr_core.hub import ROSTRHub

# Initialize the Hub
hub = ROSTRHub(profile_path="~/.rostr/hub/")

# Store state at appropriate level
hub.set("session://conversation/latest/messages", conversation_history)
hub.set("profile://user/preferences/theme", "dark")
hub.set("transient.cache.recent_files", recent_files, ttl_ms=300000)

# Retrieve state
messages = hub.get("session://conversation/latest/messages")
preferences = hub.get("profile://user/preferences/theme")

# Subscribe to changes
def on_theme_change(key, event, value):
    print(f"Theme changed to: {value}")

hub.subscribe("profile://user/preferences/theme", on_theme_change)
```

### Agent Registration and Discovery

```python
# Register an agent
agent = Agent(
    id="code-reviewer-v2",
    type="specialist",
    capabilities=Capabilities(
        domains=["python", "typescript"],
        phases=["DEVELOPMENT", "DEBUGGING"],
        tools=["read_file", "search_code", "run_tests"]
    )
)
hub.agent_registry.register(agent)

# Discover agents for a task
requirements = AgentRequirements(
    domains=["python"],
    phases=["DEVELOPMENT"],
    required_tools=["read_file", "search_code"],
    min_score=0.5,
    max_results=5
)
matching_agents = hub.agent_registry.discover(requirements)
```

### Decision Logging

```python
# Log a decision
hub.log_decision(
    component="NPAO",
    decision_type="allocation",
    context={"task": "Implement auth system"},
    options=[
        {"agent": "backend-dev", "score": 0.88, "selected": True},
        {"agent": "fullstack-dev", "score": 0.72, "selected": False}
    ],
    rationale="Backend specialist scored higher on domain match"
)

# Later, log the outcome
hub.log_outcome(
    decision_id="...",
    success=True,
    duration_ms=3400,
    quality_score=0.92
)
```

### Knowledge Compounding Query

```python
# Query what the system has learned
effective_patterns = hub.learning_engine.query_patterns(
    pattern_type="allocation",
    min_effectiveness=0.7,
    min_observations=5
)

for pattern in effective_patterns:
    print(f"Pattern: {pattern.signature}")
    print(f"  Effectiveness: {pattern.effectiveness:.3f}")
    print(f"  Observations: {pattern.observations}")
```

## Integration with ROSTR Components

### PAL → Hub
- Logs every compilation with full pipeline trace
- Stores compiled prompts for reuse
- Records user feedback on compilation quality

### RAG DAL → Hub
- Stores knowledge base index and metadata
- Logs retrieval operations and confidence scores
- Compounds knowledge across sessions

### NPAO → Hub
- Logs orchestration decisions and outcomes
- Tracks agent performance for allocation learning
- Stores task execution history

### Agent Builder → Hub
- Registers newly built agents
- Stores build configurations
- Tracks deployment status

## Quality Checklist

- [ ] All 4 state levels correctly selected based on key patterns
- [ ] Namespace resolution works for all standard namespaces
- [ ] Agent registry correctly discovers agents by capability
- [ ] Decision logs capture all required fields
- [ ] Learning engine correctly compounds knowledge
- [ ] Access control denies cross-profile access
- [ ] Heartbeat monitoring detects inactive agents
- [ ] State transitions are atomic and consistent
- [ ] Hub initialization is idempotent (safe to call multiple times)
- [ ] Global anonymization strips all PII before cross-profile sharing

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `NamespaceNotFound` | Invalid or unknown namespace | Return error, suggest valid namespaces |
| `AccessDenied` | Cross-namespace access violation | Log attempt, return 403 |
| `StateCorruption` | Database integrity failure | Restore from WAL/journal, rebuild index |
| `AgentHeartbeatTimeout` | Agent unresponsive | Mark agent inactive, notify NPAO |
| `LearningDegradation` | Pattern effectiveness declining | Prune low-effectiveness patterns |
| `GlobalOptOutViolation` | Attempt to share to global when opted out | Block write, respect privacy preference |

## References

- ROSTR Research Paper: arXiv:2604.XXXXX, Patrick Diamitani, April 2026
- rostr-core Python package: `pip install rostr-core`
- PAL Compiler: `pal-compiler` skill (Hub integration for compilation logging)
- RAG DAL Knowledge: `ragdal-knowledge` skill (Hub integration for knowledge persistence)
- NPAO Orchestrator: `npao-orchestrator` skill (Hub integration for orchestration state)
- ROSTR Agent Builder: `rostr-agent-builder` skill (Hub integration for agent registry)
- Hub Architecture Specification: Section 3.4 of ROSTR paper
