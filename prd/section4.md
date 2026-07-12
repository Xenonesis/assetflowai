# Section 4 — Functional Requirements & Business Rules

---

# Purpose

This section defines every functional capability that AssetFlow AI must provide.

Each requirement describes:

- Expected system behavior
- User interaction
- Validation rules
- Business logic
- Acceptance criteria
- Error handling

These requirements are mandatory for the MVP unless explicitly marked as optional.

---

# Functional Requirement Categories

The platform consists of the following core modules.

FR-001 Authentication

FR-002 User Management

FR-003 Department Management

FR-004 Asset Categories

FR-005 Asset Management

FR-006 Asset Allocation

FR-007 Asset Transfer

FR-008 Resource Booking

FR-009 Maintenance

FR-010 Audit

FR-011 Dashboard

FR-012 Reports

FR-013 Notifications

FR-014 Activity Logs

FR-015 AI Assistant

---

# FR-001 Authentication

## Description

Users must authenticate before accessing the platform.

---

### Functional Requirements

The system shall:

- Allow login using email and password.
- Allow logout.
- Support forgot password.
- Support password reset.
- Maintain active session.
- Validate JWT/session token.
- Redirect users based on role.

---

### Validation Rules

Email required

Password required

Minimum password length = 8

Email must be unique

Inactive users cannot login

---

### Acceptance Criteria

✓ User logs in successfully.

✓ Invalid credentials show error.

✓ Expired session redirects to login.

✓ Logout destroys session.

---

### Error Cases

Incorrect password

Inactive account

Deleted account

Expired token

Network failure

---

# FR-002 User Management

## Description

Administrators manage all users.

---

### Features

Create User

Edit User

Deactivate User

Activate User

Reset Password

Assign Department

Assign Role

---

### Validation

Email unique

Department required

Role required

Employee ID unique

---

### Business Rules

Only Admin may:

- Create users
- Promote users
- Change roles
- Delete users

Employees cannot change their own roles.

---

### Acceptance Criteria

Admin can create users.

Duplicate email blocked.

Inactive users cannot login.

---

# FR-003 Department Management

Departments organize users and assets.

---

### Features

Create Department

Edit Department

Deactivate Department

Assign Head

Parent Department

Department Status

---

### Validation

Department Name unique

Department Code unique

Cannot delete if assets exist

Cannot delete if employees exist

---

### Business Rules

Inactive departments cannot receive new assets.

Department Head must be active.

---

# FR-004 Asset Categories

Categories classify assets.

Examples

Electronics

Furniture

Vehicles

Servers

Networking

Medical Equipment

---

### Features

Create Category

Edit Category

Archive Category

Category Icon

Custom Metadata

---

### Validation

Category Name unique

Cannot delete if assets exist

---

# FR-005 Asset Management

This is the primary module.

---

## Features

Register Asset

Edit Asset

Archive Asset

Delete Asset

Search Asset

View Timeline

Upload Documents

Generate QR

Print QR

View History

---

### Asset Fields

Asset ID

Asset Tag

Name

Category

Department

Serial Number

Manufacturer

Model

Purchase Date

Warranty

Purchase Cost

Vendor

Condition

Status

Current Holder

Current Location

Photo

Documents

Notes

Created By

Created At

Updated At

---

### Asset Lifecycle

Available

↓

Reserved

↓

Allocated

↓

Maintenance

↓

Available

↓

Retired

↓

Disposed

---

### Validation

Serial Number unique

Asset Tag auto-generated

Category required

Department required

Status required

---

### Business Rules

Every asset belongs to exactly one category.

An asset cannot have two active holders.

Deleted assets remain in audit history.

Asset status changes automatically based on workflows.

---

### Acceptance Criteria

✓ Asset registered.

✓ QR generated.

✓ Timeline created.

✓ Searchable immediately.

---

# FR-006 Asset Allocation

Assets may be assigned to users.

---

### Features

Allocate

Return

Transfer

Expected Return Date

Condition Check

History

---

### Validation

Asset must be Available.

Employee must be Active.

Department must exist.

---

### Business Rules

Allocated assets cannot be allocated again.

Transfer required if asset already allocated.

Return changes status to Available.

History immutable.

---

### Acceptance Criteria

Allocation updates status.

Notifications sent.

History stored.

Dashboard updated.

---

# FR-007 Asset Transfer

Transfers move assets between employees or departments.

---

Workflow

Request

↓

Review

↓

Approve

↓

Reassign

↓

History Update

---

### Features

Transfer Request

Approve

Reject

Comments

Timeline

Notification

---

### Business Rules

Transfer requires approval.

Requester cannot self-approve.

Transfer creates audit log.

---

# FR-008 Resource Booking

