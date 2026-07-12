# Section 9.12 — Dashboard API Specification

---

# Purpose

Dashboard APIs provide aggregated operational data.

These endpoints are optimized for analytics and executive reporting.

---

# Endpoints

```
GET    /dashboard

GET    /dashboard/kpis

GET    /dashboard/assets

GET    /dashboard/maintenance

GET    /dashboard/bookings

GET    /dashboard/audits

GET    /dashboard/activity

GET    /dashboard/calendar

GET    /dashboard/notifications

GET    /dashboard/ai-insights

GET    /dashboard/system-health
```

---

# Dashboard Widgets

Asset Overview

Maintenance Due

Today's Bookings

Audit Status

Compliance

Recent Activity

Quick Actions

AI Insights

Notifications

Calendar

---

# Permissions

dashboard.view

dashboard.analytics

---

# Business Rules

Dashboard is role-aware.

Widgets filtered by:

Organization

Department

Permissions

User Scope

---

# Cache Strategy

Redis

5 Minutes

Realtime invalidation after updates.

---

# Events

DashboardViewed

WidgetLoaded

AIInsightViewed

---

# Background Jobs

Dashboard Refresh

Analytics Refresh

Materialized View Update

---

# Performance

Dashboard

<500ms

Widgets

<150ms

---

# Definition of Done

✓ KPI APIs

✓ Analytics APIs

✓ Cached

✓ Realtime

✓ Role-aware
