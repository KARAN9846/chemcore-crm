import { formatQuotationDate } from "../../utils/quotationDisplayUtils";

const QuotationTradeTerms = ({ quotation }) => {
  const fields = [
    ["Quotation No.", quotation.quotationNumber],
    ["Quotation Date", formatQuotationDate(quotation.quotationDate)],
    ["Valid Until", formatQuotationDate(quotation.validUntil)],
    ["Currency", quotation.currency],
    ["Incoterm", quotation.incoterm],
    ["Port of Loading", quotation.loadingPort],
    ["Port of Destination", quotation.dischargePort],
    ["Payment Terms", quotation.paymentTerms],
    ["Packaging", quotation.packagingDetails],
    ["Prepared By", quotation.metadata?.createdBy],
    ["Client Email", quotation.clientEmail],
  ];

  return (
    <section className="quotation-section">
      <header className="quotation-section-header">
        <span className="quotation-section-icon">
          <i className="bi bi-info-circle-fill" aria-hidden="true"></i>
        </span>
        <div>
          <h2>Quotation Details</h2>
          <p>Client, validity, payment, port and packaging information.</p>
        </div>
      </header>
      <div className="quotation-detail-fields">
        {fields.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value || "-"}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuotationTradeTerms;
