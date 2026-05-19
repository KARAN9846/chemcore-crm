# Database Schema

Foundational PostgreSQL schema files for the CRM backend.

Current foundation:
- `000_extensions.sql`
- `001_workspaces.sql`
- `002_users.sql`

Future module schemas should stay workspace-scoped and can be added in order, for example:
- `010_leads.sql`
- `020_quotations.sql`
- `030_orders.sql`
- `040_suppliers.sql`
- `050_shipments.sql`
- `060_compliance.sql`
- `070_payments.sql`

These files are not automatically executed yet. They establish the database contract before real CRM persistence is wired into controllers and services.

Important current-state note:
- Existing onboarding/business APIs currently use `companies` as the workspace root.
- Do not migrate live data from `companies` to `workspaces` as part of onboarding relationship stabilization.
- Future CRM module schemas should use `companies(id)` until a separate workspace migration is intentionally designed.
