# Migrations

Store versioned migration files here when database execution is introduced.

Guidelines:
- Keep migrations append-only once shared.
- Prefer small, reversible changes.
- Include indexes and constraints with the table changes they support.
- Keep workspace ownership explicit for tenant-scoped CRM tables.

No migration runner is configured yet.

Current reviewed migrations:
- `001_stabilize_onboarding_relationships.sql` keeps `companies(id)` as the current workspace root, adds safe relationship constraints/indexes, and preserves existing onboarding/API behavior.

Execution notes:
- Run preflight SELECTs first.
- Do not validate `NOT VALID` constraints until orphan checks are clean.
- Keep `branding` as the currently active API table.
- Preserve `company_branding` if it exists in a deployed database.
