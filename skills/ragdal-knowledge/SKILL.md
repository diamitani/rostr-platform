---
name: ragdal-knowledge
description: ROSTR RAG DAL (Dynamic Acquisition Layer) — 3-tier source credibility system with multi-pass autonomous retrieval, confidence scoring, gap detection, and persistent knowledge base for retrieval-augmented intelligence.
version: 1.0.0
author: Patrick Diamitani
tags: [rostr, rag, knowledge-retrieval, source-credibility, confidence-scoring, gap-detection, knowledge-base]
dependencies:
  - rostr-core>=0.1.0
trigger_conditions:
  - user query requires external knowledge or factual grounding
  - agent encounters information gap during task execution
  - PAL pipeline flags intent as requiring knowledge retrieval
  - knowledge base update or refresh is triggered
  - confidence score on existing knowledge falls below threshold
---

# RAG DAL — ROSTR Dynamic Acquisition Layer

## Overview

The RAG DAL (Retrieval-Augmented Generation Dynamic Acquisition Layer) is ROSTR's intelligent knowledge retrieval subsystem. Unlike naive RAG implementations that indiscriminately retrieve and inject documents, RAG DAL implements a sophisticated 3-tier source credibility framework, multi-pass autonomous retrieval, confidence scoring, gap detection, and persistent knowledge base management. This ensures that every piece of knowledge fed into the ROSTR pipeline is authoritative, relevant, and appropriately weighted.

RAG DAL treats knowledge retrieval as a continuous, self-improving process. It doesn't just fetch documents — it evaluates sources, detects what it doesn't know, fills gaps through recursive retrieval, and compounds knowledge over time. This creates a system that gets smarter with every interaction.

### Why RAG DAL Exists

Standard RAG suffers from critical weaknesses:

1. **Indiscriminate retrieval**: All sources treated equally, regardless of authority
2. **Single-pass limitation**: One retrieval pass, take it or leave it
3. **No confidence model**: No way to know if retrieved info is trustworthy
4. **No gap awareness**: Cannot identify what it doesn't know
5. **Amnesia**: Knowledge gained in one session is lost in the next

RAG DAL addresses all five through its layered architecture.

## The 3-Tier Source Credibility System

RAG DAL classifies every knowledge source into one of three credibility tiers. The tier determines both retrieval priority and the weight applied to information from that source during integration.

### Tier 1: Authoritative Sources (Credibility Score: 1.0)

Sources that have been verified, peer-reviewed, or are otherwise considered definitively authoritative within their domain.

**Characteristics:**
- Peer-reviewed academic publications (arXiv, IEEE, ACM, Nature, etc.)
- Official documentation from primary maintainers (docs.python.org, devdocs.io, etc.)
- Published standards (RFC, ISO, W3C, IETF)
- Verified government and institutional publications (.gov, .edu domains)
- Primary source repositories (official GitHub orgs, PyPI, npm)

**Retrieval Behavior:**
- Always retrieved when available for a query
- Results from Tier 1 override conflicting Tier 2/3 results
- Cached with maximum TTL (24 hours for docs, indefinite for standards)
- Indexed into long-term knowledge base

**Examples:**
- `https://docs.python.org/3/library/asyncio.html` (credibility: 1.0)
- `arXiv:2604.XXXXX` (credibility: 1.0)
- `https://www.rfc-editor.org/rfc/rfc9110` (credibility: 1.0)

### Tier 2: Curated Sources (Credibility Score: 0.75)

Sources maintained by recognized community authorities, commercial entities with strong reputations, or curated aggregators.

**Characteristics:**
- Stack Overflow answers with score > 10 and accepted status
- Official company engineering blogs (Stripe, Netflix, AWS)
- Curated tutorial platforms (Real Python, MDN Web Docs)
- Well-maintained open-source project wikis and discussions
- SaaS provider documentation (non-primary but reputable)

**Retrieval Behavior:**
- Retrieved when Tier 1 sources are insufficient
- Weighted at 75% in conflict resolution against Tier 1
- Cached with medium TTL (6 hours)
- Indexed into knowledge base with Tier 2 flag

**Examples:**
- `https://stackoverflow.com/a/123456` (score 45, accepted) (credibility: 0.75)
- `https://netflixtechblog.com/...` (credibility: 0.75)
- `https://realpython.com/async-io-python/` (credibility: 0.75)

### Tier 3: Community Sources (Credibility Score: 0.40)

Sources from the broader community that may contain useful information but lack formal authority or curation.

