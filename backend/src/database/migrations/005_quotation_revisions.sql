ALTER TABLE quotations
  ADD COLUMN IF NOT EXISTS parent_quotation_id bigint REFERENCES quotations(id),
  ADD COLUMN IF NOT EXISTS version_number integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS revision_notes text,
  ADD COLUMN IF NOT EXISTS revised_from_id bigint REFERENCES quotations(id),
  ADD COLUMN IF NOT EXISTS is_latest_version boolean NOT NULL DEFAULT true;

UPDATE quotations
SET version_number = COALESCE(version_number, 1),
    is_latest_version = COALESCE(is_latest_version, true)
WHERE version_number IS NULL
   OR is_latest_version IS NULL;

DROP INDEX IF EXISTS uq_quotations_number_per_company;

CREATE UNIQUE INDEX IF NOT EXISTS uq_quotations_number_version_per_company
  ON quotations (company_id, quotation_number, version_number)
  WHERE COALESCE(is_deleted, false) = false;

CREATE INDEX IF NOT EXISTS idx_quotations_revision_root
  ON quotations (company_id, COALESCE(parent_quotation_id, id), version_number);

CREATE INDEX IF NOT EXISTS idx_quotations_latest_version
  ON quotations (company_id, is_latest_version)
  WHERE COALESCE(is_deleted, false) = false;
