---
sidebar_position: 6
---

# RAG DAL — Dynamic Acquisition Layer

**Knowledge Engine** — 3-tier credibility scoring with multi-pass autonomous retrieval.

## Three-Tier Source Architecture

| Tier | Credibility | Sources | Usage |
|------|------------|---------|-------|
| **Tier 1** | 1.00 | arXiv, PubMed, official docs, .gov, standards bodies | Establish ground truth |
| **Tier 2** | 0.75 | Reuters, AP, BBC, NYT, WSJ, Gartner, McKinsey | Contextualize, current events |
| **Tier 3** | 0.40 | Blogs, social media, Stack Overflow, Reddit, Hacker News | Real-world signal, sentiment |

## Multi-Pass Retrieval Algorithm

```
Pass 1: Broad Sweep
  - 5 search queries across all tiers
  - Decompose into sub-topics
  - Assess coverage

  IF all confidence ≥ 0.8: DONE

Pass 2: Gap Fill
  - Target low-confidence sub-topics
  - 2 searches per gap
  - Focus Tier 1-2

  IF all confidence ≥ 0.8: DONE

Pass 3: Deep Verification
  - Tier 1 only for remaining gaps
  - Mark uncertain if still < 0.7
```

## Confidence Scoring Formula

```
confidence(topic) =
  (source_count × 0.35) +
  (consistency × 0.30) +
  (tier_distribution × 0.25) +
  (recency × 0.10)

Coverage criteria (confidence ≥ 0.8):
  - ≥2 Tier 1/2 sources confirm claim
  - No contradictions among high-credibility sources
  - <90 days old for time-sensitive OR verified timeless
  - All sub-questions answered
```

## Knowledge Base Ingestion

```json
{
  "entry_id": "uuid",
  "query_origin": "original question",
  "content": "extracted text",
  "summary": "3-5 sentence distillation",
  "source": {
    "url": "https://...",
    "title": "...",
    "tier": 1,
    "credibility_score": 0.95
  },
  "metadata": {
    "topics": ["tags"],
    "entities": ["named entities"],
    "data_type": "factual | opinion | statistical | procedural"
  },
  "confidence": 0.85
}
```
