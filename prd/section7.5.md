# Section 7.5 — Background Jobs, Event Bus & Queue Architecture

---

# Purpose

Modern enterprise applications should never perform long-running tasks during HTTP requests.

Instead, expensive operations are delegated to asynchronous workers through a reliable queue system.

This subsystem is responsible for:

- Background Jobs
- Queue Processing
- Event Bus
- Retry Logic
- Scheduled Jobs
- Dead Letter Queues
- Worker Architecture

---

# Goals

The queue system must provide:

✓ Reliability

✓ Retry Support

✓ Fault Tolerance

✓ Horizontal Scaling

✓ Delayed Jobs

✓ Scheduled Jobs

✓ Event-Driven Processing

✓ Observability

---

# Technology Stack

Queue

```
BullMQ
```

---

Broker

```
Redis
```

---

Scheduler

```
BullMQ Scheduler
```

---

Workers

```
Node.js Workers
```

---

# Why Background Jobs?

Without Queue

```
HTTP Request

↓

Generate PDF

↓

Upload

↓

Send Email

↓

Notify Users

↓

AI Analysis

↓

Response
```

Response Time

15 Seconds

---

With Queue

```
HTTP Request

↓

Save Data

↓

Queue Jobs

↓

Return Response

↓

Workers Process Jobs
```

Response Time

<200ms

---

# Architecture

```
Client

↓

API

↓

Service

↓

Transaction Commit

↓

Publish Event

↓

Queue

↓

Worker

↓

External Service
```

---

# Queue Types

## notifications

Handles

In-App Notifications

Push Notifications

Slack

Teams

WhatsApp

---

## emails

Handles

Transactional Emails

Reports

Invitations

Password Reset

Approvals

---

## ai

Handles

Summaries

Predictions

Recommendations

Embeddings

Report Generation

---

## reports

Handles

PDF

Excel

CSV

Large Reports

---

## maintenance

Handles

Preventive Scheduling

Warranty Reminders

SLA Monitoring

Escalations

---

## imports

Handles

Bulk Asset Import

CSV Processing

Image Processing

Validation

---

## media

Handles

Image Compression

Thumbnail Generation

QR Generation

OCR

Virus Scan (future)

---

# Queue Structure

```
queues/

├── notification.queue.ts

├── email.queue.ts

├── ai.queue.ts

├── report.queue.ts

├── maintenance.queue.ts

├── import.queue.ts

└── media.queue.ts
```

Each queue owns:

Producer

Worker

Job Types

Retry Policy

---

# Worker Structure

```
workers/

email.worker.ts

notification.worker.ts

report.worker.ts

maintenance.worker.ts

ai.worker.ts

media.worker.ts
```

Workers are stateless.

---

# Event Bus

Business Services publish domain events.

Examples

```
AssetCreated

AssetUpdated

AssetAllocated

AssetReturned

BookingCreated

MaintenanceCompleted

AuditClosed

UserCreated
```

---

# Event Flow

```
Asset Allocated

↓

Publish Event

↓

Notification Queue

↓

Email Queue

↓

Activity Log

↓

Analytics

↓

Webhook

↓

AI Summary
```

One event may trigger multiple jobs.

---

# Job Lifecycle

```
Created

↓

Queued

↓

Waiting

↓

Active

↓

Completed

OR

↓

Failed

↓

Retry

↓

Completed

OR

↓

Dead Letter Queue
```

---

# Retry Strategy

Retries

```
3 Attempts
```

Backoff

```
Exponential
```

Example

```
1 min

↓

5 min

↓

15 min
```

After retries exhausted

↓

Dead Letter Queue

---

# Dead Letter Queue

Purpose

Store permanently failed jobs.

Examples

Email provider unavailable

Webhook timeout

Invalid AI provider

Corrupted PDF

Jobs reviewed manually.

---

# Scheduled Jobs

Runs automatically.

Examples

Every Minute

```
Notification Cleanup
```

Every Hour

```
Retry Failed Jobs
```

Daily

```
Warranty Check

Maintenance Scheduling

AI Health Score

Asset Utilization
```

Weekly

```
Database Cleanup

Statistics

Archive Logs
```

Monthly

```
Compliance Reports

Financial Reports
```

---

# Delayed Jobs

Examples

Reminder

```
24 Hours Before
```

Maintenance

```
7 Days Before
```

Warranty

```
90 Days Before
```

Booking Reminder

```
1 Hour Before
```

---

# Job Payload

Example

```json
{
  "jobId":"...",
  "organizationId":"...",
  "assetId":"...",
  "userId":"...",
  "metadata":{}
}
```

Payloads should contain identifiers, not large objects.

---

# Idempotency

Every job must be idempotent.

Running the same job twice must not produce duplicate effects.

Example

Duplicate Email

↓

Prevented

Duplicate Notification

↓

Prevented

Duplicate QR

↓

Prevented

---

# Worker Responsibilities

Workers may:

Send Emails

Generate Reports

Call AI Models

Resize Images

Compress Files

Call External APIs

Workers must never:

Handle HTTP Requests

Manage Authentication

Perform UI Logic

---

# Job Monitoring

Metrics

Queued

Active

Completed

Failed

Average Duration

Retry Count

Worker Health

---

# AI Queue

Handles

Asset Summaries

Maintenance Predictions

Executive Reports

Natural Language Search

Embeddings

Knowledge Base Updates

Future

Autonomous Agents

---

# Report Queue

Large reports generated asynchronously.

Examples

Inventory Report

Audit Report

Compliance Report

Financial Report

Executive Dashboard Export

User receives notification when ready.

---

# Import Queue

Workflow

```
Upload CSV

↓

Validate

↓

Parse

↓

Create Assets

↓

Generate QR

↓

Index Search

↓

Notification
```

---

# Media Queue

Tasks

Image Resize

Thumbnail

OCR

QR Code

PDF Preview

Virus Scan

Watermark (future)

---

# Queue Monitoring

Dashboard displays:

Queue Length

Failed Jobs

Average Processing Time

Worker Status

Retry Count

Dead Letter Queue

---

# Performance Goals

Notification

<5 Seconds

Email

<30 Seconds

AI Summary

<60 Seconds

Report

<2 Minutes

Bulk Import

10,000 Assets

<5 Minutes

---

# Security

Workers use service accounts.

Secrets loaded securely.

No user sessions.

All actions logged.

---

# Disaster Recovery

If Redis unavailable:

Pause queues.

Continue core transactions.

Resume processing automatically.

Failed jobs persisted.

---

# Future Extensions

Supports

Kafka

RabbitMQ

AWS SQS

Google Pub/Sub

Azure Service Bus

Temporal

Durable Execution

without changing business services.

---

# Definition of Done

The Background Job subsystem is complete when:

✓ BullMQ configured.

✓ Redis connected.

✓ Domain events published.

✓ Queues separated by responsibility.

✓ Workers implemented.

✓ Retry strategy configured.

✓ Dead Letter Queue operational.

✓ Scheduled jobs running.

✓ Monitoring dashboard available.

✓ Jobs idempotent.

✓ Performance targets achieved.

---

# Section Summary

The Background Job architecture provides AssetFlow AI with a resilient, scalable, and event-driven execution model. By moving expensive operations out of the request-response cycle, the platform delivers fast user experiences while reliably processing notifications, reports, AI workloads, media processing, and scheduled maintenance tasks. The design supports horizontal scaling, fault tolerance, and future migration to enterprise messaging platforms without significant architectural changes.
