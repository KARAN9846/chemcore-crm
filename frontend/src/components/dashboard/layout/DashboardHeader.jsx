const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div>
        <div className="dashboard-header-title-row">
          <h1>Admin Dashboard</h1>
          <span className="dashboard-role-pill">
            <i className="bi bi-shield-fill-check" aria-hidden="true"></i>
            Administrator
          </span>
        </div>
      </div>

      <div className="dashboard-header-meta">
        <p>
          Welcome back, <strong>Admin</strong> - ArchemCore Industries
        </p>
        <button type="button" className="dashboard-range-button">
          <i className="bi bi-calendar3" aria-hidden="true"></i>
          This Month
          <i className="bi bi-chevron-down" aria-hidden="true"></i>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
