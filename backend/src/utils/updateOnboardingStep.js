import db from "../config/db.js";

export const updateOnboardingStep = async (companyId, step) => {
  console.log("Updating onboarding step:", {
    companyId,
    step,
  });

  const result = await db.query(
    `
    UPDATE companies
    SET onboarding_step = GREATEST(COALESCE(onboarding_step, 1), $1)
    WHERE id = $2
    RETURNING onboarding_step
    `,
    [step, companyId],
  );

  console.log("ONBOARDING STEP UPDATED:", result.rows[0]);

  return result.rows[0];
};