Shared resources support scheduling.

Examples

Meeting Room

Projector

Vehicle

Laptop Pool

Camera

Conference Hall

---

### Features

Calendar

Time Slot

Availability

Cancel

Reschedule

Reminder

---

### Validation

No overlapping bookings.

End Time > Start Time.

Past bookings prohibited.

---

### Business Rules

Resources marked unavailable cannot be booked.

Cancelled bookings free the slot.

---

### Acceptance Criteria

Overlap prevented.

Calendar updated.

Notifications delivered.

---

# FR-009 Maintenance

Maintenance workflow manages repairs.

---

Workflow

Pending

↓

Approved

↓

Technician Assigned

↓

In Progress

↓

Resolved

↓

Closed

---

### Features

Raise Request

Approve

Reject

Assign Technician

Upload Photos

Cost

Priority

Completion Notes

History

---

### Validation

Asset required.

Description required.

Priority required.

---

### Business Rules

Approval changes status to Maintenance.

Completion restores status.

History cannot be deleted.

---

# FR-010 Audit

Audit verifies physical assets.

---

Workflow

Create Cycle

↓

Assign Auditor

↓

Verify

↓

Discrepancy

↓

Close Cycle

↓

Generate Report

---

### Features

Audit Cycle

Verification

Missing

Damaged

Lost

Comments

Report

---

### Business Rules

Closed audits immutable.

Missing assets flagged.

Lost assets require confirmation.

---

# FR-011 Dashboard

Every role receives a customized dashboard.

---

Widgets

KPIs

Charts

Recent Activity

Notifications

Calendar

Quick Actions

AI Insights

---

Dashboard updates automatically after:

Allocation

Maintenance

Booking

Audit

Transfer

---

# FR-012 Reports

Reports include

Assets

Departments

Maintenance

Bookings

Audits

Utilization

Inventory

---

Export

PDF

Excel

CSV

---

Filtering

Department

Date

Employee

Category

Status

Location

---

# FR-013 Notifications

Supported Channels

In-App

Email

---

Notification Types

Allocation

Transfer

Booking

Maintenance

Audit

Returns

System

AI

---

Business Rules

Notifications must persist until read.

Critical alerts require acknowledgment.

---

# FR-014 Activity Logs

Every important action generates a log.

Examples

Login

Logout

Asset Created

Edited

Deleted

Allocated

Returned

Transfer Approved

Booking Created

Maintenance Completed

Audit Closed

---

Log Fields

Timestamp

User

Action

Module

Old Value

New Value

IP Address

Device

---

Activity logs are immutable.

---

# FR-015 AI Assistant

The AI Assistant provides intelligent assistance.

---

Capabilities

Natural Language Search

Asset Lookup

Maintenance Prediction

Analytics Summary

Department Insights

Policy Questions

Audit Summary

---

Example Queries

"Where is Laptop AF-102?"

"Show idle assets."

"Assets needing maintenance."

"Generate utilization summary."

"Most active department."

---

Business Rules

AI cannot modify data.

AI suggestions require human confirmation.

AI responses logged.

---

# Cross-Module Business Rules

The following rules apply across the platform.

---

BR-001

Every asset must have exactly one lifecycle state.

---

BR-002

Every allocation creates history.

---

BR-003

Every maintenance request references one asset.

---

BR-004

Bookings cannot overlap.

---

BR-005

Closed audits are immutable.

---

BR-006

Inactive users cannot create records.

---

BR-007

Inactive departments cannot receive assets.

---

BR-008

Deleted records remain available in audit history.

---

BR-009

Every important action creates an activity log.

---

BR-010

Every permission check uses RBAC middleware.

---

# Functional Requirement Priority

## Critical (P0)

Authentication

Assets

Allocation

Maintenance

Bookings

Dashboard

RBAC

Reports

Notifications

---

## High (P1)

Audit

Activity Logs

QR Generation

Search

---

## Medium (P2)

AI Assistant

Analytics

Predictive Maintenance

Smart Insights

---

## Low (Future)

RFID

IoT

Voice Assistant

Offline Mode

Digital Twin

---

# Definition of Done

A functional module is considered complete only if:

✓ CRUD operations work.

✓ Validation implemented.

✓ RBAC enforced.

✓ Activity logs generated.

✓ Notifications triggered.

✓ APIs documented.

✓ Error handling complete.

✓ Responsive UI implemented.

✓ Unit tests pass.

✓ Business rules enforced.

---

# Section Summary

This section defines the complete functional behavior of AssetFlow AI. It establishes the business rules, validations, workflows, acceptance criteria, and priorities for every core module. These requirements form the basis for backend APIs, frontend screens, database design, RBAC, and testing.