**Characteristics:**
- Personal blog posts and Medium articles
- Forum discussions (Reddit, Hacker News, Discord)
- GitHub issues and pull request discussions
- YouTube tutorials and conference talks
- AI-generated content without human verification

**Retrieval Behavior:**
- Retrieved only when Tier 1 and Tier 2 are exhausted
- Weighted at 40% in conflict resolution
- Cached with short TTL (1 hour)
- Never indexed into long-term knowledge base without human verification
- Flagged with `needs_verification: true`

**Examples:**
- `https://medium.com/@user/how-i-use-asyncio` (credibility: 0.40)
- `https://reddit.com/r/Python/comments/...` (credibility: 0.40)
- `https://github.com/project/issues/1234` (credibility: 0.40)

## The Full Confidence Formula

RAG DAL computes a composite confidence score for every retrieved knowledge item using the following formula:

```
C(k) = C_source(k) × C_relevance(k) × C_freshness(k) × C_consensus(k) × C_completeness(k)
```

Where:

### C_source(k) — Source Credibility
The base credibility score from the tier system (1.0, 0.75, or 0.40), adjusted by source-specific modifiers:

```
C_source(k) = tier_base_score × domain_authority_modifier × recency_reputation_modifier
```

- `domain_authority_modifier`: How authoritative is this source for this specific domain? (0.5–1.5)
  - Stack Overflow is authoritative for debugging (1.2) but not for architecture decisions (0.7)
- `recency_reputation_modifier`: Has the source maintained quality recently? (0.7–1.3)

### C_relevance(k) — Semantic Relevance
How well does the retrieved item answer the query?

```
C_relevance(k) = cosine_similarity(embedding(query), embedding(k)) × keyword_match_ratio
```

- `cosine_similarity`: Embedding-based semantic similarity (0.0–1.0)
- `keyword_match_ratio`: Proportion of query keywords found in the document (0.0–1.0)
- Combined via multiplication to penalize documents that match semantically but not lexically (or vice versa)

### C_freshness(k) — Temporal Freshness
How current is the information relative to its domain's expectations?

```
C_freshness(k) = max(0, 1 - (age_in_days / domain_freshness_horizon_days))
```

Domain freshness horizons:
| Domain | Freshness Horizon | Decay Rate |
|--------|-------------------|------------|
| Web frameworks (React, Next.js) | 180 days | Fast |
| Programming languages (stable) | 730 days | Slow |
| Scientific papers | 1825 days | Very slow |
| Security advisories | 30 days | Very fast |
| Database internals | 1095 days | Minimal |

### C_consensus(k) — Cross-Source Consensus
Do multiple independent sources agree?

```
C_consensus(k) = 1.0 - (conflict_penalty × conflicting_sources_count)
                + (agreement_bonus × min(agreeing_sources_count, max_agreement_bonus_sources))
```

- `conflict_penalty`: 0.15 per conflicting Tier 1 source, 0.10 per Tier 2, 0.05 per Tier 3
- `agreement_bonus`: 0.05 per agreeing independent source
- `max_agreement_bonus_sources`: 4 (diminishing returns beyond 4 sources)

### C_completeness(k) — Information Completeness
Does the retrieved item fully address the query, or is it partial?

```
C_completeness(k) = min(1.0, covered_aspects / total_query_aspects) × depth_factor
```

- `covered_aspects`: Number of query aspects addressed by the item
- `total_query_aspects`: Total aspects extracted from the query
- `depth_factor`: Does the item provide surface-level or deep information? (0.3–1.0)
  - Surface mention: 0.3
  - Brief explanation: 0.6
  - Comprehensive treatment: 1.0

### Confidence Interpretation

| Confidence Range | Meaning | Action |
|-----------------|---------|--------|
| 0.90 – 1.00 | Highly reliable | Use directly, no caveats |
| 0.70 – 0.89 | Generally reliable | Use with "according to" attribution |
| 0.50 – 0.69 | Moderately reliable | Use with caveats, cross-reference |
| 0.30 – 0.49 | Low confidence | Surface to user for verification |
| 0.00 – 0.29 | Unreliable | Discard, do not use |

### Worked Example

Query: "What is the time complexity of Python's list.sort()?"

Retrieved item: Python official docs page on sorting

