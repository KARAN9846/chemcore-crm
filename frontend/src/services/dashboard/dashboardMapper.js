const cloneArray = (items = []) => items.map((item) => ({ ...item }));

const quickNavigationSymbols = {
  users: "👥",
  roles: "🔐",
  chemicals: "⚗️",
  branding: "🎨",
  templates: "📄",
  "api-keys": "🔌",
  "port-master": "🚢",
  billing: "💳",
  "quick-reports": "📊",
};

export const mapDashboardStats = (stats = []) => cloneArray(stats);

export const mapDashboardAlerts = (alerts = []) => cloneArray(alerts);

export const mapQuickActions = (actions = []) => cloneArray(actions);

export const mapBusinessOverview = (overview = {}) => {
  const source = overview || {};

  return {
    ...source,
    labels: [...(source.labels || [])],
    revenue: [...(source.revenue || [])],
    margin: [...(source.margin || [])],
    orders: [...(source.orders || [])],
  };
};

export const mapModuleUsage = (modules = []) => cloneArray(modules);

export const mapRecentOrders = (orders = []) => cloneArray(orders);

export const mapTeamActivity = (members = []) => cloneArray(members);

export const mapSystemHealth = (services = []) => cloneArray(services);

export const mapQuickNavigation = (links = []) =>
  links.map((link) => ({
    ...link,
    htmlSymbol: link.htmlSymbol || quickNavigationSymbols[link.id],
  }));

export const mapDashboardData = (dashboard = {}) => ({
  stats: mapDashboardStats(dashboard.stats),
  alerts: mapDashboardAlerts(dashboard.alerts),
  businessOverview: mapBusinessOverview(dashboard.businessOverview),
  teamActivity: mapTeamActivity(dashboard.teamActivity),
  systemHealth: mapSystemHealth(dashboard.systemHealth),
  recentOrders: mapRecentOrders(dashboard.recentOrders),
  moduleUsage: mapModuleUsage(dashboard.moduleUsage),
  quickActions: mapQuickActions(dashboard.quickActions),
  quickNavigation: mapQuickNavigation(dashboard.quickNavigation),
});
