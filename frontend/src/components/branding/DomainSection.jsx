import { useEffect, useState } from "react";

const sanitizeSubdomain = (value) =>
  value.toLowerCase().replace(/[^a-z0-9-]/g, "");

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const DOMAIN_CHECK_URL = `${BASE_URL}/api/domain/check`;

const DomainSection = ({ form, onChange, onBlur }) => {
  const subdomain = sanitizeSubdomain(form.subdomain || "");
  const [isChecking, setIsChecking] = useState(false);
  const [domainStatus, setDomainStatus] = useState(null);

  useEffect(() => {
    if (!subdomain) {
      setIsChecking(false);
      setDomainStatus(null);
      return undefined;
    }

    if (subdomain.length < 3) {
      setIsChecking(false);
      setDomainStatus(null);
      return undefined;
    }

    setDomainStatus(null);
    setIsChecking(true);
    let currentRequest = true;

    const timeoutId = window.setTimeout(async () => {
      try {
        if (!currentRequest) {
          return;
        }

        const response = await fetch(
          `${DOMAIN_CHECK_URL}?name=${encodeURIComponent(subdomain)}`,
        );
        const data = await response.json();

        if (!currentRequest) {
          return;
        }

        setDomainStatus(data.available ? "available" : "taken");
      } catch (error) {
        console.error("ERROR:", error);
        if (!currentRequest) {
          return;
        }

        setDomainStatus("error");
      } finally {
        if (currentRequest) {
          setIsChecking(false);
        }
      }
    }, 400);

    return () => {
      currentRequest = false;
      window.clearTimeout(timeoutId);
    };
  }, [subdomain]);

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
              isChecking
                ? "checking"
                : domainStatus === "taken"
                  ? "taken"
                  : domainStatus === "available"
                    ? "available"
                    : ""
            }`}
          >
            {isChecking ? (
              <>
                <i className="bi bi-hourglass-split"></i>
                {`${subdomain}.chemcore.app checking...`}
              </>
            ) : domainStatus === "error" ? (
              <>
                <i className="bi bi-exclamation-circle-fill"></i>
                Unable to check domain right now
              </>
            ) : domainStatus === "taken" ? (
              <>
                <i className="bi bi-x-circle-fill"></i>
                {`${subdomain}.chemcore.app is taken`}
              </>
            ) : domainStatus === "available" ? (
              <>
                <i className="bi bi-check-circle-fill"></i>
                {`${subdomain}.chemcore.app is available`}
              </>
            ) : null}
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
