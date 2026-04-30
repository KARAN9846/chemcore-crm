import TopBar from "../../components/layout/TopBar";
import HeroSection from "../../components/onboarding/landing/HeroSection";
import StepsSection from "../../components/onboarding/landing/StepsSection";
import FeaturesSection from "../../components/onboarding/landing/FeaturesSection";
import CTASection from "../../components/onboarding/landing/CTASection";
import Footer from "../../components/layout/Footer";

const OnboardingStart = () => {
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
