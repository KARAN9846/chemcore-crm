import { NavLink } from "react-router-dom";

import { dashboardNavigation } from "../../../config/dashboardNavigation";

const DashboardNavbar = () => {
  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-inner">
        <div className="dashboard-navbar-brand">
          <div className="dashboard-navbar-logo">CC</div>
          <strong>ChemCore</strong>
        </div>

        <nav className="dashboard-nav-list" aria-label="Dashboard navigation">
          {dashboardNavigation.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "dashboard-nav-link active" : "dashboard-nav-link"
              }
              end={item.path === "/dashboard"}
            >
              <i className={`bi ${item.icon}`} aria-hidden="true"></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dashboard-navbar-actions">
          <button
            type="button"
            className="dashboard-navbar-icon-button"
            aria-label="Notifications"
          >
            <i className="bi bi-bell" aria-hidden="true"></i>
            <span className="dashboard-navbar-notification-dot"></span>
          </button>
          <div className="dashboard-navbar-avatar" aria-label="Admin user">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