```
C_source = 1.0 (Tier 1: official docs) × 1.0 (core Python domain authority) × 1.0 (stable reputation) = 1.0
C_relevance = 0.98 (high cosine similarity) × 1.0 (all keywords present) = 0.98
C_freshness = max(0, 1 - (365/730)) = 0.50 (documented a year ago, Python is stable)
C_consensus = 1.0 − (0 × 0) + (0.05 × 2) = 1.10 → capped at 1.0 (2 other sources agree)
C_completeness = min(1.0, 3/3) × 1.0 = 1.0 (all aspects covered in depth)

C(k) = 1.0 × 0.98 × 0.50 × 1.0 × 1.0 = 0.49  ← Hmm, this is moderate. Freshness dragged it down.

Adjustment: For stable domain, we can apply a freshness_boost:
C_freshness_adjusted = C_freshness + ((1-C_freshness) × domain_stability_factor)
                     = 0.50 + (0.50 × 0.8) = 0.90

C(k)_adjusted = 1.0 × 0.98 × 0.90 × 1.0 × 1.0 = 0.882  ← "Generally reliable"
```

## Multi-Pass Autonomous Retrieval

RAG DAL does not stop after a single retrieval pass. It employs a multi-pass strategy that iteratively improves retrieval quality.

### Pass 1: Direct Retrieval

Query the knowledge base and external sources with the original query.

**Actions:**
- Search Tier 1 sources first
- Retrieve top-K results from each available source
- Compute initial confidence scores
- Identify which query aspects are addressed and which are not

**Output**: `RetrievalResultSet` with per-item confidence scores and coverage map.

### Pass 2: Gap-Filling Retrieval

Identify aspects not covered in Pass 1 and formulate targeted queries.

**Gap Detection Algorithm:**
```python
def detect_gaps(query_aspects, retrieved_items, confidence_threshold=0.7):
    gaps = []
    for aspect in query_aspects:
        # Find all items that address this aspect
        addressing_items = [item for item in retrieved_items 
                           if aspect_matches(aspect, item)]
        
        # Compute composite coverage
        if not addressing_items:
            gaps.append(Gap(aspect=aspect, severity="full"))
        else:
            max_confidence = max(item.confidence for item in addressing_items)
            if max_confidence < confidence_threshold:
                gaps.append(Gap(aspect=aspect, severity="partial", 
                               current_confidence=max_confidence))
    return gaps
```

**Actions:**
- For each detected gap, formulate a targeted sub-query
- "What is the time complexity of Python's list.sort()?" might spawn:
  - "Timsort algorithm time complexity" (if Python-specific page was incomplete)
  - "Python list sort worst-case performance" (if missing edge cases)
- Search all tiers for gap-filling queries
- Lower the relevance bar for Tier 1/2 gap searches

**Output**: Augmented `RetrievalResultSet` with gap-filling items.

### Pass 3: Verification Retrieval

Cross-reference findings to verify accuracy and resolve conflicts.

**Actions:**
- For each high-impact knowledge item (C(k) > 0.7), search for corroborating sources
- For each conflict detected, retrieve additional sources to break the tie
- Apply the consensus component of the confidence formula
- Downgrade items that fail verification

**Output**: Verified `RetrievalResultSet` with consensus-adjusted confidence scores.

### Pass 4 (Conditional): Deep-Dive Retrieval

Triggered only when domain complexity exceeds a threshold.

**Trigger Conditions:**
- Query spans multiple highly technical domains
- Confidence scores remain below 0.7 after Pass 3
- Explicit user request for exhaustive research

**Actions:**
- Expand search to Tier 3 sources
- Lower relevance thresholds
- Include adjacent-domain sources
- Apply stricter verification

### Pass Limit and Escape Hatch

- Maximum passes: 4 (configurable)
- If after 4 passes confidence is still below 0.5, return results with `needs_human_research` flag
- Each pass is logged to ROSTR Hub for retrieval strategy optimization

## Gap Detection System

Gap detection is a first-class capability of RAG DAL, not an afterthought. The system actively monitors for knowledge gaps and initiates gap-filling strategies.

### Gap Types

| Gap Type | Description | Severity | Response |
|----------|-------------|----------|----------|
| `full` | No information found for an aspect | Critical | Initiate targeted retrieval pass |
| `partial` | Information found but confidence < threshold | High | Formulate sub-queries, lower tier barriers |
| `stale` | Information exists but is outdated | Medium | Search for fresher sources, flag staleness |
| `conflicting` | Multiple sources disagree | High | Retrieve more sources, apply consensus formula |
| `depth` | Surface-level info, needs deeper treatment | Medium | Formulate depth-seeking sub-queries |

### Gap Score

A holistic measure of how much the retrieval is still missing:

