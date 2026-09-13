---
name: pal-compiler
description: ROSTR PAL (Prompt Abstraction Layer) — 5-stage compiler pipeline for transforming raw user intents into optimized, context-rich, executable prompts through Intent extraction, Context injection, Semantic enhancement, Runtime compilation, and Output routing.
version: 1.0.0
author: Patrick Diamitani
tags: [rostr, pal, prompt-compiler, abstraction-layer, intent-extraction, semantic-enhancement, output-routing]
dependencies:
  - rostr-core>=0.1.0
trigger_conditions:
  - user provides a natural-language instruction
  - user asks to compile, optimize, or enhance a prompt
  - any ROSTR pipeline that requires PAL preprocessing
  - agent initialization or intent routing
---

# PAL Compiler — ROSTR Prompt Abstraction Layer

## Overview

The PAL (Prompt Abstraction Layer) is the central compiler pipeline of the ROSTR framework, responsible for transforming raw, unstructured user intents into structured, context-rich, and semantically precise prompts that downstream agents and models can execute with high fidelity. PAL implements a rigorous 5-stage compilation pipeline that mirrors traditional compiler design — lexing, parsing, optimization, code generation, and linking — but applied to the domain of natural language prompting.

PAL is the entry point for every user interaction in ROSTR. Before any agent receives a task, before any orchestration begins, and before any knowledge retrieval fires, the raw input passes through PAL's five stages. This ensures that every downstream operation starts from a clean, unambiguous, and fully contextualized specification.

### Why PAL Exists

Modern LLM-based systems suffer from "prompt drift" — the degradation of instruction quality as prompts pass through multiple agents, tools, and context windows. PAL solves this by:

1. **Normalizing** user input into a canonical representation
2. **Enriching** that representation with session, user, and domain context
3. **Disambiguating** vague or incomplete instructions
4. **Compiling** the enriched intent into an executable format
5. **Routing** the compiled prompt to the correct target(s)

## The 5-Stage PAL Compiler Pipeline

```
Raw Input → [Stage 1: Intent Extraction] → [Stage 2: Context Injection] → [Stage 3: Semantic Enhancement] → [Stage 4: Runtime Compilation] → [Stage 5: Output Routing] → Executable Prompt
```

### Stage 1: Intent Extraction (LEX)

The first stage parses raw user input to extract structured intent. This is analogous to lexical analysis in a traditional compiler — breaking down the input stream into meaningful tokens.

**Process:**

1. **Tokenization**: Split input into semantic tokens (verbs, nouns, entities, constraints)
2. **Intent Classification**: Map tokens to one or more intent categories:
   - `CREATE` — generate, build, write, produce
   - `QUERY` — ask, retrieve, find, search for information
   - `MODIFY` — update, change, edit, refactor
   - `DELETE` — remove, delete, clean up
   - `ANALYZE` — review, evaluate, assess, debug
   - `ORCHESTRATE` — coordinate, schedule, pipeline
   - `CONFIGURE` — setup, install, initialize
3. **Entity Extraction**: Identify key entities (files, services, people, dates, systems)
4. **Constraint Extraction**: Capture explicit constraints (deadlines, formats, quality bars, scope limits)
5. **Ambiguity Flagging**: Mark ambiguous or underspecified elements for resolution in later stages

**Output**: A structured `IntentGraph` containing:
```json
{
  "primary_intent": "CREATE",
  "secondary_intents": ["ANALYZE"],
  "entities": ["file.py", "function_x", "API"],
  "constraints": {"deadline": "today", "language": "python"},
  "ambiguities": ["function_x: unresolved reference"],
  "confidence": 0.92
}
```

**Implementation Guidelines:**
- Use a combination of regex patterns and lightweight classifier models
- Intent classification should be deterministic and auditable
- Fall back to `QUERY` when intent is ambiguous
- Log all ambiguity flags for continuous improvement
- Respect user language — do not over-normalize creative or stylistic intent

### Stage 2: Context Injection (PARSE)

The second stage enriches the parsed intent with contextual information from multiple sources. This is analogous to parsing — building an abstract syntax tree that incorporates surrounding context.

**Context Sources (in priority order):**

1. **Session Context** (weight: 1.0):
   - Conversation history (last N turns)
   - Active working directory
   - Current git branch and repo state
   - Open files and buffers
   - Previous PAL compilation outputs from this session

2. **User Context** (weight: 0.9):
   - User preferences and defaults
   - Skill level indicators (novice/expert signals)
   - Common workflows and patterns
   - User-defined aliases and shortcuts

