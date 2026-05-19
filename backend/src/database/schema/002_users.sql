-- Foundational user schema for ChemCore CRM.
-- Authentication is intentionally out of scope for this foundation.
-- Passwords, sessions, JWTs, and identity-provider tables should be introduced
-- in a dedicated auth module later.

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL DEFAULT gen_random_uuid(),
  workspace_id BIGINT REFERENCES workspaces(id) ON DELETE CASCADE,
  email CITEXT NOT NULL,
  full_name VARCHAR(180) NOT NULL,
  display_name VARCHAR(120),
  role VARCHAR(60) NOT NULL DEFAULT 'member',
  department VARCHAR(120),
  job_title VARCHAR(120),
  phone VARCHAR(40),
  status VARCHAR(40) NOT NULL DEFAULT 'invited',
  invite_token TEXT,
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMPTZ,

  CONSTRAINT users_public_id_unique UNIQUE (public_id),
  CONSTRAINT users_workspace_email_unique UNIQUE (workspace_id, email),
  CONSTRAINT users_role_check CHECK (
    role IN ('owner', 'admin', 'manager', 'sales', 'operations', 'accounts', 'member')
  ),
  CONSTRAINT users_status_check CHECK (
    status IN ('invited', 'active', 'inactive', 'suspended', 'archived')
  )
);

CREATE INDEX IF NOT EXISTS idx_users_workspace_id
  ON users (workspace_id);

CREATE INDEX IF NOT EXISTS idx_users_status
  ON users (status);

CREATE INDEX IF NOT EXISTS idx_users_role
  ON users (role);

CREATE INDEX IF NOT EXISTS idx_users_last_active_at
  ON users (last_active_at);

CREATE INDEX IF NOT EXISTS idx_users_metadata_gin
  ON users USING GIN (metadata);

COMMENT ON TABLE users IS
  'Workspace-scoped CRM users. Auth credentials are intentionally modeled separately later.';

COMMENT ON COLUMN users.workspace_id IS
  'Tenant relationship used by future CRM modules: leads, quotations, orders, suppliers, shipments, compliance, and payments.';

COMMENT ON COLUMN users.preferences IS
  'User-level UI and notification preferences; avoid storing secrets here.';
