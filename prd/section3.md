# Section 3 — Stakeholders, User Personas, Roles & Permissions

---

# Purpose

This section defines every stakeholder, user role, responsibilities, permissions, goals, frustrations, and primary workflows within AssetFlow AI.

It serves as the foundation for:

- Role-Based Access Control (RBAC)
- Dashboard Personalization
- API Authorization
- Navigation Visibility
- Workflow Permissions
- Notification Routing
- Audit Logging

Every feature implemented in the application must respect the permissions and responsibilities defined in this document.

---

# Stakeholders

The following stakeholders influence the success of AssetFlow AI.

---

## Executive Management

Examples

- CEO
- COO
- Director
- Operations Head

Responsibilities

- Review operational reports
- Track asset utilization
- Review department performance
- Make strategic decisions

Goals

- Improve operational efficiency
- Reduce operational costs
- Increase accountability
- Improve asset utilization

Primary Dashboard

Executive Analytics Dashboard

---

## IT Administrator

Responsibilities

- Configure the organization
- Manage users
- Assign permissions
- Maintain system settings
- Monitor platform health

Goals

- Secure system
- Smooth operations
- Correct access control

---

## Operations Manager

Responsibilities

- Oversee daily operations
- Approve requests
- Review reports
- Track utilization

Goals

- Faster approvals
- Better resource allocation
- Operational transparency

---

## Asset Manager

Primary owner of the Asset Module.

Responsibilities

- Register assets
- Update assets
- Allocate assets
- Approve transfers
- Manage maintenance
- Verify returns

Goals

- Accurate asset tracking
- Zero duplicate allocations
- Faster maintenance

KPIs

- Allocation accuracy
- Maintenance completion
- Asset utilization

---

## Department Head

Responsible for department resources.

Responsibilities

- View department assets
- Approve requests
- Review employee assets
- Department analytics

Goals

- Efficient resource utilization
- Department accountability

KPIs

- Department utilization
- Pending approvals
- Asset availability

---

## Employee

The largest user group.

Responsibilities

- View assigned assets
- Book shared resources
- Request maintenance
- Submit transfer requests
- Return assets

Goals

- Quickly locate resources
- Easy booking
- Fast approvals

KPIs

- Booking success
- Maintenance requests resolved

---

# User Personas

---

## Persona 1

### System Administrator

Age

28–50

Technical Skill

★★★★★

Primary Device

Desktop

Frequency

Daily

Pain Points

- Managing users
- Security
- Permissions
- Manual onboarding

Goals

- Easy administration
- Reliable platform
- Secure access

Daily Tasks

- Create users
- Manage departments
- Configure categories
- Monitor logs

---

## Persona 2

### Asset Manager

Technical Skill

★★★★☆

Primary Device

Desktop

Frequency

Daily

Pain Points

- Missing assets
- Duplicate allocations
- Poor maintenance visibility

Goals

- Full asset visibility
- Easy allocation
- Maintenance tracking

Daily Tasks

- Register assets
- Allocate assets
- Approve maintenance
- Review reports

---

## Persona 3

### Department Head

Technical Skill

★★★☆☆

Primary Device

Desktop

Tablet

Pain Points

- Manual approvals
- No department visibility

Goals

- Quick approvals
- Department analytics

Daily Tasks

- Review requests
- Approve transfers
- Monitor assets

---

## Persona 4

### Employee

Technical Skill

★★☆☆☆

Primary Device

Mobile

Desktop

Pain Points

- Cannot locate assets
- Booking conflicts
- Slow approvals

Goals

- Fast booking
- Easy maintenance request

Daily Tasks

- View assets
- Scan QR
- Book resources
- Raise maintenance

---

# Role Hierarchy

```
System Admin
       │
       ▼
Asset Manager
       │
       ▼
Department Head
       │
       ▼
Employee
```

Higher roles inherit permissions of lower roles unless explicitly restricted.

---

# Permission Matrix

