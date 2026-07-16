---
name: npao-orchestrator
description: ROSTR NPAO (Navigate, Prioritize, Allocate, Orchestrate) — 5D Phase Taxonomy with 4D Priority scoring, intelligent agent allocation, and 4 production-ready orchestration patterns for multi-agent coordination.
version: 1.0.0
author: Patrick Diamitani
tags: [rostr, npao, orchestrator, multi-agent, priority-scoring, phase-taxonomy, agent-allocation]
dependencies:
  - rostr-core>=0.1.0
trigger_conditions:
  - multi-step or multi-agent task is detected by PAL
  - user request involves coordination of multiple subtasks
  - task complexity exceeds single-agent capacity
  - workflow requires phased execution with dependencies
  - agent allocation decisions needed
---

# NPAO Orchestrator — ROSTR Navigate, Prioritize, Allocate, Orchestrate

## Overview

The NPAO Orchestrator is ROSTR's central coordination engine for multi-agent, multi-phase task execution. NPAO stands for Navigate, Prioritize, Allocate, Orchestrate — the four pillars of intelligent task management. When a task exceeds what a single agent can handle, or when multiple phases with complex dependencies are involved, NPAO decomposes, sequences, and executes the work across a coordinated team of specialized agents.

NPAO is not a simple scheduler or pipeline. It is an adaptive, priority-aware orchestration system that continuously evaluates task state, agent performance, and environmental factors to make real-time allocation and orchestration decisions. It implements the 5D Phase Taxonomy for classifying work, a 4D Priority scoring formula for ranking tasks, and four production-hardened orchestration patterns.

### Why NPAO Exists

Multi-agent systems often fail due to:

1. **Coordination Overhead**: Agents step on each other's work
2. **Priority Confusion**: No clear ranking of what matters most
3. **Resource Starvation**: Critical tasks wait while low-priority work consumes agents
4. **Pattern Mismatch**: Wrong orchestration pattern for the problem structure
5. **Phase Blindness**: No recognition of the natural phases of development work

NPAO solves all five through its taxonomy, scoring, and pattern-based approach.

## The 5D Phase Taxonomy

NPAO classifies every task into one of five development phases. This taxonomy is grounded in the software development lifecycle but generalizes to any creative or engineering workflow. Each phase has distinct characteristics, agent requirements, and orchestration patterns.

### Phase 1: PreD — Pre-Design (Discovery & Planning)

The earliest phase where the problem is explored and the approach is decided.

**Characteristics:**
- High ambiguity, low specificity
- Information gathering and synthesis
- Stakeholder alignment and requirement elicitation
- Exploration of alternatives
- Risk assessment and feasibility analysis

**Agent Requirements:**
- Research agents for information gathering
- Analysis agents for synthesis and evaluation
- Planning agents for roadmap generation
- Low need for execution agents

**Orchestration Pattern:** `broadcast-gather` or `debate-consensus`

**Example Tasks:**
- "Should we use PostgreSQL or MongoDB for this application?"
- "What's the best approach for implementing real-time collaboration?"
- "Evaluate the feasibility of migrating from monolith to microservices"

### Phase 2: Design — Architecture & Specification

The phase where the solution is architected and specified in detail.

**Characteristics:**
- Moderate ambiguity, increasing specificity
- Architecture decisions and trade-off analysis
- API design and contract definition
- Data model design
- Component and interface specification
- Test strategy definition

**Agent Requirements:**
- Architecture agents for system design
- API design specialists
- Data modeling agents
- Review/validation agents

**Orchestration Pattern:** `pipeline-sequential` or `specialist-routing`

**Example Tasks:**
- "Design the REST API for the user management service"
- "Architect the event-driven pipeline for order processing"
- "Design the database schema supporting multi-tenancy"

### Phase 3: Development — Implementation

The phase where code is written, tested, and integrated.

**Characteristics:**
- Low ambiguity, high specificity
- Writing production code with tests
- Following established patterns and standards
- Continuous integration and validation
- Documentation alongside implementation

**Agent Requirements:**
- Implementation/coding agents
- Test generation agents
- Code review agents
- Documentation agents

