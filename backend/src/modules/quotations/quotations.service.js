import db from "../../config/db.js";
import {
  mapCreateQuotationToDb,
  mapQuotationResponse,
} from "./quotations.mapper.js";

const insertQuotationSql = `
  INSERT INTO quotations (
    company_id,
    lead_id,
    quotation_number,
    status,
    quotation_date,
    valid_until,
    currency,
    client_name,
    company_name,
    client_email,
    country,
    subtotal,
    freight_total,
    additional_charges,
    discount_total,
    grand_total,
    gross_profit,
    margin_percent,
    incoterm,
    payment_terms,
    loading_port,
    discharge_port,
    packaging_details,
    remarks,
    internal_notes,
    metadata,
    created_by
  )
  VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
    $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
    $21,$22,$23,$24,$25,$26,$27
  )
  RETURNING *
`;

const insertQuotationItemSql = `
  INSERT INTO quotation_items (
    quotation_id,
    chemical_name,
    grade_spec,
    quantity,
    unit,
    unit_price,
    supplier_cost,
    freight_cost,
    line_total,
    gross_profit,
    margin_percent,
    sort_order,
    metadata
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
`;

export const createQuotation = async (payload) => {
  const dbPayload = mapCreateQuotationToDb(payload);
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const quotationYear = new Date().getFullYear();
    await client.query("SELECT pg_advisory_xact_lock($1, $2)", [
      quotationYear,
      payload.companyId,
    ]);

    let leadId = null;

    if (dbPayload.quotation.lead_public_id) {
      const leadResult = await client.query(
        `SELECT id
         FROM leads
         WHERE company_id = $1
           AND public_id = $2
         LIMIT 1`,
        [payload.companyId, dbPayload.quotation.lead_public_id],
      );
      leadId = leadResult.rows[0]?.id ?? null;
    }

    let quotationNumber = dbPayload.quotation.quotation_number;

    if (!quotationNumber) {
      quotationNumber = await generateQuotationNumber(client, payload.companyId);
    }

    const duplicateResult = await client.query(
      `SELECT id
       FROM quotations
       WHERE company_id = $1
         AND quotation_number = $2
         AND COALESCE(is_deleted, false) = false
       LIMIT 1`,
      [payload.companyId, quotationNumber],
    );

    if (duplicateResult.rows[0]) {
      await client.query("ROLLBACK");

      return {
        duplicate: true,
        quotation: null,
      };
    }

    const quotationResult = await client.query(insertQuotationSql, [
      dbPayload.quotation.company_id,
      leadId,
      quotationNumber,
      dbPayload.quotation.status,
      dbPayload.quotation.quotation_date,
      dbPayload.quotation.valid_until,
      dbPayload.quotation.currency,
      dbPayload.quotation.client_name,
      dbPayload.quotation.company_name,
      dbPayload.quotation.client_email,
      dbPayload.quotation.country,
      dbPayload.quotation.subtotal,
      dbPayload.quotation.freight_total,
      dbPayload.quotation.additional_charges,
      dbPayload.quotation.discount_total,
      dbPayload.quotation.grand_total,
      dbPayload.quotation.gross_profit,
      dbPayload.quotation.margin_percent,
      dbPayload.quotation.incoterm,
      dbPayload.quotation.payment_terms,
      dbPayload.quotation.loading_port,
      dbPayload.quotation.discharge_port,
      dbPayload.quotation.packaging_details,
      dbPayload.quotation.remarks,
      dbPayload.quotation.internal_notes,
      JSON.stringify(dbPayload.quotation.metadata),
      dbPayload.quotation.created_by,
    ]);

    const quotationRow = quotationResult.rows[0];

    for (const item of dbPayload.items) {
      await client.query(insertQuotationItemSql, [
        quotationRow.id,
        item.chemical_name,
        item.grade_spec,
        item.quantity,
        item.unit,
        item.unit_price,
        item.supplier_cost,
        item.freight_cost,
        item.line_total,
        item.gross_profit,
        item.margin_percent,
        item.sort_order,
        JSON.stringify(item.metadata),
      ]);
    }

    await client.query("COMMIT");

    return {
      duplicate: false,
      quotation: mapQuotationResponse(quotationRow),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const generateQuotationNumber = async (client, companyId) => {
  const year = new Date().getFullYear();
  const result = await client.query(
    `SELECT COALESCE(
       MAX(CAST(substring(quotation_number FROM ('^QT-' || $2 || '-([0-9]+)$')) AS int)),
       0
     ) + 1 AS next_number
     FROM quotations
     WHERE company_id = $1
       AND quotation_number LIKE ('QT-' || $2 || '-%')
       AND COALESCE(is_deleted, false) = false`,
    [companyId, String(year)],
  );
  const nextNumber = String(result.rows[0]?.next_number ?? 1).padStart(4, "0");

  return `QT-${year}-${nextNumber}`;
};
