# Section 6.4.4 — Asset Warranty, Insurance, Depreciation, Compliance & Versioning

---

# Purpose

Enterprise assets require much more than ownership tracking.

Organizations also need to manage:

- Warranty information
- Insurance policies
- Depreciation
- Regulatory compliance
- Certifications
- Version history
- Financial records

These tables ensure every asset remains legally compliant, financially traceable, and audit-ready.

---

# Asset Financial Ecosystem

```
Assets
   │
   ├───────────────┐
   │               │
   ▼               ▼
Warranty      Insurance
   │               │
   ▼               ▼
Compliance   Depreciation
        │
        ▼
 Version History
```

---

# Table 1 — asset_warranties

## Purpose

Stores warranty information for every asset.

Supports:

- Manufacturer Warranty
- Extended Warranty
- AMC
- Vendor Support
- Service Contracts

---

## Relationships

```
Asset

1

↓

Many Warranty Records
```

---

## Columns

| Column | Type |
|---------|------|
| id | UUID |
| asset_id | UUID FK |
| warranty_type | ENUM |
| provider_name | VARCHAR(150) |
| warranty_number | VARCHAR(80) |
| coverage_details | TEXT |
| start_date | DATE |
| end_date | DATE |
| support_email | VARCHAR(255) |
| support_phone | VARCHAR(25) |
| status | ENUM |
| created_at | TIMESTAMP |

---

## Warranty Types

```
Manufacturer

Extended

AMC

OEM

Third Party
```

---

## Status

```
ACTIVE

EXPIRED

PENDING

CANCELLED
```

---

## Business Rules

Multiple warranties allowed.

Only one Active Primary Warranty.

Expired warranties retained.

AI monitors expiry.

---

# Warranty Alerts

Automatic reminders

```
90 Days Before

30 Days Before

7 Days Before

Expiry Day
```

---

# Table 2 — asset_insurance

## Purpose

Tracks insurance coverage.

Useful for

Vehicles

Medical Equipment

Servers

Industrial Equipment

High Value Assets

---

## Relationships

```
Asset

↓

Many Insurance Policies
```

---

## Columns

| Column | Type |
|---------|------|
| id | UUID |
| asset_id | UUID FK |
| insurer_name | VARCHAR(120) |
| policy_number | VARCHAR(80) |
| policy_type | ENUM |
| insured_amount | DECIMAL(14,2) |
| premium | DECIMAL(12,2) |
| deductible | DECIMAL(12,2) |
| start_date | DATE |
| expiry_date | DATE |
| policy_document | TEXT |
| status | ENUM |
| created_at | TIMESTAMP |

---

## Policy Types

```
Asset

Vehicle

Electronics

Equipment

Comprehensive

Custom
```

---

## Business Rules

Expired policies remain.

Renewal reminders generated.

Documents stored separately.

---

# Insurance Notifications

```
90 Days

30 Days

15 Days

7 Days

Expiry Day
```

---

# Table 3 — asset_depreciation

## Purpose

Stores depreciation calculations.

Supports accounting reports.

Future ERP integration.

---

## Relationships

```
Asset

↓

Many Depreciation Records
```

---

## Columns

| Column | Type |
|---------|------|
| id | UUID |
| asset_id | UUID FK |
| depreciation_method | ENUM |
| useful_life_years | INTEGER |
| salvage_value | DECIMAL(12,2) |
| purchase_cost | DECIMAL(12,2) |
| current_book_value | DECIMAL(12,2) |
| annual_depreciation | DECIMAL(12,2) |
| monthly_depreciation | DECIMAL(12,2) |
| last_calculated | DATE |

---

## Supported Methods

```
Straight Line

Declining Balance

Double Declining

Units Produced

Manual
```

---

## AI Capabilities

AI recommends

Replacement

Upgrade

Dispose

Continue Use

based on depreciation.

---

# Table 4 — asset_compliance

## Purpose

Tracks compliance requirements.

Examples

ISO

Safety

Calibration

Fire Safety

Medical

Electrical Inspection

Government Certification

---

## Relationships

```
Asset

↓

Many Compliance Records
```

---

## Columns

| Column | Type |
|---------|------|
| id | UUID |
| asset_id | UUID FK |
| compliance_name | VARCHAR(150) |
| authority | VARCHAR(120) |
| certificate_number | VARCHAR(80) |
| issued_date | DATE |
| expiry_date | DATE |
| compliance_status | ENUM |
| attachment | TEXT |
| remarks | TEXT |

---

## Compliance Status

```
VALID

EXPIRED

PENDING

FAILED

REVOKED
```

---

## Business Rules

Expired compliance blocks allocation.

Compliance reminders generated.

Documents preserved.

---

# Compliance Alerts

```
180 Days

90 Days

30 Days

7 Days

Expiry Day
```

---

# Table 5 — asset_versions

## Purpose

Maintains version history.

Allows complete reconstruction of previous asset records.

Supports

Audit

Rollback

History

Compliance

---

## Relationships

```
Asset

↓

Many Versions
```

---

## Columns

| Column | Type |
|---------|------|
| id | UUID |
| asset_id | UUID FK |
| version_number | INTEGER |
| snapshot | JSONB |
| changed_by | UUID FK |
| change_reason | TEXT |
| created_at | TIMESTAMP |

---

## Snapshot Example

```json
{
    "department":"IT",
    "holder":"EMP102",
    "status":"AVAILABLE",
    "location":"HQ Floor 2"
}
```

---

## Business Rules

Every edit creates a version.

Versions immutable.

Rollback only through admin tools.

---

# Financial Relationships

```
Asset

↓

Purchase Cost

↓

Depreciation

↓

Current Value

↓

Insurance

↓

Replacement Decision
```

---

# AI Insights

AI can answer:

> Which warranties expire next month?

---

> Which assets are over-depreciated?

---

> Which assets have no insurance?

---

> Which compliance certificates expire soon?

---

> Recommend replacements.

---

# Dashboard Widgets

Warranty Expiring

Insurance Expiring

Compliance Due

Depreciation Summary

Replacement Candidates

Most Expensive Assets

Assets Without Coverage

Compliance Score

---

# Validation Rules

Warranty End ≥ Start

Insurance Expiry ≥ Start

Depreciation ≥ 0

Book Value ≥ 0

Compliance Expiry ≥ Issue Date

Version Number Incremental

---

# Index Strategy

```
asset_id

expiry_date

status

provider_name

policy_number

certificate_number
```

Composite

```
(asset_id, status)

(asset_id, expiry_date)
```

---

# Reporting Support

Generate reports for:

Warranty Report

Insurance Coverage Report

Depreciation Report

Compliance Status Report

Replacement Forecast

Financial Asset Report

Audit Compliance Report

---

# Security

Only:

Admin

Finance

Asset Manager

can modify financial records.

Employees have read-only access where permitted.

All changes are logged.

---

# Future Expansion

Supports future integration with:

SAP ERP

Oracle ERP

Odoo Accounting

QuickBooks

Zoho Books

Government Compliance APIs

Insurance APIs

Warranty Provider APIs

---

# Definition of Done

The Financial & Compliance subsystem is complete when:

✓ Warranty lifecycle tracked.

✓ Insurance policies managed.

✓ Depreciation calculated.

✓ Compliance monitored.

✓ Version history maintained.

✓ AI insights available.

✓ Alerts generated automatically.

✓ Financial reports supported.

✓ Complete audit trail preserved.
