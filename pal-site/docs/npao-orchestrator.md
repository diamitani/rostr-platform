---
sidebar_position: 7
---

# NPAO — Navigate, Prioritize, Allocate, Orchestrate

**Decision Engine** — 5D phase classification + 4D priority scoring.

## 5D Phase Taxonomy

| Phase | Purpose | Key Question | Completion Criteria |
|-------|---------|-------------|-------------------|
| **PreD** | Determine IF to build | "Is this worth building?" | Problem stated, alternatives considered, go/no-go |
| **Design** | Define WHAT to build | "What exactly are we building?" | Architecture, data models, tech stack |
| **Development** | Build it | "Does it work?" | Tests pass, code reviewed, docs updated |
| **Deployment** | Ship it safely | "Is it safe to ship?" | QA passed, perf benchmarks, monitoring active |
| **Debugging** | Fix what's broken | "What broke and why?" | Root cause identified, regression test added |

## 4D Priority Scoring

| Dimension | Range | Examples |
|-----------|-------|----------|
| **Phase Urgency** | 0-10 | P0 production debug = 10, PreD research = 2 |
| **Dependency Impact** | 0-10 | 6+ tasks blocked = 10, 0 blocked = 0 |
| **Business Impact** | 0-10 | Revenue affected = 9-10, nice-to-have = 0-2 |
| **Resource Efficiency** | 0-10 | under 1 hour, high confidence = 10, multi-day = 2 |

## Composite Priority Formula

```
Priority = (Phase_Urgency × 0.35)
         + (Dependency_Impact × 0.30)
         + (Business_Impact × 0.25)
         + (Resource_Efficiency × 0.10)

Thresholds:
  ≥ 7.0  → Immediate allocation
  4.0-6.9 → Queued
  < 4.0 → Backlog
```

## Agent Allocation Algorithm

```python
def allocate_task(task, agents):
    # 1. Filter eligible agents
    eligible = [a for a in agents if
        task.phase in a.phases and
        all(tool in a.tools for tool in task.required_tools) and
        a.current_tasks < a.max_parallel_tasks]
    
    # 2. Score each agent
    for agent in eligible:
        context_score = vector_similarity(task, agent.memory)
        specialization_score = capability_overlap(task, agent)
        load_score = 1.0 - (agent.current_tasks / agent.max_parallel_tasks)
        
        scores[agent] = (
            context_score * 0.50 +
            specialization_score * 0.35 +
            load_score * 0.15
        )
    
    # 3. Allocate to highest scorer
    return max(scores, key=scores.get)
```

## Orchestration Patterns

| Pattern | Flow | Use Case |
|---------|------|----------|
| **Sequential Chain** | A → B → C | Output of A feeds B |
| **Parallel Fan-Out** | A → [B, C, D] | Independent tasks |
| **Aggregation Fan-In** | [A, B, C] → E | Synthesize results |
| **Conditional Branch** | A → decision → B or C | Conditional logic |
