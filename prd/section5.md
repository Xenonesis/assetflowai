# Section 5 — Information Architecture, Navigation & User Flows

---

# Purpose

This section defines:

- Overall application structure
- Navigation hierarchy
- Sidebar organization
- Route structure
- Screen inventory
- User journeys
- Navigation rules
- Layout system
- Breadcrumb behavior

The objective is to ensure every screen is discoverable, consistent, role-aware, and optimized for productivity.

---

# Design Philosophy

AssetFlow AI follows a modern enterprise dashboard architecture inspired by:

- Linear
- Notion
- GitHub
- Stripe Dashboard
- Vercel
- Atlassian Jira

Navigation should prioritize:

- Speed
- Discoverability
- Minimal clicks
- Predictability
- Keyboard accessibility

---

# Application Layout

```
+-------------------------------------------------------------+
|                     Top Navigation Bar                      |
+-------------+-----------------------------------------------+
|             |                                               |
|             |                                               |
|   Sidebar   |              Main Content Area                |
|             |                                               |
|             |                                               |
|             |                                               |
+-------------+-----------------------------------------------+
|                  Notification Drawer                        |
+-------------------------------------------------------------+
```

---

# Global Layout Components

Every authenticated page contains:

- Top Navigation
- Left Sidebar
- Breadcrumbs
- Main Content
- Notification Center
- Command Palette
- User Menu
- AI Assistant Button
- Footer (optional)

---

# Top Navigation

The top navigation remains visible across all authenticated screens.

Components:

### Left

- Logo
- Current Workspace
- Breadcrumb

---

### Center

Global Search

Search supports:

- Assets
- Employees
- Departments
- Categories
- Bookings
- Maintenance
- Audits

Shortcut:

CTRL + K

---

### Right

Notification Bell

AI Assistant

Theme Switch

Profile Avatar

Settings

Logout

---

# Sidebar Navigation

The sidebar is role-aware.

Users only see modules they are authorized to access.

---

## Admin Sidebar

Dashboard

Organization

- Departments
- Employees
- Categories

Assets

Allocation

Bookings

Maintenance

Audit

Reports

Notifications

Activity Logs

Settings

---

## Asset Manager Sidebar

Dashboard

Assets

Allocation

Bookings

Maintenance

Audit

Reports

Notifications

---

## Department Head Sidebar

Dashboard

Department Assets

Approvals

Bookings

Reports

Notifications

---

## Employee Sidebar

Dashboard

My Assets

Bookings

Maintenance

Notifications

AI Assistant

---

# Navigation Rules

Users cannot navigate to unauthorized routes.

Attempting to access restricted pages returns:

403 Forbidden

or

Redirect to Dashboard

---

# Breadcrumbs

Every page displays breadcrumbs.

Example

Dashboard

>

Assets

>

Laptop AF-102

>

Maintenance History

---

Rules

- Always visible
- Clickable
- Generated automatically
- Current page not clickable

---

# Route Structure

## Public Routes

```
/
```

Landing Page

---

```
/login
```

---

```
/signup
```

---

```
/forgot-password
```

---

```
/reset-password
```

---

# Protected Routes

```
/dashboard
```

---

```
/organization
```

---

```
/organization/departments
```

---

```
/organization/employees
```

---

```
/organization/categories
```

---

```
/assets
```

---

```
/assets/new
```

---

```
/assets/:id
```

---

```
/assets/:id/edit
```

---

```
/allocations
```

---

```
/transfers
```

---

```
/bookings
```

---

```
/maintenance
```

---

```
/audits
```

---

```
/reports
```

---

```
/notifications
```

---

```
/activity
```

---

```
/settings
```

---

# Screen Inventory

The MVP contains approximately 40+ screens.

---

## Authentication

- Login
- Signup
- Forgot Password
- Reset Password

---

## Dashboard

- Dashboard
- KPI Details

---

## Organization

Departments

Employees

Categories

Department Details

Employee Details

Category Details

---

## Assets

Asset List

Create Asset

Asset Details

Edit Asset

Asset Timeline

Asset Documents

Asset QR

---

## Allocation

Allocation List

Allocate Asset

Return Asset

Transfer Asset

Transfer Details

---

## Bookings

