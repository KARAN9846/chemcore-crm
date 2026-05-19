import { getThemeData } from "../../../utils/themeUtils";

const getName = (item) => (typeof item === "string" ? item : item?.name);

const SetupSummary = ({ company, branding, teamCount, chemicals, supplier }) => {
  const safeChemicals = Array.isArray(chemicals) ? chemicals : [];
  const workspaceDomain = branding?.domain || branding?.subdomain || "workspace";
  const theme = getThemeData(branding?.primary_color);
  const chemicalNames = safeChemicals.map(getName).filter(Boolean);
  const visibleChemicals = chemicalNames.slice(0, 3).join(", ");
  const moreChemicals = Math.max(chemicalNames.length - 3, 0);

  return (
    <div className="setup-summary">
      <div className="summary-title">
        <i className="bi bi-check2-all me-1"></i> What was set up
      </div>

      <div className="summary-items">
        <div className="summary-item">
          <div className="summary-check">
            <i className="bi bi-check-lg"></i>
          </div>
          <span>Company Profile</span>
          <em>
            -{" "}
            {company
              ? `${company.name || company.companyName || company.company_name} · ${
                  company.city || "City not set"
                }, ${company.country || "Country not set"}`
              : "Company details unavailable"}
          </em>
        </div>

        <div className="summary-item">
          <div className="summary-check">
            <i className="bi bi-check-lg"></i>
          </div>
          <span>Branding</span>
          <em>
            -{" "}
            {branding ? (
              <>
                <span
                  className="theme-dot"
                  style={{
                    backgroundColor: theme.color,
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    margin: "0 6px",
                  }}
                ></span>
                {theme.name}
                {theme.isCustom ? ` (${theme.color})` : ""} theme{" \u00b7 "}
                {workspaceDomain}.chemcore.app
              </>
            ) : (
              "Branding details unavailable"
            )}
          </em>
        </div>

        <div className="summary-item">
          <div className="summary-check">
            <i className="bi bi-check-lg"></i>
          </div>
          <span>Team Invites Sent</span>
          <em>- {teamCount || 0} members</em>
        </div>

        <div className="summary-item">
          <div className="summary-check">
            <i className="bi bi-check-lg"></i>
          </div>
          <span>Chemicals Added</span>
          <em>
            - {chemicalNames.length} chemicals
            {chemicalNames.length > 0
              ? `: ${visibleChemicals}${moreChemicals ? ` + ${moreChemicals} more` : ""}`
              : ""}
          </em>
        </div>

        <div className="summary-item">
          <div className="summary-check">
            <i className="bi bi-check-lg"></i>
          </div>
          <span>First Supplier</span>
          <em>
            -{" "}
            {supplier
              ? `${supplier.companyName || supplier.company_name} · ${
                  supplier.city || "City not set"
                }`
              : "No supplier added"}
          </em>
        </div>
      </div>
    </div>
  );
};

export default SetupSummary;
