-- Stabilize existing onboarding/business table relationships around companies(id).
--
-- Execution policy:
-- 1. Run the PREFLIGHT section first.
-- 2. If any orphan or duplicate result returns rows, stop and clean data manually.
-- 3. Run the ADDITIVE DDL section only after preflight is clean.
-- 4. Run the VALIDATION section when ready to scan existing rows.
--
-- This migration is intentionally SQL-only. It is not executed by the app.
-- It does not drop, rename, or rewrite existing business tables.

-- =========================================================
-- PREFLIGHT: orphan checks
-- =========================================================

-- users.company_id must point to companies(id)
SELECT u.id, u.company_id
FROM users u
LEFT JOIN companies c ON c.id = u.company_id
WHERE u.company_id IS NOT NULL
  AND c.id IS NULL;

-- suppliers.company_id must point to companies(id)
SELECT s.id, s.company_id
FROM suppliers s
LEFT JOIN companies c ON c.id = s.company_id
WHERE s.company_id IS NOT NULL
  AND c.id IS NULL;

-- chemicals.company_id must point to companies(id)
SELECT ch.id, ch.company_id
FROM chemicals ch
LEFT JOIN companies c ON c.id = ch.company_id
WHERE ch.company_id IS NOT NULL
  AND c.id IS NULL;

-- branding.company_id must point to companies(id)
SELECT b.id, b.company_id
FROM branding b
LEFT JOIN companies c ON c.id = b.company_id
WHERE b.company_id IS NOT NULL
  AND c.id IS NULL;

-- company_branding.company_id must point to companies(id), if the table exists
CREATE TEMP TABLE IF NOT EXISTS company_branding_orphan_preflight (
  id BIGINT,
  company_id BIGINT
) ON COMMIT DROP;

TRUNCATE company_branding_orphan_preflight;

DO $$
BEGIN
  IF to_regclass('public.company_branding') IS NOT NULL THEN
    EXECUTE $SQL$
      INSERT INTO company_branding_orphan_preflight (id, company_id)
      SELECT cb.id, cb.company_id
      FROM company_branding cb
      LEFT JOIN companies c ON c.id = cb.company_id
      WHERE cb.company_id IS NOT NULL
        AND c.id IS NULL
    $SQL$;
  END IF;
END $$;

SELECT *
FROM company_branding_orphan_preflight;

-- =========================================================
-- PREFLIGHT: duplicate checks before unique indexes
-- =========================================================

-- users should not repeat the same email inside one company
SELECT company_id, LOWER(email) AS normalized_email, COUNT(*) AS duplicate_count
FROM users
WHERE company_id IS NOT NULL
  AND email IS NOT NULL
GROUP BY company_id, LOWER(email)
HAVING COUNT(*) > 1;

-- branding is expected to be one row per company
SELECT company_id, COUNT(*) AS duplicate_count
FROM branding
WHERE company_id IS NOT NULL
GROUP BY company_id
HAVING COUNT(*) > 1;

-- chemicals unique index is intentionally not added below until this is clean
SELECT company_id, LOWER(name) AS normalized_name, COUNT(*) AS duplicate_count
FROM chemicals
WHERE company_id IS NOT NULL
  AND name IS NOT NULL
GROUP BY company_id, LOWER(name)
HAVING COUNT(*) > 1;

-- company_branding is expected to be one row per company, if the table exists
CREATE TEMP TABLE IF NOT EXISTS company_branding_duplicate_preflight (
  company_id BIGINT,
  duplicate_count BIGINT
) ON COMMIT DROP;

TRUNCATE company_branding_duplicate_preflight;

DO $$
BEGIN
  IF to_regclass('public.company_branding') IS NOT NULL THEN
    EXECUTE $SQL$
      INSERT INTO company_branding_duplicate_preflight (company_id, duplicate_count)
      SELECT company_id, COUNT(*) AS duplicate_count
      FROM company_branding
      WHERE company_id IS NOT NULL
      GROUP BY company_id
      HAVING COUNT(*) > 1
    $SQL$;
  END IF;
END $$;

SELECT *
FROM company_branding_duplicate_preflight;

-- =========================================================
-- ADDITIVE DDL: timestamp consistency
-- =========================================================

ALTER TABLE IF EXISTS companies
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS suppliers
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS chemicals
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS branding
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS companies
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE IF EXISTS users
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE IF EXISTS suppliers
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE IF EXISTS chemicals
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE IF EXISTS branding
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

