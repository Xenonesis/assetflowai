# Section 6.6 — Resource Booking & Scheduling Database Design

---

# Purpose

The Booking subsystem enables employees to reserve shared organizational resources for a defined period.

Unlike allocations, bookings are temporary and time-bound.

Examples include:

- Meeting Rooms
- Company Vehicles
- Laptops
- Projectors
- Cameras
- Conference Halls
- Lab Equipment
- Shared Workstations
- Training Rooms

The system prevents scheduling conflicts, supports approvals, and integrates with enterprise calendars.

---

# Booking Workflow

```

Available Resource

↓

Search Availability

↓

Create Booking

↓

Approval (Optional)

↓

Confirmed

↓

Check-In

↓

In Use

↓

Check-Out

↓

Completed

```

Alternative Paths

```
Rejected

Cancelled

Expired

No Show
```

---

# Core Tables

1. resources
2. resource_bookings
3. booking_attendees
4. booking_conflicts
5. booking_checkins

---

# Table 1 — resources

## Purpose

Stores every shared resource that can be booked.

Examples

Conference Room A

Projector P-01

Canon Camera

Vehicle V-12

Laptop Pool

Training Room

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID FK Nullable |
| resource_name | VARCHAR(150) |
| resource_type | ENUM |
| department_id | UUID FK |
| location_id | UUID FK |
| capacity | INTEGER |
| approval_required | BOOLEAN |
| advance_booking_days | INTEGER |
| booking_duration_limit | INTEGER |
| status | ENUM |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## Resource Types

```
Meeting Room

Vehicle

Projector

Laptop

Camera

Desk

Lab Equipment

Training Room

Other
```

---

## Status

```
Available

Unavailable

Maintenance

Reserved

Archived
```

---

## Business Rules

Resources may optionally reference an asset.

Capacity required for rooms.

Inactive resources cannot be booked.

---

# Table 2 — resource_bookings

## Purpose

Stores every booking.

---

## Relationships

```
Resource

↓

Many Bookings

User

↓

Many Bookings
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| resource_id | UUID FK |
| booked_by | UUID FK |
| title | VARCHAR(200) |
| purpose | TEXT |
| booking_start | TIMESTAMP |
| booking_end | TIMESTAMP |
| attendee_count | INTEGER |
| approval_required | BOOLEAN |
| approved_by | UUID FK |
| checked_in_at | TIMESTAMP |
| checked_out_at | TIMESTAMP |
| recurrence_rule | TEXT |
| status | ENUM |
| created_at | TIMESTAMP |

---

## Status

```
Pending

Approved

Confirmed

Checked In

Completed

Cancelled

Rejected

Expired

No Show
```

---

## Validation

Start < End

No past bookings

Duration within configured limit

No overlapping bookings

---

## Business Rules

Booking automatically expires after end time.

Conflict detection mandatory.

Approval workflow configurable.

---

# Table 3 — booking_attendees

## Purpose

Stores attendees for meetings or shared bookings.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| booking_id | UUID FK |
| user_id | UUID FK |
| attendance_status | ENUM |
| invited_at | TIMESTAMP |

---

## Attendance Status

```
Invited

Accepted

Declined

Attended

Absent
```

---

# Table 4 — booking_conflicts

## Purpose

Stores detected scheduling conflicts.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| booking_id | UUID FK |
| conflicting_booking_id | UUID FK |
| conflict_type | ENUM |
| detected_at | TIMESTAMP |
| resolved | BOOLEAN |

---

## Conflict Types

```
Time Overlap

Maintenance Window

Resource Offline

Capacity Exceeded

Approval Missing
```

---

# Table 5 — booking_checkins

## Purpose

Tracks actual usage.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| booking_id | UUID FK |
| checked_in_by | UUID FK |
| checked_out_by | UUID FK |
| checkin_time | TIMESTAMP |
| checkout_time | TIMESTAMP |
| remarks | TEXT |

---

# Booking Lifecycle

```
Draft

↓

Pending

↓

Approved

↓

Confirmed

↓

Checked In

↓

Completed
```

Alternative

```
Cancelled

Rejected

Expired

No Show
```

---

# Conflict Detection Rules

The system must reject bookings if:

- Resource already booked
- Resource under maintenance
- Resource archived
- Booking exceeds maximum duration
- Capacity exceeded
- Approval required but missing

---

# Recurring Bookings

Supported recurrence:

```
Daily

Weekly

Monthly

Custom RRULE
```

Examples:

Weekly Team Meeting

Monthly Review

Quarterly Audit

---

# Calendar Integration

The schema is designed to integrate with:

- Google Calendar
- Microsoft Outlook
- Apple Calendar
- CalDAV

Each booking may store an external calendar identifier.

---

# AI Features

AI can answer:

> Find an available meeting room tomorrow at 2 PM.

---

> Which rooms are under-utilized?

---

> Predict booking demand next week.

---

> Recommend an alternate room.

---

> Detect recurring booking conflicts.

---

# Notifications

Generated for:

Booking Created

Approval Requested

Booking Approved

Reminder (24h)

Reminder (1h)

Check-In Reminder

Booking Cancelled

Conflict Detected

Booking Completed

---

# Reporting

Booking Utilization Report

Resource Usage Report

No-Show Report

Conflict Report

Department Booking Report

Peak Usage Analysis

---

# Performance Strategy

Indexes

```
resource_id

booking_start

booking_end

status

booked_by
```

Composite

```
(resource_id, booking_start)

(resource_id, booking_end)

(resource_id, status)
```

Target query time:

```
Availability Search

<100ms
```

---

# Security

Employees:

Create and view own bookings.

Department Heads:

View department bookings.

Asset Managers:

Manage all resources.

Admins:

Full control.

---

# Future Extensions

Supports:

- QR Check-In
- NFC Check-In
- RFID Entry
- Occupancy Sensors
- Smart Locks
- IoT Room Status
- Auto Release of No-Shows
- AI Scheduling Assistant

---

# Definition of Done

The Booking subsystem is complete when:

✓ Shared resources can be registered.

✓ Bookings created and approved.

✓ Conflicts automatically detected.

✓ Recurring bookings supported.

✓ Check-in / Check-out tracked.

✓ Notifications generated.

✓ Calendar integration ready.

✓ AI scheduling supported.

✓ Reports available.

✓ Audit trail maintained.

---

# Section Summary

The Resource Booking subsystem provides enterprise-grade scheduling for shared organizational resources. It supports conflict-free reservations, approval workflows, attendance tracking, recurring events, and future integrations with external calendar systems and IoT-enabled facilities.
