import DashboardPanel from "../common/DashboardPanel";

const SystemHealthPanel = ({ services = [] }) => {
  if (!services?.length) {
    return null;
  }

  return (
    <DashboardPanel
      title="System Health"
      titleIcon="bi-heart-pulse-fill"
      titleIconStyle={{ color: "#ef4444" }}
      actionText="Logs"
      actionLink="/dashboard/system"
    >
      <div className="dashboard-system-health-list">
        {services.map((service) => (
          <article key={service.id} className="dashboard-system-health-row">
            <div className="dashboard-system-health-service">
              <span className={`dashboard-system-health-dot ${service.status}`} />
              <strong>{service.service}</strong>
            </div>

            <strong className={`dashboard-system-health-state ${service.status}`}>
              {service.summary}
            </strong>
          </article>
        ))}
      </div>
      <div className="dashboard-subscription-block">
        <div className="dashboard-subscription-kicker">Subscription</div>
        <div className="dashboard-subscription-plan">
          <span>Growth Plan</span>
          <span>Active</span>
        </div>
        <div className="dashboard-subscription-meta">
          6 of 10 seats used &middot; Renews May 1, 2026
        </div>
        <div className="dashboard-subscription-progress" aria-hidden="true">
          <div />
        </div>
        <a href="/dashboard/settings/billing" className="dashboard-subscription-link">
          Manage subscription <span aria-hidden="true">→</span>
        </a>
      </div>
    </DashboardPanel>
  );
};

export default SystemHealthPanel;
