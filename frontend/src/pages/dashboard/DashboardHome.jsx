import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import QuickActions from "../../components/dashboard/actions/QuickActions";
import AlertBanner from "../../components/dashboard/alerts/AlertBanner";
import BusinessOverviewChart from "../../components/dashboard/charts/BusinessOverviewChart";
import QuickNavigationGrid from "../../components/dashboard/navigation/QuickNavigationGrid";
import RecentOrdersList from "../../components/dashboard/orders/RecentOrdersList";
import ModuleUsagePanel from "../../components/dashboard/panels/ModuleUsagePanel";
import SystemHealthPanel from "../../components/dashboard/panels/SystemHealthPanel";
import StatsGrid from "../../components/dashboard/stats/StatsGrid";
import TeamActivityTable from "../../components/dashboard/tables/TeamActivityTable";
import { getDashboardData } from "../../services/dashboard/dashboardService";
import { getCompanyId } from "../../utils/company";
import { resetOnboarding } from "../../utils/resetOnboarding";

const emptyDashboardData = {
  alerts: [],
  quickActions: [],
  stats: [],
  businessOverview: null,
  moduleUsage: [],
  teamActivity: [],
  systemHealth: [],
  quickNavigation: [],
  recentOrders: [],
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(emptyDashboardData);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      const nextDashboardData = await getDashboardData();

      if (!isMounted) {
        return;
      }

      setDashboardData(nextDashboardData);
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDevReset = async () => {
    const activeCompanyId = getCompanyId();

    if (activeCompanyId) {
      try {
        await api.post(`/dev/reset-onboarding/${activeCompanyId}`);
      } catch (error) {
        console.error("Dev onboarding reset failed:", error);
      }
    }

    resetOnboarding();
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="dashboard-home dashboard-home-static">
      <AlertBanner alerts={dashboardData.alerts} />
      <QuickActions actions={dashboardData.quickActions} />

      <StatsGrid stats={dashboardData.stats} />

      <section className="dashboard-home-row dashboard-home-analytics-row">
        <BusinessOverviewChart data={dashboardData.businessOverview} />
        <ModuleUsagePanel modules={dashboardData.moduleUsage} />
      </section>

      <section className="dashboard-home-row dashboard-home-operational-row">
        <TeamActivityTable rows={dashboardData.teamActivity} />
        <SystemHealthPanel services={dashboardData.systemHealth} />
        <QuickNavigationGrid links={dashboardData.quickNavigation} />
      </section>

      <section className="dashboard-home-row dashboard-home-full-row">
        <RecentOrdersList orders={dashboardData.recentOrders} />
      </section>

      {import.meta.env.DEV ? (
        <section className="dashboard-dev-utility" aria-label="Development tools">
          <button
            type="button"
            onClick={handleDevReset}
            className="dashboard-reset-button"
          >
            Reset Onboarding
          </button>
        </section>
      ) : null}
    </div>
  );
};

export default DashboardHome;
