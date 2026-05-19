import { Link } from "react-router-dom";

const alertIcons = {
  success: "bi-check-circle",
  warning: "bi-exclamation-triangle",
  danger: "bi-x-octagon",
  info: "bi-info-circle",
};

const AlertBanner = ({ alerts = [] }) => {
  if (!alerts?.length) {
    return null;
  }

  return (
    <section className="dashboard-alert-banner" aria-label="Dashboard alerts">
      {alerts.map((alert) => {
        const variant = alert.type || "info";
        const icon = alertIcons[variant] || alertIcons.info;

        return (
          <article key={alert.id} className={`dashboard-alert ${variant}`}>
            <span className="dashboard-alert-icon">
              <i className={`bi ${icon}`} aria-hidden="true"></i>
            </span>

            <div className="dashboard-alert-content">
              <h2>{alert.title}</h2>
              <p>{alert.message}</p>
            </div>

            {alert.actionLabel && alert.actionPath ? (
              <Link to={alert.actionPath} className="dashboard-alert-action">
                {alert.actionLabel}
                <i className="bi bi-arrow-right" aria-hidden="true"></i>
              </Link>
            ) : null}
          </article>
        );
      })}
    </section>
  );
};

export default AlertBanner;
