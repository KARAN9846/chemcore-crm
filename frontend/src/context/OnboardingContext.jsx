import { useCallback, useMemo, useState } from "react";

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

const readOnboardingData = () => {
  try {
    const storedData = localStorage.getItem(ONBOARDING_KEYS.DATA);
    const parsedData = storedData ? JSON.parse(storedData) : {};

    return parsedData && typeof parsedData === "object" ? parsedData : {};
  } catch {
    return {};
  }
};

export const OnboardingProvider = ({ children }) => {
  const [companyId, setCompanyIdState] = useState(() => readCompanyId());
  const [currentStep, setCurrentStepState] = useState(() => readCurrentStep());
  const [onboardingChemicals, setOnboardingChemicalsState] = useState(() =>
    readChemicals(),
  );
  const [onboardingData, setOnboardingDataState] = useState(() =>
    readOnboardingData(),
  );
  const [isHydrated] = useState(true);

  const setCompanyId = useCallback((value) => {
    setCompanyIdState(value);

    if (value) {
      localStorage.setItem(ONBOARDING_KEYS.COMPANY, value);
      localStorage.setItem(ONBOARDING_KEYS.LEGACY_COMPANY, value);
      return;
    }

    localStorage.removeItem(ONBOARDING_KEYS.COMPANY);
    localStorage.removeItem(ONBOARDING_KEYS.LEGACY_COMPANY);
  }, []);

  const setCurrentStep = useCallback((value) => {
    const nextStep = Number(value);
    const safeStep = Number.isFinite(nextStep) && nextStep > 0 ? nextStep : 1;

    setCurrentStepState(safeStep);
    localStorage.setItem(ONBOARDING_KEYS.STEP, String(safeStep));
  }, []);

  const setOnboardingChemicals = useCallback((value) => {
    const safeChemicals = Array.isArray(value) ? value : [];

    setOnboardingChemicalsState(safeChemicals);
    localStorage.setItem(
      ONBOARDING_KEYS.CHEMICALS,
      JSON.stringify(safeChemicals),
    );
  }, []);

  const setOnboardingData = useCallback((value) => {
    setOnboardingDataState((prev) => {
      const nextData = typeof value === "function" ? value(prev) : value;

      if (!nextData) {
        localStorage.removeItem(ONBOARDING_KEYS.DATA);
        return {};
      }

      const safeData =
        nextData && typeof nextData === "object" ? nextData : {};

      localStorage.setItem(ONBOARDING_KEYS.DATA, JSON.stringify(safeData));
      return safeData;
    });
  }, []);

  const value = useMemo(
    () => ({
      companyId,
      currentStep,
      isHydrated,
      company: onboardingData.company || null,
      branding: onboardingData.branding || null,
      team: onboardingData.team || [],
      chemicals: onboardingData.chemicals || onboardingChemicals,
      supplier: onboardingData.supplier || null,
      onboardingChemicals,
      setCompanyId,
      setCurrentStep,
      setOnboardingChemicals,
      setOnboardingData,
    }),
    [
      companyId,
      currentStep,
      isHydrated,
      onboardingData,
      onboardingChemicals,
      setCompanyId,
      setCurrentStep,
      setOnboardingChemicals,
      setOnboardingData,
    ],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
