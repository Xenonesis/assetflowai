# Section 6.3 — Core Database Tables

---

# Purpose

This section defines the core database entities required before any business module can function.

These entities provide the organizational structure, authentication, authorization, and classification system used throughout AssetFlow AI.

Every other module references one or more of these tables.

Core Tables:

1. users
2. roles
3. permissions
4. role_permissions
5. departments
6. asset_categories
7. locations

---

# Entity Overview

```

Roles

↓

Users

↓

Departments

↓

Assets

↓

Maintenance

↓

Reports

Categories

↓

Assets

Permissions

↓

Roles

↓

Users
```

---

# Table 1 — roles

## Purpose

Stores every system role.

Examples

- Admin
- Asset Manager
- Department Head
- Employee

---

## Columns

| Column | Type | Constraints |
|----------|------|------------|
| id | UUID | PK |
| name | VARCHAR(50) | UNIQUE NOT NULL |
| description | TEXT | NULL |
| priority | SMALLINT | DEFAULT 0 |
| is_system | BOOLEAN | DEFAULT TRUE |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## Sample Data

| Name |
|------|
| Admin |
| Asset Manager |
| Department Head |
| Employee |

---

## Business Rules

Role names are unique.

System roles cannot be deleted.

Inactive roles cannot be assigned.

Priority determines hierarchy.

---

## Indexes

UNIQUE(name)

INDEX(priority)

INDEX(is_active)

---

# Table 2 — permissions

## Purpose

Stores every permission available inside the platform.

Permissions follow:

```

module.action
```

Examples

assets.create

assets.edit

assets.delete

maintenance.approve

reports.export

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| module | VARCHAR(50) |
| action | VARCHAR(50) |
| permission_key | VARCHAR(100) UNIQUE |
| description | TEXT |
| created_at | TIMESTAMP |

---

## Examples

assets.view

assets.create

assets.update

assets.delete

assets.allocate

bookings.create

maintenance.approve

audit.create

reports.export

---

## Validation

Permission key unique.

Module required.

Action required.

---

# Table 3 — role_permissions

## Purpose

Maps permissions to roles.

Many-to-many relationship.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| role_id | UUID FK |
| permission_id | UUID FK |
| created_at | TIMESTAMP |

---

## Relationships

Role

↓

Many Permissions

Permission

↓

Many Roles

---

## Constraints

Unique

(role_id, permission_id)

---

## Example

Admin

↓

assets.create

Admin

↓

assets.delete

Employee

↓

assets.view

Employee

↓

bookings.create

---

# Table 4 — departments

## Purpose

Represents organizational departments.

Examples

IT

HR

Finance

Operations

Sales

Administration

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| name | VARCHAR(100) |
| code | VARCHAR(20) |
| description | TEXT |
| head_user_id | UUID FK users |
| parent_department_id | UUID FK departments |
| email | VARCHAR(255) |
| phone | VARCHAR(20) |
| location_id | UUID FK |
| status | ENUM |
| created_by | UUID |
| updated_by | UUID |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |
| deleted_at | TIMESTAMP NULL |

---

## Status

Active

Inactive

Archived

---

## Relationships

Department

↓

Many Users

Department

↓

Many Assets

Department

↓

Many Reports

Department

↓

Many Audit Cycles

---

## Validation

Department Name unique.

Department Code unique.

Parent Department optional.

Department Head optional.

---

## Business Rules

Inactive department cannot receive assets.

Cannot delete department with employees.

Cannot delete department with active assets.

---

## Indexes

UNIQUE(name)

UNIQUE(code)

INDEX(status)

INDEX(parent_department_id)

---

# Table 5 — users

## Purpose

Stores employee accounts.

Every authenticated person exists here.

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| employee_code | VARCHAR(30) |
| first_name | VARCHAR(80) |
| last_name | VARCHAR(80) |
| email | VARCHAR(255) |
| phone | VARCHAR(20) |
| password_hash | TEXT |
| avatar_url | TEXT |
| department_id | UUID FK |
| role_id | UUID FK |
| designation | VARCHAR(100) |
| joining_date | DATE |
| status | ENUM |
| last_login | TIMESTAMP |
| failed_attempts | SMALLINT |
| email_verified | BOOLEAN |
| is_active | BOOLEAN |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |
| deleted_at | TIMESTAMP |

