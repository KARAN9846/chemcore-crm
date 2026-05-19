const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  trendType = "neutral",
}) => {
  return (
    <article className={`dashboard-stat-card ${trendType}`}>
      <div className="dashboard-stat-card-top">
        <div className="dashboard-stat-icon">
          <i className={`bi ${icon}`} aria-hidden="true"></i>
        </div>

        {trend ? (
          <span className={`dashboard-stat-trend ${trendType}`}>{trend}</span>
        ) : null}
      </div>

      <div>
        <p className="dashboard-stat-title">{title}</p>
        <strong className="dashboard-stat-value">{value}</strong>
        {subtitle ? (
          <p className="dashboard-stat-subtitle">{subtitle}</p>
        ) : null}
      </div>
    </article>
  );
};

export default StatCard;
