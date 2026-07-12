# AGENTS.md

# AssetFlow AI

**Version:** 1.0.0 Enterprise Edition

---

# Project Overview

AssetFlow AI is an AI-native Enterprise Asset Intelligence Platform designed to help organizations manage physical assets, maintenance, compliance, inventory, audits, documentation, analytics, and AI-powered workflows from a unified cloud platform.

The system is built using a modern enterprise architecture with scalability, security, observability, and AI at its core.

---

# Core Tech Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- TanStack Query
- Zustand

## Backend

- Next.js Route Handlers
- Supabase
- PostgreSQL
- Drizzle ORM (future)
- Redis (future)
- BullMQ (future)

## Authentication

- Supabase Auth
- RBAC
- Multi-Tenant Access Control

## AI

- OpenAI
- Anthropic
- Google Gemini
- OpenRouter
- MCP (Model Context Protocol)
- RAG
- Multi-Agent Architecture

---

# Project Goals

The platform should provide:

- Enterprise Asset Management
- Inventory Management
- Maintenance Scheduling
- Audit Management
- Compliance Management
- QR / Barcode Asset Tracking
- AI Assistant
- Executive Dashboards
- Enterprise Analytics
- Workflow Automation

---

# Engineering Principles

Always prioritize:

- Security
- Scalability
- Simplicity
- Maintainability
- Performance
- Accessibility
- Observability
- Developer Experience

Never sacrifice architecture quality for short-term speed.

---

# Coding Standards

## TypeScript

Always use strict mode.

Never use:

- any
- @ts-ignore (unless absolutely required)

Prefer:

- Interfaces
- Strong typing
- Utility types
- Generics

---

## React

Prefer:

- Server Components
- Server Actions
- Suspense
- Streaming

Avoid unnecessary Client Components.

---

## Components

Every component should be:

- Reusable
- Typed
- Accessible
- Small
- Testable

---

## Styling

Use

Tailwind CSS

Do not write inline CSS unless required.

Use CSS variables for design tokens.

---

## Folder Structure

```
src/
│
├── app/
├── components/
├── features/
├── modules/
├── ai/
├── api/
├── db/
├── server/
├── services/
├── hooks/
├── lib/
├── providers/
├── store/
├── config/
├── styles/
├── types/
├── utils/
└── tests/
```

Never create random folders.

---

# Architecture Rules

Use feature-first architecture.

Each module should be isolated.

Example

```
features/assets/

components/

hooks/

services/

types/

actions/

validators/

tests/
```

---

# API Guidelines

Every API must:

Validate Input

Authenticate User

Authorize User

Validate Tenant

Return Typed Response

Log Errors

Support Pagination

Support Filtering

Support Sorting

Support Rate Limiting

---

# Database Rules

Never expose database directly.

Always use service layer.

Every table must include

- id
- created_at
- updated_at

Support soft delete where applicable.

---

# Security Rules

Always validate:

Authentication

Authorization

Organization Ownership

Input Validation

Output Encoding

File Uploads

Never trust client input.

---

# AI Guidelines

Every AI feature must:

Support model abstraction.

Support multiple providers.

Support provider fallback.

Support prompt versioning.

Support prompt evaluation.

Support observability.

Support cost tracking.

Support safety validation.

Never hardcode prompts inside components.

---

# Prompt Engineering

Keep prompts:

Reusable

Versioned

Documented

Secure

Testable

---

# MCP Rules

All MCP tools must:

Declare schema

Validate arguments

Return structured output

Handle failures gracefully

Log execution

---

# Error Handling

Never expose internal errors.

Use structured error objects.

Log all unexpected failures.

Provide user-friendly messages.

---

# Logging

Log

Authentication

Authorization

API Calls

AI Requests

Errors

Warnings

Performance Metrics

Audit Events

Never log secrets.

---

# Performance

Optimize

Images

Queries

Bundle Size

Streaming

Caching

Lazy Loading

Server Components

---

# Accessibility

Follow WCAG 2.2 AA.

Every UI must support

Keyboard Navigation

Screen Readers

Focus Management

ARIA Labels

Color Contrast

---

# Testing

Every feature should include

Unit Tests

Integration Tests

E2E Tests

AI Evaluation (where applicable)

---

# Documentation

Every module should include

README

Architecture Notes

API Docs

Types

Examples

---

# Git Rules

Branch Naming

feature/

fix/

hotfix/

release/

refactor/

docs/

---

Commit Format

feat:

fix:

refactor:

docs:

test:

perf:

chore:

---

# Pull Request Rules

Every PR must include

Purpose

Screenshots (if UI)

Testing Notes

Breaking Changes

Checklist

---

# Definition of Done

A feature is complete only when

- Code implemented
- Types added
- Validation complete
- Security reviewed
- Tests passing
- Documentation updated
- Performance acceptable
- Accessibility verified
- AI evaluation completed (if applicable)

---

# Things AI Agents Must NEVER Do

- Introduce breaking changes without documentation.
- Hardcode secrets or API keys.
- Disable TypeScript checks.
- Use any unnecessarily.
- Bypass authentication or authorization.
- Duplicate business logic.
- Create circular dependencies.
- Ignore lint errors.
- Ignore accessibility.
- Skip validation.
- Remove logging without reason.

---

# Long-Term Vision

AssetFlow AI aims to become an AI-native Enterprise Intelligence Platform capable of managing assets, workflows, enterprise knowledge, compliance, maintenance, and decision-making through secure, explainable, and autonomous AI systems.

Every engineering decision should contribute toward that vision.