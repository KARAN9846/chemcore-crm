-- Foundational Leads table for ChemCore CRM.
-- Additive-only migration: creates a new company-scoped CRM table and indexes.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL DEFAULT gen_random_uuid(),
  company_id BIGINT NOT NULL,

  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80),
  company_name VARCHAR(140) NOT NULL,
  designation VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  country VARCHAR(80) NOT NULL,
  city VARCHAR(80),

  chemical_names TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  quantity_required NUMERIC(14, 3),
  unit VARCHAR(20),
  frequency VARCHAR(40),
  price_per_unit NUMERIC(14, 2),
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  estimated_value NUMERIC(16, 2),

  incoterm VARCHAR(40),
  payment_terms TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  packaging_requirement VARCHAR(120),
  port_of_destination VARCHAR(120),

  source VARCHAR(80),
  source_detail VARCHAR(180),
  assigned_to VARCHAR(100),
  initial_stage VARCHAR(40),
  lead_score INTEGER NOT NULL DEFAULT 0,
  score_label VARCHAR(20) NOT NULL DEFAULT 'Cold',

  followup_date DATE,
  followup_time TIME,
  followup_via VARCHAR(40),

  notes TEXT,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT leads_public_id_unique UNIQUE (public_id),
  CONSTRAINT fk_leads_company
    FOREIGN KEY (company_id)
    REFERENCES companies(id)
    ON DELETE CASCADE,
  CONSTRAINT leads_score_check CHECK (lead_score >= 0 AND lead_score <= 100),
  CONSTRAINT leads_status_check CHECK (
    status IN ('new', 'qualified', 'quoted', 'negotiating', 'converted', 'lost')
  )
);

CREATE INDEX IF NOT EXISTS idx_leads_company_id
  ON leads (company_id);

CREATE INDEX IF NOT EXISTS idx_leads_company_status
  ON leads (company_id, status);

CREATE INDEX IF NOT EXISTS idx_leads_company_created_at
  ON leads (company_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_company_score
  ON leads (company_id, lead_score DESC);

CREATE INDEX IF NOT EXISTS idx_leads_followup_date
  ON leads (company_id, followup_date)
  WHERE followup_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_chemical_names_gin
  ON leads USING GIN (chemical_names);

COMMENT ON TABLE leads IS
  'Company-scoped CRM lead records for chemical export workflows.';

COMMENT ON COLUMN leads.public_id IS
  'External UUID safe for API responses and future URLs.';
