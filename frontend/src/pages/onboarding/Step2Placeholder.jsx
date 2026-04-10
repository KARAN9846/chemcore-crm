import "../../styles/onboarding-step1.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/layout/TopBar";
import ProgressBar from "../../components/onboarding/layout/ProgressBar";
import { useOnboarding } from "../../context/OnboardingContext";

const Step2Placeholder = () => {
  const navigate = useNavigate();
  const { companyId, currentStep, isHydrated } = useOnboarding();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!companyId || currentStep < 2) {
      navigate("/onboarding/step-1", { replace: true });
    }
  }, [companyId, currentStep, isHydrated, navigate]);

  if (!isHydrated || !companyId || currentStep < 2) {
    return null;
  }

  return (
    <>
      <TopBar variant="secure" />
      <ProgressBar />

      <div className="main-wrap">
        <div className="form-container">
          <div className="step-header">
            <div className="step-badge">Step 2</div>
            <h1 className="step-title">Step 2 is ready for the next build</h1>
            <p className="step-sub">
              Company details saved successfully. This placeholder keeps the
              onboarding flow moving cleanly while Step 2 is implemented.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step2Placeholder;
