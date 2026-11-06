---
paths:
  - 'app/Concerns/**'
---

# Concerns

## Shared validation rules as Concerns traits
Extract validation rules used by more than one Form Request or Fortify action into a trait in `app/Concerns` (e.g. `PasswordValidationRules`) instead of duplicating them.
