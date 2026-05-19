import { Link } from "react-router-dom";

const QuickActions = ({ actions = [] }) => {
  if (!actions.length) {
    return null;
  }

  return (
    <section className="dashboard-quick-actions" aria-label="Quick actions">
      {actions.map((action) => (
        <Link
          key={action.id}
          to={action.path}
          className={`dashboard-quick-action ${action.variant}`}
        >
          <span className="dashboard-quick-action-icon">
            <i className={`bi ${action.icon}`} aria-hidden="true"></i>
          </span>
          <span>{action.label}</span>
        </Link>
      ))}
    </section>
  );
};

export default QuickActions;