```
G(k_query) = Σ (aspect_weight_i × gap_severity_i) / Σ(aspect_weight_i)
```

Where gap severity is: full=1.0, partial=0.5, depth=0.3, stale=0.4, conflicting=0.6

If `G(k_query) > 0.4`, RAG DAL will either:
- Initiate another retrieval pass
- Flag for human research
- Return best-effort results with explicit gap documentation

## Knowledge Base Persistence

RAG DAL maintains a persistent knowledge base that compounds across sessions.

### Knowledge Base Architecture

```
~/.rostr/knowledge/
├── index.db                 # SQLite index of all knowledge items
├── vectors/                 # Vector embeddings for semantic search
│   ├── tier1/              # Tier 1 embeddings (high priority cache)
│   ├── tier2/              # Tier 2 embeddings
│   └── tier3/              # Tier 3 embeddings (volatile, may be pruned)
├── documents/              # Cached document contents
│   ├── {hash}/             # Content-addressed storage
│   │   ├── raw.txt         # Raw text content
│   │   ├── metadata.json   # Retrieval metadata
│   │   └── chunks.json     # Chunked representation
└── graphs/                 # Knowledge graphs for relationship mapping
    └── domain_graph.json   # Entity-relationship graph per domain
```

### Knowledge Item Schema

```json
{
  "id": "kb_uuid_v4",
  "content_hash": "sha256_of_content",
  "url": "source_url_or_null",
  "title": "Document title",
  "tier": 1,
  "credibility_score": 1.0,
  "domain": "python.standard_library.sorting",
  "retrieved_at": "2026-07-11T12:00:00Z",
  "expires_at": "2026-07-12T12:00:00Z",
  "last_accessed_at": "2026-07-11T14:30:00Z",
  "access_count": 7,
  "confidence_history": [
    {"timestamp": "2026-07-11T12:00:00Z", "score": 0.882},
    {"timestamp": "2026-07-11T14:30:00Z", "score": 0.890}
  ],
  "embedding": [0.123, -0.456, "..."]],
  "chunks": [
    {"id": "chunk_1", "text": "...", "aspects": ["time_complexity"]}
  ],
  "relationships": [
    {"target_id": "kb_other_uuid", "type": "references", "strength": 0.9}
  ],
  "consensus_sources": ["kb_src1", "kb_src2"],
  "conflict_sources": []
}
```

### Knowledge Compounding

RAG DAL implements several compounding strategies:

1. **Access-Based Reinforcement**: Frequently accessed items have extended TTLs and higher default confidence
2. **Consensus Strengthening**: Each new corroborating source increases consensus score
3. **Relationship Discovery**: As items are used together, relationship edges are strengthened
4. **Domain Expertise Development**: Persistent retrieval patterns build domain-specific authority modifiers
5. **Staleness Detection**: Items that consistently fail verification are flagged and eventually pruned

### Pruning and Maintenance

- Tier 3 items are pruned after 7 days without access
- Tier 2 items are pruned after 30 days without access
- Tier 1 items are pruned only when explicitly superseded by newer version
- Vector index is rebuilt weekly
- Knowledge base size is monitored; if it exceeds configured limits, lowest-access items are evicted

## Using RAG DAL

### Basic Usage

```python
from rostr_core.ragdal import RAGDAL

# Initialize RAG DAL
rag = RAGDAL()

# Retrieve knowledge for a query
results = rag.retrieve("How does Python's GIL affect async performance?")

# Results are ranked by confidence
for item in results.items:
    print(f"[Tier {item.tier}] {item.title}: C(k)={item.confidence:.3f}")
    print(f"  Gap score: {item.gap_score:.3f}")

# Check if there were gaps
if results.gaps:
    print(f"Knowledge gaps detected: {len(results.gaps)}")
    for gap in results.gaps:
        print(f"  - {gap.aspect}: {gap.severity}")
```

### Configuring Source Credibility

```python
from rostr_core.ragdal import RAGDAL, SourceRegistry

rag = RAGDAL()

# Add a custom Tier 1 source
rag.source_registry.add_source(
    url_pattern="https://internal-docs.company.com/*",
    tier=1,
    domain_authority={"python": 1.0, "distributed_systems": 1.2},
    freshness_horizon_days=90
)

# Override a domain's authority modifier for a source
rag.source_registry.update_domain_authority(
    source="stackoverflow.com",
    domain="security",
    authority=0.3  # Stack Overflow is not authoritative for security
)
```