---

## Status

Active

Inactive

Suspended

Pending Verification

---

## Relationships

User

↓

One Department

↓

One Role

↓

Many Assets Created

↓

Many Allocations

↓

Many Notifications

↓

Many Activity Logs

↓

Many AI Conversations

---

## Validation

Employee Code unique.

Email unique.

Phone optional.

Password encrypted.

Role required.

Department required.

---

## Business Rules

Inactive users cannot login.

Deleted users remain in history.

Password never stored in plaintext.

Email verification required.

---

## Indexes

UNIQUE(email)

UNIQUE(employee_code)

INDEX(role_id)

INDEX(department_id)

INDEX(status)

INDEX(last_login)

---

# Table 6 — asset_categories

## Purpose

Classifies assets.

Examples

Electronics

Furniture

Vehicles

Networking

Medical

Infrastructure

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| name | VARCHAR(100) |
| code | VARCHAR(30) |
| icon | VARCHAR(100) |
| color | VARCHAR(20) |
| description | TEXT |
| depreciation_years | SMALLINT |
| warranty_default_months | SMALLINT |
| requires_serial | BOOLEAN |
| requires_qr | BOOLEAN |
| status | ENUM |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## Relationships

Category

↓

Many Assets

---

## Validation

Category Name unique.

Category Code unique.

---

## Business Rules

Cannot delete category with assets.

Inactive categories hidden from dropdown.

---

## Example Categories

Electronics

Furniture

Servers

Vehicles

Projectors

Networking

Medical

Construction

---

## Indexes

UNIQUE(name)

UNIQUE(code)

INDEX(status)

---

# Table 7 — locations

## Purpose

Represents physical locations.

Examples

Building A

Building B

Floor 3

Warehouse

Conference Hall

Branch Office

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| name | VARCHAR(120) |
| code | VARCHAR(30) |
| building | VARCHAR(80) |
| floor | VARCHAR(20) |
| room | VARCHAR(50) |
| address | TEXT |
| city | VARCHAR(80) |
| state | VARCHAR(80) |
| country | VARCHAR(80) |
| postal_code | VARCHAR(20) |
| latitude | DECIMAL(10,8) |
| longitude | DECIMAL(11,8) |
| status | ENUM |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## Relationships

Location

↓

Many Departments

↓

Many Assets

↓

Many Resources

---

## Validation

Location name unique.

Coordinates optional.

---

## Business Rules

Inactive locations hidden.

Historical records preserved.

---

## Core Relationships Summary

```
roles

↓

users

↓

departments

↓

locations

↓

assets

↓

maintenance

↓

audit

↓

reports
```

```
asset_categories

↓

assets
```

```
permissions

↓

role_permissions

↓

roles
```

---

# Core Constraints

Users require:

✓ Department

✓ Role

Departments may have:

✓ Parent Department

✓ Department Head

Categories:

✓ Unique Name

✓ Unique Code

Roles:

✓ Immutable System Roles

Permissions:

✓ Unique Permission Key

Locations:

✓ Reusable across modules

---

# Data Integrity Rules

- A User must belong to exactly one Department.
- A User must have exactly one Role.
- A Department may have one Department Head.
- A Department can have many Users.
- A Category can classify many Assets.
- A Location can contain many Assets.
- Roles cannot exist without permissions.
- Permission assignments must be unique.

---

# Expected Record Volume

| Table | Expected Size |
|--------|--------------:|
| Roles | <20 |
| Permissions | 300–500 |
| Role Permissions | 2,000–5,000 |
| Departments | 100–10,000 |
| Users | 100–100,000 |
| Categories | 20–500 |
| Locations | 50–50,000 |

---

# Section Summary

These seven core tables form the foundation of AssetFlow AI.

Every business module—including Assets, Allocations, Bookings, Maintenance, Audits, Reports, Notifications, and AI—depends on these entities for identity, authorization, organization, and classification.

No operational data should exist without referencing these core entities.
