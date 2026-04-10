const BrandingPreview = ({ form }) => {
  const accent = form.primaryColor || "#0d2b1a";
  const workspaceName = form.workspaceName || "Your CRM";
  const tagline = form.tagline || "";

  return (
    <div className="preview-container">
      <div className="preview-label">
        <i className="bi bi-eye"></i> Live Preview
      </div>

      <div className="preview-navbar">
        <div className="preview-nav-bar" style={{ background: accent }}>
          <div
            className="preview-logo-box"
            style={{ background: "rgba(255,255,255,.2)" }}
          >
            CC
          </div>

          <div>
            <div className="preview-company-name">{workspaceName}</div>
            <div className="preview-tagline">{tagline}</div>
          </div>

          <div className="preview-nav-items">
            <div className="preview-nav-item preview-nav-item-lg"></div>
            <div className="preview-nav-item preview-nav-item-md"></div>
            <div className="preview-nav-item preview-nav-item-sm"></div>
          </div>
        </div>

        <div className="preview-body">
          <div className="preview-card">
            <div
              className="preview-card-title"
              style={{ width: "80%", background: accent, opacity: 0.15 }}
            ></div>
            <div className="preview-card-line preview-line-90"></div>
            <div className="preview-card-line preview-line-70"></div>
            <div className="preview-btn" style={{ background: accent }}>
              Action
            </div>
          </div>
        </div>
      </div>

      <div className="preview-email">
        <div className="preview-email-header" style={{ background: accent }}>
          <div className="preview-email-logo">{workspaceName}</div>
        </div>

        <div className="preview-email-body">
          <div className="preview-email-line preview-line-90"></div>
          <div className="preview-email-line preview-line-75"></div>
          <div className="preview-email-line preview-line-85"></div>
          <div
            className="preview-email-btn"
            style={{ background: accent }}
          ></div>
        </div>
      </div>

      <div className="preview-note">
        <i className="bi bi-info-circle"></i>
        Preview updates as you change settings
      </div>
    </div>
  );
};

export default BrandingPreview;
