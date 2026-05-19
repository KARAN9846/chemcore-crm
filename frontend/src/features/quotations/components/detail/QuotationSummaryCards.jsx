import {
  formatQuotationMoney,
  formatQuotationPercent,
} from "../../utils/quotationDisplayUtils";

const QuotationSummaryCards = ({ quotation }) => {
  const cards = [
    {
      label: "Subtotal",
      value: formatQuotationMoney(quotation.subtotal, quotation.currency),
    },
    {
      label: "Grand Total",
      value: formatQuotationMoney(quotation.grandTotal, quotation.currency),
      highlight: true,
    },
    {
      label: "Gross Profit",
      value: formatQuotationMoney(quotation.grossProfit, quotation.currency),
    },
    {
      label: "Margin",
      value: formatQuotationPercent(quotation.marginPercent),
    },
  ];

  return (
    <section className="quotation-summary-grid">
      {cards.map((card) => (
        <article
          key={card.label}
          className={`quotation-summary-card ${card.highlight ? "highlight" : ""}`}
        >
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
};

export default QuotationSummaryCards;
