import { formatQuotationDate } from "../../utils/quotationDisplayUtils";

const QuotationHero = ({ quotation }) => (
  <section className="quotation-detail-hero">
    <div>
      <span className="quotation-detail-kicker">Quotation</span>
      <h2>{quotation.quotationNumber}</h2>
      <p>
        {quotation.clientName} - {quotation.companyName || "Company not specified"}
      </p>
    </div>
    <div className="quotation-detail-hero-meta">
      <span>{quotation.status}</span>
      <strong>{formatQuotationDate(quotation.quotationDate)}</strong>
      <small>Valid until {formatQuotationDate(quotation.validUntil)}</small>
    </div>
  </section>
);

export default QuotationHero;
