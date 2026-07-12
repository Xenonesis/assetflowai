# Section 9.11 — Audit Management API Specification

---

# Purpose

Audit APIs manage physical asset verification, compliance audits, findings, evidence collection, corrective actions, and audit reporting.

Supports:

- Audit Cycles
- Asset Verification
- QR-Based Audits
- Evidence Upload
- Compliance Tracking
- Findings Management
- Corrective Actions
- Audit Reports

---

# Endpoints

```
GET    /audits

POST   /audits

GET    /audits/{id}

PATCH  /audits/{id}

DELETE /audits/{id}

POST   /audits/{id}/start

POST   /audits/{id}/close

POST   /audits/{id}/cancel

GET    /audits/{id}/items

POST   /audits/{id}/verify

POST   /audits/{id}/findings

PATCH  /audits/findings/{id}

POST   /audits/findings/{id}/resolve

POST   /audits/{id}/evidence

GET    /audits/{id}/report

GET    /audits/history
```

---

# Permissions

audit.view

audit.create

audit.update

audit.verify

audit.close

audit.export

---

# Business Rules

Only scheduled audits may start.

Closed audits become immutable.

Evidence required for failed verification.

Critical findings require corrective action.

Compliance score calculated automatically.

---

# Events

AuditCreated

AuditStarted

AssetVerified

FindingCreated

FindingResolved

AuditClosed

ReportGenerated

---

# Background Jobs

Compliance Calculation

Executive Summary

Notification

PDF Report

AI Summary

---

# Performance

Audit Dashboard

<200ms

Verification

<100ms

Report Generation

Async

---

# Definition of Done

✓ Audit CRUD

✓ Verification

✓ Findings

✓ Evidence

✓ Reports

✓ Compliance
