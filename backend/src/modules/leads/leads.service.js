import db from "../../config/db.js";
import {
  mapCreateLeadToDb,
  mapLeadListResponse,
  mapLeadResponse,
} from "./leads.mapper.js";

const insertLeadSql = `
  INSERT INTO leads (
    company_id,
    first_name,
    last_name,
    company_name,
    designation,
    email,
    phone,
    country,
    city,
    chemical_names,
    quantity_required,
    unit,
    frequency,
    price_per_unit,
    currency,
    estimated_value,
    incoterm,
    payment_terms,
    packaging_requirement,
    port_of_destination,
    source,
    source_detail,
    assigned_to,
    initial_stage,
    current_stage,
    lead_score,
    score_label,
    followup_date,
    followup_time,
    followup_via,
    notes,
    status
  )
  VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
    $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
    $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32
  )
  RETURNING *
`;

export const createLead = async (payload) => {
  const dbPayload = mapCreateLeadToDb(payload);
  const duplicateLead = await findDuplicateLead(dbPayload);

  if (duplicateLead && !payload.continueAnyway) {
    return {
      duplicate: true,
      existingLead: mapLeadResponse(duplicateLead),
    };
  }

  const result = await db.query(insertLeadSql, [
    dbPayload.company_id,
    dbPayload.first_name,
    dbPayload.last_name,
    dbPayload.company_name,
    dbPayload.designation,
    dbPayload.email,
    dbPayload.phone,
    dbPayload.country,
    dbPayload.city,
    dbPayload.chemical_names,
    dbPayload.quantity_required,
    dbPayload.unit,
    dbPayload.frequency,
    dbPayload.price_per_unit,
    dbPayload.currency,
    dbPayload.estimated_value,
    dbPayload.incoterm,
    dbPayload.payment_terms,
    dbPayload.packaging_requirement,
    dbPayload.port_of_destination,
    dbPayload.source,
    dbPayload.source_detail,
    dbPayload.assigned_to,
    dbPayload.initial_stage,
    dbPayload.current_stage,
    dbPayload.lead_score,
    dbPayload.score_label,
    dbPayload.followup_date,
    dbPayload.followup_time,
    dbPayload.followup_via,
    dbPayload.notes,
    dbPayload.status,
  ]);

  return {
    duplicate: false,
    lead: mapLeadResponse(result.rows[0]),
  };
};

const findDuplicateLead = async (lead) => {
  const result = await db.query(
    `SELECT *
     FROM leads
     WHERE company_id = $1
       AND created_at >= NOW() - INTERVAL '14 days'
       AND (
        LOWER(email) = LOWER($2)
        OR LOWER(company_name) = LOWER($3)
       )
       AND chemical_names && $4::text[]
     ORDER BY created_at DESC
     LIMIT 1`,
    [
      lead.company_id,
      lead.email,
      lead.company_name,
      lead.chemical_names?.length ? lead.chemical_names : ["__none__"],
    ],
  );

  return result.rows[0] || null;
};

const sortColumns = {
  createdAt: "created_at",
  companyName: "company_name",
  score: "lead_score",
  followUp: "followup_date",
  value: "estimated_value",
};

const buildLeadFilters = (filters) => {
  const where = ["company_id = $1"];
  const values = [filters.companyId];

  if (filters.search) {
    values.push(`%${filters.search}%`);
    where.push(`(
      company_name ILIKE $${values.length}
      OR first_name ILIKE $${values.length}
      OR last_name ILIKE $${values.length}
      OR email ILIKE $${values.length}
      OR chemical_names::text ILIKE $${values.length}
    )`);
  }

  if (filters.status) {
    values.push(filters.status);
    where.push(`status = $${values.length}`);
  }

  if (filters.dateFrom) {
    values.push(filters.dateFrom);
    where.push(`created_at::date >= $${values.length}`);
  }

  if (filters.dateTo) {
    values.push(filters.dateTo);
    where.push(`created_at::date <= $${values.length}`);
  }

  if (filters.scoreMin !== undefined) {
    values.push(filters.scoreMin);
    where.push(`lead_score >= $${values.length}`);
  }

  if (filters.scoreMax !== undefined) {
    values.push(filters.scoreMax);
    where.push(`lead_score <= $${values.length}`);
  }

  return {
    whereSql: where.join(" AND "),
    values,
  };
};

