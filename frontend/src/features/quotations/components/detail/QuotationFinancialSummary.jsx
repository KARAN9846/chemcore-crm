import {
  formatQuotationMoney,
  formatQuotationPercent,
} from "../../utils/quotationDisplayUtils";

const QuotationFinancialSummary = ({ quotation }) => {
  const rows = [
    ["Subtotal", quotation.subtotal],
    ["Freight", quotation.freightTotal],
    ["Additional Charges", quotation.additionalCharges],
    ["Discount", quotation.discountTotal],
    ["Grand Total", quotation.grandTotal],
  ];

  return (
    <section className="quotation-section quotation-margin-summary-card">
      <header className="quotation-section-header">
        <span className="quotation-section-icon">
          <i className="bi bi-graph-up-arrow" aria-hidden="true"></i>
        </span>
        <div>
          <h2>Margin Summary</h2>
          <p>Totals and profitability from the saved quotation.</p>
        </div>
      </header>
      <div className="quotation-margin-display compact">
        <div
          className="quotation-margin-circle excellent"
          style={{
            "--quotation-margin-progress": `${Math.max(
              0,
              Math.min(Number(quotation.marginPercent || 0), 100),
            )}%`,
          }}
        >
          <strong>{formatQuotationPercent(quotation.marginPercent)}</strong>
          <span>Gross Margin</span>
        </div>
      </div>
      <div className="quotation-financial-list">
        {rows.map(([label, value]) => (
          <div key={label} className={label === "Grand Total" ? "grand" : ""}>
            <span>{label}</span>
            <strong>{formatQuotationMoney(value, quotation.currency)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuotationFinancialSummary;