Booking Calendar

Booking Details

Create Booking

Edit Booking

---

## Maintenance

Maintenance List

Create Request

Request Details

Assign Technician

History

---

## Audit

Audit List

Create Cycle

Audit Details

Verification Screen

Discrepancy Report

---

## Reports

Dashboard Reports

Department Reports

Asset Reports

Maintenance Reports

Audit Reports

---

## Notifications

Notification Center

Notification Detail

---

## Activity Logs

Activity List

Activity Detail

---

## Settings

Profile

Organization

Security

Notifications

AI Settings

---

# User Flow

## Employee

```
Login

↓

Dashboard

↓

View My Assets

↓

Book Resource

↓

Receive Approval

↓

Use Resource

↓

Return Resource

↓

Logout
```

---

## Asset Manager

```
Login

↓

Dashboard

↓

Register Asset

↓

Generate QR

↓

Allocate

↓

Approve Requests

↓

Maintenance

↓

Reports

↓

Logout
```

---

## Admin

```
Login

↓

Dashboard

↓

Create Department

↓

Create Employee

↓

Assign Role

↓

Review Analytics

↓

Logout
```

---

# Primary Navigation Flow

```
Dashboard

↓

Assets

↓

Asset Details

↓

Allocation

↓

Maintenance

↓

History

↓

Reports
```

---

# Quick Actions

Each dashboard contains floating quick actions.

Examples

Admin

- Create User
- Register Asset
- Start Audit

Asset Manager

- Allocate Asset
- Approve Maintenance
- Generate QR

Employee

- Book Resource
- Return Asset
- Raise Request

---

# Search Experience

Global search supports:

Assets

Employees

Departments

Bookings

Maintenance

Audits

Reports

Settings

Search should be fuzzy.

Results grouped by type.

---

# Empty States

Every page should include meaningful empty states.

Example

No Assets Found

Illustration

↓

"Register your first asset."

↓

Primary Button

Register Asset

---

# Loading States

Every page supports:

Skeleton Loader

Progress Indicator

Lazy Loading

Infinite Scroll where applicable

---

# Error States

Standard error pages

401

Unauthorized

403

Forbidden

404

Not Found

500

Internal Server Error

Network Error

Retry

---

# Responsive Navigation

Desktop

Permanent Sidebar

---

Tablet

Collapsible Sidebar

---

Mobile

Bottom Navigation

Hamburger Menu

Floating AI Button

---

# Keyboard Shortcuts

CTRL + K

Global Search

---

N

New Asset

---

A

AI Assistant

---

ESC

Close Modal

---

/

Focus Search

---

# Command Palette

The command palette provides instant navigation.

Supported Commands

Create Asset

Create Department

Allocate Asset

Book Resource

Open Reports

Open Settings

Search Employee

Search Asset

Generate Report

---

# Notification Drawer

Accessible from every page.

Supports

Unread

Read

Mentions

System Alerts

Maintenance Alerts

Approval Requests

---

# AI Assistant Access

The AI Assistant is globally accessible.

Floating button

Bottom-right

Desktop

Tablet

Mobile

The assistant retains conversation context during the active session.

---

# Navigation Principles

Navigation should satisfy the following:

✓ Maximum three clicks to reach any primary feature

✓ Sidebar never changes unexpectedly

✓ Role-specific visibility

✓ Predictable hierarchy

✓ Consistent URLs

✓ Breadcrumb support

✓ Keyboard navigation

✓ Mobile responsiveness

---

# Information Architecture

```
Authentication
        │
        ▼
Dashboard
        │
        ├───────────────┐
        ▼               ▼
Organization         Assets
        │               │
        ▼               ▼
Employees        Asset Details
Departments            │
Categories             ▼
                    Allocation
                        │
                        ▼
                  Maintenance
                        │
                        ▼
                     Audit
                        │
                        ▼
                     Reports
                        │
                        ▼
                 Notifications
```

---

# Section Summary

This section defines the complete navigation model, routing hierarchy, page inventory, layouts, user journeys, and interaction architecture for AssetFlow AI.

It ensures that all users experience a consistent, intuitive, and role-aware interface while providing developers and AI coding agents with a clear blueprint for application routing, layouts, and navigation behavior.
