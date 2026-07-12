# Section 6.4.1 — Asset Management Database (assets)

---

# Purpose

The `assets` table is the most critical entity in the AssetFlow AI platform.

Every physical asset owned, managed, borrowed, allocated, maintained, audited, or retired by the organization must exist within this table.

This table serves as the **Single Source of Truth (SSOT)** for all asset-related operations.

All downstream modules—including Allocation, Booking, Maintenance, Audit, QR Tracking, AI Insights, Reports, Notifications, and Analytics—reference this entity.

---

# Business Objectives

The Asset table must:

- Store every physical asset.
- Track complete lifecycle.
- Prevent duplicate registrations.
- Support QR tracking.
- Enable AI recommendations.
- Maintain historical integrity.
- Support enterprise-scale growth.
- Allow future IoT/RFID integration.

---

# Table Name

```sql
assets
```

---

# Primary Key

```sql
id UUID PRIMARY KEY
```

Uses UUID v7.

Reason:

- Globally unique
- Secure APIs
- Better distributed systems
- Future multi-tenant support

---

# Table Structure

| Column | Type | Required | Default | Description |
|----------|------|----------|----------|-------------|
| id | UUID | ✅ | uuid_generate_v7() | Primary Key |
| asset_tag | VARCHAR(30) | ✅ | Auto Generated | Human-readable Asset ID |
| barcode | VARCHAR(60) | ❌ | NULL | Barcode value |
| qr_code | TEXT | ❌ | NULL | QR Identifier |
| serial_number | VARCHAR(120) | ❌ | NULL | Manufacturer Serial |
| asset_name | VARCHAR(255) | ✅ | - | Asset Name |
| short_name | VARCHAR(80) | ❌ | NULL | Display Name |
| description | TEXT | ❌ | NULL | Description |
| category_id | UUID FK | ✅ | - | Asset Category |
| department_id | UUID FK | ✅ | - | Owning Department |
| current_holder_id | UUID FK | ❌ | NULL | Current Employee |
| location_id | UUID FK | ❌ | NULL | Physical Location |
| manufacturer | VARCHAR(120) | ❌ | NULL | Brand |
| model | VARCHAR(120) | ❌ | NULL | Model |
| purchase_date | DATE | ❌ | NULL | Purchase Date |
| warranty_start | DATE | ❌ | NULL | Warranty Start |
| warranty_end | DATE | ❌ | NULL | Warranty Expiry |
| purchase_cost | NUMERIC(12,2) | ❌ | 0 | Purchase Cost |
| current_value | NUMERIC(12,2) | ❌ | NULL | Current Estimated Value |
| depreciation_rate | NUMERIC(5,2) | ❌ | NULL | Annual Depreciation |
| asset_condition | ENUM | ✅ | GOOD | Physical Condition |
| lifecycle_status | ENUM | ✅ | AVAILABLE | Current Status |
| ownership_type | ENUM | ✅ | OWNED | Owned / Leased |
| is_bookable | BOOLEAN | ✅ | FALSE | Shared Resource |
| requires_approval | BOOLEAN | ✅ | TRUE | Allocation Approval |
| maintenance_due | DATE | ❌ | NULL | Next Maintenance |
| last_maintenance | DATE | ❌ | NULL | Last Maintenance |
| image_url | TEXT | ❌ | NULL | Thumbnail |
| notes | TEXT | ❌ | NULL | Internal Notes |
| created_by | UUID FK | ✅ | - | Creator |
| updated_by | UUID FK | ❌ | NULL | Last Modifier |
| created_at | TIMESTAMP | ✅ | NOW() | Created Timestamp |
| updated_at | TIMESTAMP | ✅ | NOW() | Updated Timestamp |
| deleted_at | TIMESTAMP | ❌ | NULL | Soft Delete |
| version | INTEGER | ✅ | 1 | Optimistic Locking |

---

# Lifecycle Status

```text
AVAILABLE

↓

RESERVED

↓

ALLOCATED

↓

UNDER_MAINTENANCE

↓

AVAILABLE

↓

RETIRED

↓

DISPOSED
```

Additional Statuses

```
LOST

DAMAGED

IN_TRANSIT

ARCHIVED
```

---

# Asset Condition Enum

```text
NEW

EXCELLENT

GOOD

FAIR

POOR

DAMAGED

BROKEN

LOST
```

---

# Ownership Type

```
OWNED

LEASED

RENTED

THIRD_PARTY
```

---

# Asset Tag Format

Automatically Generated

```
AF-000001

AF-000002

AF-000003
```

Pattern

```
PREFIX + Zero Padded Number
```

Configurable

