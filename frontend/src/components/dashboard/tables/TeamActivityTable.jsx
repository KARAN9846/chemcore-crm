import DashboardPanel from "../common/DashboardPanel";

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const roleClassByLabel = {
  Sales: "sales",
  Operations: "operations",
  Accounts: "accounts",
};

const getRoleLabel = (member) => member.department || member.role;

const getRoleClass = (member) =>
  roleClassByLabel[getRoleLabel(member)] || "neutral";

const TeamActivityTable = ({ rows = [] }) => {
  if (!rows?.length) {
    return null;
  }

  return (
    <DashboardPanel
      title="Team Activity"
      titleIcon="bi-people-fill"
      actionText="Full log"
      actionLink="/dashboard/team"
    >
      <div className="dashboard-table-wrap dashboard-team-activity-wrap">
        <table className="dashboard-table dashboard-team-activity-table">
          <thead>
            <tr>
              <th scope="col">User</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col">Today's Actions</th>
              <th scope="col">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="dashboard-team-member">
                    <span
                      className="dashboard-team-avatar"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {getInitials(member.name)}
                    </span>
                    <strong>{member.name}</strong>
                  </div>
                </td>
                <td>
                  <span
                    className={`dashboard-team-role-badge ${getRoleClass(
                      member,
                    )}`}
                  >
                    {getRoleLabel(member)}
                  </span>
                </td>
                <td>
                  <span className="dashboard-team-status">
                    <span
                      className={`dashboard-team-status-dot ${member.statusVariant}`}
                      aria-hidden="true"
                    />
                    {member.status}
                  </span>
                </td>
                <td>
                  <span className="dashboard-team-activity-badge">
                    {member.actionsToday} actions
                  </span>
                </td>
                <td>{member.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
};

export default TeamActivityTable;
