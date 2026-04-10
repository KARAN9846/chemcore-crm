import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ONBOARDING_COMPANY_ID_KEY = "companyId";
const ONBOARDING_STEP_KEY = "onboardingStep";

const OnboardingContext = createContext(null);

const readCompanyId = () => localStorage.getItem(ONBOARDING_COMPANY_ID_KEY) || null;

const readCurrentStep = () => {
  const storedStep = Number(localStorage.getItem(ONBOARDING_STEP_KEY));
  return Number.isFinite(storedStep) && storedStep > 0 ? storedStep : 1;
};

export const OnboardingProvider = ({ children }) => {
  const [companyId, setCompanyIdState] = useState(() => readCompanyId());
  const [currentStep, setCurrentStepState] = useState(() => readCurrentStep());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setCompanyIdState(readCompanyId());
    setCurrentStepState(readCurrentStep());
    setIsHydrated(true);
  }, []);

  const setCompanyId = (value) => {
    setCompanyIdState(value);

    if (value) {
      localStorage.setItem(ONBOARDING_COMPANY_ID_KEY, value);
      return;
    }

    localStorage.removeItem(ONBOARDING_COMPANY_ID_KEY);
  };

  const setCurrentStep = (value) => {
    const nextStep = Number(value);
    const safeStep = Number.isFinite(nextStep) && nextStep > 0 ? nextStep : 1;

    setCurrentStepState(safeStep);
    localStorage.setItem(ONBOARDING_STEP_KEY, String(safeStep));
  };

  const value = useMemo(
    () => ({
      companyId,
      currentStep,
      isHydrated,
      setCompanyId,
      setCurrentStep,
    }),
    [companyId, currentStep, isHydrated],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }

  return context;
};