**Orchestration Pattern:** `parallel-worker` or `pipeline-sequential`

**Example Tasks:**
- "Implement the UserService class with all CRUD operations"
- "Write the payment processing module with Stripe integration"
- "Create the React components for the dashboard"

### Phase 4: Deployment — Release & Operations

The phase where the solution is deployed, configured, and made operational.

**Characteristics:**
- Zero ambiguity, maximum specificity
- Infrastructure provisioning and configuration
- CI/CD pipeline execution
- Environment management
- Monitoring and alerting setup
- Migration execution

**Agent Requirements:**
- DevOps/infrastructure agents
- Configuration management agents
- Migration agents
- Monitoring setup agents

**Orchestration Pattern:** `pipeline-sequential` with rollback gates

**Example Tasks:**
- "Deploy the updated user service to staging"
- "Run the database migration for schema v3"
- "Configure the production monitoring dashboard"

### Phase 5: Debugging — Investigation & Repair

The phase where issues are diagnosed and resolved.

**Characteristics:**
- Variable ambiguity (high initially, decreasing with investigation)
- Hypothesis-driven exploration
- Root cause analysis
- Minimal, surgical fixes
- Regression prevention

**Agent Requirements:**
- Diagnostic agents for investigation
- Log analysis agents
- Code forensics agents
- Fix implementation agents
- Test verification agents

**Orchestration Pattern:** `broadcast-gather` for diagnosis, then `specialist-routing` for fix

**Example Tasks:**
- "Users are reporting 500 errors on the checkout page"
- "Performance degraded by 40% after the last deployment"
- "Memory leak in the WebSocket connection handler"

### Phase Detection

NPAO automatically detects the phase of incoming tasks:

```python
def detect_phase(intent_graph, context):
    """
    Phase detection heuristic based on intent characteristics.
    """
    # Check for debugging indicators
    if any(word in intent_graph.raw_input.lower() 
           for word in ['bug', 'error', 'fix', 'broken', 'crash', 'leak', 'slow']):
        return Phase.DEBUGGING
    
    # Check for deployment indicators
    if any(word in intent_graph.raw_input.lower() 
           for word in ['deploy', 'release', 'ship', 'publish', 'migrate', 'configure']):
        return Phase.DEPLOYMENT
    
    # Check for design indicators
    if any(word in intent_graph.raw_input.lower() 
           for word in ['design', 'architect', 'plan', 'structure', 'pattern', 'approach']):
        return Phase.DESIGN
    
    # Check for discovery/planning indicators
    if intent_graph.ambiguity_score > 0.5 and intent_graph.primary_intent == "QUERY":
        return Phase.PRED
    
    # Default to development
    return Phase.DEVELOPMENT
```

## The 4D Priority Scoring Formula

NPAO assigns every task and subtask a priority score across four dimensions. This composite score determines execution order and resource allocation.

### Priority Score Formula

```
P(task) = w_u × P_urgency(task) + w_i × P_impact(task) + w_d × P_dependency(task) + w_r × P_risk(task)
```

Where the weights are configurable but default to:
- `w_u` (urgency weight) = 0.30
- `w_i` (impact weight) = 0.30
- `w_d` (dependency weight) = 0.25
- `w_r` (risk weight) = 0.15

### Dimension 1: P_urgency — Temporal Urgency (0.0–1.0)

How time-sensitive is this task?

```
P_urgency(task) = deadline_proximity_factor × staleness_factor × user_urgency_signal
```

- `deadline_proximity_factor`: How close is the deadline?
  - `1.0` if overdue or due within 1 hour
  - `0.8` if due within 24 hours
  - `0.5` if due within 1 week
  - `0.2` if no deadline or due > 1 week
  
- `staleness_factor`: How long has this task been waiting?
  - `1.0` if waiting > 30 minutes
  - `0.7` if waiting 10–30 minutes
  - `0.3` if waiting < 10 minutes
  
- `user_urgency_signal`: Explicit urgency from user
  - `1.0` for "ASAP", "urgent", "critical"
  - `0.5` for normal priority
  - `0.1` for "when you have time", "low priority"

