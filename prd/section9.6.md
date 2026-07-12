# Section 9.6 — Asset Management API Specification

---

# Purpose

Asset APIs manage the complete lifecycle of organizational assets.

Supports:

- Asset Registration
- Asset Search
- Asset Updates
- QR Management
- Barcode Management
- Asset Status
- Asset History
- Asset Lifecycle

---

# Endpoints

```
GET    /assets

POST   /assets

GET    /assets/{id}

PATCH  /assets/{id}

DELETE /assets/{id}

POST   /assets/bulk-import

POST   /assets/bulk-update

POST   /assets/bulk-delete

GET    /assets/search

GET    /assets/{id}/history

GET    /assets/{id}/documents

POST   /assets/{id}/documents

DELETE /assets/{id}/documents/{documentId}

GET    /assets/{id}/maintenance

GET    /assets/{id}/allocations

GET    /assets/{id}/bookings

GET    /assets/{id}/audit-history

POST   /assets/{id}/generate-qr

POST   /assets/{id}/generate-barcode

GET    /assets/export
```

---

# Permissions

assets.view

assets.create

assets.update

assets.delete

assets.import

assets.export

assets.documents

---

# Business Rules

Asset Tag unique.

Serial Number unique.

Soft delete only.

Archived assets cannot be allocated.

Disposed assets are immutable.

---

# Events

AssetCreated

AssetUpdated

AssetArchived

AssetDisposed

AssetImported

QRCodeGenerated

BarcodeGenerated

---

# Background Jobs

QR Generation

Thumbnail

OCR

Search Index

Notification

Activity Log

---

# Performance

Asset Search

<150ms

Asset Details

<100ms

Bulk Import

Async

---

# Definition of Done

✓ Asset CRUD

✓ Search

✓ Import/Export

✓ QR

✓ History

✓ Documents