3. **Project Context** (weight: 0.85):
   - Project structure (file tree, package layout)
   - Build system and dependencies
   - Code style and conventions (linting rules, formatters)
   - README, CONTRIBUTING, and other governance docs

4. **Domain Context** (weight: 0.7):
   - Domain-specific terminology and jargon
   - Industry standards and best practices
   - Regulatory or compliance requirements

5. **Environmental Context** (weight: 0.6):
   - OS, shell, and runtime environment
   - Available tools and their versions
   - Resource constraints (memory, compute, API limits)

**Context Fusion Algorithm:**
```
context_score = Σ (source_value × source_weight) / Σ(source_weight)
```

Context is merged using a priority-based overlay: higher-priority sources override lower-priority ones on conflict, and complementary information is additive.

**Output**: An augmented `IntentGraph` with context nodes attached to each entity, constraint, and intent.

### Stage 3: Semantic Enhancement (OPTIMIZE)

The third stage optimizes the enriched intent graph for maximum clarity, precision, and executability. This is the optimizer pass — applying transformations that improve the prompt without changing its semantics.

**Enhancement Passes:**

1. **Disambiguation Pass**:
   - Resolve ambiguous references using context
   - Prompt user for clarification when ambiguity exceeds threshold
   - Apply heuristics for common ambiguous patterns

2. **Precision Pass**:
   - Expand vague terms into concrete specifications
   - "make it better" → "improve performance by ≥10% while maintaining test coverage"
   - "fix the bug" → "resolve NullPointerException at line 342 of handler.py"
   - Add measurable success criteria where possible

3. **Structure Pass**:
   - Organize multi-step intents into sequential or parallel sub-goals
   - Establish dependencies between sub-goals
   - Insert checkpoints and validation gates

4. **Constraint Resolution Pass**:
   - Resolve conflicting constraints with priority rules
   - Expand implicit constraints (e.g., "today" → explicit date)
   - Validate constraint feasibility against environmental context

5. **Inference Pass**:
   - Infer unstated requirements from context
   - "write tests" → "write unit tests for the UserService class using pytest, covering all public methods"
   - Flag inferred additions so they can be confirmed or rejected

**Enhancement Rules Engine:**
```python
class EnhancementRule:
    pattern: str          # Regex or semantic pattern to match
    condition: Callable   # Additional conditions for application
    transform: Callable   # Transformation function
    priority: int         # Execution order (lower = earlier)
    reversible: bool      # Can the user undo this enhancement?
```

**Output**: A fully resolved, disambiguated, and structured `EnhancedIntentGraph`.

### Stage 4: Runtime Compilation (CODEGEN)

The fourth stage compiles the enhanced intent graph into an executable prompt format tailored to the target model or agent. This is code generation — producing the final prompt that will be consumed.

**Compilation Targets:**

1. **System Prompt Compilation**: Produces structured system instructions
2. **User Message Compilation**: Produces the user-facing message
3. **Tool Specification Compilation**: Generates tool-use schemas
4. **Context Window Compilation**: Assembles the full context window payload

**Compilation Strategies:**

| Strategy | Description | Use Case |
|----------|-------------|----------|
| `direct` | Pass-through with formatting | Simple, unambiguous intents |
| `cot` | Chain-of-Thought prompting | Complex reasoning tasks |
| `few_shot` | Include examples | Pattern-matching tasks |
| `structured` | JSON/YAML-formatted output | Data extraction / generation |
| `role_play` | Persona-based instructions | Creative or conversational tasks |
| `stepwise` | Sequential instruction blocks | Multi-step procedural tasks |
| `socratic` | Question-driven elicitation | Exploratory or diagnostic tasks |
| `self_critique` | Include self-evaluation steps | High-stakes or accuracy-critical tasks |

**Compilation Parameters:**
- `target_model`: Model family and version (e.g., `claude-4`, `gpt-5`, `deepseek-v4`)
- `max_tokens`: Context window budget allocation
- `temperature`: Desired creativity/precision balance
- `format`: Output format preferences (`markdown`, `json`, `code`, `natural`)
- `audience`: Intended consumer (`human`, `agent`, `tool`, `pipeline`)

**Template Engine:**
Uses a Jinja2-inspired template system with ROSTR-specific extensions:
- `{{ intent.primary }}` — Primary intent category
- `{{ entities[*].name }}` — All extracted entities
- `{{ context.session.history[0:5] }}` — Last 5 conversation turns
- `{{ constraints | format_constraints }}` — Formatted constraint list
- `{% if ambiguity_score > 0.3 %}...{% endif %}` — Conditional blocks

