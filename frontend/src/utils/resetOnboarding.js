const ONBOARDING_KEY_PREFIXES = ["onboarding", "step"];

const ONBOARDING_KEYS = [
  "onboardingData",
  "onboardingStep",
  "onboardingCompanyId",
  "onboardingChemicals",
  "step1Draft",
  "step2Draft",
  "companyId",
];

export const resetOnboarding = () => {
  ONBOARDING_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });

  Object.keys(localStorage).forEach((key) => {
    if (
      ONBOARDING_KEY_PREFIXES.some((prefix) =>
        key.toLowerCase().startsWith(prefix.toLowerCase()),
      )
    ) {
      localStorage.removeItem(key);
    }
  });
};
