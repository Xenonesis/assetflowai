# Section 9.16 — Search API Specification

---

# Purpose

The Search APIs provide unified enterprise-wide search across all modules.

Supports:

- Assets
- Users
- Departments
- Locations
- Bookings
- Maintenance
- Audit
- Reports
- AI Semantic Search (Future)

---

# Endpoints

```
GET    /search

POST   /search

GET    /search/suggestions

GET    /search/recent

DELETE /search/recent

GET    /search/saved

POST   /search/saved

DELETE /search/saved/{id}

GET    /search/filters
```

---

# Search Types

Global Search

Module Search

Advanced Search

Saved Search

Recent Search

AI Search

---

# Features

Fuzzy Search

Full Text Search

Autocomplete

Search History

Faceted Filters

Saved Queries

Semantic Search (Future)

---

# Permissions

search.global

search.assets

search.users

search.audit

---

# Business Rules

Results filtered by organization.

Permission-aware.

Maximum 100 results per request.

---

# Events

SearchExecuted

SearchSaved

SearchCleared

---

# Performance

Autocomplete

<100ms

Global Search

<150ms

---

# Definition of Done

✓ Global Search

✓ Filters

✓ Suggestions

✓ Saved Searches

✓ Permission Aware