### Dimension 2: P_impact — Business/User Impact (0.0–1.0)

How much does this task matter?

```
P_impact(task) = user_impact_score × system_criticality × blast_radius
```

- `user_impact_score`: How many users affected?
  - `1.0`: All users / core feature
  - `0.7`: Majority of users / important feature
  - `0.4`: Some users / secondary feature
  - `0.1`: Few users / edge case

- `system_criticality`: Is this a critical path component?
  - `1.0`: Authentication, payments, data integrity
  - `0.7`: Core business logic
  - `0.4`: Supporting services
  - `0.1`: Non-critical / internal tools

- `blast_radius`: Failure impact scope
  - `1.0`: Data loss, security breach, revenue impact
  - `0.6`: Service degradation
  - `0.3`: Minor feature broken
  - `0.1`: Cosmetic issue

### Dimension 3: P_dependency — Dependency Criticality (0.0–1.0)

How many other tasks depend on this one?

```
P_dependency(task) = downstream_blockers_count_normalized × dependency_chain_depth_factor
```

- `downstream_blockers_count_normalized`: How many tasks are blocked by this one?
  - `min(1.0, blocked_tasks / 10)`: Normalized to [0, 1.0]

- `dependency_chain_depth_factor`: How deep in the dependency chain?
  - `1.0`: Blocking tasks that themselves block many others (root dependency)
  - `0.6`: Mid-chain dependency
  - `0.3`: Leaf dependency

### Dimension 4: P_risk — Risk Mitigation Value (0.0–1.0)

How much risk does completing this task mitigate?

```
P_risk(task) = failure_probability × failure_severity × mitigation_efficiency
```

- `failure_probability`: Likelihood of failure if task is skipped (0.0–1.0)
- `failure_severity`: Consequences if the failure occurs (0.0–1.0)
- `mitigation_efficiency`: How effectively does this task reduce risk? (0.0–1.0)
  - `1.0`: Eliminates risk entirely
  - `0.5`: Reduces risk significantly
  - `0.1`: Marginal risk reduction

### Priority Level Mapping

| P(task) Score | Priority Level | Execution Policy |
|---------------|---------------|------------------|
| 0.80 – 1.00 | CRITICAL | Execute immediately, preempt other tasks |
| 0.60 – 0.79 | HIGH | Execute next, allocate best available agent |
| 0.40 – 0.59 | MEDIUM | Execute when resources available |
| 0.20 – 0.39 | LOW | Execute in background or batch |
| 0.00 – 0.19 | OPTIONAL | Execute only if idle |

## Agent Allocation Algorithm

NPAO implements a multi-factor allocation algorithm that matches tasks to the optimal agent.

### Agent Capability Model

Every agent in the ROSTR registry has a capability profile:

```json
{
  "agent_id": "code-reviewer-v2",
  "capabilities": {
    "domains": ["python", "typescript", "go"],
    "phases": ["DESIGN", "DEVELOPMENT", "DEBUGGING"],
    "max_complexity": 0.8,
    "max_context_length": 128000,
    "specialties": ["security_review", "performance_analysis", "style_enforcement"],
    "success_rate": 0.94,
    "avg_latency_ms": 2300,
    "cost_per_token": 0.000015,
    "available_tools": ["read_file", "search_code", "run_tests", "git_diff"]
  }
}
```

### Allocation Scoring

For a given task `T` and agent `A`, the allocation score is:

```
A_score(T, A) = domain_match × 0.30 
              + phase_fit × 0.25 
              + complexity_fit × 0.15 
              + success_rate × 0.15 
              + latency_score × 0.10 
              + cost_efficiency × 0.05
```

- `domain_match`: 1.0 if task domain in agent's domains, else weighted similarity
- `phase_fit`: 1.0 if task phase in agent's phases, 0.3 otherwise
- `complexity_fit`: `1.0 - |task.complexity - agent.max_complexity|` (capped at 0.0)
- `success_rate`: Direct use of agent's historical success rate
- `latency_score`: `max(0, 1.0 - (agent.avg_latency_ms / 10000))` (normalized)
- `cost_efficiency`: `max(0, 1.0 - (agent.cost_per_token / 0.0001))` (normalized)

