# Section 9.8 — Allocation & Transfer APIs

---

# Purpose

Manages assignment and movement of assets.

---

# Allocation Endpoints

```
GET    /allocations

POST   /allocations

GET    /allocations/{id}

PATCH  /allocations/{id}

POST   /allocations/{id}/approve

POST   /allocations/{id}/reject

POST   /allocations/{id}/return

POST   /allocations/{id}/extend
```

---

# Transfer Endpoints

```
GET    /transfers

POST   /transfers

GET    /transfers/{id}

PATCH  /transfers/{id}

POST   /transfers/{id}/approve

POST   /transfers/{id}/complete

POST   /transfers/{id}/cancel
```

---

# Permissions

allocation.create

allocation.update

allocation.approve

allocation.return

transfer.create

transfer.approve

---

# Business Rules

Only AVAILABLE assets may be allocated.

Allocated assets cannot be allocated twice.

Transfer updates location and owner atomically.

---

# Events

AllocationCreated

AllocationApproved

AllocationReturned

TransferRequested

TransferCompleted

---

# Background Jobs

Notifications

Audit Log

Activity Timeline

Dashboard Refresh

---

# Definition of Done

✓ Allocation Workflow

✓ Transfer Workflow

✓ Approvals

✓ Returns

✓ History
