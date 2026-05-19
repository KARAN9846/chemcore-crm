-- Additive indexes for lead duplicate detection and CRM list search paths.

CREATE INDEX IF NOT EXISTS idx_leads_company_lower_email
  ON leads (company_id, LOWER(email));

CREATE INDEX IF NOT EXISTS idx_leads_company_lower_company_name
  ON leads (company_id, LOWER(company_name));

CREATE INDEX IF NOT EXISTS idx_leads_company_recent_duplicate_scan
  ON leads (company_id, created_at DESC, LOWER(email), LOWER(company_name));
