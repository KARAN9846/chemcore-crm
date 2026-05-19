import DashboardPanel from "../common/DashboardPanel";

const ModuleUsagePanel = ({ modules = [] }) => {
  if (!modules?.length) {
    return null;
  }

  return (
    <DashboardPanel
      title="Module Usage - This Month"
      titleIcon="bi-bar-chart-steps"
      actionText="Detailed"
      actionLink="/dashboard/reports"
    >
      <div className="dashboard-module-usage-list">
        {modules.map((item) => (
          <article key={item.id} className="dashboard-module-usage-row">
            <div className="dashboard-module-usage-top">
              <div className="dashboard-module-usage-label">
                <h3>{item.module}</h3>
              </div>

              <div
                className="dashboard-module-usage-track"
                aria-label={`${item.module} usage ${item.usage}%`}
              >
                <span
                  className="dashboard-module-usage-bar"
                  style={{
                    width: `${item.usage}%`,
                    backgroundColor: item.color,
                  }}
                >
                  <span>{item.count} actions</span>
                </span>
              </div>

              <strong>{item.count}</strong>
            </div>
          </article>
        ))}
      </div>
    </DashboardPanel>
  );
};

export default ModuleUsagePanel;
