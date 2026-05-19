# Database Architecture

This directory contains the foundational PostgreSQL architecture for ChemCore CRM.

Structure:
- `schema/` - canonical SQL table definitions
- `migrations/` - future executable database changes
- `seeds/` - future local/staging seed data
- `queries/` - future shared SQL query files

The existing connection setup in `backend/src/config/db.js` is preserved. These files do not introduce an ORM, authentication, CRUD APIs, or business logic.

Current relationship model:
- `companies(id)` is the active workspace/root tenant entity for onboarding and current business data.
- The future `workspaces` schema is a blueprint only and must not replace `companies` until a dedicated migration is planned.
- Current child tables should remain scoped by `company_id`.

Design principles:
- Company-first tenancy for current production tables
- Explicit primary keys and timestamps
- JSONB metadata only for extension points, not core business records
- Future CRM modules should reference `companies(id)` while the existing onboarding system remains company-rooted
- Authentication should be introduced separately from the base `users` profile table
