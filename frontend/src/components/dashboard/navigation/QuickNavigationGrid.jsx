import { Link } from "react-router-dom";

import DashboardPanel from "../common/DashboardPanel";

const QuickNavigationGrid = ({ links = [] }) => {
  if (!links?.length) {
    return null;
  }

  return (
    <DashboardPanel
      title="Quick Navigation"
      titleIcon="bi-lightning-fill"
      titleIconStyle={{ color: "var(--gold)" }}
    >
      <div className="dashboard-navigation-grid">
        {links.map((link) => (
          <Link
            key={link.id}
            to={link.path}
            className="dashboard-navigation-card"
          >
            <span className="dashboard-navigation-icon">
              {link.htmlSymbol ? (
                <span aria-hidden="true">{link.htmlSymbol}</span>
              ) : (
                <i className={`bi ${link.icon}`} aria-hidden="true"></i>
              )}
            </span>

            <span className="dashboard-navigation-content">
              <strong>{link.label}</strong>
            </span>
          </Link>
        ))}
      </div>
    </DashboardPanel>
  );
};

export default QuickNavigationGrid;
