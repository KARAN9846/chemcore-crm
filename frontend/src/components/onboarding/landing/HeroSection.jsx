import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="hero-section">
      <div className="hero-badge">
        <i className="bi bi-stars"></i> Setup Wizard · Takes only 5 minutes
      </div>

      <h1 className="hero-title">
        Welcome to <span>ChemCore CRM</span>
      </h1>

      <p className="hero-sub">
        The complete chemical export management platform. Let's set up your
        workspace — your team, your chemicals, your suppliers — in just a few
        steps.
      </p>

      <button
        className="hero-btn"
        onClick={() => navigate("/onboarding/step1")}
      >
        Start Setup
      </button>
    </div>
  );
};

export default HeroSection;
