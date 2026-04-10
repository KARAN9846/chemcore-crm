import "../../styles/onboarding-step1.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/layout/TopBar";
import ProgressBar from "../../components/onboarding/layout/ProgressBar";
import { useOnboarding } from "../../context/OnboardingContext";

const Step3Placeholder = () => {
  const navigate = useNavigate();
  const { companyId, currentStep, isHydrated } = useOnboarding();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!companyId || currentStep < 3) {
      navigate("/onboarding/step-2", { replace: true });
    }
  }, [companyId, currentStep, isHydrated, navigate]);

  if (!isHydrated || !companyId || currentStep < 3) {
    return null;
  }

  return (
    <>
      <TopBar variant="secure" />
      <ProgressBar currentStep={3} />

      <div className="main-wrap">
        <div className="form-container">
          <div className="step-header">
            <div className="step-badge">Step 3</div>
            <h1 className="step-title">Step 3 is ready for the next build</h1>
            <p className="step-sub">
              Branding details saved successfully. This placeholder keeps the
              onboarding flow moving cleanly while Step 3 is implemented.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step3Placeholder;
