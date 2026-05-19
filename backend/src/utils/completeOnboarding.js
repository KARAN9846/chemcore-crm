import db from "../config/db.js";

export const completeOnboarding = async (companyId) => {
  console.log("Updating onboarding step:", {
    companyId,
    step: 6,
  });

  await db.query(
    `
    UPDATE companies
    SET onboarding_completed = true,
        onboarding_step = 6
    WHERE id = $1
    `,
    [companyId],
  );
};
