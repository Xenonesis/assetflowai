# Section 6.9 — Notifications, Activity Logs & Communication Database Design

---

# Purpose

The Communication subsystem delivers real-time notifications, records every significant system action, queues outbound communications, and provides immutable audit logs.

Objectives:

- Notify users of important events
- Maintain complete activity history
- Support multiple communication channels
- Enable event-driven architecture
- Power integrations with external services
- Provide forensic-grade audit trails

This subsystem underpins security, transparency, and operational awareness.

---

# Event Flow

```
Business Event

↓

Event Bus

↓

Notification Engine

↓

Email Queue

↓

Push Notification

↓

In-App Notification

↓

Webhook

↓

Activity Log

↓

Audit Log
```

---

# Core Tables

1. notifications
2. notification_templates
3. notification_preferences
4. activity_logs
5. audit_logs
6. email_queue
7. webhook_events

---

# Table 1 — notifications

## Purpose

Stores all in-app notifications.

Examples:

- Asset allocated
- Maintenance approved
- Booking reminder
- Audit assigned
- Warranty expiring

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| recipient_id | UUID FK Users |
| title | VARCHAR(200) |
| message | TEXT |
| notification_type | ENUM |
| priority | ENUM |
| entity_type | VARCHAR(50) |
| entity_id | UUID Nullable |
| is_read | BOOLEAN |
| read_at | TIMESTAMP Nullable |
| expires_at | TIMESTAMP Nullable |
| created_at | TIMESTAMP |

---

## Notification Types

```
Asset

Allocation

Booking

Maintenance

Audit

Approval

Reminder

Security

AI Insight

System
```

---

## Priority

```
Low

Normal

High

Critical
```

---

## Business Rules

Unread notifications persist until read.

Critical notifications require acknowledgment.

Expired notifications archived.

---

# Table 2 — notification_templates

## Purpose

Reusable templates for notifications.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| template_key | VARCHAR(120) UNIQUE |
| channel | ENUM |
| subject | VARCHAR(255) |
| body | TEXT |
| variables | JSONB |
| is_active | BOOLEAN |
| created_at | TIMESTAMP |

---

## Channels

```
In-App

Email

SMS

Push

Webhook

Slack

Teams

WhatsApp
```

---

## Example Variables

```json
{
  "asset_name": "",
  "employee_name": "",
  "due_date": ""
}
```

---

# Table 3 — notification_preferences

## Purpose

Stores user notification preferences.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID FK |
| channel | ENUM |
| notification_type | ENUM |
| enabled | BOOLEAN |
| quiet_hours_start | TIME Nullable |
| quiet_hours_end | TIME Nullable |
| created_at | TIMESTAMP |

---

## Business Rules

Users can opt out of non-critical notifications.

Critical security alerts cannot be disabled.

---

# Table 4 — activity_logs

## Purpose

Records all business activities performed by users.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID FK Nullable |
| action | VARCHAR(120) |
| module | VARCHAR(80) |
| entity_type | VARCHAR(80) |
| entity_id | UUID Nullable |
| old_value | JSONB Nullable |
| new_value | JSONB Nullable |
| ip_address | INET |
| user_agent | TEXT |
| created_at | TIMESTAMP |

---

## Example Activities

```
User Login

Asset Created

Asset Updated

Allocation Approved

Booking Cancelled

Maintenance Closed

Audit Completed
```

---

## Business Rules

Immutable records.

No updates allowed.

Never deleted.

---

# Table 5 — audit_logs

## Purpose

Stores security-sensitive events for compliance.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| actor_id | UUID FK Nullable |
| event_type | ENUM |
| severity | ENUM |
| target_resource | VARCHAR(120) |
| target_id | UUID Nullable |
| ip_address | INET |
| device_info | TEXT |
| metadata | JSONB |
| occurred_at | TIMESTAMP |

---

## Event Types

```
Authentication

Authorization

Permission Change

Role Change

Password Reset

Failed Login

MFA Event

API Access

System Configuration

Security Alert
```

---

## Severity

```
Info

Warning

High

Critical
```

---

## Business Rules

Immutable.

Retained for minimum 7 years.

Supports compliance audits.

---

# Table 6 — email_queue

## Purpose

Queues outbound emails for asynchronous delivery.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| recipient_email | VARCHAR(255) |
| template_id | UUID FK |
| subject | VARCHAR(255) |
| payload | JSONB |
| status | ENUM |
| retry_count | INTEGER |
| scheduled_at | TIMESTAMP |
| sent_at | TIMESTAMP Nullable |
| created_at | TIMESTAMP |

---

## Status

```
Queued

Processing

Sent

Failed

Cancelled
```

---

## Business Rules

Retries with exponential backoff.

Maximum retry count configurable.

Failed emails logged.

---

# Table 7 — webhook_events

## Purpose

Stores outbound webhook events for integrations.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| event_name | VARCHAR(150) |
| endpoint_url | TEXT |
| payload | JSONB |
| response_status | INTEGER Nullable |
| response_body | TEXT Nullable |
| retry_count | INTEGER |
| status | ENUM |
| created_at | TIMESTAMP |

---

## Status

```
Pending

Delivered

Failed

Retrying
```

---

# Event Bus

Every major action emits an event.

Examples

```
AssetAllocated

MaintenanceCompleted

BookingApproved

AuditClosed

UserCreated

RoleChanged
```

Consumers

- Notification Service
- Email Service
- AI Engine
- Analytics
- Webhooks
- Activity Logger

---

# Notification Lifecycle

```
Create Event

↓

Resolve Template

↓

Generate Notification

↓

Queue Delivery

↓

Deliver

↓

Read

↓

Archive
```

---

# AI Features

The AI Assistant can answer:

> Show unread critical alerts.

---

> Summarize yesterday's activity.

---

> Which users receive the most notifications?

---

> Detect unusual login activity.

---

> Explain recent system changes.

---

# Reporting

Notification Delivery Report

Unread Notifications

Email Delivery Report

Activity Summary

Security Events

Webhook Success Rate

User Activity Report

Audit Trail Report

---

# Performance Strategy

Indexes

```
recipient_id

notification_type

is_read

created_at

user_id

module

event_type

status
```

Composite

```
(recipient_id, is_read)

(user_id, created_at)

(event_type, severity)
```

Target Query Time

```
Notification Feed

<100ms

Activity Timeline

<150ms
```

---

# Security

Employees:

View own notifications.

Managers:

View department-related activities.

Admins:

View all notifications and logs.

Audit logs require elevated permissions.

Sensitive metadata encrypted where applicable.

---

# Future Extensions

Supports:

- Slack Integration
- Microsoft Teams
- WhatsApp Business API
- SMS Gateways
- Mobile Push Notifications
- Kafka/RabbitMQ Event Streaming
- SIEM Integration
- OpenTelemetry Export

without schema redesign.

---

# Definition of Done

The Communication subsystem is complete when:

✓ In-app notifications delivered.

✓ Templates reusable.

✓ User preferences respected.

✓ Activity logs immutable.

✓ Security audit logs maintained.

✓ Email queue operational.

✓ Webhooks delivered with retries.

✓ Event-driven architecture established.

✓ Reports generated.

✓ AI insights supported.

---

# Section Summary

The Communication subsystem provides a complete enterprise-grade event infrastructure for AssetFlow AI. It combines notifications, activity tracking, security auditing, asynchronous messaging, and webhook integrations into a unified, scalable architecture that supports transparency, compliance, and future enterprise integrations.
