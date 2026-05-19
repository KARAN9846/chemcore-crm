import { Outlet, useLocation } from "react-router-dom";

import DashboardHeader from "../components/dashboard/layout/DashboardHeader";
import DashboardNavbar from "../components/dashboard/layout/DashboardNavbar";

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const showDashboardHeader = pathname === "/dashboard";

  return (
    <div className="dashboard-layout">
      <DashboardNavbar />

      <div className="dashboard-shell">
        {showDashboardHeader && <DashboardHeader />}

        <main className="dashboard-main" aria-label="Dashboard content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
