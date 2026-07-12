# Section 6.4.2 — Asset Supporting Tables

---

# Purpose

The `assets` table stores only the core asset information.

Additional information such as documents, images, QR codes, tags, metadata, warranties, and attachments should be stored in dedicated supporting tables.

This approach provides:

- Better normalization
- Better performance
- Easier maintenance
- Unlimited attachments
- Version control
- Future extensibility

Supporting tables include:

1. asset_documents
2. asset_images
3. asset_qr_codes
4. asset_tags
5. asset_custom_fields

---

# Table 1 — asset_documents

## Purpose

Stores every document related to an asset.

Examples

- Invoice
- Purchase Order
- Warranty Card
- Insurance
- AMC Contract
- User Manual
- Compliance Certificate

---

## Relationships

```
Asset

1

↓

Many Documents
```

---

## Columns

| Column | Type | Required |
|---------|------|----------|
| id | UUID | ✅ |
| asset_id | UUID FK | ✅ |
| file_name | VARCHAR(255) | ✅ |
| original_name | VARCHAR(255) | ✅ |
| mime_type | VARCHAR(120) | ✅ |
| extension | VARCHAR(20) | ✅ |
| file_size | BIGINT | ✅ |
| storage_path | TEXT | ✅ |
| public_url | TEXT | Nullable |
| checksum | VARCHAR(64) | Nullable |
| document_type | ENUM | ✅ |
| uploaded_by | UUID FK | ✅ |
| uploaded_at | TIMESTAMP | ✅ |
| version | INTEGER | Default 1 |
| remarks | TEXT | Nullable |

---

## Document Types

```
Invoice

Purchase Order

Warranty

Insurance

AMC

Manual

Certificate

Compliance

Photo

Other
```

---

## Validation

Maximum Size

```
25 MB
```

Allowed Formats

```
PDF

PNG

JPEG

WEBP

DOCX

XLSX
```

---

## Business Rules

Every document belongs to exactly one asset.

Deleting an asset does not remove documents.

Old versions remain preserved.

Files stored inside Supabase Storage.

---

## Indexes

```
asset_id

document_type

uploaded_at
```

---

# Table 2 — asset_images

## Purpose

Stores high-quality asset photographs.

Supports:

- Gallery
- Thumbnail
- Damage Evidence
- Audit Photos
- AI Recognition

---

## Relationships

```
Asset

↓

Many Images
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID FK |
| image_url | TEXT |
| thumbnail_url | TEXT |
| file_size | BIGINT |
| width | INTEGER |
| height | INTEGER |
| image_type | ENUM |
| uploaded_by | UUID |
| uploaded_at | TIMESTAMP |
| is_primary | BOOLEAN |

---

## Image Types

Primary

Gallery

Damage

Maintenance

Audit

QR

Other

---

## Business Rules

Only one Primary Image.

Unlimited Gallery Images.

Maximum

20 Images

per Asset.

---

## Validation

Allowed Formats

JPEG

PNG

WEBP

Maximum Size

10 MB

---

## Indexes

```
asset_id

is_primary
```

---

# Table 3 — asset_qr_codes

## Purpose

Stores QR information used for instant asset lookup.

QR Code opens:

```
Asset Details

↓

Timeline

↓

Maintenance

↓

Allocate

↓

Return
```

---

## Relationships

```
Asset

1

↓

1 QR Code
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID FK |
| qr_value | TEXT |
| qr_hash | VARCHAR(128) |
| generated_at | TIMESTAMP |
| regenerated_count | INTEGER |
| last_scan_at | TIMESTAMP |
| scan_count | INTEGER |
| created_by | UUID |

---

## QR Format

```
AF-000125
```

Encoded URL

```
https://assetflow.ai/assets/AF-000125
```

Future

Encrypted QR Payload

---

## Business Rules

QR must be unique.

QR regenerated on request.

Old QR remains invalid.

Every scan updates statistics.

---

## Indexes

```
asset_id

qr_hash
```

---

# Table 4 — asset_tags

## Purpose

Provides flexible tagging.

Examples

```
Critical

Server

Finance

Portable

Laptop

High Value

Sensitive

IoT Ready

Leased
```

---

## Relationships

```
Asset

↓

Many Tags
```

Many-to-Many

```
Assets

↓

asset_asset_tags

↓

Tags
```

---

## Table

tags

| Column | Type |
|----------|------|
| id | UUID |
| name | VARCHAR(80) |
| color | VARCHAR(20) |
| icon | VARCHAR(80) |

---

## Junction Table

asset_tags

| Column | Type |
|----------|------|
| asset_id | UUID |
| tag_id | UUID |

---

## Business Rules

Tags reusable.

Unlimited tags.

Duplicate assignment prohibited.

---

# Table 5 — asset_custom_fields

## Purpose

Allows organizations to create custom metadata without changing the database schema.

Example

```
Battery Capacity

Processor

RAM

Insurance Number

Calibration Date

Power Rating

License Key

Expiry

Certification
```

---

## Relationships

```
Asset

↓

Many Custom Fields
```

---

## Columns

| Column | Type |
|----------|------|
| id | UUID |
| asset_id | UUID FK |
| field_name | VARCHAR(120) |
| field_type | ENUM |
| field_value | TEXT |
| created_at | TIMESTAMP |

---

## Supported Types

```
Text

Number

Date

Boolean

JSON

Currency

Email

URL
```

---

## Business Rules

Unlimited custom fields.

Displayed dynamically.

Included in reports.

Searchable.

---

# File Storage Strategy

Provider

```
Supabase Storage
```

Buckets

```
asset-images

asset-documents

qr-codes

maintenance

audit
```

---

## Folder Structure

```
assets/

    AF-000001/

        images/

        documents/

        qr/

        maintenance/

        audit/
```

---

# Upload Workflow

```
Select File

↓

Validation

↓

Virus Scan (Future)

↓

Compress

↓

Upload Storage

↓

Create DB Record

↓

Generate Thumbnail

↓

Return URL
```

---

# Security

Private Buckets

Signed URLs

Role-based Downloads

Audit Logging

Checksum Validation

---

# Performance Strategy

Images

Automatically resized.

Thumbnails generated.

Lazy loaded.

Documents

CDN cached.

Large downloads streamed.

QR Codes

Cached.

Generated once.

---

# Search Support

Users can search by:

Document Name

Tag

Custom Field

QR Value

File Type

Manufacturer

Model

Serial Number

---

# AI Integration

AI has access to:

Documents

Warranty

Images

Tags

Custom Fields

Future

OCR

Image Recognition

Damage Detection

Warranty Extraction

Invoice Parsing

Barcode Recognition

---

# Example Asset Structure

```
Dell Latitude

↓

Invoice.pdf

↓

Warranty.pdf

↓

Front Image

↓

Side Image

↓

QR Code

↓

Tags

Laptop

Portable

Finance

↓

Custom Fields

RAM

32GB

Processor

Intel Ultra 7

Battery

97Wh
```

---

# Definition of Done

Supporting asset tables are complete when:

✓ Multiple images supported.

✓ Unlimited documents.

✓ QR generation implemented.

✓ Tags implemented.

✓ Custom fields supported.

✓ Storage integration completed.

✓ Search indexed.

✓ AI compatible.

✓ Role permissions enforced.

✓ Upload validation complete.
