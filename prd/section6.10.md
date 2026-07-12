# Section 6.10 — AI, System Configuration & Supporting Database Design

---

# Purpose

This section defines the supporting database architecture for:

- AI Assistant
- AI Conversations
- AI Memory
- AI Feedback
- Organization Settings
- Feature Flags
- System Configuration
- API Keys
- Third-party Integrations

These tables are not directly related to assets but provide the infrastructure required for a modern enterprise SaaS platform.

---

# System Architecture

```
Organization

↓

Organization Settings

↓

Feature Flags

↓

Users

↓

AI Assistant

↓

Conversations

↓

Messages

↓

Feedback

↓

Analytics
```

---

# Core Tables

1. organizations
2. organization_settings
3. system_settings
4. feature_flags
5. ai_conversations
6. ai_messages
7. ai_feedback
8. api_keys
9. integration_configs

---

# Table 1 — organizations

## Purpose

Supports future multi-tenant architecture.

Even if the MVP launches as single-tenant, every business record should eventually belong to an organization.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_name | VARCHAR(200) |
| organization_code | VARCHAR(50) UNIQUE |
| logo_url | TEXT |
| website | TEXT |
| industry | VARCHAR(100) |
| timezone | VARCHAR(80) |
| currency | VARCHAR(20) |
| language | VARCHAR(20) |
| country | VARCHAR(100) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## Business Rules

Organization code unique.

Timezone configurable.

Supports future white-label deployments.

---

# Table 2 — organization_settings

## Purpose

Stores organization-specific configuration.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID FK |
| setting_key | VARCHAR(150) |
| setting_value | JSONB |
| updated_by | UUID FK |
| updated_at | TIMESTAMP |

---

## Example Settings

```json
{
  "asset_tag_prefix":"AF",
  "require_allocation_approval":true,
  "default_currency":"INR",
  "default_timezone":"Asia/Kolkata",
  "maintenance_auto_assign":false
}
```

---

## Business Rules

Keys unique per organization.

Values stored as JSONB.

Changes logged.

---

# Table 3 — system_settings

## Purpose

Stores global application settings.

Only administrators can modify.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| setting_key | VARCHAR(150) UNIQUE |
| setting_value | JSONB |
| description | TEXT |
| updated_by | UUID FK |
| updated_at | TIMESTAMP |

---

## Examples

```
Max Upload Size

Password Policy

Session Timeout

JWT Expiry

SMTP Settings

Storage Bucket

AI Provider

Maintenance Window
```

---

# Table 4 — feature_flags

## Purpose

Enables controlled rollout of new features.

Supports gradual deployments and A/B testing.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| feature_key | VARCHAR(150) UNIQUE |
| feature_name | VARCHAR(200) |
| enabled | BOOLEAN |
| rollout_percentage | INTEGER |
| organization_id | UUID FK Nullable |
| created_at | TIMESTAMP |

---

## Example Features

```
AI Assistant

QR Scanning

RFID

Predictive Maintenance

Digital Twin

Offline Mode

Voice Commands
```

---

## Business Rules

Rollout percentage between 0–100.

Feature overrides supported per organization.

---

# Table 5 — ai_conversations

## Purpose

Stores every AI chat session.

---

## Relationships

```
User

↓

Many Conversations

Conversation

↓

Many Messages
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID FK |
| title | VARCHAR(255) |
| context_type | ENUM |
| context_id | UUID Nullable |
| model_name | VARCHAR(100) |
| started_at | TIMESTAMP |
| last_message_at | TIMESTAMP |

---

## Context Types

```
Asset

Maintenance

Audit

Booking

Report

Dashboard

General
```

---

## Business Rules

Conversation titles generated automatically.

Linked to business context where applicable.

---

# Table 6 — ai_messages

## Purpose

Stores every message exchanged with the AI.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| conversation_id | UUID FK |
| sender | ENUM |
| message | TEXT |
| token_count | INTEGER |
| latency_ms | INTEGER |
| metadata | JSONB |
| created_at | TIMESTAMP |

---

## Sender

```
User

