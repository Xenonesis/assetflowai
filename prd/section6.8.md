# Section 6.8 — Audit Management Database Design

---

# Purpose

The Audit subsystem verifies the existence, condition, ownership, and compliance status of organizational assets.

It enables organizations to:

- Conduct scheduled audit cycles
- Assign auditors
- Verify physical assets
- Scan QR codes
- Capture evidence
- Record discrepancies
- Generate audit reports
- Maintain compliance records

The subsystem provides complete traceability for regulatory and internal audits.

---

# Audit Workflow

```
Create Audit Cycle

↓

Assign Auditors

↓

Generate Audit Items

↓

Physical Verification

↓

Capture Evidence

↓

Record Findings

↓

Review

↓

Close Audit

↓

Generate Report

↓

AI Summary
```

Alternative Paths

```
Re-Audit

Escalation

Asset Missing

Asset Damaged

Investigation

Corrective Action
```

---

# Core Tables

1. audit_cycles
2. audit_assignments
3. audit_items
4. audit_findings
5. audit_evidence
6. audit_reports

---

# Table 1 — audit_cycles

## Purpose

Represents a complete audit event.

Examples

Annual Asset Audit

Quarterly IT Audit

Department Audit

Vehicle Inspection

Compliance Audit

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| audit_number | VARCHAR(40) UNIQUE |
| audit_name | VARCHAR(200) |
| audit_type | ENUM |
| department_id | UUID FK Nullable |
| start_date | DATE |
| end_date | DATE |
| initiated_by | UUID FK |
| approved_by | UUID FK Nullable |
| status | ENUM |
| remarks | TEXT |
| created_at | TIMESTAMP |

---

## Audit Types

```
Annual

Quarterly

Monthly

Random

Department

Compliance

Financial

Safety
```

---

## Status

```
Draft

Scheduled

In Progress

Under Review

Completed

Cancelled

Archived
```

---

## Business Rules

Audit number auto-generated.

Closed audits cannot be modified.

Audit dates cannot overlap for the same scope unless explicitly allowed.

---

# Table 2 — audit_assignments

## Purpose

Assigns auditors to audit cycles.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| audit_cycle_id | UUID FK |
| auditor_id | UUID FK Users |
| assigned_by | UUID FK |
| assigned_at | TIMESTAMP |
| assignment_status | ENUM |

---

## Assignment Status

```
Assigned

Accepted

Declined

Completed
```

---

## Business Rules

One audit may have multiple auditors.

Auditor workload should be balanced.

Assignment changes logged.

---

# Table 3 — audit_items

## Purpose

Represents every asset to be verified during an audit.

---

## Relationships

```
Audit Cycle

↓

Many Audit Items

Asset

↓

Many Audit Items
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| audit_cycle_id | UUID FK |
| asset_id | UUID FK |
| expected_location_id | UUID FK |
| actual_location_id | UUID FK Nullable |
| expected_holder_id | UUID FK Nullable |
| actual_holder_id | UUID FK Nullable |
| verification_status | ENUM |
| qr_verified | BOOLEAN |
| verified_by | UUID FK |
| verified_at | TIMESTAMP |
| remarks | TEXT |

---

## Verification Status

```
Pending

Verified

Missing

Damaged

Incorrect Location

Incorrect Holder

Duplicate

Requires Review
```

---

## Business Rules

Every asset appears only once per audit cycle.

QR verification automatically timestamps the audit.

Location mismatches create findings.

---

# Table 4 — audit_findings

## Purpose

Stores issues discovered during audits.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| audit_item_id | UUID FK |
| severity | ENUM |
| finding_type | ENUM |
| description | TEXT |
| corrective_action | TEXT |
| responsible_user | UUID FK |
| due_date | DATE |
| status | ENUM |
| resolved_at | TIMESTAMP Nullable |
| created_at | TIMESTAMP |

---

## Severity

```
Low

Medium

High

Critical
```

---

## Finding Types

```
Missing Asset

