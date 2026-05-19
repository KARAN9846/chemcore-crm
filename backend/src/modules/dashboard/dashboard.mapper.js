const cloneArray = (items = []) => items.map((item) => ({ ...item }));

export const mapDashboardStats = (stats = []) => cloneArray(stats);

export const mapDashboardAlerts = (alerts = []) => cloneArray(alerts);

export const mapBusinessOverview = (overview = {}) => ({
  ...overview,
  labels: [...(overview.labels || [])],
  revenue: [...(overview.revenue || [])],
  margin: [...(overview.margin || [])],
  orders: [...(overview.orders || [])],
});

export const mapTeamActivity = (members = []) => cloneArray(members);

export const mapSystemHealth = (services = []) => cloneArray(services);

export const mapRecentOrders = (orders = []) => cloneArray(orders);

export const mapModuleUsage = (modules = []) => cloneArray(modules);

export const mapQuickActions = (actions = []) => cloneArray(actions);

export const mapQuickNavigation = (links = []) => cloneArray(links);

export const mapDashboardOverview = (dashboard = {}) => ({
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
