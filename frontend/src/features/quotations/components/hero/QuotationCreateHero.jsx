import { formatQuotationMoney } from "../../utils/quotationCalculations";
import {
  getMarginHealthTitle,
} from "../../utils/quotationMarginUtils";

const getClientTitle = (client) =>
  [client.name, client.company].filter(Boolean).join(" - ") ||
  "Select a lead to begin";

const getValidityLabel = (quotationInfo) => {
  if (!quotationInfo.validUntil) {
    return "Validity not set";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const validUntil = new Date(`${quotationInfo.validUntil}T00:00:00`);
  const daysLeft = Math.ceil((validUntil - today) / 86400000);

  if (Number.isNaN(daysLeft)) {
    return "Validity not set";
  }

  if (daysLeft < 0) {
    return "Expired";
  }

  if (daysLeft === 0) {
    return "Expires today";
  }

  return `Valid for ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
};

const QuotationCreateHero = ({
  mode = "create",
  marginSnapshot,
  quotationForm,
  subtitle,
  title = "Create Quotation",
  totals,
  warnings = [],
}) => {
  const { client, quotationInfo, tradeTerms } = quotationForm;
  const selectedChemical = quotationForm.lineItems
    .map((item) => item.chemical)
    .find(Boolean);
  const tags = [
    selectedChemical,
    tradeTerms.incoterm,
    tradeTerms.loadingPort,
    tradeTerms.paymentTerm,
    client.country,
  ].filter(Boolean);

  return (
    <section className="quotation-create-hero">
      <div className="quotation-create-hero-main">
        <div className="quotation-create-kicker">
          <span className="quotation-status-pill draft">
            <i className="bi bi-pencil-square" aria-hidden="true"></i>
            {mode === "revise" ? "Revision draft" : "Draft quotation"}
          </span>
          <span>{quotationInfo.reference || "Reference generated on save"}</span>
        </div>

        <h1>{title}</h1>
        <p>{subtitle || getClientTitle(client)}</p>

        <div className="quotation-hero-tags">
          {tags.length ? (
            tags.slice(0, 5).map((tag) => (
              <span key={tag} className="quotation-hero-tag">
                {tag}
              </span>
            ))
          ) : (
            <span className="quotation-hero-tag muted">Lead, trade terms, and chemicals appear here</span>
          )}
        </div>
      </div>

      <div className="quotation-create-hero-side">
        <span className="quotation-hero-value-label">Total Quotation Value</span>
        <strong>{formatQuotationMoney(totals.grandTotal, quotationInfo.currency)}</strong>
        <div className="quotation-hero-metrics">
          <span>{quotationInfo.currency}</span>
          <span>{marginSnapshot.marginPercent.toFixed(1)}% margin</span>
          <span>{getMarginHealthTitle(marginSnapshot.marginHealth)}</span>
        </div>
        <div className="quotation-hero-validity">
          <i className="bi bi-clock-fill" aria-hidden="true"></i>
          {getValidityLabel(quotationInfo)}
        </div>
      </div>

      {warnings.length ? (
        <div className="quotation-hero-warning">
          <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
          {warnings[0]}
        </div>
      ) : null}
    </section>
  );
};

export default QuotationCreateHero;