export const listLeads = async (filters) => {
  const page = filters.page;
  const limit = filters.limit;
  const offset = (page - 1) * limit;
  const sortColumn = sortColumns[filters.sortBy] ?? sortColumns.createdAt;
  const sortDir = filters.sortDir === "asc" ? "ASC" : "DESC";
  const { whereSql, values } = buildLeadFilters(filters);

  const countResult = await db.query(
    `SELECT COUNT(*)::int AS total FROM leads WHERE ${whereSql}`,
    values,
  );

  const listValues = [...values, limit, offset];
  const leadsResult = await db.query(
    `SELECT *
     FROM leads
     WHERE ${whereSql}
     ORDER BY ${sortColumn} ${sortDir} NULLS LAST, id DESC
     LIMIT $${values.length + 1}
     OFFSET $${values.length + 2}`,
    listValues,
  );

  const total = countResult.rows[0]?.total ?? 0;

  return {
    data: leadsResult.rows.map(mapLeadListResponse),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const listLeadOptions = async ({ companyId }) => {
  const result = await db.query(
    `SELECT
       public_id,
       first_name,
       last_name,
       company_name,
       email,
       country,
       currency
     FROM leads
     WHERE company_id = $1
       AND status <> 'lost'
     ORDER BY updated_at DESC NULLS LAST, created_at DESC
     LIMIT 100`,
    [companyId],
  );

  return result.rows.map((row) => {
    const clientName = [row.first_name, row.last_name].filter(Boolean).join(" ");
    const displayLabel = [
      clientName || row.company_name,
      row.company_name,
      row.country,
    ]
      .filter(Boolean)
      .join(" - ");

    return {
      publicId: row.public_id,
      leadId: row.public_id,
      clientName,
      companyName: row.company_name,
      email: row.email,
      country: row.country,
      currency: row.currency,
      displayLabel,
    };
  });
};

export const getLeadByPublicId = async ({ companyId, publicId }) => {
  const result = await db.query(
    `SELECT *
     FROM leads
     WHERE company_id = $1
       AND public_id = $2
     LIMIT 1`,
    [companyId, publicId],
  );

  return result.rows[0] ? mapLeadResponse(result.rows[0]) : null;
};

export const updateLead = async (payload) => {
  const dbPayload = mapCreateLeadToDb(payload);

  const result = await db.query(
    `UPDATE leads
     SET
      first_name = $1,
      last_name = $2,
      company_name = $3,
      designation = $4,
      email = $5,
      phone = $6,
      country = $7,
      city = $8,
      chemical_names = $9,
      quantity_required = $10,
      unit = $11,
      frequency = $12,
      price_per_unit = $13,
      currency = $14,
      estimated_value = $15,
      incoterm = $16,
      payment_terms = $17,
      packaging_requirement = $18,
      port_of_destination = $19,
      source = $20,
      source_detail = $21,
      assigned_to = $22,
      initial_stage = $23,
      current_stage = $24,
      lead_score = $25,
      score_label = $26,
      followup_date = $27,
      followup_time = NULLIF($28, '')::time,
      followup_via = $29,
      notes = $30,
      status = $31,
      updated_at = NOW()
     WHERE company_id = $32
       AND public_id = $33
     RETURNING *`,
    [
      dbPayload.first_name,
      dbPayload.last_name,
      dbPayload.company_name,
      dbPayload.designation,
      dbPayload.email,
      dbPayload.phone,
      dbPayload.country,
      dbPayload.city,
      dbPayload.chemical_names,
      dbPayload.quantity_required,
      dbPayload.unit,
      dbPayload.frequency,
      dbPayload.price_per_unit,
      dbPayload.currency,
      dbPayload.estimated_value,
      dbPayload.incoterm,
      dbPayload.payment_terms,
      dbPayload.packaging_requirement,
      dbPayload.port_of_destination,
      dbPayload.source,
      dbPayload.source_detail,
      dbPayload.assigned_to,
      dbPayload.initial_stage,
      dbPayload.current_stage,
      dbPayload.lead_score,
      dbPayload.score_label,
      dbPayload.followup_date,
      dbPayload.followup_time,
      dbPayload.followup_via,
      dbPayload.notes,
      dbPayload.status,
      payload.companyId,
      payload.publicId,
    ],
  );

  return result.rows[0] ? mapLeadResponse(result.rows[0]) : null;
};

export const updateLeadFollowup = async ({
  companyId,
  publicId,
  followup,
}) => {
  const result = await db.query(
    `UPDATE leads
     SET
      followup_date = $1,
      followup_time = NULLIF($2, '')::time,
      followup_via = $3,
      notes = COALESCE(NULLIF($4, ''), notes),
      updated_at = NOW()
     WHERE company_id = $5
       AND public_id = $6
     RETURNING *`,
    [
      followup.date,
      followup.time,
      followup.via,
      followup.note,
      companyId,
      publicId,
    ],
  );

  return result.rows[0] ? mapLeadResponse(result.rows[0]) : null;
};