**Output**: A fully compiled `RuntimePrompt` object containing the system prompt, user message, tool schemas, and context payload.

### Stage 5: Output Routing (LINK)

The fifth and final stage routes the compiled prompt to the appropriate target(s). This is the linker — connecting the compiled output to the execution environment.

**Routing Destinations:**

1. **Direct LLM Call**: Route to a specific model API
2. **Agent Dispatch**: Route to one or more specialized agents
3. **Pipeline Queue**: Enqueue for batch or sequential processing
4. **Human Review**: Present for human approval before execution
5. **Logging/Telemetry**: Record for audit and improvement

**Routing Decision Matrix:**

| Condition | Route To |
|-----------|----------|
| `confidence >= 0.95 AND risk == "low"` | Direct execution |
| `confidence >= 0.80 AND risk == "medium"` | Agent dispatch with human-in-the-loop |
| `confidence < 0.80 OR risk == "high"` | Human review |
| `intent == "ORCHESTRATE"` | NPAO orchestrator |
| `requires_knowledge == true` | RAG DAL → Agent dispatch |
| `multi_step == true` | NPAO orchestrator + Agent dispatch |

**Feedback Loop:**
Output routing maintains a feedback channel back to PAL:
- Route outcome (success/failure/needs-clarification)
- User corrections to compiled prompts
- Agent-reported ambiguity or insufficiency
- Execution metrics (latency, token usage, satisfaction)

This feedback is used to tune enhancement rules, context weights, and compilation strategies over time.

## PAL Protocol Specification

### PAL Message Format

All PAL-compiled prompts use the following envelope:

```json
{
  "pal_version": "1.0.0",
  "compilation_id": "uuid-v4",
  "timestamp": "ISO-8601",
  "pipeline_stages": {
    "intent_extraction": { "duration_ms": 12, "confidence": 0.92 },
    "context_injection": { "duration_ms": 45, "sources_used": 4 },
    "semantic_enhancement": { "duration_ms": 23, "passes_applied": 5 },
    "runtime_compilation": { "duration_ms": 8, "strategy": "cot" },
    "output_routing": { "duration_ms": 3, "target": "agent_dispatch" }
  },
  "intent_graph": { ... },
  "compiled_prompt": {
    "system": "...",
    "user": "...",
    "tools": [...],
    "context_payload": {...}
  },
  "routing": {
    "target": "agent_dispatch",
    "agents": ["code-reviewer", "test-generator"],
    "orchestration_hint": "parallel"
  }
}
```

### PAL Lifecycle Hooks

PAL exposes hooks that other ROSTR components can register:

```python
# Before any stage
pal.register_pre_hook("intent_extraction", my_validator)

# After any stage
pal.register_post_hook("semantic_enhancement", my_logger)

# On routing decision
pal.register_route_hook(my_override_function)

# On compilation error
pal.register_error_hook(my_fallback_handler)
```

### PAL Configuration

```yaml
pal:
  version: "1.0.0"
  
  stages:
    intent_extraction:
      enabled: true
      classifier: "regex_hybrid"
      min_confidence: 0.6
      
    context_injection:
      enabled: true
      max_history_turns: 10
      context_sources:
        - session
        - user
        - project
        - domain
        - environment
        
    semantic_enhancement:
      enabled: true
      max_passes: 10
      auto_disambiguate: true
      user_clarification_threshold: 0.4
      
    runtime_compilation:
      enabled: true
      default_strategy: "direct"
      fallback_strategy: "cot"
      
    output_routing:
      enabled: true
      auto_execute_threshold: 0.95
      human_review_threshold: 0.80
      
  templates:
    directory: "~/.rostr/pal/templates/"
    cache_enabled: true
    
  feedback:
    enabled: true
    store_execution_results: true
    adaptive_weights: true
```

## Using PAL Compiler

### Basic Usage

```python
from rostr_core.pal import PALCompiler

# Initialize the compiler
pal = PALCompiler()

# Compile a raw input
result = pal.compile("Write a Python function that sorts a list of dictionaries by a given key")

# Result contains the fully compiled prompt
print(result.compiled_prompt.system)
print(result.compiled_prompt.user)

# Inspect the pipeline
for stage_name, stage_result in result.stages.items():
    print(f"{stage_name}: {stage_result.duration_ms}ms, confidence={stage_result.confidence}")
```

### Advanced Usage with Custom Configuration