Damaged Asset

Wrong Location

Wrong Owner

QR Missing

Compliance Failure

Unauthorized Allocation

Inventory Mismatch

Other
```

---

## Status

```
Open

In Progress

Resolved

Closed

Rejected
```

---

## Business Rules

Critical findings require escalation.

Resolved findings remain immutable.

Every finding generates an activity log.

---

# Table 5 — audit_evidence

## Purpose

Stores supporting evidence collected during audits.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| audit_item_id | UUID FK |
| evidence_type | ENUM |
| file_url | TEXT |
| uploaded_by | UUID FK |
| uploaded_at | TIMESTAMP |
| remarks | TEXT |

---

## Evidence Types

```
Photo

Video

PDF

Document

QR Scan

Signature

Voice Note
```

---

## Business Rules

Evidence stored in secure object storage.

Files linked, not embedded.

Version history maintained.

---

# Table 6 — audit_reports

## Purpose

Stores generated audit reports.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| audit_cycle_id | UUID FK |
| report_type | ENUM |
| generated_by | UUID FK |
| report_url | TEXT |
| generated_at | TIMESTAMP |

---

## Report Types

```
Summary

Detailed

Department

Compliance

Executive

Exception Report
```

---

# Audit Verification Process

```
Select Asset

↓

Scan QR Code

↓

Load Asset Details

↓

Compare Expected vs Actual

↓

Capture Photo

↓

Record Condition

↓

Save Verification

↓

Generate Finding (if needed)

↓

Next Asset
```

---

# QR-Based Verification

Each successful scan records:

- Asset ID
- Auditor
- GPS (optional)
- Timestamp
- Device ID (future)
- Verification result

---

# Compliance Scoring

Every audit generates a compliance score.

Example Formula

```
Verified Assets

÷

Total Assets

×

100
```

Example

```
485 Verified

500 Total

=

97%
```

---

# AI Features

The AI Assistant can answer:

> Which department has the most audit findings?

---

> Show assets repeatedly failing audits.

---

> Generate executive audit summary.

---

> Predict departments at highest audit risk.

---

> Recommend corrective actions.

---

# Notifications

Generated for:

Audit Created

Auditor Assigned

Audit Started

Finding Created

Critical Finding

Corrective Action Due

Audit Completed

Report Generated

---

# Reporting

Audit Completion Report

Department Audit Report

Finding Summary

Compliance Report

Exception Report

Auditor Performance

Corrective Action Report

Executive Dashboard

---

# Performance Strategy

Indexes

```
audit_cycle_id

asset_id

verification_status

severity

status

verified_at
```

Composite

```
(audit_cycle_id, verification_status)

(asset_id, verification_status)

(severity, status)
```

Target Query Time

```
Audit Dashboard

<150ms
```

---

# Security

Employees:

No access unless assigned.

Auditors:

Access assigned audit cycles only.

Asset Managers:

View and manage all audits.

Admins:

Full access.

Every audit action logged.

---

# Future Extensions

Supports:

- Offline mobile auditing
- RFID batch verification
- NFC verification
- GPS location validation
- Barcode scanning
- AI image verification
- Drone-assisted inspections
- Computer vision asset detection

without schema redesign.

---

# Definition of Done

The Audit subsystem is complete when:

✓ Audit cycles can be created.

✓ Auditors assigned.

✓ Assets verified.

✓ QR verification supported.

✓ Findings recorded.

✓ Evidence uploaded.

✓ Compliance score calculated.

✓ Reports generated.

✓ AI summaries available.

✓ Complete audit trail preserved.

---

# Section Summary

The Audit subsystem provides enterprise-grade governance and compliance by supporting structured audit cycles, physical verification, discrepancy management, evidence collection, compliance scoring, and AI-assisted reporting. It integrates seamlessly with Assets, Allocations, Maintenance, Notifications, Activity Logs, and Analytics to provide a complete organizational audit capability.
