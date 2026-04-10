const TAKEN_SUBDOMAINS = new Set([
  "demo",
  "admin",
  "app",
  "test",
  "dev",
  "archemcore-demo",
]);

const sanitizeSubdomain = (value) =>
  value.toLowerCase().replace(/[^a-z0-9-]/g, "");

const DomainSection = ({ form, onChange, onBlur }) => {
  const subdomain = sanitizeSubdomain(form.subdomain || "");
  const isAvailable = subdomain && !TAKEN_SUBDOMAINS.has(subdomain);
  const isTaken = subdomain && TAKEN_SUBDOMAINS.has(subdomain);

  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-globe2"></i> Custom Domain
        <span className="plan-badge">
          <i className="bi bi-star-fill"></i> Enterprise
        </span>
      </div>

      <div className="mb-3">
        <label className="form-label">Subdomain (ChemCore hosted)</label>
        <div className="domain-input-group">
          <span className="domain-prefix">https://</span>
          <input
            type="text"
            name="subdomain"
            className="form-control domain-input"
            placeholder="yourcompany"
            value={subdomain}
            onChange={(e) => onChange("subdomain", sanitizeSubdomain(e.target.value))}
            onBlur={() => onBlur("subdomain")}
          />
          <span className="domain-suffix">.chemcore.app</span>
        </div>

        {subdomain ? (
          <div
            className={`domain-status ${
              isTaken ? "taken" : isAvailable ? "available" : "checking"
            }`}
          >
            <i
              className={`bi ${
                isTaken ? "bi-x-circle-fill" : "bi-check-circle-fill"
              }`}
            ></i>
            {isTaken
              ? `${subdomain}.chemcore.app is taken`
              : `${subdomain}.chemcore.app is available`}
          </div>
        ) : null}
      </div>

      <div>
        <label className="form-label">
          Custom Domain{" "}
          <span className="plan-badge">
            <i className="bi bi-star-fill"></i> Enterprise
          </span>
        </label>
        <input
          type="text"
          name="customDomain"
          className="form-control"
          placeholder="crm.yourcompany.com"
          value={form.customDomain}
          onChange={(e) => onChange("customDomain", e.target.value)}
          onBlur={() => onBlur("customDomain")}
        />
        <div className="form-hint">
          Point your DNS CNAME to <strong>hosted.chemcore.app</strong> - setup
          guide sent after onboarding.
        </div>
      </div>
    </div>
  );
};

export default DomainSection;
