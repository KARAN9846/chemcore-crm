import db from "../config/db.js";
import { chemicalBulkSchema } from "../../../shared/validation/chemical.schema.js";

export const saveChemicals = async (req, res) => {
  const client = await db.connect();

  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID missing",
      });
    }

    const parsed = chemicalBulkSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.errors,
      });
    }

    const { chemicals } = parsed.data;

    if (!chemicals || chemicals.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No chemicals provided",
      });
    }

    // 🔥 DUPLICATE CHECK (inside request)
    const names = chemicals.map((c) => c.name.toLowerCase().trim());
    const uniqueNames = new Set(names);

    if (names.length !== uniqueNames.size) {
      return res.status(400).json({
        success: false,
        message: "Duplicate chemicals in request",
      });
    }

    await client.query("BEGIN");

    // 🔥 CLEAR OLD (onboarding replace mode)
    await client.query("DELETE FROM chemicals WHERE company_id=$1", [
      companyId,
    ]);

    const inserted = [];

    for (const chem of chemicals) {
      console.log("Saving chemical:", chem.name);

      const result = await client.query(
        `INSERT INTO chemicals 
        (company_id, name, formula, category, hs_code, unit)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          companyId,
          chem.name,
          chem.formula,
          chem.category,
          chem.hsCode,
          chem.unit,
        ],
      );

      inserted.push(result.rows[0]);
    }

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Chemicals saved",
      data: inserted,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Chemical Save Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  } finally {
    client.release();
  }
};
