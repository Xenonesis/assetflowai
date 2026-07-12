# Section 9.1 — API Overview

---

# Purpose

This section defines the complete API architecture of AssetFlow AI.

The API layer enables communication between:

- Web Application
- Mobile Application
- AI Assistant
- Third-party Integrations
- Internal Background Workers
- External Automation Platforms

Every API follows the standards defined in Section 7.3.

---

# API Style

Primary

REST API

Future

GraphQL

gRPC (Internal)

---

# Base URLs

Development

```
http://localhost:3000/api/v1
```

Production

```
https://api.assetflow.ai/v1
```

---

# API Principles

✓ Stateless

✓ Versioned

✓ Secure

✓ Predictable

✓ Resource-oriented

✓ Idempotent where applicable

✓ JSON-only

✓ OpenAPI compliant

---

# Authentication

Better Auth Session

Secure Cookies

Bearer Tokens (Future)

Service Accounts

API Keys

---

# Response Format

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "message": "Success"
}
```

Error

```json
{
  "success": false,
  "error": {
    "code": "ASSET_NOT_FOUND",
    "message": "...",
    "details": {}
  }
}
```

---

# API Modules

Authentication

Organization

Users

Roles

Assets

Categories

Locations

Allocations

Bookings

Maintenance

Audit

Reports

Dashboard

Notifications

AI

Search

Files

Admin

Integrations

Health

Realtime

---

# API Security

Authentication

Authorization

Validation

Rate Limit

CSRF

Organization Scope

Audit Logging

---

# Rate Limits

Authentication

5 / 15 min

General

100/min

AI

30/min

Search

60/min

Upload

20/hour

---

# Performance Targets

GET

<100ms

POST

<200ms

Search

<150ms

Reports

Async

---

# API Lifecycle

Design

↓

Implementation

↓

Testing

↓

OpenAPI

↓

Release

↓

Deprecation

↓

Sunset

---

# Definition of Done

✓ OpenAPI Generated

✓ Authentication Protected

✓ Standard Responses

✓ Versioned

✓ Tested

✓ Documented
