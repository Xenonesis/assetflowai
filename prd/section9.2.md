# Section 9.2 — Authentication API Specification

---

# Purpose

Authentication APIs manage:

- Registration
- Login
- Logout
- Sessions
- Password Reset
- Email Verification
- MFA
- Session Management

---

# Endpoints

```
POST   /auth/register

POST   /auth/login

POST   /auth/logout

POST   /auth/refresh

GET    /auth/session

POST   /auth/forgot-password

POST   /auth/reset-password

POST   /auth/verify-email

POST   /auth/resend-verification

POST   /auth/change-password

GET    /auth/sessions

DELETE /auth/sessions/{id}

DELETE /auth/sessions
```

---

# Authentication Flow

```
Register

↓

Verify Email

↓

Login

↓

Session Created

↓

Authenticated APIs
```

---

# Permissions

Public

Register

Login

Forgot Password

Verify Email

Authenticated

Logout

Session

Change Password

---

# Business Rules

Passwords

Argon2id

Email unique

Max 5 login attempts

Session timeout

30 minutes inactivity

Remember Me

30 days

---

# Events

UserRegistered

UserLoggedIn

UserLoggedOut

PasswordChanged

PasswordReset

SessionRevoked

---

# Background Jobs

Verification Email

Password Reset Email

Audit Log

Notification

---

# Rate Limits

Register

5/hour

Login

5/15 min

Password Reset

3/hour

---

# Definition of Done

✓ Secure Login

✓ Session Management

✓ Password Recovery

✓ Email Verification

✓ Audit Logging
