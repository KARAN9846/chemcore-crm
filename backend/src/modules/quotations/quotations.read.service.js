import db from "../../config/db.js";
import {
  mapQuotationDetailResponse,
  mapQuotationListResponse,
} from "./quotations.mapper.js";

const sortColumns = {
  createdAt: "q.created_at",
  quotationDate: "q.quotation_date",
  validUntil: "q.valid_until",
  value: "q.grand_total",
  margin: "q.margin_percent",
  client: "q.company_name",
};

const buildQuotationFilters = (filters) => {
  const where = [
    "q.company_id = $1",
    "COALESCE(q.is_deleted, false) = false",
    "COALESCE(q.is_latest_version, true) = true",
  ];
  const values = [filters.companyId];

  if (filters.search) {
    values.push(`%${filters.search}%`);
    where.push(`(
      q.quotation_number ILIKE $${values.length}
      OR q.client_name ILIKE $${values.length}
      OR q.company_name ILIKE $${values.length}
      OR q.country ILIKE $${values.length}
      OR EXISTS (
        SELECT 1
        FROM quotation_items qi_search
        WHERE qi_search.quotation_id = q.id
          AND qi_search.chemical_name ILIKE $${values.length}
      )
    )`);
  }

  if (filters.status) {
    values.push(filters.status);
    where.push(`q.status = $${values.length}`);
  }

  if (filters.owner) {
    values.push(filters.owner);
    where.push(`q.created_by = $${values.length}`);
  }

  if (filters.chemical) {
    values.push(filters.chemical);
    where.push(`EXISTS (
      SELECT 1
      FROM quotation_items qi_filter
      WHERE qi_filter.quotation_id = q.id
        AND qi_filter.chemical_name = $${values.length}
    )`);
  }

  return {
    whereSql: where.join(" AND "),
    values,
  };
};

export const listQuotations = async (filters) => {
  const page = filters.page;
  const limit = filters.limit;
  const offset = (page - 1) * limit;
  const sortColumn = sortColumns[filters.sortBy] ?? sortColumns.quotationDate;
  const sortDir = filters.sortDir === "asc" ? "ASC" : "DESC";
  const { whereSql, values } = buildQuotationFilters(filters);

  const countResult = await db.query(
    `SELECT COUNT(*)::int AS total
     FROM quotations q
     WHERE ${whereSql}`,
    values,
  );

  const listValues = [...values, limit, offset];
  const listResult = await db.query(
    `SELECT
       q.*,
       item.chemical_name AS primary_chemical,
       item.grade_spec AS primary_grade,
       item.quantity AS primary_quantity,
       item.unit AS primary_unit,
       item.unit_price AS primary_unit_price,
       item_count.item_count
     FROM quotations q
     LEFT JOIN LATERAL (
       SELECT chemical_name, grade_spec, quantity, unit, unit_price
       FROM quotation_items
       WHERE quotation_id = q.id
       ORDER BY sort_order ASC, id ASC
       LIMIT 1
     ) item ON true
     LEFT JOIN LATERAL (
       SELECT COUNT(*)::int AS item_count
       FROM quotation_items
       WHERE quotation_id = q.id
     ) item_count ON true
     WHERE ${whereSql}
     ORDER BY ${sortColumn} ${sortDir} NULLS LAST, q.id DESC
     LIMIT $${values.length + 1}
     OFFSET $${values.length + 2}`,
    listValues,
  );

  const summaryResult = await db.query(
    `SELECT
       COUNT(*) FILTER (WHERE status NOT IN ('Accepted', 'Rejected', 'Expired'))::int AS all_open,
       COUNT(*) FILTER (WHERE status = 'Draft')::int AS draft,
       COUNT(*) FILTER (WHERE status = 'Sent')::int AS sent,
       COUNT(*) FILTER (WHERE status = 'Revised')::int AS revised,
       COUNT(*) FILTER (WHERE status = 'Accepted')::int AS accepted,
       COUNT(*) FILTER (WHERE status = 'Rejected')::int AS rejected,
       COUNT(*) FILTER (
         WHERE status NOT IN ('Accepted', 'Rejected', 'Expired')
           AND valid_until IS NOT NULL
           AND valid_until >= CURRENT_DATE
           AND valid_until <= CURRENT_DATE + INTERVAL '7 days'
       )::int AS expiring_soon,
       COALESCE(SUM(grand_total) FILTER (
         WHERE status NOT IN ('Accepted', 'Rejected', 'Expired')
       ), 0)::numeric AS open_value
     FROM quotations q
     WHERE q.company_id = $1
       AND COALESCE(q.is_deleted, false) = false
       AND COALESCE(q.is_latest_version, true) = true`,
    [filters.companyId],
  );

  const total = countResult.rows[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const summary = summaryResult.rows[0] ?? {};

  return {
    data: listResult.rows.map(mapQuotationListResponse),
    summary: {
      allOpen: summary.all_open ?? 0,
      draft: summary.draft ?? 0,
      sent: summary.sent ?? 0,
      revised: summary.revised ?? 0,
      accepted: summary.accepted ?? 0,
      rejected: summary.rejected ?? 0,
      expiringSoon: summary.expiring_soon ?? 0,
      openValue: summary.open_value ?? 0,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const getQuotationByPublicId = async ({ companyId, publicId }) => {
  const quotationResult = await db.query(
    `SELECT q.*
     FROM quotations q
     WHERE q.company_id = $1
       AND q.public_id = $2
       AND COALESCE(q.is_deleted, false) = false
     LIMIT 1`,
    [companyId, publicId],
  );
  const quotation = quotationResult.rows[0];

  if (!quotation) {
    return null;
  }

  const itemsResult = await db.query(
    `SELECT *
     FROM quotation_items
     WHERE quotation_id = $1
     ORDER BY sort_order ASC, id ASC`,
    [quotation.id],
  );
  const rootQuotationId = quotation.parent_quotation_id ?? quotation.id;
  const versionHistoryResult = await db.query(
    `SELECT public_id,
            quotation_number,
            version_number,
            status,
            revision_notes,
            is_latest_version,
            created_by,
            created_at,
            updated_at
     FROM quotations
     WHERE company_id = $1
       AND COALESCE(is_deleted, false) = false
       AND (id = $2 OR parent_quotation_id = $2)
     ORDER BY version_number DESC, id DESC`,
    [companyId, rootQuotationId],
  );

  let lead = null;

  if (quotation.lead_id) {
    const leadResult = await db.query(
      `SELECT public_id, first_name, last_name, company_name, email, country
       FROM leads
       WHERE id = $1
         AND company_id = $2
       LIMIT 1`,
      [quotation.lead_id, companyId],
    );

    if (leadResult.rows[0]) {
      const row = leadResult.rows[0];
      lead = {
        publicId: row.public_id,
        clientName: [row.first_name, row.last_name].filter(Boolean).join(" "),
        companyName: row.company_name,
        email: row.email,
        country: row.country,
      };
    }
  }

  return mapQuotationDetailResponse({
    quotation,
    items: itemsResult.rows,
    lead,
    versionHistory: versionHistoryResult.rows,
  });
};

export const deleteQuotation = async ({ companyId, publicId }) => {
  const result = await db.query(
    `UPDATE quotations
     SET is_deleted = true,
         updated_at = NOW()
     WHERE company_id = $1
       AND public_id = $2
       AND COALESCE(is_deleted, false) = false
     RETURNING public_id`,
    [companyId, publicId],
  );

  return result.rows[0] ? { publicId: result.rows[0].public_id } : null;
};
