import db from "../config/db.js";

export const getCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId || Number.isNaN(Number(companyId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const result = await db.query(
      "SELECT * FROM companies WHERE id = $1",
      [companyId],
    );

    return res.status(200).json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (error) {
    console.error("Company Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
