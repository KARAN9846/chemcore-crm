import db from "../config/db.js";

export const resetOnboarding = async (req, res) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      success: false,
      message: "Dev reset is only available in development mode",
    });
  }

  try {
    const { companyId } = req.params;

    if (!companyId || Number.isNaN(Number(companyId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const result = await db.query(
      `
      UPDATE companies
      SET onboarding_completed = false,
          onboarding_step = 1
      WHERE id = $1
      RETURNING id, onboarding_step, onboarding_completed
      `,
      [companyId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Dev onboarding reset error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
