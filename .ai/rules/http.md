---
paths:
  - 'app/Http/**'
---

# Http

## Form Requests for HTTP validation
Validate HTTP input with Form Request classes in `app/Http/Requests`, grouped by area subfolder (e.g. `Admin/`, `Settings/`), never inline `$request->validate()` in controllers.

## No service or repository layer
Controllers query Eloquent directly and return `Inertia::render()` or redirects; do not introduce Service, Repository, or Action layers.

## Area-grouped Http layer
Group controllers and Form Requests by feature area in mirrored subfolders (`Controllers/{Area}`, `Requests/{Area}`); one route file per area required from `web.php`, grouped with middleware + prefix + name.
