# Section 9.9 — Booking APIs

---

# Purpose

Resource reservation APIs.

---

# Endpoints

```
GET    /bookings

POST   /bookings

GET    /bookings/{id}

PATCH  /bookings/{id}

DELETE /bookings/{id}

POST   /bookings/{id}/approve

POST   /bookings/{id}/reject

POST   /bookings/{id}/check-in

POST   /bookings/{id}/check-out

GET    /resources

GET    /resources/{id}

GET    /resources/availability

POST   /resources
```

---

# Permissions

booking.view

booking.create

booking.update

booking.approve

resource.manage

---

# Business Rules

No overlapping bookings.

Capacity validation.

Approval required where configured.

Recurring bookings supported.

---

# Events

BookingCreated

BookingApproved

BookingCancelled

CheckedIn

CheckedOut

---

# Background Jobs

Calendar Sync

Reminder Email

Notification

Conflict Detection

---

# Performance

Availability Search

<100ms

---

# Definition of Done

✓ Booking CRUD

✓ Availability Search

✓ Check-in

✓ Check-out

✓ Recurring Bookings
