const RoleCards = ({ roles }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          fontSize: "12px",
          fontWeight: "700",
          color: "var(--gray-700)",
          marginBottom: "10px",
          textTransform: "uppercase",
          letterSpacing: ".5px",
        }}
      >
        <i className="bi bi-shield-check me-1"></i> Available Roles
      </div>

      <div className="role-grid">
        {roles.map((role) => (
          <div key={role.value} className="role-card">
            <div className="role-icon">{role.icon}</div>
            <div className="role-name">{role.value}</div>
            <div className="role-desc">{role.description}</div>
            <span className={`role-badge ${role.badgeClass}`}>
              {role.badgeLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleCards;
