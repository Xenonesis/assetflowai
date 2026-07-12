# Section 6.4.3 — Asset Lifecycle, Status History & Event Timeline

---

# Purpose

The Asset Lifecycle System records every state transition and operational event throughout an asset's lifetime.

Unlike the `assets` table, which stores only the current state, these tables preserve the complete history of the asset.

This enables:

- Complete auditability
- Historical reporting
- AI analysis
- Timeline visualization
- Compliance
- Undo investigations
- Operational insights

No historical event should ever be deleted.

---

# Asset Lifecycle

Every asset follows a predefined lifecycle.

```
Procured

↓

Registered

↓

Available

↓

Reserved

↓

Allocated

↓

In Use

↓

Returned

↓

Available

↓

Maintenance

↓

Available

↓

Retired

↓

Disposed
```

Alternative States

```
Lost

Damaged

Stolen

Archived

In Transit
```

---

# Lifecycle Principles

- Every transition creates a history record.
- History is immutable.
- Users cannot edit previous events.
- Every event stores the responsible user.
- Every event includes timestamp and remarks.
- AI can analyze lifecycle patterns.

---

# Table 1 — asset_status_history

## Purpose

Stores every status transition of an asset.

The `assets.lifecycle_status` column always represents the **latest status**, while this table preserves the complete timeline.

---

## Relationships

```
Asset

1

↓

Many Status History Records
```

---

## Columns

| Column | Type | Required |
|----------|------|----------|
| id | UUID | ✅ |
| asset_id | UUID FK | ✅ |
| previous_status | ENUM | Nullable |
| current_status | ENUM | ✅ |
| changed_by | UUID FK | ✅ |
| change_reason | TEXT | Nullable |
| triggered_by | ENUM | ✅ |
| created_at | TIMESTAMP | ✅ |

---

# Trigger Sources

```
Manual

Allocation

Return

Maintenance

Transfer

Audit

System

API

Bulk Import

AI Recommendation
```

---

# Example

```
Asset

AF-000124

Previous

AVAILABLE

↓

Current

ALLOCATED

↓

Changed By

EMP-102

↓

Reason

Assigned to HR Manager

↓

Time

12 July 2026
```

---

# Business Rules

Status changes cannot be edited.

Status changes cannot be deleted.

Status history ordered chronologically.

Every lifecycle transition creates a record.

---

# Table 2 — asset_events

## Purpose

Stores every meaningful business event related to an asset.

Unlike Status History, this includes operational events.

Examples

Created

Allocated

Returned

Maintenance Started

Maintenance Completed

QR Scanned

Transferred

Audit Passed

Audit Failed

Document Uploaded

Warranty Expired

---

## Relationships

```
Asset

↓

Many Events
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID FK |
| event_type | ENUM |
| title | VARCHAR(150) |
| description | TEXT |
| performed_by | UUID FK |
| reference_table | VARCHAR(80) |
| reference_id | UUID |
| metadata | JSONB |
| event_time | TIMESTAMP |

---

# Event Types

```
CREATED

UPDATED

ALLOCATED

RETURNED

TRANSFERRED

BOOKED

MAINTENANCE_STARTED

MAINTENANCE_COMPLETED

AUDIT_STARTED

AUDIT_COMPLETED

DOCUMENT_UPLOADED

IMAGE_UPLOADED

QR_GENERATED

QR_SCANNED

STATUS_CHANGED

LOCATION_CHANGED

OWNER_CHANGED

RETIRED

DISPOSED

RESTORED
```

---

# Metadata

Events support JSON metadata.

Example

```json
{
    "old_department":"IT",
    "new_department":"HR",
    "approvedBy":"EMP-001"
}
```

---

# Business Rules

Events never deleted.

Events generated automatically.

Developers should never manually insert timeline events.

Events created by application services.

---

# Table 3 — asset_lifecycle_history

## Purpose

Maintains complete ownership and lifecycle journey.

This differs from status history.

Status

↓

Current State

Lifecycle History

↓

Business Journey

---

## Relationships

```
Asset

↓

Many Lifecycle Records
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID FK |
| lifecycle_stage | ENUM |
| entered_at | TIMESTAMP |
| exited_at | TIMESTAMP |
| duration_hours | INTEGER |
| responsible_user | UUID |
| remarks | TEXT |

---

# Example

```
Asset

↓

Available

8 Days

↓

Allocated

183 Days

↓

Maintenance

2 Days

↓

Available

32 Days

↓

Retired
```

---

# Lifecycle Analytics

Using this table we can calculate:

Average Allocation Time

Average Maintenance Time

Average Idle Time

Average Asset Life

Replacement Recommendation

Utilization %

---

# Table 4 — asset_location_history

## Purpose

Tracks physical movement of assets.

Example

```
Warehouse

↓

HQ

↓

IT Floor

↓

Meeting Room

↓

Maintenance Center
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID FK |
| previous_location_id | UUID FK |
| new_location_id | UUID FK |
| moved_by | UUID FK |
| reason | TEXT |
| moved_at | TIMESTAMP |

---

# Business Rules

Every location change recorded.

Supports GPS in future.

Supports RFID integration.

---

# Timeline Generation

The UI timeline is generated from multiple tables.

```
Asset Created

↓

QR Generated

↓

Allocated

↓

Returned

↓

Maintenance

↓

Transferred

↓

Audit

↓

Disposed
```

Timeline merges

Status History

+

Events

+

Maintenance

+

Transfers

+

Audits

into one chronological view.

---

# State Transition Rules

Allowed

```
AVAILABLE

↓

ALLOCATED
```

Allowed

```
ALLOCATED

↓

RETURNED
```

Allowed

```
AVAILABLE

↓

MAINTENANCE
```

Allowed

```
MAINTENANCE

↓

AVAILABLE
```

Allowed

```
AVAILABLE

↓

RETIRED
```

Forbidden

```
RETIRED

↓

ALLOCATED
```

Forbidden

```
DISPOSED

↓

AVAILABLE
```

Forbidden

```
LOST

↓

ALLOCATED
```

---

# Event Generation Rules

Every important action creates an event.

| Action | Event |
|---------|-------|
| Asset Created | CREATED |
| Asset Updated | UPDATED |
| Allocation | ALLOCATED |
| Return | RETURNED |
| Transfer | TRANSFERRED |
| Maintenance | MAINTENANCE_STARTED |
| Maintenance Close | MAINTENANCE_COMPLETED |
| QR Scan | QR_SCANNED |
| Audit | AUDIT_COMPLETED |
| Retirement | RETIRED |

---

# AI Integration

The AI Assistant reads historical events.

Examples

> Show maintenance history.

↓

Timeline generated.

---

> Which assets move frequently?

↓

Location History Analysis.

---

> Predict replacement.

↓

Lifecycle Analysis.

---

> Show inactive assets.

↓

Duration Analysis.

---

# Performance Strategy

Indexes

```
asset_id

event_time

event_type

current_status

lifecycle_stage
```

Timeline Query Target

```
<150 ms
```

History Query

```
<100 ms
```

---

# Future Extensions

The timeline system should support:

- RFID movement events
- IoT sensor events
- GPS tracking
- Temperature logs
- Battery health
- Network status
- AI anomaly detection
- Digital Twin synchronization

without schema redesign.

---

# Definition of Done

The Asset History system is complete when:

✓ Every status transition is recorded.

✓ Every business action generates an event.

✓ Asset timelines are immutable.

✓ Location changes are tracked.

✓ Lifecycle duration is measurable.

✓ Timeline UI can be generated directly from database records.

✓ AI can analyze historical data.

✓ Full audit trail is preserved.
