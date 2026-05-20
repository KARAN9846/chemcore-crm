import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/layout/TopBar";
import HeroSection from "../../components/onboarding/landing/HeroSection";
import StepsSection from "../../components/onboarding/landing/StepsSection";
import FeaturesSection from "../../components/onboarding/landing/FeaturesSection";
import CTASection from "../../components/onboarding/landing/CTASection";
import Footer from "../../components/layout/Footer";
import { getOnboardingStatus } from "../../api/onboarding.api";
import { useOnboarding } from "../../context/useOnboarding";
import { getCompanyId } from "../../utils/company";
import { clearOnboardingStorage } from "../../utils/onboardingStorage";

const isMissingCompanyError = (error) =>
  error.response?.status === 404 &&
  error.response?.data?.message === "Company not found";

const OnboardingStart = () => {
  const navigate = useNavigate();
  const { setCompanyId, setCurrentStep, setOnboardingData } = useOnboarding();

  useEffect(() => {
    let isMounted = true;

    const resumeOnboarding = async () => {
      const activeCompanyId = getCompanyId();

      if (!activeCompanyId) {
        clearOnboardingStorage();
        setCompanyId(null);
        setCurrentStep(1);
        setOnboardingData(null);
        return;
      }

      try {
        const response = await getOnboardingStatus(activeCompanyId);
        const status = response?.data;

        if (!isMounted || !status) {
          return;
        }

        setCompanyId(String(status.companyId));
        setCurrentStep(status.onboarding_step);

        if (status.onboarding_completed) {
          navigate("/dashboard", { replace: true });
          return;
        }

        navigate(`/onboarding/step${status.onboarding_step}`, {
          replace: true,
        });
      } catch (error) {
        if (isMissingCompanyError(error)) {
          clearOnboardingStorage();
          setCompanyId(null);
          setCurrentStep(1);
          setOnboardingData(null);
          return;
        }

        console.error("Onboarding resume error:", error);
      }
    };

    resumeOnboarding();

    return () => {
      isMounted = false;
    };
  }, [navigate, setCompanyId, setCurrentStep, setOnboardingData]);

  return (
    <>
      <TopBar />
      <HeroSection />
      <StepsSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default OnboardingStart;
