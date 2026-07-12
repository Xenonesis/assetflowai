# Section 6.7 — Maintenance Management Database Design

---

# Purpose

The Maintenance subsystem manages the complete lifecycle of maintenance activities for organizational assets.

It enables organizations to:

- Raise maintenance requests
- Schedule preventive maintenance
- Track work orders
- Assign technicians
- Record spare parts
- Monitor SLA compliance
- Track maintenance costs
- Predict failures using AI

This subsystem ensures assets remain operational while minimizing downtime and extending asset lifespan.

---

# Maintenance Workflow

```

Asset

↓

Issue Reported

↓

Maintenance Request

↓

Approval

↓

Work Order Created

↓

Technician Assigned

↓

Repair In Progress

↓

Quality Verification

↓

Completed

↓

Asset Available

```

Alternative Paths

```
Cancelled

Rejected

Escalated

Vendor Repair

Replacement Recommended
```

---

# Core Tables

1. maintenance_requests
2. maintenance_work_orders
3. maintenance_technicians
4. maintenance_checklists
5. maintenance_parts
6. maintenance_costs
7. preventive_maintenance
8. maintenance_logs

---

# Table 1 — maintenance_requests

## Purpose

Stores every maintenance request raised for an asset.

---

## Relationships

```
Asset

↓

Many Maintenance Requests
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID FK |
| reported_by | UUID FK |
| assigned_to | UUID FK Nullable |
| issue_title | VARCHAR(200) |
| issue_description | TEXT |
| priority | ENUM |
| category | ENUM |
| reported_at | TIMESTAMP |
| due_date | DATE |
| status | ENUM |
| approval_required | BOOLEAN |
| approved_by | UUID FK |
| approved_at | TIMESTAMP |
| created_at | TIMESTAMP |

---

## Priority

```
Low

Medium

High

Critical
```

---

## Categories

```
Hardware

Software

Electrical

Mechanical

Network

Cleaning

Inspection

Calibration

Other
```

---

## Status

```
Pending

Approved

Assigned

In Progress

Waiting Parts

Completed

Rejected

Cancelled

Escalated
```

---

## Business Rules

Only active assets can receive maintenance.

Maintenance automatically changes asset status to:

UNDER_MAINTENANCE

Critical requests require approval within SLA.

---

# Table 2 — maintenance_work_orders

## Purpose

Represents the actual repair task assigned to technicians.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| maintenance_request_id | UUID FK |
| work_order_number | VARCHAR(40) |
| technician_id | UUID FK |
| estimated_hours | DECIMAL |
| actual_hours | DECIMAL |
| started_at | TIMESTAMP |
| completed_at | TIMESTAMP |
| verification_status | ENUM |
| completion_notes | TEXT |
| created_at | TIMESTAMP |

---

## Verification Status

```
Pending

Verified

Rejected

Reopened
```

---

## Business Rules

Every approved request generates one work order.

Completed work orders require verification.

---

# Table 3 — maintenance_technicians

## Purpose

Stores technician information.

Supports:

- Internal technicians
- External vendors
- Service providers

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| user_id | UUID FK Nullable |
| technician_name | VARCHAR(150) |
| company_name | VARCHAR(150) |
| specialization | VARCHAR(120) |
| phone | VARCHAR(30) |
| email | VARCHAR(255) |
| availability_status | ENUM |
| created_at | TIMESTAMP |

---

## Availability

```
Available

Busy

Leave

Offline
```

---

# Table 4 — maintenance_checklists

## Purpose

Ensures standardized maintenance procedures.

Example

Laptop Checklist

☑ Battery Checked

☑ Keyboard Tested

☑ Screen Tested

☑ Ports Tested

☑ BIOS Updated

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| work_order_id | UUID FK |
| checklist_item | VARCHAR(255) |
| completed | BOOLEAN |
| remarks | TEXT |
| completed_by | UUID FK |
| completed_at | TIMESTAMP |

---

# Table 5 — maintenance_parts

## Purpose

Tracks spare parts used during maintenance.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| work_order_id | UUID FK |
| part_name | VARCHAR(150) |
| part_number | VARCHAR(80) |
| quantity | INTEGER |
| unit_cost | DECIMAL(12,2) |
| supplier | VARCHAR(120) |
| created_at | TIMESTAMP |

---

## Future Integration

Inventory Module

Automatic Stock Deduction

Purchase Orders

---

# Table 6 — maintenance_costs

## Purpose

Stores repair costs.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| work_order_id | UUID FK |
| labor_cost | DECIMAL(12,2) |
| parts_cost | DECIMAL(12,2) |
| external_service_cost | DECIMAL(12,2) |
| miscellaneous_cost | DECIMAL(12,2) |
| total_cost | DECIMAL(12,2) |
| currency | VARCHAR(10) |
| created_at | TIMESTAMP |

---

## Formula

```
Total Cost