### Gap-Aware Retrieval

```python
# Enable aggressive gap detection
results = rag.retrieve(
    query="Compare PostgreSQL and MySQL for a high-write financial application",
    max_passes=3,
    gap_threshold=0.3,  # Aggressive: fill gaps even at low severity
    verification_pass=True,
    deep_dive=False
)

# Results include a gap report
print(results.gap_report)
# {
#   "overall_gap_score": 0.15,
#   "gaps_filled": 2,
#   "gaps_remaining": 1,
#   "remaining_gaps": [
#     {"aspect": "PCI compliance implications", "severity": "partial"}
#   ]
# }
```

### Knowledge Base Operations

```python
# Force a knowledge base refresh
rag.knowledge_base.refresh(domain="python.async")

# Query with knowledge base only (no external retrieval)
kb_results = rag.knowledge_base.query(
    "Python async patterns",
    min_confidence=0.8
)

# Export knowledge for a domain
rag.knowledge_base.export(
    domain="python.standard_library",
    format="json",
    path="./python_kb_export.json"
)

# Import external knowledge
rag.knowledge_base.import_from_file(
    path="./external_knowledge.json",
    default_tier=2
)
```

### Advanced: Custom Confidence Scoring

```python
from rostr_core.ragdal import ConfidenceScorer

class MyCustomScorer(ConfidenceScorer):
    def compute_confidence(self, item, query, context):
        base = super().compute_confidence(item, query, context)
        
        # Add custom factor: penalize items from sources the user previously corrected
        correction_history = context.get("user_corrections", [])
        if item.source in correction_history:
            base *= 0.7
        
        # Boost items that cite primary research
        if item.has_citations and item.citation_count > 5:
            base = min(1.0, base * 1.2)
        
        return base

rag = RAGDAL(confidence_scorer=MyCustomScorer())
```

## Integration with Other ROSTR Components

### PAL → RAG DAL

When PAL's Stage 3 (Semantic Enhancement) detects that an intent requires knowledge beyond the model's training data, it signals RAG DAL:

```python
# PAL compilation triggers RAG DAL
if pal_result.requires_knowledge_retrieval:
    knowledge = rag.retrieve(
        query=pal_result.knowledge_query,
        context=pal_result.context
    )
    pal_result.inject_knowledge(knowledge)
```

### RAG DAL → NPAO

When retrieved knowledge indicates complexity (multiple sub-domains, high gap score), RAG DAL can recommend orchestration patterns:

```python
if results.complexity_score > 0.7:
    npao.decompose_task(
        sub_tasks=results.suggested_decomposition,
        knowledge_map=results.domain_map
    )
```

### RAG DAL → ROSTR Hub

All retrieval operations are logged to the Hub:
- Retrieval performance metrics (latency, passes, gap fill rate)
- Knowledge base growth and compounding statistics
- Source credibility adjustments
- User corrections for reinforcement learning

## Quality Checklist

- [ ] All Tier 1 sources correctly identified and prioritized
- [ ] Confidence scores computed using full 5-factor formula
- [ ] Multi-pass retrieval correctly fills gaps when detected
- [ ] Gap detection identifies at least 90% of actual knowledge gaps
- [ ] Knowledge base persistence works across sessions
- [ ] Source credibility modifiers are domain-aware
- [ ] Verification pass catches conflicting information
- [ ] Pruning does not remove high-access items
- [ ] Retrieval latency < 500ms for cached queries
- [ ] Retrieval latency < 3s for 3-pass full retrieval

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `NoSourcesAvailable` | All source backends down | Return knowledge base results only, flag degraded mode |
| `RetrievalTimeout` | External source too slow | Return partial results from faster sources |
| `EmbeddingServiceUnavailable` | Vector DB down | Fall back to keyword-only retrieval |
| `KnowledgeBaseCorruption` | Index integrity failure | Rebuild from document store, log incident |
| `ConfidenceDegradation` | Historical confidence declining | Trigger source re-evaluation |

## References

- ROSTR Research Paper: arXiv:2604.XXXXX, Patrick Diamitani, April 2026
- rostr-core Python package: `pip install rostr-core`
- PAL Compiler: `pal-compiler` skill (Section 4.1 of ROSTR paper for knowledge-retrieval trigger)
- NPAO Orchestrator: `npao-orchestrator` skill
- ROSTR Hub: `rostr-hub` skill (knowledge base persistence depends on Hub state management)
- RAG DAL Protocol Specification: Section 3.2 of ROSTR paper
