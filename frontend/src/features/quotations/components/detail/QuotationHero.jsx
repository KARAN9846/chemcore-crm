import {
  formatQuotationDate,
  formatQuotationMoney,
  formatQuotationPercent,
} from "../../utils/quotationDisplayUtils";

const getCountryFlag = (country = "") => {
  const normalizedCountry = country.toLowerCase();

  if (normalizedCountry.includes("kuwait")) return "KW";
  if (normalizedCountry.includes("india")) return "IN";
  if (normalizedCountry.includes("uae") || normalizedCountry.includes("emirates")) {
    return "AE";
  }
  if (normalizedCountry.includes("saudi")) return "SA";
  if (normalizedCountry.includes("oman")) return "OM";
  if (normalizedCountry.includes("qatar")) return "QA";

  return "";
};

const QuotationHero = ({ quotation }) => (
  <section className="quotation-detail-hero">
    <div className="quotation-detail-hero-main">
      <div className="quotation-detail-title-row">
        <h2>{quotation.quotationNumber}</h2>
        <span className="quotation-detail-version">
          v{quotation.versionNumber ?? 1}
          {quotation.isLatestVersion ? " - Current" : ""}
        </span>
      </div>
      <p>
        {quotation.clientName}
        {quotation.companyName ? ` - ${quotation.companyName}` : ""}
        {quotation.country ? ` - ${quotation.country}` : ""}
      </p>
      <div className="quotation-detail-tags">
        {quotation.incoterm ? (
          <span>
            <i className="bi bi-truck" aria-hidden="true"></i>
            {quotation.incoterm}
          </span>
        ) : null}
        {quotation.paymentTerms ? <span>{quotation.paymentTerms}</span> : null}
        {quotation.country ? (
          <span>
            {getCountryFlag(quotation.country)}
            {quotation.country}
          </span>
        ) : null}
      </div>
    </div>
    <div className="quotation-detail-hero-meta">
      <strong>{formatQuotationMoney(quotation.grandTotal, quotation.currency)}</strong>
      <span>Total Quotation Value</span>
      <small>
        Margin {formatQuotationPercent(quotation.marginPercent)} - Profit{" "}
        {formatQuotationMoney(quotation.grossProfit, quotation.currency)}
      </small>
      <small>
        Quote date {formatQuotationDate(quotation.quotationDate)}
      </small>
    </div>
  </section>
);

export default QuotationHero;
