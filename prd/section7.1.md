# Section 7.1 — Backend Architecture & Engineering Principles

---

# Purpose

This section defines the backend architecture of AssetFlow AI.

It establishes:

- Application architecture
- Project structure
- Layer responsibilities
- Coding standards
- Dependency rules
- Request lifecycle
- Error handling
- Validation strategy
- Scalability principles

Every backend feature must follow the architecture described here.

---

# Technology Stack

## Runtime

Node.js 24 LTS

---

## Framework

Next.js 16

App Router

---

## Language

TypeScript 6

Strict Mode Enabled

---

## ORM

Drizzle ORM

---

## Database

PostgreSQL 17

Supabase

---

## Authentication

Better Auth

---

## Validation

Zod

---

## API

Next.js Route Handlers

REST API

Future

GraphQL Gateway

---

## Queue

BullMQ

Redis

---

## Cache

Redis

React Query

---

## Storage

Supabase Storage

---

## AI

AI SDK

OpenAI

Gemini

Claude

Groq

Provider abstraction layer

---

# Architecture Style

AssetFlow AI follows:

```
Layered Architecture

+

Domain Driven Design

+

Service Layer Pattern

+

Repository Pattern

+

Dependency Injection
```

---

# High-Level Architecture

```
Browser

↓

Next.js

↓

API Route

↓

Middleware

↓

Controller

↓

Validation

↓

Service

↓

Repository

↓

Drizzle ORM

↓

PostgreSQL

↓

Redis

↓

External APIs
```

---

# Layer Responsibilities

## Presentation Layer

Responsibilities

HTTP

JSON

Status Codes

Authentication

Response Formatting

Never

Business Logic

---

## Validation Layer

Responsibilities

Validate Input

Sanitize Data

Reject Invalid Requests

Uses

Zod

---

## Service Layer

The heart of the application.

Contains

Business Rules

Workflow Logic

Permissions

Notifications

AI Calls

Transactions

Never

SQL

HTTP

---

## Repository Layer

Responsibilities

Database Operations

Queries

Transactions

Indexes

Pagination

Only layer allowed to communicate with Drizzle.

---

## Database Layer

PostgreSQL

ACID

Indexes

Constraints

Foreign Keys

---

# Dependency Rules

Allowed

```
API

↓

Service

↓

Repository

↓

Database
```

Forbidden

```
API

↓

Database
```

Forbidden

```
Repository

↓

HTTP
```

Forbidden

```
Service

↓

React Components
```

---

# Folder Structure

```text
src/

├── app/
│   ├── api/
│   ├── (dashboard)/
│   ├── auth/
│   └── layout.tsx
│
├── domains/
│   ├── assets/
│   ├── allocation/
│   ├── booking/
│   ├── maintenance/
│   ├── audit/
│   ├── reports/
│   ├── notifications/
│   └── ai/
│
├── db/
│   ├── schema/
│   ├── migrations/
│   ├── seed/
│   └── index.ts
│
├── services/
│
├── repositories/
│
├── lib/
│
├── middleware/
│
├── validations/
│
├── types/
│
├── hooks/
│
├── config/
│
└── utils/
```

---

# Domain Structure

Example

```text
domains/assets/

asset.controller.ts

asset.service.ts

asset.repository.ts

asset.schema.ts

asset.types.ts

asset.routes.ts

asset.events.ts

asset.constants.ts

asset.permissions.ts
```

Every domain follows the same structure.

---

# Request Lifecycle

```
Client Request

↓

Authentication

↓

Authorization

↓

Rate Limit

↓

Validation

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Response Formatter

↓

Client
```

---

# Transaction Strategy

Use database transactions for:

Asset Allocation

Transfer

Maintenance Completion

Audit Closure

Bulk Imports

Never allow partial success.

---

# Error Handling

Standard error format:

```json
{
  "success": false,
  "error": {
    "code": "ASSET_NOT_FOUND",
    "message": "The requested asset does not exist.",
    "details": null
  }
}
```

---

# Error Categories

Validation

Authentication

Authorization

Business Rule

Database

External Service

Internal Server

---

# Logging Strategy

Every request logs:

- Request ID
- User ID
- Route
- Method
- Duration
- Status Code
- IP Address

Sensitive data must never be logged.

---

# Configuration

Environment variables accessed only through:

```
config/index.ts
```

Never use

```
process.env
```

directly throughout the application.

---

# Background Jobs

Handled by BullMQ.

Examples:

- Email delivery
- Notification fan-out
- AI report generation
- Thumbnail creation
- Scheduled maintenance
- Warranty reminders
- Backup tasks

---

# Event-Driven Architecture

Business events published after successful transactions.

Examples:

```
AssetAllocated

BookingCreated

MaintenanceCompleted

AuditClosed

UserCreated

PasswordReset
```

Subscribers:

- Notifications
- Emails
- Activity Logs
- Analytics
- AI Insights
- Webhooks

---

# Security Principles

- RBAC enforced in service layer.
- Input validated before business logic.
- Secrets never exposed.
- SQL Injection prevented by ORM.
- CSRF protection enabled.
- Rate limiting on sensitive endpoints.

---

# Coding Standards

- Strict TypeScript.
- No `any` type.
- Functions should have a single responsibility.
- Business logic only in services.
- Repositories contain no business logic.
- Controllers remain thin.
- Prefer composition over inheritance.

---

# Performance Goals

API Response

<300ms

Asset Search

<150ms

Dashboard

<500ms

Background Jobs

Asynchronous

---

# Definition of Done

Backend architecture is complete when:

✓ Layered architecture implemented.

✓ Domains isolated.

✓ Repository pattern enforced.

✓ Services contain business logic.

✓ Validation centralized.

✓ Errors standardized.

✓ Transactions used correctly.

✓ Events published.

✓ Background jobs configured.

✓ Logging implemented.

✓ Configuration centralized.

---

# Section Summary

This architecture provides a scalable, modular, and maintainable backend foundation for AssetFlow AI. By separating concerns into clear layers and domains, it supports rapid development, easier testing, AI-assisted code generation, and long-term maintainability while remaining ready for enterprise-scale growth.
