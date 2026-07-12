# Section 7.4 — Service Layer, Repository Pattern & Domain Architecture

---

# Purpose

This section defines the internal backend architecture used by AssetFlow AI.

It establishes:

- Domain organization
- Service layer responsibilities
- Repository pattern
- Dependency boundaries
- Transaction ownership
- Business rule enforcement
- Validation flow
- Error propagation
- Domain events
- Testing strategy

No business logic should exist outside the Service Layer.

---

# Design Principles

The backend follows:

✓ Domain Driven Design (DDD)

✓ Clean Architecture

✓ Repository Pattern

✓ Service Layer Pattern

✓ Dependency Inversion

✓ SOLID Principles

✓ Event-Driven Architecture

---

# Domain Organization

Each business capability is an independent domain.

```
Authentication

Organization

Assets

Allocation

Bookings

Maintenance

Audit

Reports

Notifications

AI

Settings
```

Domains communicate through services—not by directly accessing each other's repositories.

---

# Project Structure

```text
src/

domains/

├── assets/
│   ├── asset.controller.ts
│   ├── asset.service.ts
│   ├── asset.repository.ts
│   ├── asset.schema.ts
│   ├── asset.types.ts
│   ├── asset.events.ts
│   ├── asset.permissions.ts
│   ├── asset.constants.ts
│   └── index.ts
│
├── allocation/
├── maintenance/
├── booking/
├── audit/
└── ...
```

Each domain owns:

- Database access
- Business rules
- Validation
- Events
- Constants
- Permissions

---

# Layer Responsibilities

## Controller Layer

Responsibilities

Receive HTTP Request

↓

Validate Authentication

↓

Call Service

↓

Return Response

Controllers must never:

- Execute SQL
- Implement business logic
- Send notifications
- Perform calculations

Controllers remain thin.

---

## Service Layer

The Service Layer is the heart of the application.

Responsibilities

Business Rules

Transactions

Permission Checks

Cross-domain Coordination

AI Integration

Notifications

Event Publishing

Workflow Decisions

Every business rule belongs here.

---

## Repository Layer

Repositories interact only with the database.

Responsibilities

CRUD

Queries

Pagination

Transactions

Indexes

Repositories must never:

- Send emails
- Validate permissions
- Perform calculations
- Publish events

---

## Validation Layer

Uses Zod.

Responsibilities

Validate Input

Transform Data

Normalize Values

Reject Invalid Requests

Runs before Service Layer.

---

# Dependency Flow

Allowed

```
Controller

↓

Service

↓

Repository

↓

Database
```

Forbidden

```
Controller

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
Repository

↓

Notification Service
```

---

# Service Example

AssetService

Responsibilities

Register Asset

Update Asset

Archive Asset

Allocate Asset

Generate QR

Trigger Notifications

Publish Events

Never executes raw SQL.

---

# Repository Example

AssetRepository

Responsibilities

Find By ID

Create

Update

Delete

Search

Pagination

Transactions

Nothing else.

---

# Transaction Ownership

Transactions belong only to Services.

Example

Allocate Asset

```
Update Asset

↓

Create Allocation

↓

Create Activity Log

↓

Publish Event

↓

Commit
```

If one step fails

↓

Rollback everything.

---

# Cross-Domain Communication

Incorrect

```
Asset Repository

↓

Booking Repository
```

Correct

```
Asset Service

↓

Booking Service
```

Domains communicate through Services only.

---

# Domain Events

Services publish events.

Examples

```
AssetCreated

AssetAllocated

AssetReturned

BookingCreated

MaintenanceCompleted

AuditClosed

UserCreated
```

Subscribers

Notifications

Emails

Activity Logs

Analytics

AI

Webhooks

---

# Validation Flow

```
HTTP Request

↓

Zod Validation

↓

Controller

↓

Service

↓

Repository

↓

Database
```

No invalid data reaches the database.

---

# Error Propagation

Errors originate in:

Validation

↓

Service

↓

Repository

Returned using standard error format.

Never expose:

SQL errors

Stack traces

Secrets

Internal implementation details

---

# Business Rule Example

Rule

Only AVAILABLE assets can be allocated.

Implementation

```
Controller

↓

AssetService

↓

Check Status

↓

If Available

Continue

Else

Throw BusinessError
```

Repository never checks business rules.

---

# Dependency Injection

Services depend on interfaces.

Example

```
AssetService

↓

AssetRepositoryInterface
```

Benefits

- Easy testing
- Mock repositories
- Future database replacement

---

# Interface Example

AssetRepository

Must implement

Create

Update

Delete

Find

Search

Count

Exists

Soft Delete

---

# Shared Libraries

Shared modules

```
lib/

config/

utils/

constants/

validators/

types/
```

Never contain business-specific logic.

---

# Utility Rules

Utilities

Pure Functions Only

Examples

Currency Formatting

Date Formatting

Slug Generation

UUID Helpers

Never access database.

---

# Constants

Each domain owns constants.

Example

```
Asset Status

Allocation Status

Booking Status

Maintenance Priority
```

No hardcoded strings.

---

# Configuration

Environment values accessed only through:

```
config/index.ts
```

Never

```
process.env

inside services
```

---

# Logging

Services log:

Start

Finish

Duration

Failures

Transaction IDs

Repositories do not log business events.

---

# Event Publishing

After successful transaction

```
Commit

↓

Publish Event

↓

Notification

↓

Email

↓

Analytics
```

Never publish before commit.

---

# Testing Strategy

Every Service

Unit Tests

Business Rule Tests

Edge Cases

Transaction Tests

Permission Tests

---

Repositories

Integration Tests

SQL Tests

Performance Tests

---

Controllers

API Tests

Authorization Tests

Response Tests

---

# Naming Standards

Services

```
AssetService
```

Repositories

```
AssetRepository
```

Controllers

```
AssetController
```

Schemas

```
AssetSchema
```

Types

```
AssetDto

AssetEntity

AssetResponse
```

---

# Anti-Patterns

Never do:

Business logic inside Controllers

Business logic inside Repositories

Raw SQL inside Controllers

Direct repository-to-repository calls

Global mutable state

God Services (thousands of lines)

Circular dependencies

---

# Performance Principles

Repositories

Optimized SQL

Indexes

Minimal Queries

Pagination

Services

Batch operations

Parallel execution where safe

Transaction minimization

Controllers

Minimal processing

---

# Example Request Lifecycle

```
POST /api/v1/assets

↓

Authentication

↓

Authorization

↓

Validation

↓

AssetController

↓

AssetService

↓

AssetRepository

↓

PostgreSQL

↓

Commit

↓

Publish AssetCreated Event

↓

Notification Service

↓

Response
```

---

# Definition of Done

The Service Layer architecture is complete when:

✓ Controllers remain thin.

✓ Services own business logic.

✓ Repositories own data access.

✓ Validation centralized.

✓ Transactions managed by services.

✓ Domain events published after commit.

✓ Dependency injection used.

✓ Shared utilities isolated.

✓ Tests written for every layer.

✓ No architectural rule violations.

---

# Section Summary

The Service Layer architecture ensures AssetFlow AI remains modular, scalable, and maintainable as it grows. By enforcing strict separation of concerns, domain isolation, repository abstraction, and event-driven workflows, the platform supports enterprise-scale development while remaining highly compatible with AI-assisted code generation and long-term engineering best practices.