### Allocation Algorithm

```python
def allocate(task, available_agents, allocation_strategy="best_fit"):
    """
    Allocate task to optimal agent(s).

    Strategies:
    - best_fit: Single best agent
    - top_k: K best agents for redundancy/consensus
    - round_robin: Distribute across agents for fairness
    - cost_optimized: Best agent within budget
    """
    if allocation_strategy == "best_fit":
        scores = [(agent, A_score(task, agent)) for agent in available_agents]
        scores.sort(key=lambda x: x[1], reverse=True)
        
        best_agent, best_score = scores[0]
        
        if best_score < 0.4:
            # No agent is a good fit; escalate to human or use generic agent
            return AllocationResult(
                agent=generic_agent,
                score=best_score,
                warning="No agent scored above 0.4. Using fallback.",
                needs_human_review=True
            )
        
        return AllocationResult(agent=best_agent, score=best_score)

    elif allocation_strategy == "top_k":
        scores = [(agent, A_score(task, agent)) for agent in available_agents]
        scores.sort(key=lambda x: x[1], reverse=True)
        return AllocationResult(agents=scores[:3], strategy="top_k_consensus")

    elif allocation_strategy == "round_robin":
        # Distribute tasks evenly across qualified agents
        qualified = [a for a in available_agents if A_score(task, a) > 0.5]
        agent = qualified[current_robin_index % len(qualified)]
        current_robin_index += 1
        return AllocationResult(agent=agent, strategy="round_robin")

    elif allocation_strategy == "cost_optimized":
        scores = [(agent, A_score(task, agent)) for agent in available_agents]
        # Filter to agents above quality threshold, then pick cheapest
        qualified = [(a, s) for a, s in scores if s > 0.5]
        qualified.sort(key=lambda x: x[0].cost_per_token)
        return AllocationResult(agent=qualified[0][0], strategy="cost_optimized")
```

## The 4 Orchestration Patterns

NPAO implements four production-hardened orchestration patterns. The appropriate pattern is selected based on task structure, phase, and dependency characteristics.

### Pattern 1: Pipeline-Sequential

Tasks execute in strict sequential order with defined handoff points between stages.

**When to Use:**
- Tasks have clear linear dependencies (A → B → C)
- Output of one task is input to the next
- Quality gates needed between stages
- Phases: DESIGN, DEVELOPMENT, DEPLOYMENT

**Structure:**
```
[Stage 1: Agent A] → [Gate 1: Validation] → [Stage 2: Agent B] → [Gate 2: Validation] → [Stage 3: Agent C] → [Done]
```

**Implementation:**
```python
async def pipeline_sequential(stages, context):
    """
    Execute stages sequentially with validation gates.
    Each stage output becomes input for the next stage.
    """
    pipeline_state = context
    
    for i, stage in enumerate(stages):
        # Allocate agent for this stage
        allocation = allocate(stage.task, stage.available_agents)
        
        # Execute stage
        stage_result = await allocation.agent.execute(
            task=stage.task,
            context=pipeline_state,
            previous_stage_output=pipeline_state.get("last_output")
        )
        
        # Validation gate
        if stage.validation:
            gate_result = await stage.validation.check(stage_result)
            if not gate_result.passed:
                if stage.on_failure == "retry":
                    await _retry_stage(stage, pipeline_state)
                elif stage.on_failure == "rollback":
                    await _rollback_pipeline(stages[:i], context)
                    raise PipelineFailure(f"Stage {i} failed validation")
                elif stage.on_failure == "skip":
                    continue
        
        # Handoff state
        pipeline_state["last_output"] = stage_result
        pipeline_state[f"stage_{i}_output"] = stage_result
        
        # Log to Hub
        hub.log_stage_completion(stage, allocation, stage_result)
    
    return pipeline_state
```

