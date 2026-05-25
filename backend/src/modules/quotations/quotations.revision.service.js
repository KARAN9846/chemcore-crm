import db from "../../config/db.js";
import {
  mapCreateQuotationToDb,
  mapQuotationResponse,
} from "./quotations.mapper.js";

const insertRevisionSql = `
  INSERT INTO quotations (
    company_id,
    lead_id,
    quotation_number,
    version_number,
    parent_quotation_id,
    revised_from_id,
    revision_notes,
    is_latest_version,
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
    $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
    $31,$32
  )
  RETURNING *
`;

const insertRevisionItemSql = `
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

const getLeadId = async ({ client, companyId, leadPublicId }) => {
  if (!leadPublicId) {
    return null;
  }

  const leadResult = await client.query(
    `SELECT id
     FROM leads
     WHERE company_id = $1
       AND public_id = $2
     LIMIT 1`,
    [companyId, leadPublicId],
  );

  return leadResult.rows[0]?.id ?? null;
};

export const reviseQuotation = async ({
  companyId,
  publicId,
  quotationForm,
  revisionNotes = "",
  saveMode = "draft",
}) => {
  const dbPayload = mapCreateQuotationToDb({ companyId, quotationForm });
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const sourceResult = await client.query(
      `SELECT *
       FROM quotations
       WHERE company_id = $1
         AND public_id = $2
         AND COALESCE(is_deleted, false) = false
       LIMIT 1
       FOR UPDATE`,
      [companyId, publicId],
    );
    const source = sourceResult.rows[0];

    if (!source) {
      await client.query("ROLLBACK");
      return null;
    }

    const rootQuotationId = source.parent_quotation_id ?? source.id;
    const quotationNumber = source.quotation_number;
    await client.query(
      `SELECT id
       FROM quotations
       WHERE company_id = $1
         AND quotation_number = $2
         AND COALESCE(is_deleted, false) = false
       ORDER BY version_number DESC, id DESC
       FOR UPDATE`,
      [companyId, quotationNumber],
    );

    const latestResult = await client.query(
      `SELECT MAX(version_number)::int AS latest_version
       FROM quotations
       WHERE company_id = $1
         AND quotation_number = $2
         AND COALESCE(is_deleted, false) = false`,
      [companyId, quotationNumber],
    );
    const latestVersion =
      latestResult.rows[0]?.latest_version ?? source.version_number ?? null;
    const currentVersion = Number(source.version_number ?? latestVersion ?? 1);
    const nextVersionNumber = latestVersion ? Number(latestVersion) + 1 : 1;

    console.log("[quotation revision]", {
      currentVersion,
      latestVersion,
      nextVersionNumber,
      quotation_number: quotationNumber,
    });

    const leadId = await getLeadId({
      client,
      companyId,
      leadPublicId: dbPayload.quotation.lead_public_id,
    });

    await client.query(
      `UPDATE quotations
       SET is_latest_version = false,
           updated_at = NOW()
       WHERE company_id = $1
         AND quotation_number = $2
         AND COALESCE(is_deleted, false) = false
         AND COALESCE(is_latest_version, true) = true`,
      [companyId, quotationNumber],
    );

    const metadata = {
      ...dbPayload.quotation.metadata,
      revision: {
        ...(dbPayload.quotation.metadata?.revision ?? {}),
        sourcePublicId: source.public_id,
        revisedFromVersion: source.version_number ?? 1,
        versionNumber: nextVersionNumber,
      },
    };

    const revisionResult = await client.query(insertRevisionSql, [
      dbPayload.quotation.company_id,
      leadId,
      quotationNumber,
      nextVersionNumber,
      rootQuotationId,
      source.id,
      revisionNotes || null,
      true,
      saveMode === "send" ? "Sent" : "Draft",
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
      JSON.stringify(metadata),
      dbPayload.quotation.created_by,
    ]);
    const revisionRow = revisionResult.rows[0];

    for (const item of dbPayload.items) {
      await client.query(insertRevisionItemSql, [
        revisionRow.id,
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

    return mapQuotationResponse(revisionRow);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