```
AF

AST

LAP

IT

VEH
```

---

# Business Rules

## Rule 1

Every asset must belong to exactly one category.

---

## Rule 2

Every asset belongs to exactly one department.

---

## Rule 3

Serial Numbers must be unique if provided.

---

## Rule 4

Asset Tags are globally unique.

---

## Rule 5

Deleted assets are never permanently removed.

Soft Delete only.

---

## Rule 6

Assets cannot have two active holders simultaneously.

---

## Rule 7

Retired assets cannot be allocated.

---

## Rule 8

Disposed assets become read-only.

---

## Rule 9

Lost assets automatically trigger notifications.

---

## Rule 10

Maintenance automatically changes lifecycle status.

---

# Relationships

```
Category

1

↓

Many Assets
```

```
Department

1

↓

Many Assets
```

```
Location

1

↓

Many Assets
```

```
User

1

↓

Many Assets Created
```

```
Asset

1

↓

Many Allocation Records
```

```
Asset

1

↓

Many Maintenance Records
```

```
Asset

1

↓

Many Audit Records
```

```
Asset

1

↓

Many Documents
```

```
Asset

1

↓

Many Images
```

---

# Constraints

```sql
UNIQUE(asset_tag)
```

```sql
UNIQUE(serial_number)
```

(serial_number allows multiple NULL values)

```sql
CHECK (purchase_cost >= 0)
```

```sql
CHECK (current_value >= 0)
```

```sql
CHECK (warranty_end >= warranty_start)
```

```sql
CHECK (maintenance_due >= purchase_date)
```

---

# Default Values

```
Lifecycle

AVAILABLE
```

Condition

```
GOOD
```

Ownership

```
OWNED
```

Bookable

```
FALSE
```

Approval

```
TRUE
```

Created At

```
NOW()
```

---

# Index Strategy

Primary Index

```
PRIMARY KEY(id)
```

Unique

```
asset_tag
```

Unique

```
serial_number
```

Search

```
asset_name
```

Search

```
manufacturer
```

Search

```
model
```

Foreign Keys

```
category_id

department_id

location_id

current_holder_id
```

Lifecycle

```
lifecycle_status
```

Condition

```
asset_condition
```

Maintenance

```
maintenance_due
```

Composite

```
(department_id, lifecycle_status)
```

Composite

```
(category_id, lifecycle_status)
```

Composite

```
(location_id, lifecycle_status)
```

---

# Searchable Fields

Global Search indexes

- Asset Tag
- Asset Name
- Serial Number
- Manufacturer
- Model
- Department
- Category
- QR Code
- Barcode

Future

PostgreSQL Full Text Search

pg_trgm

pgvector

---

# Validation Rules

Asset Name

Required

Max 255 chars

---

Category

Required

---

Department

Required

---

Asset Tag

Generated

Read Only

---

Purchase Cost

Cannot be negative

---

Warranty

End Date ≥ Start Date

---

Maintenance Date

Cannot be before Purchase Date

---

# AI Features

Every asset exposes metadata to AI.

AI can answer:

> Where is Laptop AF-001?

> Who currently owns it?

> When is maintenance due?

> Which department owns it?

> Show idle assets.

> Predict replacement.

---

# Example Record

```json
{
  "asset_tag": "AF-000145",
  "asset_name": "Dell Latitude 7440",
  "category": "Electronics",
  "department": "IT",
  "manufacturer": "Dell",
  "model": "Latitude 7440",
  "serial_number": "DL74401239",
  "condition": "GOOD",
  "status": "ALLOCATED",
  "current_holder": "EMP-102",
  "location": "HQ Floor 3",
  "purchase_cost": 98500,
  "bookable": false
}
```

---

# Performance Expectations

Single Asset Fetch

< 20ms

---

Asset Search

< 150ms

---

Asset List (100 rows)

< 300ms

---

Bulk Import

10,000 assets

< 45 seconds

---

# Future Expansion

The assets table must support future integration with:

- RFID tags
- NFC chips
- BLE Beacons
- GPS trackers
- IoT sensors
- Warranty providers
- Vendor APIs
- Procurement systems
- Insurance records
- Carbon footprint tracking
- Digital Twin models

No breaking schema changes should be required.

---

# Definition of Done

The `assets` table implementation is complete when:

- UUID primary key implemented.
- Asset tags auto-generated.
- QR-ready identifiers stored.
- All foreign keys enforced.
- Soft delete enabled.
- Audit columns included.
- Lifecycle validation implemented.
- Indexes created.
- Constraints validated.
- ORM model generated.
- Migration tested.
- CRUD operations verified.
