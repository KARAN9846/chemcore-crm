import { getCompanyId } from "./company";

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
  Object.entries(ONBOARDING_KEYS).forEach(([name, key]) => {
    if (name === "LEGACY_COMPANY") {
      return;
    }

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
  getCompanyId() || localStorage.getItem(ONBOARDING_KEYS.COMPANY) || null;
