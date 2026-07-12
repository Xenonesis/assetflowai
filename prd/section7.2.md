# Section 7.2 — Authentication, Authorization & Security Architecture

---

# Purpose

This section defines the complete security architecture for AssetFlow AI.

It covers:

- Authentication
- Authorization
- Session Management
- Role-Based Access Control (RBAC)
- Permission Resolution
- API Security
- Token Strategy
- Security Headers
- Account Protection
- Audit Logging

Every authenticated request must follow the rules defined in this section.

---

# Security Goals

The platform must provide:

✓ Strong Authentication

✓ Fine-Grained Authorization

✓ Secure Sessions

✓ API Protection

✓ Zero Trust Principles

✓ Complete Audit Trail

✓ Least Privilege Access

✓ Enterprise Compliance

---

# Authentication Provider

Provider

```
Better Auth
```

Reason

- First-class Next.js support
- Session-based authentication
- Secure cookies
- OAuth support
- Passkey support (future)
- Type-safe integration
- Database adapters

---

# Authentication Flow

```
User Login

↓

Credentials Validation

↓

Password Verification

↓

Create Session

↓

Store Secure Cookie

↓

Load Permissions

↓

Redirect Dashboard
```

---

# Supported Login Methods

## MVP

✓ Email + Password

---

## Phase 2

Google

Microsoft Azure AD

GitHub

SAML

LDAP

Magic Links

Passkeys (WebAuthn)

---

# Session Architecture

Authentication uses

```
Database-backed Sessions
```

instead of JWT-only authentication.

Reason

- Easy revocation
- Better security
- Centralized session control
- Device management

---

# Session Lifecycle

```
Login

↓

Session Created

↓

Secure Cookie

↓

Session Validation

↓

Session Refresh

↓

Logout

↓

Session Destroyed
```

---

# Session Table

Stores

Session ID

User ID

Expires At

Device

Browser

IP Address

Last Activity

Created At

---

# Cookie Configuration

```
HttpOnly

Secure

SameSite=Lax

Encrypted

Signed
```

Never accessible via JavaScript.

---

# Session Timeout

Inactive

```
30 Minutes
```

Absolute

```
7 Days
```

Remember Me

```
30 Days
```

Configurable.

---

# Password Policy

Minimum

```
12 Characters
```

Required

Uppercase

Lowercase

Number

Special Character

---

Forbidden

Common Passwords

Dictionary Words

User Name

Email

Recent Passwords

---

# Password Storage

Algorithm

```
Argon2id
```

Never

SHA1

MD5

Plain Text

---

# Password Reset Flow

```
Forgot Password

↓

Email Link

↓

Token Validation

↓

New Password

↓

Invalidate Old Sessions

↓

Login
```

---

# Multi-Factor Authentication

Phase 2

Supports

TOTP

Email OTP

Passkeys

Hardware Keys

SMS OTP (Optional)

---

# Authorization Model

Authorization uses

```
RBAC

+

Permission Based Access
```

---

# Hierarchy

```
Admin

↓

Asset Manager

↓

Department Head

↓

Employee
```

---

# Permission Format

```
module.action
```

Examples

```
assets.view

assets.create

assets.update

assets.delete

bookings.create

maintenance.approve

audit.close

reports.export
```

---

# Permission Resolution

```
User

↓

Role

↓

Permissions

↓

Middleware

↓

Access Granted
```

---

# Authorization Middleware

Every protected request validates:

Authentication

↓

Active Session

↓

Role

↓

Permission

↓

Organization Scope

↓

Department Scope

↓

Ownership Rules

---

# Resource Ownership

Employees may access:

Their own

Assets

Bookings

Maintenance Requests

Notifications

AI Conversations

---

Department Heads

Own Department

+

Department Assets

+

Department Reports

---

Asset Managers

All Assets

All Maintenance

All Allocations

---

Admins

Everything

---

# API Security

Every API validates:

✓ Authentication

✓ Authorization

✓ Input Validation

✓ Rate Limit

✓ CSRF Token

✓ Organization Context

✓ Request Size

---

# Rate Limiting

Authentication

```
5 Attempts

Per 15 Minutes
```

API

```
100 Requests

Per Minute
```

AI

```
30 Requests

Per Minute
```

Uploads

```
20 Uploads

Per Hour
```

---

# Security Headers

Every response includes:

```
Content-Security-Policy

X-Frame-Options

X-Content-Type-Options

Referrer-Policy

Permissions-Policy

Strict-Transport-Security
```

---

# CSRF Protection

All state-changing requests require:

CSRF Token

+

Secure Cookie

---

# CORS Policy

Allowed Origins

Configured Environment Variables

No Wildcards

Credentials Allowed

HTTPS Only

---

# Account Protection

Automatic account lock after:

```
5 Failed Logins
```

Lock Duration

```
30 Minutes
```

Admin unlock available.

---

# Device Management

Each session stores:

Browser

Operating System

IP Address

Country

Last Activity

Future

Trusted Devices

---

# Sensitive Operations

Require password confirmation:

Delete Organization

Rotate API Keys

Export Data

Delete Assets

Change Roles

Reset Passwords

---

# Audit Logging

Security events recorded:

Login

Logout

Failed Login

Password Reset

Role Change

Permission Change

API Key Rotation

MFA Enabled

Session Revoked

---

# AI Security

AI may:

Read business data

Generate summaries

Recommend actions

---

AI may NOT:

Delete data

Modify records

Approve workflows

Change permissions

Execute destructive operations

without explicit user confirmation.

---

# File Upload Security

Validate:

File Type

File Size

Mime Type

Checksum

Virus Scan (Future)

Store outside public directory.

---

# Data Encryption

Encrypted At Rest

Passwords

API Keys

Secrets

Tokens

---

Encrypted In Transit

HTTPS

TLS 1.3

---

# Compliance

Designed for:

ISO 27001

SOC 2

GDPR

HIPAA (future)

Indian DPDP Act

---

# Security Monitoring

Track:

Failed Logins

Suspicious IPs

Brute Force

Permission Violations

Session Hijacking

Token Misuse

---

# Incident Response

Automatically:

Lock compromised account

Revoke sessions

Notify administrators

Generate audit event

---

# Future Security

Supports

Passkeys

Hardware Security Keys

Biometric Login

Risk-Based Authentication

Adaptive MFA

SSO

SCIM Provisioning

Zero Trust Networking

---

# Definition of Done

Authentication & Security is complete when:

✓ Better Auth integrated.

✓ Sessions secured.

✓ RBAC enforced.

✓ Permissions validated.

✓ Passwords hashed.

✓ CSRF enabled.

✓ Rate limiting active.

✓ Audit logging implemented.

✓ Security headers configured.

✓ Sensitive actions protected.

✓ AI permissions restricted.

---

# Section Summary

This security architecture provides a production-ready authentication and authorization system for AssetFlow AI. By combining Better Auth, secure session management, RBAC, fine-grained permissions, modern password hashing, audit logging, and defense-in-depth security controls, the platform is prepared for enterprise deployments while remaining extensible for future features such as SSO, passkeys, and adaptive authentication.