| Feature | Admin | Asset Manager | Department Head | Employee |
|----------|------|---------------|-----------------|-----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| User Management | ✅ | ❌ | ❌ | ❌ |
| Department Management | ✅ | ❌ | ❌ | ❌ |
| Category Management | ✅ | ❌ | ❌ | ❌ |
| Register Asset | ✅ | ✅ | ❌ | ❌ |
| Edit Asset | ✅ | ✅ | ❌ | ❌ |
| Delete Asset | ✅ | ✅ | ❌ | ❌ |
| Allocate Asset | ✅ | ✅ | ❌ | ❌ |
| Return Asset | ✅ | ✅ | ❌ | Request Only |
| Transfer Approval | ✅ | ✅ | ✅ | ❌ |
| Book Resource | ✅ | ✅ | ✅ | ✅ |
| Maintenance Request | ✅ | ✅ | ✅ | ✅ |
| Maintenance Approval | ✅ | ✅ | ❌ | ❌ |
| Audit Cycle | ✅ | ✅ | ❌ | ❌ |
| Reports | ✅ | ✅ | Department | Personal |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| AI Assistant | ✅ | ✅ | ✅ | ✅ |

---

# Dashboard Personalization

## Admin Dashboard

Widgets

- Organization KPIs
- Total Assets
- Active Users
- Pending Approvals
- Recent Activities
- Audit Status
- Analytics
- Notifications

Quick Actions

- Create User
- Register Asset
- Start Audit

---

## Asset Manager Dashboard

Widgets

- Available Assets
- Maintenance Queue
- Pending Transfers
- Recent Allocations
- Upcoming Returns

Quick Actions

- Allocate Asset
- Register Asset
- Approve Maintenance

---

## Department Head Dashboard

Widgets

- Department Assets
- Pending Requests
- Bookings
- Employee Assets
- Department Analytics

Quick Actions

- Approve Request
- Book Resource

---

## Employee Dashboard

Widgets

- My Assets
- My Bookings
- Maintenance Requests
- Notifications
- AI Assistant

Quick Actions

- Scan QR
- Book Resource
- Return Asset
- Raise Maintenance

---

# Authentication Flow

```
User Login

↓

Credentials Validation

↓

Account Active?

↓

Role Retrieved

↓

Permissions Loaded

↓

Dashboard Redirect

↓

Realtime Session Started
```

---

# Authorization Rules

Every API request must validate:

- User authentication
- Active session
- User role
- Resource ownership
- Department access
- Organization scope

Unauthorized requests return:

HTTP 403

Forbidden

---

# User Journey

## Employee Journey

Login

↓

Dashboard

↓

View Assets

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

---

## Asset Manager Journey

Login

↓

Dashboard

↓

Register Asset

↓

Generate QR

↓

Allocate Asset

↓

Approve Requests

↓

Maintenance

↓

Reports

---

## Admin Journey

Login

↓

Organization Setup

↓

Departments

↓

Employees

↓

Promote Roles

↓

System Dashboard

↓

Analytics

↓

Audit Logs

---

# User Stories

---

## Employee

As an employee,

I want to see all assets assigned to me

so that I always know what equipment I am responsible for.

Acceptance Criteria

- Assigned assets visible.
- Asset status displayed.
- QR code available.
- Return option available.

---

## Asset Manager

As an Asset Manager,

I want to allocate assets to employees

so that ownership is digitally tracked.

Acceptance Criteria

- Duplicate allocation blocked.
- History recorded.
- Notification sent.
- Status updated automatically.

---

## Department Head

As a Department Head,

I want to approve transfer requests

so that department resources remain controlled.

Acceptance Criteria

- Approve
- Reject
- Add remarks
- Timeline updated

---

## Administrator

As an Administrator,

I want to manage users and permissions

so that only authorized people access sensitive features.

Acceptance Criteria

- Create users
- Disable users
- Promote roles
- Reset passwords
- View audit logs

---

# Notification Routing

Every role receives different notifications.

Admin

- User created
- System alerts
- Audit completed

Asset Manager

- Allocation request
- Transfer approval
- Maintenance request

Department Head

- Department approval
- Booking requests

Employee

- Booking confirmation
- Asset assigned
- Maintenance update
- Return reminder

---

# Security Principles

Users should only access data they are authorized to view.

Rules

- Employees cannot view other employees' assets.
- Department Heads only access their department.
- Asset Managers manage all assets but cannot modify system settings.
- Administrators have unrestricted access.

Every action must be logged.

---

# AI Personalization

The AI Assistant adapts responses based on role.

Employee

> "Show my assigned laptop."

Department Head

> "Show department utilization."

Asset Manager

> "Which assets require maintenance this week?"

Admin

> "Generate organization asset summary."

---

# Section Summary

This section defines the people who interact with AssetFlow AI, their responsibilities, permissions, workflows, and access boundaries.

The RBAC model established here is the foundation for navigation, dashboards, APIs, notifications, security, and AI personalization throughout the application.

No feature should bypass the permission rules defined in this section.
