import { useNavigate } from "react-router-dom";
const CTASection = () => {
  const navigate = useNavigate();
  return (
    <div className="cta-section">
      <h3>Ready to set up your workspace?</h3>
      <p>It takes less than 5 minutes. You can change everything later.</p>

      <button
        className="hero-btn"
        onClick={() => navigate("/onboarding/step-1")}
      >
        Begin Setup — Step 1 of 6
      </button>
    </div>
  );
};

export default CTASection;
