import DashboardPanel from "../common/DashboardPanel";
import StatusBadge from "../common/StatusBadge";

const WorkspaceHealth = ({ groups = [] }) => {
  if (!groups?.length) {
    return null;
  }

  return (
    <DashboardPanel
      title="Workspace Health"
      actionText="View Details"
      actionLink="/dashboard/reports"
    >
      <div className="dashboard-health-groups">
        {groups.map((group) => (
          <section key={group.title} className="dashboard-health-group">
            <h3>{group.title}</h3>
            <div className="dashboard-home-badges">
              {group.badges.map((badge) => (
                <StatusBadge
                  key={badge.id}
                  label={badge.label}
                  variant={badge.variant}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </DashboardPanel>
  );
};

export default WorkspaceHealth;