=

Labor

+

Parts

+

External

+

Miscellaneous
```

---

# Table 7 — preventive_maintenance

## Purpose

Defines recurring maintenance schedules.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID FK |
| schedule_type | ENUM |
| frequency | INTEGER |
| frequency_unit | ENUM |
| next_due_date | DATE |
| last_completed | DATE |
| auto_generate_request | BOOLEAN |
| created_at | TIMESTAMP |

---

## Schedule Types

```
Time Based

Usage Based

Calendar Based
```

---

## Frequency Units

```
Days

Weeks

Months

Years

Hours

Kilometers

Cycles
```

---

## Business Rules

Overdue schedules automatically generate maintenance requests if enabled.

---

# Table 8 — maintenance_logs

## Purpose

Stores chronological logs for every maintenance activity.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| maintenance_request_id | UUID FK |
| action | VARCHAR(120) |
| performed_by | UUID FK |
| remarks | TEXT |
| created_at | TIMESTAMP |

---

## Example Logs

Request Created

Approved

Assigned

Technician Arrived

Repair Started

Parts Ordered

Repair Completed

Verified

Closed

---

# SLA Management

Each priority has an SLA.

| Priority | Response | Resolution |
|----------|----------|------------|
| Critical | 30 min | 4 hrs |
| High | 2 hrs | 1 day |
| Medium | 8 hrs | 3 days |
| Low | 24 hrs | 7 days |

---

# AI Features

The AI Assistant can answer:

> Which assets are overdue for maintenance?

---

> Which technician has the highest workload?

---

> Predict the next maintenance date.

---

> Which assets cost the most to maintain?

---

> Recommend replacement instead of repair.

---

# Notifications

Generated for:

Maintenance Request Created

Approval Required

Technician Assigned

Parts Required

SLA Breach

Maintenance Completed

Verification Pending

Preventive Maintenance Due

---

# Reports

Preventive Maintenance Report

Corrective Maintenance Report

Technician Performance Report

Maintenance Cost Report

Asset Downtime Report

SLA Compliance Report

Parts Consumption Report

---

# Performance Strategy

Indexes

```
asset_id

status

priority

assigned_to

due_date

reported_at
```

Composite

```
(asset_id, status)

(priority, status)

(assigned_to, status)
```

Target query time:

```
Maintenance Dashboard

<150ms
```

---

# Security

Employees:

Raise requests and view their own.

Technicians:

Access assigned work orders.

Asset Managers:

Approve, assign, and monitor all maintenance.

Admins:

Full access.

Every action must generate an activity log.

---

# Future Extensions

Supports:

- IoT-triggered maintenance
- Predictive AI scheduling
- QR-based maintenance check-in
- Offline technician mobile app
- Vendor portals
- Warranty claim automation
- Inventory integration
- Digital maintenance manuals

---

# Definition of Done

The Maintenance subsystem is complete when:

✓ Maintenance requests can be created.

✓ Work orders generated.

✓ Technicians assigned.

✓ Checklists completed.

✓ Parts tracked.

✓ Costs calculated.

✓ Preventive schedules automated.

✓ SLA monitored.

✓ Notifications generated.

✓ AI insights available.

✓ Complete audit trail maintained.

---

# Section Summary

The Maintenance subsystem provides enterprise-grade maintenance management by combining reactive repairs, preventive scheduling, work orders, technician assignment, cost tracking, and AI-assisted insights. It integrates tightly with the Asset, Allocation, Audit, Notification, and Reporting modules to ensure complete lifecycle management and operational reliability.
