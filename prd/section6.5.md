# Section 6.5 — Asset Allocation & Transfer Database Design

---

# Purpose

The Allocation & Transfer subsystem manages the complete chain of custody for every asset.

Every movement of an asset—from allocation to return, transfer, reservation, or reassignment—must be permanently recorded.

Objectives:

- Prevent duplicate allocations
- Maintain ownership history
- Support approvals
- Ensure accountability
- Enable audits
- Generate AI insights
- Track chain of custody

This subsystem forms the operational heart of AssetFlow AI.

---

# Allocation Workflow

```

Asset Available

↓

Allocation Request

↓

Approval

↓

Allocated

↓

Returned

↓

Available

OR

↓

Transfer

↓

New Owner

OR

↓

Maintenance

↓

Available

```

---

# Core Tables

1. asset_allocations
2. asset_returns
3. asset_transfer_requests
4. asset_transfer_history
5. asset_reservations

---

# Table 1 — asset_allocations

## Purpose

Stores every asset allocation.

An asset can be allocated multiple times over its lifetime.

Historical allocations are never deleted.

---

## Relationships

```
Asset

1

↓

Many Allocations

User

1

↓

Many Allocations
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID FK |
| allocated_to | UUID FK Users |
| allocated_by | UUID FK Users |
| department_id | UUID FK |
| allocation_type | ENUM |
| expected_return | DATE |
| actual_return | DATE |
| purpose | TEXT |
| approval_required | BOOLEAN |
| approved_by | UUID FK |
| approved_at | TIMESTAMP |
| status | ENUM |
| digital_signature | TEXT |
| remarks | TEXT |
| created_at | TIMESTAMP |

---

# Allocation Types

```
Permanent

Temporary

Project

Loan

Rental

Emergency

Training

Testing
```

---

# Status

```
Pending

Approved

Allocated

Returned

Cancelled

Expired

Rejected
```

---

# Business Rules

Only AVAILABLE assets can be allocated.

Asset status changes automatically.

One active allocation per asset.

Approval required when configured.

Digital signature optional.

History immutable.

---

# Validation

Asset exists.

User active.

Department active.

Expected return ≥ today.

---

# Constraints

```sql
CHECK(expected_return >= CURRENT_DATE)
```

Unique active allocation.

```
(asset_id)

WHERE status='Allocated'
```

---

# Table 2 — asset_returns

## Purpose

Records asset returns.

Maintains return condition.

Supports damage reporting.

---

## Relationships

```
Allocation

↓

Return
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| allocation_id | UUID FK |
| returned_by | UUID FK |
| received_by | UUID FK |
| return_condition | ENUM |
| remarks | TEXT |
| damage_notes | TEXT |
| photos | JSONB |
| signature | TEXT |
| returned_at | TIMESTAMP |

---

# Return Condition

```
Excellent

Good

Fair

Damaged

Broken

Lost
```

---

# Business Rules

Return closes allocation.

Asset becomes AVAILABLE.

If damaged

↓

Maintenance Request created.

If lost

↓

Incident created.

---

# Table 3 — asset_transfer_requests

## Purpose

Transfers assets between employees or departments.

---

## Workflow

```
Request

↓

Manager Approval

↓

Asset Manager Approval

↓

Transfer

↓

History
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID |
| from_user | UUID |
| to_user | UUID |
| from_department | UUID |
| to_department | UUID |
| requested_by | UUID |
| approved_by | UUID |
| rejected_by | UUID |
| transfer_reason | TEXT |
| approval_comments | TEXT |
| status | ENUM |
| requested_at | TIMESTAMP |
| approved_at | TIMESTAMP |

---

# Status

```
Draft

Pending

Approved

Rejected

Completed

Cancelled
```

---

# Business Rules

Requester cannot approve.

Approval mandatory.

Transfer updates allocation.

Timeline event created.

Notification sent.

---

# Table 4 — asset_transfer_history

## Purpose

Permanent record of completed transfers.

---

## Relationships

```
Asset

↓

Many Transfers
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID |
| previous_owner | UUID |
| new_owner | UUID |
| previous_department | UUID |
| new_department | UUID |
| transfer_request_id | UUID |
| completed_by | UUID |
| completed_at | TIMESTAMP |

---

# Business Rules

Never editable.

Never deleted.

Supports audit.

---

# Table 5 — asset_reservations

## Purpose

Reserve assets before allocation.

Examples

Reserve Laptop

Reserve Projector

Reserve Vehicle

---

## Workflow

```
Available

↓

Reserved

↓

Allocated

↓

Returned

↓

Available
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID |
| reserved_by | UUID |
| reserved_for | UUID |
| reservation_start | TIMESTAMP |
| reservation_end | TIMESTAMP |
| reservation_reason | TEXT |
| status | ENUM |
| created_at | TIMESTAMP |

---

# Status

```
Active

Expired

Cancelled

Converted

```

---

# Business Rules

Reservation blocks allocation.

Expired reservation auto-cancelled.

Converted reservation becomes allocation.

---

# Approval Workflow

```
Employee

↓

Department Head

↓

Asset Manager

↓

Approved

↓

Allocation

↓

Notification
```

Approval rules should be configurable by organization.

---

# Chain of Custody

Every asset movement creates:

- Allocation Record
- Transfer Record (if applicable)
- Return Record
- Timeline Event
- Activity Log
- Notification

This ensures complete traceability.

---

# Conflict Detection

System prevents:

- Double allocation
- Allocation of retired assets
- Allocation of assets under maintenance
- Allocation during active reservation
- Transfers without approval

---

# Digital Signatures

Allocation

↓

Employee Signature

↓

Asset Manager Signature

↓

Return Signature

Stored as:

```
Base64

or

Secure File Reference
```

---

# AI Features

AI can answer:

> Who currently owns this asset?

↓

Current Allocation

---

> Show overdue returns.

↓

Expected Return Analysis

---

> Which department borrows the most assets?

↓

Allocation Analytics

---

> Which employees frequently damage assets?

↓

Return Condition History

---

> Predict future allocation demand.

↓

Usage Analysis

---

# Notifications

Generated on:

Allocation Request

Approval

Allocation

Return Reminder

Overdue Return

Transfer Request

Transfer Approval

Transfer Completion

Reservation Expiry

---

# Reporting

Allocation Report

Return Report

Transfer Report

Department Usage

Employee Usage

Asset Utilization

Overdue Assets

Chain of Custody

---

# Performance

Indexes

```
asset_id

allocated_to

status

department_id

expected_return

created_at
```

Composite

```
(asset_id, status)

(allocated_to, status)

(department_id, status)
```

Target Query Time

```
<100ms
```

---

# Security

Employees:

View only their own allocations.

Department Heads:

View department allocations.

Asset Managers:

Manage all allocations.

Admins:

Full access.

Every change logged.

---

# Future Extensions

Supports:

- Mobile Check-in / Check-out
- QR Scan Allocation
- NFC Allocation
- RFID Check-out
- Face Verification
- Geo-fencing
- Offline Allocation Sync
- AI Approval Recommendations

without schema redesign.

---

# Definition of Done

The Allocation & Transfer subsystem is complete when:

✓ Asset allocation works.

✓ Return workflow implemented.

✓ Transfer approvals operational.

✓ Reservation system functional.

✓ Chain of custody maintained.

✓ Conflict detection enabled.

✓ Digital signatures supported.

✓ Notifications generated.

✓ Timeline updated.

✓ AI analytics supported.

✓ Audit trail preserved.
