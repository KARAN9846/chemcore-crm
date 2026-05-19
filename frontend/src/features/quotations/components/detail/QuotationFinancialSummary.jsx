import { formatQuotationMoney } from "../../utils/quotationDisplayUtils";

const QuotationFinancialSummary = ({ quotation }) => {
  const rows = [
    ["Subtotal", quotation.subtotal],
    ["Freight", quotation.freightTotal],
    ["Additional Charges", quotation.additionalCharges],
    ["Discount", quotation.discountTotal],
    ["Grand Total", quotation.grandTotal],
  ];

  return (
    <section className="quotation-section">
      <header className="quotation-section-header">
        <span className="quotation-section-icon">
          <i className="bi bi-calculator-fill" aria-hidden="true"></i>
        </span>
        <h2>Financial Summary</h2>
      </header>
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
