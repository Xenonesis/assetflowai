# Section 6.1 — Database Architecture & Design Principles

---

# Purpose

This section defines the database architecture for AssetFlow AI.

The database is responsible for storing all organizational information including:

- Users
- Roles
- Departments
- Categories
- Assets
- Asset History
- Bookings
- Maintenance
- Transfers
- Audits
- Reports
- Notifications
- Activity Logs
- AI Conversations
- System Configuration

The architecture must support enterprise-scale growth while maintaining high performance, consistency, security, and extensibility.

---

# Database Technology

Database

PostgreSQL 17+

ORM

Drizzle ORM

Migration Tool

Drizzle Kit

Connection Pool

Supabase Pooler / PgBouncer

Hosting

Supabase PostgreSQL

---

# Why PostgreSQL?

PostgreSQL has been selected because it provides:

✓ ACID Transactions

✓ Foreign Keys

✓ JSON Support

✓ Full Text Search

✓ Generated Columns

✓ Row Level Security

✓ Extensions

✓ Excellent Performance

✓ Strong Community

✓ Enterprise Reliability

---

# Database Goals

The database must satisfy the following goals.

---

## DG-001

Maintain complete data integrity.

No invalid relationships should exist.

---

## DG-002

Prevent duplicate business records.

Examples

- Duplicate Asset Tags
- Duplicate Employee Emails
- Duplicate Serial Numbers

---

## DG-003

Support millions of records.

Example

Assets

1,000,000+

Activity Logs

100,000,000+

Notifications

50,000,000+

without architectural redesign.

---

## DG-004

Support future modules.

Future additions include:

Inventory

Procurement

Finance

CRM

RFID

IoT

Mobile

ERP Integrations

---

## DG-005

Provide complete auditability.

Every important record should maintain:

Created By

Updated By

Created At

Updated At

Deleted At

Version

---

# Database Design Principles

---

## Principle 1

Normalization First

The schema should follow Third Normal Form (3NF).

No duplicated business information should exist.

Example

Department Name should exist only in the Departments table.

Assets should reference Department ID.

---

## Principle 2

Relationships Over Duplication

Always reference entities using Foreign Keys.

Example

❌ Wrong

Employee Name stored in Asset table.

✅ Correct

employee_id references employees.id

---

## Principle 3

Immutable History

Historical information should never be overwritten.

Example

Asset Allocation History

Bad

Overwrite previous owner.

Good

Create Allocation History Record.

---

## Principle 4

Soft Deletes

Business data should never be permanently deleted unless legally required.

Instead use:

deleted_at

deleted_by

is_deleted

This allows:

Recovery

Audit

Compliance

---

## Principle 5

UUID Primary Keys

Every business table uses UUID.

Example

id UUID PRIMARY KEY

Benefits

No collision

Safer APIs

Distributed systems

Easy replication

---

## Principle 6

Automatic Timestamps

Every table contains

created_at

updated_at

Optional

deleted_at

---

## Principle 7

Status Driven Workflows

Workflow entities should use Status fields.

Examples

Assets

Available

Allocated

Maintenance

Lost

Retired

---

Bookings

Pending

Approved

Cancelled

Completed

---

Maintenance

Pending

Approved

Assigned

In Progress

Resolved

Closed

---

# Naming Convention

Tables

snake_case

Example

asset_categories

maintenance_requests

activity_logs

---

Columns

snake_case

Example

asset_tag

employee_id

department_id

created_at

---

Primary Key

id

---

Foreign Key

entity_id

Examples

asset_id

user_id

department_id

category_id

---

Boolean Fields

Prefix

is_

Examples

is_active

is_deleted

is_shared

is_verified

---

Timestamp Fields

created_at

updated_at

deleted_at

approved_at

completed_at

returned_at

---

# Schema Organization

```
public

│

├── users

├── roles

├── permissions

├── departments

├── categories

├── assets

├── allocations

├── transfers

├── bookings

├── maintenance

├── audits

├── reports

├── notifications

├── activity_logs

├── ai

└── settings
```

