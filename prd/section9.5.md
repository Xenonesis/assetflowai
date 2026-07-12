# Section 9.5 — Role & Permission (RBAC) API Specification

---

# Purpose

RBAC APIs manage roles, permissions, and authorization.

---

# Endpoints

```
GET    /roles

POST   /roles

GET    /roles/{id}

PATCH  /roles/{id}

DELETE /roles/{id}

GET    /permissions

POST   /roles/{id}/permissions

DELETE /roles/{id}/permissions/{permissionId}

POST   /users/{id}/roles

DELETE /users/{id}/roles/{roleId}

GET    /users/{id}/permissions

POST   /permissions/check
```

---

# Permission Format

```
assets.view

assets.create

assets.update

assets.delete

maintenance.approve

booking.create

audit.close

reports.export

admin.manage
```

---

# Default Roles

Super Admin

Organization Owner

Asset Manager

Department Head

Employee

Auditor

Maintenance Technician

Viewer

---

# Permission Resolution

```
User

↓

Role

↓

Permissions

↓

Access Decision
```

---

# Business Rules

Permissions inherited from roles.

Direct user permissions optional.

Reserved system roles cannot be deleted.

Permission cache invalidated after changes.

---

# Events

RoleCreated

RoleUpdated

RoleDeleted

PermissionAssigned

PermissionRemoved

RoleAssigned

RoleRevoked

---

# Background Jobs

Permission Cache Refresh

Audit Log

Notification

---

# Security

Every RBAC change requires:

Password Confirmation

Audit Log

Permission Validation

---

# Performance

Permission Check

<20ms

---

# Definition of Done

✓ Role CRUD

✓ Permission Assignment

✓ User Roles

✓ Permission Cache

✓ Audit Trail
