# Section 9.4 — User Management API Specification

---

# Purpose

User APIs manage employees and platform users.

---

# Endpoints

```
GET    /users

POST   /users

GET    /users/{id}

PATCH  /users/{id}

DELETE /users/{id}

POST   /users/{id}/activate

POST   /users/{id}/deactivate

GET    /users/{id}/activity

GET    /users/{id}/sessions

GET    /users/{id}/assets

GET    /users/{id}/bookings

GET    /users/{id}/notifications

POST   /users/bulk-import
```

---

# Capabilities

Employee Management

Profile Management

Department Assignment

Asset Ownership

Session Monitoring

Bulk Import

Activity Timeline

---

# Permissions

users.view

users.create

users.update

users.delete

users.export

users.import

---

# Business Rules

Email unique.

Employee ID unique.

Soft delete only.

Cannot delete yourself.

Managers cannot edit Admins.

---

# Events

UserCreated

UserUpdated

UserActivated

UserDeactivated

UserDeleted

BulkImported

---

# Background Jobs

Invitation

Welcome Email

QR Badge

Activity Log

Notification

---

# Performance

Search

<150ms

Profile

<100ms

---

# Definition of Done

✓ User CRUD

✓ Bulk Import

✓ Session View

✓ Activity Timeline

✓ Department Assignment
