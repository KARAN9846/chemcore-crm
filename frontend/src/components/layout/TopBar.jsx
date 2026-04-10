import { Link } from "react-router-dom";

const TopBar = ({ variant }) => {
  if (variant === "secure") {
    return (
      <div className="top-bar">
        <Link to="/" className="logo">
          <div className="logo-icon">CC</div>
          <div className="logo-text">ChemCore CRM</div>
        </Link>

        <span className="secure-note">
          <i className="bi bi-lock-fill"></i>
          Secure Setup
        </span>
      </div>
    );
  }

  return (
    <div className="top-bar">
      <div className="logo">
        <div className="logo-icon">CC</div>
        <div className="logo-text-wrap">
          <div className="logo-text">ChemCore CRM</div>
          <div className="logo-sub">Chemical Export Management</div>
        </div>
      </div>

      <div className="top-bar-right">
        Already have an account? <a href="#">Sign In</a>
      </div>
    </div>
  );
};

export default TopBar;
