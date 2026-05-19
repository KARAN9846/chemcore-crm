-- Lead activities foundation for ChemCore CRM.
-- Additive-only migration: creates company-scoped timeline records and adds
-- a non-destructive current_stage workflow column to leads.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS current_stage VARCHAR(40);

UPDATE leads
SET current_stage = COALESCE(current_stage, initial_stage, status, 'new')
WHERE current_stage IS NULL;

CREATE INDEX IF NOT EXISTS idx_leads_company_current_stage
  ON leads (company_id, current_stage);

CREATE TABLE IF NOT EXISTS lead_activities (
  id BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL DEFAULT gen_random_uuid(),
  company_id BIGINT NOT NULL,
  lead_id BIGINT NOT NULL,

  activity_type VARCHAR(40) NOT NULL,
  subject VARCHAR(160) NOT NULL,
  notes TEXT,
  outcome VARCHAR(180),

  previous_stage VARCHAR(40),
  new_stage VARCHAR(40),

  followup_date DATE,
  followup_time TIME,
  followup_via VARCHAR(40),

  activity_date DATE NOT NULL,
  activity_time TIME,
  created_by VARCHAR(100),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT lead_activities_public_id_unique UNIQUE (public_id),
  CONSTRAINT fk_lead_activities_company
    FOREIGN KEY (company_id)
    REFERENCES companies(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_lead_activities_lead
    FOREIGN KEY (lead_id)
    REFERENCES leads(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_company_lead_created
  ON lead_activities (company_id, lead_id, activity_date DESC, activity_time DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_lead_activities_company_type
  ON lead_activities (company_id, activity_type);

COMMENT ON TABLE lead_activities IS
  'Company-scoped CRM timeline and conversation activity records for leads.';

COMMENT ON COLUMN leads.current_stage IS
  'Current CRM workflow stage used by lead activity logging and future pipeline automation.';