```python
from rostr_core.pal import PALCompiler, PALConfig

# Custom configuration
config = PALConfig.from_yaml("my_pal_config.yaml")
config.stages.semantic_enhancement.max_passes = 15
config.stages.output_routing.auto_execute_threshold = 0.90

pal = PALCompiler(config=config)

# Compile with explicit context
result = pal.compile(
    input="Optimize the database queries in this project",
    context_override={
        "project": {"orm": "sqlalchemy", "database": "postgresql"},
        "user": {"expertise": "senior", "preferred_style": "functional"}
    }
)
```

### Registering Custom Enhancement Rules

```python
from rostr_core.pal import EnhancementRule

# Create a custom rule
my_rule = EnhancementRule(
    pattern=r"(?i)make\s+(?:it|this|the\s+code)\s+(faster|better|cleaner)",
    condition=lambda match, ctx: ctx.get("language") == "python",
    transform=lambda match, ctx: f"Optimize for performance using Python-specific patterns. Target: at least 30% speed improvement measured by timeit. Preserve all existing behavior and tests.",
    priority=5,
    reversible=True
)

pal.register_enhancement_rule(my_rule)
```

### Hooking into the Pipeline

```python
def audit_intent_extraction(stage_input, stage_output, context):
    """Log every intent extraction for audit trail."""
    logger.info(f"Intent extracted: {stage_output.primary_intent}")
    logger.debug(f"Raw input: {stage_input[:200]}")
    return stage_output  # Return unmodified, or return modified output

pal.register_post_hook("intent_extraction", audit_intent_extraction)

def require_confirmation_on_create(stage_output, context):
    """Require human confirmation for any CREATE intent in production."""
    if (stage_output.primary_intent == "CREATE" and 
        context.environment.get("deployment") == "production"):
        stage_output.routing.target = "human_review"
    return stage_output

pal.register_route_hook(require_confirmation_on_create)
```

## PAL Integration with ROSTR Components

### PAL → NPAO

When PAL routes an intent to the NPAO orchestrator, it provides:
- Structured task decomposition hints
- Priority signals based on constraint urgency
- Suggested agent allocation based on entity types

### PAL → RAG DAL

When the intent requires knowledge retrieval, PAL triggers RAG DAL with:
- Pre-formulated search queries derived from enhanced entities
- Required confidence threshold for retrieved knowledge
- Domain context to guide Tier classification

### PAL → ROSTR Hub

Every PAL compilation is logged to the ROSTR Hub:
- Full compilation trace for learning
- Intent-to-outcome mapping for knowledge compounding
- User feedback signals for adaptive improvement

## Quality Checklist

- [ ] Stage 1 correctly classifies intent with confidence > 0.8
- [ ] Stage 2 injects context from at least 3 sources
- [ ] Stage 3 resolves all internal ambiguities before prompting user
- [ ] Stage 4 selects the appropriate compilation strategy
- [ ] Stage 5 routes to correct target with audit trail
- [ ] Ambiguity score < 0.3 for directly executed prompts
- [ ] All pipeline hooks execute without errors
- [ ] Feedback loop records execution outcome
- [ ] Compilation completes within 100ms for cached contexts
- [ ] PAL envelope includes all required metadata fields

## Error Handling

### Common Error Scenarios

| Error | Cause | Resolution |
|-------|-------|------------|
| `AmbiguityThresholdExceeded` | Raw input too vague | Prompt user with specific clarifying questions |
| `ContextSourceUnavailable` | Session/project context missing | Degrade gracefully with available sources |
| `CompilationTargetUnknown` | Unsupported model/target | Fall back to `direct` strategy for generic LLM |
| `EnhancementPassTimeout` | Complex intent with many passes | Return best-effort result with warnings |
| `RoutingConflict` | Multiple routing rules match | Apply priority-based resolution, log conflict |

### Fallback Chain

1. Attempt full 5-stage compilation
2. If Stage 3 fails: return Stage 2 output with ambiguity warnings
3. If Stage 1 fails: return raw input wrapped in a QUERY intent
4. If catastrophic failure: return raw input with error metadata

## References

- ROSTR Research Paper: arXiv:2604.XXXXX, Patrick Diamitani, April 2026
- rostr-core Python package: `pip install rostr-core`
- NPAO Orchestrator: `npao-orchestrator` skill
- RAG DAL Knowledge: `ragdal-knowledge` skill
- ROSTR Hub: `rostr-hub` skill
- ROSTR Agent Builder: `rostr-agent-builder` skill
- PAL Protocol Specification: Section 3.1 of ROSTR paper
