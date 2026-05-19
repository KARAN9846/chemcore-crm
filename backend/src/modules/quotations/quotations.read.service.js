import db from "../../config/db.js";
import { mapQuotationDetailResponse } from "./quotations.mapper.js";

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
  });
};