**Validation Gate Types:**
- `test_pass`: All tests must pass
- `lint_pass`: All linting checks must pass
- `review_approval`: Human or agent reviewer must approve
- `coverage_threshold`: Test coverage must meet threshold
- `performance_regression`: No performance regression detected

### Pattern 2: Parallel-Worker

Independent tasks execute concurrently across multiple agents.

**When to Use:**
- Tasks are independent (no shared state or ordering constraints)
- High throughput needed
- Phases: DEVELOPMENT (parallel feature implementation), DEBUGGING (parallel investigation)

**Structure:**
```
                    ┌→ [Agent A: Task 1] ─┐
[Coordinator: Split] ─┼→ [Agent B: Task 2] ─┼→ [Coordinator: Merge]
                    └→ [Agent C: Task 3] ─┘
```

**Implementation:**
```python
async def parallel_worker(tasks, available_agents, merge_strategy="concatenate"):
    """
    Execute independent tasks in parallel.
    Merge results according to strategy.
    """
    # Allocate agents to tasks
    allocations = []
    unallocated_tasks = list(tasks)
    
    for agent in available_agents[:len(tasks)]:
        if unallocated_tasks:
            task = unallocated_tasks.pop(0)
            allocations.append(Allocation(task=task, agent=agent))
    
    # Execute in parallel
    futures = [
        allocation.agent.execute(allocation.task, context={})
        for allocation in allocations
    ]
    
    results = await asyncio.gather(*futures, return_exceptions=True)
    
    # Handle failures
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            results[i] = await _handle_worker_failure(
                allocations[i], result, unallocated_tasks
            )
    
    # Merge results
    if merge_strategy == "concatenate":
        return _concatenate_results(results)
    elif merge_strategy == "merge_conflicts":
        return _merge_with_conflict_resolution(results)
    elif merge_strategy == "vote":
        return _majority_vote(results)
    
    return results
```

### Pattern 3: Broadcast-Gather

A query or request is broadcast to multiple agents; responses are gathered and synthesized.

**When to Use:**
- Exploration/discovery tasks
- Seeking diverse perspectives or approaches
- Diagnosis and root cause analysis
- Due diligence and risk assessment
- Phases: PreD, DEBUGGING

**Structure:**
```
[Broadcaster] ──→ [Agent A: Perspective 1] ─┐
              ├─→ [Agent B: Perspective 2] ─┼→ [Synthesizer] → [Consolidated Insight]
              └─→ [Agent C: Perspective 3] ─┘
```

**Implementation:**
```python
async def broadcast_gather(query, agents, synthesizer=None):
    """
    Broadcast query to multiple agents and synthesize responses.
    """
    # Broadcast to all agents
    futures = [
        agent.execute(query, context={"role": "analyst", "perspective": agent.specialty})
        for agent in agents
    ]
    
    responses = await asyncio.gather(*futures, return_exceptions=True)
    
    # Filter out failures
    valid_responses = [r for r in responses if not isinstance(r, Exception)]
    
    if len(valid_responses) < 2:
        return valid_responses[0] if valid_responses else None
    
    # Synthesize
    if synthesizer:
        synthesis = await synthesizer.execute(
            task="Synthesize the following perspectives into a unified analysis.",
            context={"perspectives": valid_responses}
        )
    else:
        synthesis = _default_synthesize(valid_responses)
    
    # Compute consensus and dissent
    consensus_points = _extract_consensus(valid_responses)
    dissent_points = _extract_dissent(valid_responses)
    
    return BroadcastResult(
        synthesis=synthesis,
        perspectives=valid_responses,
        consensus=consensus_points,
        dissent=dissent_points,
        confidence=_compute_synthesis_confidence(valid_responses)
    )
```

### Pattern 4: Specialist-Routing

Tasks are routed to specifically qualified agents based on task subtype or domain.

**When to Use:**
- Heterogeneous task set (different types of work in the same workflow)
- Deep domain expertise required
- Phases: DESIGN (architect + security + data model specialists), DEVELOPMENT (frontend + backend + test engineers)