DO $$
BEGIN
  IF to_regclass('public.company_branding') IS NOT NULL THEN
    EXECUTE $SQL$
      ALTER TABLE company_branding
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ
    $SQL$;

    EXECUTE $SQL$
      ALTER TABLE company_branding
        ALTER COLUMN created_at SET DEFAULT NOW(),
        ALTER COLUMN updated_at SET DEFAULT NOW()
    $SQL$;
  END IF;
END $$;

-- =========================================================
-- ADDITIVE DDL: tenant indexes
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_users_company_id
  ON users (company_id);

CREATE INDEX IF NOT EXISTS idx_suppliers_company_id
  ON suppliers (company_id);

CREATE INDEX IF NOT EXISTS idx_chemicals_company_id
  ON chemicals (company_id);

CREATE INDEX IF NOT EXISTS idx_branding_company_id
  ON branding (company_id);

DO $$
BEGIN
  IF to_regclass('public.company_branding') IS NOT NULL THEN
    EXECUTE $SQL$
      CREATE INDEX IF NOT EXISTS idx_company_branding_company_id
        ON company_branding (company_id)
    $SQL$;
  END IF;
END $$;

-- =========================================================
-- ADDITIVE DDL: uniqueness aligned with current onboarding behavior
-- =========================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_company_lower_email
  ON users (company_id, LOWER(email))
  WHERE company_id IS NOT NULL
    AND email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_branding_company_id
  ON branding (company_id)
  WHERE company_id IS NOT NULL;

DO $$
BEGIN
  IF to_regclass('public.company_branding') IS NOT NULL THEN
    EXECUTE $SQL$
      CREATE UNIQUE INDEX IF NOT EXISTS uq_company_branding_company_id
        ON company_branding (company_id)
        WHERE company_id IS NOT NULL
    $SQL$;
  END IF;
END $$;

-- Optional future index only after chemical duplicate preflight is clean:
-- CREATE UNIQUE INDEX IF NOT EXISTS uq_chemicals_company_lower_name
--   ON chemicals (company_id, LOWER(name))
--   WHERE company_id IS NOT NULL
--     AND name IS NOT NULL;

-- =========================================================
-- ADDITIVE DDL: foreign keys using NOT VALID
-- =========================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_company'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT fk_users_company
      FOREIGN KEY (company_id)
      REFERENCES companies(id)
      ON DELETE CASCADE
      NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_suppliers_company'
  ) THEN
    ALTER TABLE suppliers
      ADD CONSTRAINT fk_suppliers_company
      FOREIGN KEY (company_id)
      REFERENCES companies(id)
      ON DELETE RESTRICT
      NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_chemicals_company'
  ) THEN
    ALTER TABLE chemicals
      ADD CONSTRAINT fk_chemicals_company
      FOREIGN KEY (company_id)
      REFERENCES companies(id)
      ON DELETE CASCADE
      NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_branding_company'
  ) THEN
    ALTER TABLE branding
      ADD CONSTRAINT fk_branding_company
      FOREIGN KEY (company_id)
      REFERENCES companies(id)
      ON DELETE CASCADE
      NOT VALID;
  END IF;

  IF to_regclass('public.company_branding') IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'fk_company_branding_company'
    )
  THEN
    EXECUTE $SQL$
      ALTER TABLE company_branding
        ADD CONSTRAINT fk_company_branding_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE
        NOT VALID
    $SQL$;
  END IF;
END $$;

-- =========================================================
-- VALIDATION: run only after preflight is clean
-- =========================================================

-- ALTER TABLE users VALIDATE CONSTRAINT fk_users_company;
-- ALTER TABLE suppliers VALIDATE CONSTRAINT fk_suppliers_company;
-- ALTER TABLE chemicals VALIDATE CONSTRAINT fk_chemicals_company;
-- ALTER TABLE branding VALIDATE CONSTRAINT fk_branding_company;
-- ALTER TABLE company_branding VALIDATE CONSTRAINT fk_company_branding_company;

-- =========================================================
-- POST-CHECKS
-- =========================================================

SELECT conname, conrelid::regclass AS table_name, confrelid::regclass AS referenced_table, convalidated
FROM pg_constraint
WHERE conname IN (
  'fk_users_company',
  'fk_suppliers_company',
  'fk_chemicals_company',
  'fk_branding_company',
  'fk_company_branding_company'
)
ORDER BY conname;

SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE indexname IN (
  'idx_users_company_id',
  'idx_suppliers_company_id',
  'idx_chemicals_company_id',
  'idx_branding_company_id',
  'idx_company_branding_company_id',
  'uq_users_company_lower_email',
  'uq_branding_company_id',
  'uq_company_branding_company_id'
)
ORDER BY tablename, indexname;
