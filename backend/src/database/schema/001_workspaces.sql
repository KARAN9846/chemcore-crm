-- Foundational workspace schema for ChemCore CRM.
-- This file is intentionally not executed automatically yet.
-- Existing onboarding code currently uses a companies table; future migrations
-- can either map companies to workspaces or rename that concept deliberately.

CREATE TABLE IF NOT EXISTS workspaces (
  id BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  slug VARCHAR(120) NOT NULL,
  industry VARCHAR(120),
  country VARCHAR(120),
  timezone VARCHAR(80) NOT NULL DEFAULT 'UTC',
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(40) NOT NULL DEFAULT 'active',
  onboarding_status VARCHAR(40) NOT NULL DEFAULT 'not_started',
  onboarding_step INTEGER NOT NULL DEFAULT 1,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMPTZ,

  CONSTRAINT workspaces_public_id_unique UNIQUE (public_id),
  CONSTRAINT workspaces_slug_unique UNIQUE (slug),
  CONSTRAINT workspaces_status_check CHECK (
    status IN ('active', 'inactive', 'suspended', 'archived')
  ),
  CONSTRAINT workspaces_onboarding_status_check CHECK (
    onboarding_status IN ('not_started', 'in_progress', 'completed')
  ),
  CONSTRAINT workspaces_onboarding_step_check CHECK (onboarding_step >= 1)
);

CREATE INDEX IF NOT EXISTS idx_workspaces_status
  ON workspaces (status);

CREATE INDEX IF NOT EXISTS idx_workspaces_created_at
  ON workspaces (created_at);

CREATE INDEX IF NOT EXISTS idx_workspaces_metadata_gin
  ON workspaces USING GIN (metadata);

COMMENT ON TABLE workspaces IS
  'Tenant/workspace root for CRM data ownership and future multi-tenant modules.';

COMMENT ON COLUMN workspaces.public_id IS
  'External UUID safe for URLs and API contracts; internal joins can use id.';

COMMENT ON COLUMN workspaces.metadata IS
  'Extension point for non-critical workspace attributes before module tables mature.';