**Structure:**
```
[Router] ──→ classify(task) ──→ [Frontend Specialist]
                            ├─→ [Backend Specialist]
                            ├─→ [Database Specialist]
                            └─→ [DevOps Specialist]
```

**Implementation:**
```python
async def specialist_routing(tasks, agent_registry):
    """
    Route each task to the most specialized agent.
    """
    results = []
    
    for task in tasks:
        # Classify task to determine required specialty
        required_specialty = classify_task(task)
        
        # Find agents with that specialty
        specialists = agent_registry.find_by_specialty(required_specialty)
        
        if not specialists:
            # Fall back to general allocation
            allocation = allocate(task, agent_registry.all_agents)
        else:
            # Allocate within specialists only
            allocation = allocate(task, specialists, strategy="best_fit")
        
        result = await allocation.agent.execute(task)
        results.append(result)
    
    # Handle cross-cutting concerns
    await _handle_cross_cutting(results, agent_registry)
    
    return results


def classify_task(task):
    """Classify a task into its required specialty."""
    classification_rules = {
        "frontend": ["ui", "component", "react", "vue", "css", "html", "rendering"],
        "backend": ["api", "endpoint", "service", "controller", "middleware"],
        "database": ["schema", "migration", "query", "index", "sql", "orm"],
        "devops": ["deploy", "docker", "kubernetes", "ci/cd", "infrastructure"],
        "security": ["auth", "vulnerability", "xss", "csrf", "encrypt", "ssl"],
        "testing": ["test", "mock", "fixture", "assert", "coverage"],
    }
    
    task_text = task.description.lower()
    scores = {}
    for specialty, keywords in classification_rules.items():
        scores[specialty] = sum(1 for kw in keywords if kw in task_text)
    
    if max(scores.values()) == 0:
        return "general"
    
    return max(scores, key=scores.get)
```

## Orchestration Decision Engine

NPAO selects the orchestration pattern using a decision tree:

```python
def select_pattern(task_set, phase):
    """
    Select optimal orchestration pattern based on task structure.
    """
    # Count independent tasks
    independent_count = count_independent_tasks(task_set)
    total_count = len(task_set)
    independence_ratio = independent_count / total_count if total_count > 0 else 0
    
    # Pipeline check: strong sequential dependencies
    if has_sequential_dependencies(task_set) and independence_ratio < 0.3:
        return OrchestrationPattern.PIPELINE_SEQUENTIAL
    
    # Parallel check: mostly independent tasks
    if independence_ratio > 0.8:
        return OrchestrationPattern.PARALLEL_WORKER
    
    # Broadcast-gather for exploration/diagnosis
    if phase in [Phase.PRED, Phase.DEBUGGING] and is_exploration_task(task_set):
        return OrchestrationPattern.BROADCAST_GATHER
    
    # Specialist routing for heterogeneous tasks
    if has_diverse_specialties(task_set):
        return OrchestrationPattern.SPECIALIST_ROUTING
    
    # Default to pipeline for safety
    return OrchestrationPattern.PIPELINE_SEQUENTIAL
```

## Using NPAO Orchestrator

### Basic Usage

```python
from rostr_core.npao import NPAOOrchestrator

# Initialize the orchestrator
npao = NPAOOrchestrator()

# Decompose and execute a complex task
result = await npao.execute(
    task="Build a user authentication system with login, registration, password reset, and 2FA",
    available_agents=["backend-dev", "security-auditor", "test-writer", "doc-writer"]
)

# Inspect execution
print(f"Phase: {result.phase}")
print(f"Pattern: {result.orchestration_pattern}")
print(f"Duration: {result.total_duration_ms}ms")
for step in result.steps:
    print(f"  {step.agent_id}: {step.task} — {step.status} ({step.duration_ms}ms)")
```

### Custom Priority Configuration

```python
from rostr_core.npao import NPAOOrchestrator, PriorityConfig

# Customize priority weights
priority_config = PriorityConfig(
    urgency_weight=0.40,    # Increase urgency importance
    impact_weight=0.25,
    dependency_weight=0.25,
    risk_weight=0.10
)

npao = NPAOOrchestrator(priority_config=priority_config)
```

