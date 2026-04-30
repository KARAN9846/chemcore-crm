const InviteStats = ({ members }) => {
  const invitedCount = members.filter(
    (member) => member.name || member.email || member.role,
  ).length;
  const salesCount = members.filter((member) => member.role === "Sales").length;
  const opsCount = members.filter(
    (member) => member.role === "Operations",
  ).length;
  const accountsCount = members.filter(
    (member) => member.role === "Accounts",
  ).length;

  return (
    <div className="invite-stats">
      <div className="stat-pill">
        <i className="bi bi-people"></i> {invitedCount} invited
      </div>

      {salesCount > 0 ? (
        <div className="stat-pill sales-stat">
          <i className="bi bi-graph-up"></i> {salesCount} Sales
        </div>
      ) : null}

      {opsCount > 0 ? (
        <div className="stat-pill ops-stat">
          <i className="bi bi-truck"></i> {opsCount} Ops
        </div>
      ) : null}

      {accountsCount > 0 ? (
        <div className="stat-pill acc-stat">
          <i className="bi bi-cash-stack"></i> {accountsCount} Accounts
        </div>
      ) : null}
    </div>
  );
};

export default InviteStats;
