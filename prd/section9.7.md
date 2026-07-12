# Section 9.7 — Category, Department & Location APIs

---

# Purpose

Manages organizational structure and asset classification.

---

# Categories

Endpoints

```
GET    /categories

POST   /categories

GET    /categories/{id}

PATCH  /categories/{id}

DELETE /categories/{id}
```

---

# Departments

Endpoints

```
GET    /departments

POST   /departments

GET    /departments/{id}

PATCH  /departments/{id}

DELETE /departments/{id}
```

---

# Locations

Endpoints

```
GET    /locations

POST   /locations

GET    /locations/{id}

PATCH  /locations/{id}

DELETE /locations/{id}

GET    /locations/tree
```

---

# Permissions

categories.manage

departments.manage

locations.manage

---

# Business Rules

Names unique per organization.

Location hierarchy unlimited.

Cannot delete referenced records.

---

# Events

CategoryCreated

DepartmentUpdated

LocationDeleted

---

# Definition of Done

✓ CRUD

✓ Hierarchy

✓ Validation