### Defining Custom Phases

```python
from rostr_core.npao import Phase, PhaseRegistry

# Add a custom phase for research
research_phase = Phase(
    name="RESEARCH",
    description="Literature review and background research",
    order=0,  # Before PreD
    agent_requirements=["research-agent", "summarization-agent"],
    default_pattern=OrchestrationPattern.BROADCAST_GATHER
)

npao.phase_registry.register(research_phase)
```

### Monitoring Orchestration

```python
# Subscribe to orchestration events
async def on_task_started(task, agent, phase):
    print(f"[{phase}] Started: {task.summary} → {agent.id}")

async def on_task_completed(task, agent, result, duration_ms):
    print(f"[DONE] {task.summary}: {result.status} in {duration_ms}ms")

async def on_pattern_change(old_pattern, new_pattern, reason):
    print(f"[PATTERN] Changed from {old_pattern} to {new_pattern}: {reason}")

npao.on("task_started", on_task_started)
npao.on("task_completed", on_task_completed)
npao.on("pattern_change", on_pattern_change)
```

## Integration with Other ROSTR Components

### PAL → NPAO

PAL routes multi-step or complex intents to NPAO with structured metadata:

```python
# PAL output
pal_result = {
    "primary_intent": "CREATE",
    "entities": ["auth_system", "User model", "API endpoints"],
    "complexity_score": 0.85,  # High complexity → NPAO
    "suggested_phases": ["DESIGN", "DEVELOPMENT", "DEPLOYMENT"],
    "suggested_decomposition": [
        "Design the auth system architecture",
        "Implement User model and database schema",
        "Build registration and login endpoints",
        "Add password reset flow",
        "Implement 2FA",
        "Write integration tests",
        "Deploy to staging"
    ]
}

# Routing to NPAO
npao.execute_from_pal(pal_result)
```

### NPAO → RAG DAL

When agents need knowledge during execution, NPAO triggers RAG DAL:

```python
# During task execution
if agent.needs_knowledge(task):
    knowledge = await rag.retrieve(
        query=task.knowledge_query,
        context=task.execution_context
    )
    task.inject_knowledge(knowledge)
```

### NPAO → ROSTR Hub

All orchestration events are logged to the Hub:
- Task lifecycle events (started, completed, failed, retried)
- Agent performance metrics
- Pattern effectiveness statistics
- Priority score accuracy tracking
- Phase transition timing

## Quality Checklist

- [ ] Phase detection correctly classifies tasks > 90% of the time
- [ ] Priority scores reflect actual business impact
- [ ] Agent allocation consistently matches top-2 candidate agents
- [ ] Orchestration pattern selection appropriate for task structure
- [ ] Pipeline gates prevent propagation of bad output
- [ ] Parallel workers do not conflict on shared resources
- [ ] Broadcast-gather produces meaningful synthesis
- [ ] Failed tasks are retried or escalated appropriately
- [ ] Orchestration events are fully logged to Hub
- [ ] Pattern transition decisions are auditable

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `AllocationFailed` | No agent meets minimum score | Escalate to human, use generic fallback |
| `PipelineStageFailure` | Stage validation gate failed | Retry stage, rollback pipeline, or skip |
| `ParallelWorkerConflict` | Workers modified same resource | Detect merge conflicts, use merge strategy |
| `BroadcastNoConsensus` | No agreement among perspectives | Report dissent, escalate to human |
| `PhaseMisclassification` | Wrong phase detected | Allow manual override, learn from correction |
| `DeadlockDetected` | Circular task dependencies | Break cycle by escalating lowest-priority task |

## References

- ROSTR Research Paper: arXiv:2604.XXXXX, Patrick Diamitani, April 2026
- rostr-core Python package: `pip install rostr-core`
- PAL Compiler: `pal-compiler` skill (Section 4.2 for PAL-to-NPAO routing)
- RAG DAL Knowledge: `ragdal-knowledge` skill
- ROSTR Hub: `rostr-hub` skill (state management for orchestration tracking)
- NPAO Protocol Specification: Section 3.3 of ROSTR paper
