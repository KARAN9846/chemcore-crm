import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnboardingStart from "../pages/onboarding/OnboardingStart";
import Step1Company from "../pages/onboarding/Step1Company";
import Step2Branding from "../pages/onboarding/Step2Branding";
import Step3TeamInvite from "../pages/onboarding/Step3TeamInvite";
import Step4Chemicals from "../pages/onboarding/Step4Chemicals";
import Step5Supplier from "../pages/onboarding/Step5Supplier";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingStart />} />
        <Route path="/onboarding/step1" element={<Step1Company />} />
        <Route path="/onboarding/step2" element={<Step2Branding />} />
        <Route path="/onboarding/step3" element={<Step3TeamInvite />} />
        <Route path="/onboarding/step4" element={<Step4Chemicals />} />
        <Route path="/onboarding/step5" element={<Step5Supplier />} />
        <Route path="/onboarding/step6" element={<h1>Onboarding Complete</h1>} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
