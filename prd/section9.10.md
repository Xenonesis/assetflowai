# Section 9.10 — Maintenance APIs

---

# Purpose

Maintenance lifecycle APIs.

---

# Endpoints

```
GET    /maintenance

POST   /maintenance

GET    /maintenance/{id}

PATCH  /maintenance/{id}

DELETE /maintenance/{id}

POST   /maintenance/{id}/approve

POST   /maintenance/{id}/assign

POST   /maintenance/{id}/start

POST   /maintenance/{id}/complete

POST   /maintenance/{id}/verify

GET    /maintenance/work-orders

GET    /maintenance/schedules

POST   /maintenance/schedules

GET    /maintenance/history
```

---

# Permissions

maintenance.view

maintenance.create

maintenance.update

maintenance.assign

maintenance.verify

---

# Business Rules

Only active assets.

Preventive maintenance auto-generated.

Verification mandatory.

Complete audit trail.

---

# Events

MaintenanceRequested

WorkOrderCreated

TechnicianAssigned

MaintenanceCompleted

VerificationCompleted

---

# Background Jobs

SLA Monitor

Reminder

Notifications

Analytics

AI Prediction

---

# Performance

Dashboard

<200ms

Work Order

<150ms

---

# Definition of Done

✓ Maintenance Workflow

✓ Work Orders

✓ Scheduling

✓ Verification

✓ History
