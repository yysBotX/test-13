---
paths:
  - 'app/**'
---

# App

## No Gates or Policies
Authorize through the `admin` middleware alias (`EnsureUserIsAdmin`) plus `User::isAdmin()`; use a Form Request's `authorize()` for per-action checks. Do not add Gates or Policies.
