import {
  mapBusinessOverview,
  mapDashboardAlerts,
  mapDashboardData,
  mapDashboardStats,
  mapModuleUsage,
  mapQuickActions,
  mapQuickNavigation,
  mapRecentOrders,
  mapSystemHealth,
  mapTeamActivity,
} from "./dashboardMapper";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const DASHBOARD_ENDPOINT = `${API_BASE}/api/dashboard`;

const emptyDashboardData = {
  stats: [],
  alerts: [],
  businessOverview: null,
  teamActivity: [],
  systemHealth: [],
  recentOrders: [],
  moduleUsage: [],
  quickActions: [],
  quickNavigation: [],
};

const normalizeDashboardResponse = (payload) => {
  if (!payload?.success || !payload.data) {
    throw new Error(payload?.message || "Dashboard response was not successful");
  }

  return mapDashboardData(payload.data);
};

export const getDashboardData = async () => {
  try {
    const response = await fetch(DASHBOARD_ENDPOINT);

    if (!response.ok) {
      throw new Error(`Dashboard request failed with ${response.status}`);
    }

    const payload = await response.json();
    return normalizeDashboardResponse(payload);
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return emptyDashboardData;
  }
};

export const getDashboardStats = async () => {
  const dashboard = await getDashboardData();
  return mapDashboardStats(dashboard.stats);
};

export const getDashboardAlerts = async () => {
  const dashboard = await getDashboardData();
  return mapDashboardAlerts(dashboard.alerts);
};

export const getQuickActions = async () => {
  const dashboard = await getDashboardData();
  return mapQuickActions(dashboard.quickActions);
};

export const getBusinessOverview = async () => {
  const dashboard = await getDashboardData();
  return mapBusinessOverview(dashboard.businessOverview);
};

export const getModuleUsage = async () => {
  const dashboard = await getDashboardData();
  return mapModuleUsage(dashboard.moduleUsage);
};

export const getRecentOrders = async () => {
  const dashboard = await getDashboardData();
  return mapRecentOrders(dashboard.recentOrders);
};

export const getTeamActivity = async () => {
  const dashboard = await getDashboardData();
  return mapTeamActivity(dashboard.teamActivity);
};

export const getSystemHealth = async () => {
  const dashboard = await getDashboardData();
  return mapSystemHealth(dashboard.systemHealth);
};

export const getQuickNavigation = async () => {
  const dashboard = await getDashboardData();
  return mapQuickNavigation(dashboard.quickNavigation);
};
