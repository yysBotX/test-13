---
paths:
  - 'routes/**'
---

# Routes

## Area-grouped Http layer
Group controllers and Form Requests by feature area in mirrored subfolders (`Controllers/{Area}`, `Requests/{Area}`); one route file per area required from `web.php`, grouped with middleware + prefix + name.
