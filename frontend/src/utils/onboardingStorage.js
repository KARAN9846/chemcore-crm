export const ONBOARDING_KEYS = {
  DATA: "onboardingData",
  STEP: "onboardingStep",
  COMPANY: "onboardingCompanyId",
  CHEMICALS: "onboardingChemicals",
  STEP_1_DRAFT: "step1Draft",
  STEP_2_DRAFT: "step2Draft",
  LEGACY_COMPANY: "companyId",
};

export const clearOnboardingStorage = () => {
  Object.values(ONBOARDING_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

export const getCompanyKey = (companyId) => `onboarding_${companyId}`;

export const clearCompanyOnboarding = (companyId) => {
  if (!companyId) {
    return;
  }

  localStorage.removeItem(getCompanyKey(companyId));
};

export const readOnboardingCompanyId = () =>
  localStorage.getItem(ONBOARDING_KEYS.COMPANY) ||
  localStorage.getItem(ONBOARDING_KEYS.LEGACY_COMPANY) ||
  null;