---

# Database Modules

## Core

Users

Roles

Permissions

Departments

Categories

---

## Asset Management

Assets

Asset Documents

Asset Images

Asset QR

Asset History

Asset Timeline

---

## Operations

Allocations

Transfers

Bookings

Maintenance

Audits

---

## Communication

Notifications

Emails

Activity Logs

AI Chat

---

## Analytics

Reports

Dashboard Cache

KPIs

---

## Configuration

Settings

Feature Flags

System Config

---

# Standard Columns

Every business table should include the following columns.

| Column | Type |
|----------|------|
| id | UUID |
| created_at | Timestamp |
| updated_at | Timestamp |
| created_by | UUID |
| updated_by | UUID |
| deleted_at | Timestamp Nullable |
| deleted_by | UUID Nullable |
| is_deleted | Boolean |

These columns provide:

Audit Trail

Ownership

Recovery

Compliance

---

# Data Integrity Rules

The database must enforce:

Foreign Keys

Unique Constraints

Check Constraints

Not Null Constraints

Default Values

Cascade Rules

---

Example

Asset

must belong to

Department

Category

Creator

Status

---

# Foreign Key Strategy

Every relationship uses Foreign Keys.

Example

```
asset.department_id

↓

departments.id
```

No orphan records should exist.

---

# Cascade Rules

Parent

↓

Child

Examples

Department

↓

Assets

Deletion

RESTRICT

Reason

Assets cannot exist without departments.

---

User

↓

Notifications

Deletion

SET NULL

Reason

Historical notifications remain.

---

Asset

↓

Allocation History

Deletion

RESTRICT

Reason

Business history must remain.

---

# Indexing Strategy

Every table receives indexes based on query frequency.

Example

Users

email

department_id

role_id

---

Assets

asset_tag

serial_number

status

department_id

category_id

location

---

Bookings

resource_id

start_time

end_time

status

---

Maintenance

asset_id

priority

status

technician_id

---

# Composite Index Examples

Assets

(status, department_id)

---

Bookings

(resource_id, start_time)

---

Notifications

(user_id, is_read)

---

Activity Logs

(entity_type, entity_id)

---

# Search Strategy

Global Search supports:

Assets

Employees

Departments

Bookings

Maintenance

Audits

Use PostgreSQL Full Text Search.

Future

pgvector

for semantic AI search.

---

# Data Retention

Assets

Permanent

---

Activity Logs

7 Years

---

Notifications

1 Year

---

AI Conversations

90 Days

(Configurable)

---

Audit Records

Permanent

---

# Backup Strategy

Daily Incremental

Weekly Full Backup

Point-in-Time Recovery

30 Day Retention

---

# Security

Sensitive data:

Passwords

Encrypted

---

API Keys

Encrypted

---

Tokens

Encrypted

---

Files

Private Storage

---

Personally Identifiable Information

Protected

---

# Performance Targets

Simple Query

<50ms

---

Search

<150ms

---

Dashboard

<500ms

---

Report

<3 seconds

---

Bulk Import

10,000 Assets

<60 seconds

---

# Future Database Extensions

The schema should support future modules without breaking existing relationships.

Examples

RFID

IoT Devices

Inventory

Procurement

Finance

Vendor Management

Service Contracts

Warranty Claims

Digital Twin

Predictive Analytics

GIS Mapping

---

# Database Principles Summary

The database should be:

✓ Normalized

✓ Secure

✓ Auditable

✓ Scalable

✓ Modular

✓ AI Ready

✓ High Performance

✓ Future Proof

---

# Deliverables for Section 6

The complete database specification will include:

✓ 25+ Tables

✓ ER Diagram

✓ Foreign Key Map

✓ Index Strategy

✓ Constraints

✓ Business Rules

✓ Soft Delete Strategy

✓ History Tables

✓ Performance Optimization

✓ Migration Strategy

This section serves as the architectural foundation for all backend APIs, business workflows, reporting, analytics, and AI capabilities within AssetFlow AI.