Assistant

System
```

---

## Metadata Example

```json
{
  "asset_id":"UUID",
  "confidence":0.94,
  "sources":["maintenance","history"]
}
```

---

## Business Rules

Messages immutable.

Supports streaming responses.

Token usage tracked.

---

# Table 7 — ai_feedback

## Purpose

Captures user feedback on AI responses.

Improves future AI performance.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| message_id | UUID FK |
| user_id | UUID FK |
| rating | SMALLINT |
| feedback_type | ENUM |
| comments | TEXT |
| created_at | TIMESTAMP |

---

## Feedback Types

```
Helpful

Incorrect

Incomplete

Unsafe

Other
```

---

## Business Rules

One feedback entry per message per user.

Used for analytics and prompt tuning.

---

# Table 8 — api_keys

## Purpose

Stores encrypted API credentials for integrations.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| provider | VARCHAR(100) |
| encrypted_key | TEXT |
| environment | ENUM |
| status | ENUM |
| last_rotated | TIMESTAMP |
| created_at | TIMESTAMP |

---

## Providers

```
OpenAI

Anthropic

Google Gemini

Groq

Resend

Stripe

Twilio

Slack

Microsoft

AWS
```

---

## Business Rules

Keys encrypted at rest.

Rotation history maintained.

Never returned in API responses.

---

# Table 9 — integration_configs

## Purpose

Stores third-party integration settings.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| organization_id | UUID FK |
| integration_name | VARCHAR(120) |
| configuration | JSONB |
| enabled | BOOLEAN |
| last_sync | TIMESTAMP |
| created_at | TIMESTAMP |

---

## Supported Integrations

```
Google Workspace

Microsoft 365

Slack

Teams

SAP

Odoo

Oracle ERP

ServiceNow

Jira

GitHub

Zapier
```

---

# AI Architecture

```
User

↓

AI Conversation

↓

AI Messages

↓

AI Engine

↓

Business Context

↓

Recommendations

↓

Feedback

↓

Learning Analytics
```

---

# AI Features

The AI subsystem supports:

Natural Language Search

Asset Lookup

Maintenance Summaries

Audit Summaries

Report Generation

Predictive Insights

Workflow Assistance

Knowledge Base Queries

---

# Configuration Hierarchy

```
System Settings

↓

Organization Settings

↓

Feature Flags

↓

User Preferences
```

Higher levels override lower levels where applicable.

---

# Security

API Keys encrypted.

Secrets never logged.

AI conversations access-controlled.

Organization settings isolated.

Feature flags audited.

---

# Reporting

AI Usage Report

Token Consumption

Conversation Analytics

Feedback Summary

Feature Adoption

Integration Health

API Key Rotation Report

---

# Performance Strategy

Indexes

```
organization_id

user_id

conversation_id

feature_key

provider

integration_name
```

Composite

```
(user_id, last_message_at)

(organization_id, feature_key)
```

Target Query Time

```
Conversation Load

<100ms

Settings Lookup

<20ms
```

---

# Future Extensions

Designed to support:

- Long-term AI memory
- RAG document indexing
- MCP tool registry
- AI agents
- Autonomous workflows
- Multi-model routing
- Prompt versioning
- Fine-tuning datasets
- Organization knowledge graphs

without schema redesign.

---

# Definition of Done

The AI & Configuration subsystem is complete when:

✓ Organizations supported.

✓ Organization settings configurable.

✓ Global settings managed.

✓ Feature flags operational.

✓ AI conversations stored.

✓ AI messages tracked.

✓ Feedback collected.

✓ API keys encrypted.

✓ Integrations configurable.

✓ AI analytics available.

---

# Section Summary

This subsystem provides the intelligence and configuration backbone of AssetFlow AI. It enables AI-powered assistance, organization-level customization, secure third-party integrations, and feature management while remaining scalable for future multi-tenant SaaS deployments.
