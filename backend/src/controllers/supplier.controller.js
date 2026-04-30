import db from "../config/db.js";
import { supplierSchema } from "../../../shared/validation/supplier.schema.js";

export const createSupplier = async (req, res) => {
  const client = await db.connect();

  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID missing",
      });
    }

    const parsed = supplierSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.errors ?? parsed.error.issues,
      });
    }

    const data = parsed.data;

    const result = await client.query(
      `INSERT INTO suppliers
      (company_id, company_name, supplier_type, city, country,
       contact_person, designation, email, phone,
       min_order, lead_time, reliability,
       payment_terms, rating, notes)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *`,
      [
        companyId,
        data.companyName,
        data.supplierType,
        data.city,
        data.country,
        data.contactPerson,
        data.designation,
        data.email,
        data.phone,
        data.minOrder,
        data.leadTime,
        data.reliability,
        data.paymentTerms,
        data.rating,
        data.notes,
      ],
    );

    return res.status(200).json({
      success: true,
      message: "Supplier created",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Supplier Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  } finally {
    client.release();
  }
};
