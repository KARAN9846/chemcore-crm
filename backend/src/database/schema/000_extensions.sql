-- PostgreSQL extensions used by foundational schema files.
-- Keep extension creation separate so environments can approve them explicitly.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
