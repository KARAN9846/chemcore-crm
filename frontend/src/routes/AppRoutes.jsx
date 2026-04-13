import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnboardingStart from "../pages/onboarding/OnboardingStart";
import Step1Company from "../pages/onboarding/Step1Company";
import Step2Branding from "../pages/onboarding/Step2Branding";
import Step3TeamInvite from "../pages/onboarding/Step3TeamInvite";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingStart />} />
        <Route path="/onboarding/step-1" element={<Step1Company />} />
        <Route path="/onboarding/step-2" element={<Step2Branding />} />
        <Route path="/onboarding/step-3" element={<Step3TeamInvite />} />
        <Route path="/onboarding/team" element={<Step3TeamInvite />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
