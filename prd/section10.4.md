# Section 10.4 — Retrieval-Augmented Generation (RAG) Architecture

---

# Purpose

This section defines the complete Retrieval-Augmented Generation (RAG) architecture powering AssetFlow AI.

Instead of relying solely on an LLM's pretrained knowledge, the platform retrieves organization-specific information from trusted data sources before generating a response.

This ensures:

- Accurate answers
- Reduced hallucinations
- Organization-aware responses
- Explainable AI
- Citation support
- Enterprise security
- Fresh knowledge without model retraining

---

# Objectives

The RAG platform must:

✓ Retrieve organization knowledge

✓ Respect RBAC

✓ Support structured & unstructured data

✓ Scale to millions of documents

✓ Provide citations

✓ Minimize hallucinations

✓ Support hybrid search

✓ Keep knowledge continuously synchronized

---

# High-Level Architecture

```
User Question
      │
      ▼
Intent Detection
      │
      ▼
Context Builder
      │
      ▼
Retriever
      │
 ┌────┼─────────────┐
 ▼    ▼             ▼
SQL  Vector DB   Metadata Filter
      │
      ▼
Re-ranker
      │
      ▼
Prompt Builder
      │
      ▼
LLM
      │
      ▼
Validated Response
      │
      ▼
User
```

---

# Knowledge Sources

The AI retrieves knowledge from:

Assets

Users

Departments

Locations

Bookings

Maintenance

Audit Reports

Uploaded Documents

Warranty PDFs

SOP Documents

Company Policies

Knowledge Articles

Conversation Memory

AI Memory

---

# Supported Data Types

Structured

```
PostgreSQL
```

Semi-Structured

```
JSON

CSV

Excel
```

Unstructured

```
PDF

DOCX

TXT

Markdown

HTML
```

Future

Images

Videos

Audio

CAD Drawings

---

# RAG Pipeline

```
Document

↓

Parser

↓

Chunking

↓

Embedding

↓

Vector Storage

↓

Metadata Index

↓

Retriever

↓

Prompt Builder

↓

LLM
```

---

# Document Ingestion Pipeline

Every uploaded document passes through:

```
Upload

↓

Virus Scan

↓

OCR (if required)

↓

Text Extraction

↓

Metadata Extraction

↓

Chunking

↓

Embedding Generation

↓

Vector Storage

↓

Search Index

↓

Ready for AI
```

---

# Supported Parsers

PDF

DOCX

Markdown

CSV

Excel

HTML

Plain Text

Future

PowerPoint

Email

Scanned Documents

---

# Chunking Strategy

The default chunk size:

```
700–1200 tokens
```

Overlap

```
100–200 tokens
```

Purpose

Maintain context while reducing duplication.

---

# Chunk Metadata

Each chunk stores:

Chunk ID

Document ID

Organization ID

Asset ID

Source Type

Page Number

Section Title

Created At

Updated At

Language

Version

Permissions

---

# Embedding Architecture

Embeddings generated using dedicated embedding models.

Never use chat models for embeddings unless required.

Supported Providers

OpenAI

Gemini

Voyage AI

Jina AI

Future

Local embedding models

---

# Vector Database

Primary

```
pgvector
```

Future

Pinecone

Weaviate

Qdrant

Milvus

Redis Vector

---

# Metadata Filters

Before retrieval:

Organization

↓

Department

↓

Permissions

↓

Asset Scope

↓

Document Type

↓

Language

↓

Date

Only matching chunks are searched.

---

# Hybrid Search

Combines:

Keyword Search

+

Vector Search

+

Metadata Filtering

+

Recency Boost

↓

Best Results

---

# Retrieval Flow

```
Question

↓

Intent Detection

↓

Permission Check

↓

Metadata Filters

↓

Vector Search

↓

Keyword Search

↓

Merge Results

↓

Re-rank

↓

Top K Chunks

↓

Prompt Builder
```

---

# Top-K Retrieval

Default

Top 8 Chunks

Configurable

Maximum

20 Chunks

---

# Re-ranking

Uses cross-encoder or AI model to reorder retrieved chunks.

Ranking Factors

Semantic Similarity

Keyword Match

Recency

Authority

Document Quality

Permission Score

---

# Citation System

Every AI answer should include citations.

Example

```
Asset Policy.pdf

Page 12

Section 3.4
```

Or

```
Maintenance Record #MR-2381
```

---

# Freshness Strategy

Knowledge Base automatically updates when:

Asset Updated

Policy Changed

Document Uploaded

Maintenance Completed

Audit Closed

Report Generated

No manual re-indexing required.

---

# Organization Isolation

Every embedding includes:

Organization ID

Queries never retrieve vectors from another organization.

---

# Permission-aware Retrieval

Retrieval occurs only after:

Authentication

↓

Organization Validation

↓

Permission Resolution

↓

Metadata Filtering

↓

Vector Search

---

# Knowledge Categories

Assets

Maintenance

Policies

Compliance

Finance

IT Equipment

Facilities

HR Assets

Vehicles

Medical Equipment

Custom Categories

---

# Retrieval Performance

Vector Search

<100ms

Hybrid Search

<200ms

Prompt Assembly

<150ms

Total Retrieval

<500ms

---

# Caching

Frequently requested knowledge cached in Redis.

Cache TTL

15 minutes

Automatic invalidation on updates.

---

# Knowledge Versioning

Every document version retained.

Supports

Rollback

Comparison

Historical AI Answers

Version-specific citations

---

# Security

All documents encrypted at rest.

Signed URLs for downloads.

Audit every retrieval.

PII masking before prompt construction.

---

# Evaluation Metrics

Precision@K

Recall@K

MRR

nDCG

Citation Accuracy

Retrieval Latency

Hallucination Rate

---

# Future Enhancements

Knowledge Graph

Graph RAG

Multi-modal Retrieval

Video Retrieval

Image Embeddings

Voice Search

Cross-Organization Federated Search (Optional)

---

# Definition of Done

✓ Document ingestion operational.

✓ Chunking standardized.

✓ Embeddings generated.

✓ Vector search enabled.

✓ Hybrid retrieval implemented.

✓ Permission-aware filtering.

✓ Citation support.

✓ Automatic indexing.

✓ Version management.

✓ Performance targets achieved.

---

# Section Summary

The Retrieval-Augmented Generation architecture enables AssetFlow AI to produce trustworthy, organization-aware responses by combining structured enterprise data, unstructured documents, vector embeddings, hybrid retrieval, and permission-aware filtering. This architecture minimizes hallucinations, provides verifiable citations, and keeps AI responses synchronized with continuously changing business knowledge.
