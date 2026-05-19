import { Link } from "react-router-dom";

const DashboardPanel = ({
  title,
  titleIcon,
  titleIconStyle,
  actionText,
  actionLink,
  children,
}) => {
  return (
    <section className="dashboard-panel">
      {title || actionText ? (
        <header className="dashboard-panel-header">
          {title ? (
            <h2>
              {titleIcon ? (
                <i
                  className={`bi ${titleIcon}`}
                  style={titleIconStyle}
                  aria-hidden="true"
                ></i>
              ) : null}
              {title}
            </h2>
          ) : null}
          {actionText && actionLink ? (
            <Link to={actionLink} className="dashboard-panel-action">
              {actionText}
              <i className="bi bi-arrow-right" aria-hidden="true"></i>
            </Link>
          ) : null}
        </header>
      ) : null}

      <div className="dashboard-panel-body">{children}</div>
    </section>
  );
};

export default DashboardPanel;
