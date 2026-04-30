import { useMemo, useState } from "react";

import { OnboardingContext } from "./OnboardingContextCore";
import {
  ONBOARDING_KEYS,
  readOnboardingCompanyId,
} from "../utils/onboardingStorage";

const readCompanyId = () => readOnboardingCompanyId();

const readCurrentStep = () => {
  const storedStep = Number(localStorage.getItem(ONBOARDING_KEYS.STEP));
  return Number.isFinite(storedStep) && storedStep > 0 ? storedStep : 1;
};

const readChemicals = () => {
  try {
    const storedChemicals = localStorage.getItem(ONBOARDING_KEYS.CHEMICALS);
    const parsedChemicals = storedChemicals ? JSON.parse(storedChemicals) : [];

    return Array.isArray(parsedChemicals) ? parsedChemicals : [];
  } catch {
    return [];
  }
};

export const OnboardingProvider = ({ children }) => {
  const [companyId, setCompanyIdState] = useState(() => readCompanyId());
  const [currentStep, setCurrentStepState] = useState(() => readCurrentStep());
  const [onboardingChemicals, setOnboardingChemicalsState] = useState(() =>
    readChemicals(),
  );
  const [isHydrated] = useState(true);

  const setCompanyId = (value) => {
    setCompanyIdState(value);

    if (value) {
      localStorage.setItem(ONBOARDING_KEYS.COMPANY, value);
      localStorage.removeItem(ONBOARDING_KEYS.LEGACY_COMPANY);
      return;
    }

    localStorage.removeItem(ONBOARDING_KEYS.COMPANY);
    localStorage.removeItem(ONBOARDING_KEYS.LEGACY_COMPANY);
  };

  const setCurrentStep = (value) => {
    const nextStep = Number(value);
    const safeStep = Number.isFinite(nextStep) && nextStep > 0 ? nextStep : 1;

    setCurrentStepState(safeStep);
    localStorage.setItem(ONBOARDING_KEYS.STEP, String(safeStep));
  };

  const setOnboardingChemicals = (value) => {
    const safeChemicals = Array.isArray(value) ? value : [];

    setOnboardingChemicalsState(safeChemicals);
    localStorage.setItem(
      ONBOARDING_KEYS.CHEMICALS,
      JSON.stringify(safeChemicals),
    );
  };

  const value = useMemo(
    () => ({
      companyId,
      currentStep,
      isHydrated,
      onboardingChemicals,
      setCompanyId,
      setCurrentStep,
      setOnboardingChemicals,
    }),
    [companyId, currentStep, isHydrated, onboardingChemicals],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
