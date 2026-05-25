import {
  formatQuotationDate,
  formatQuotationMoney,
  formatQuotationPercent,
} from "../../utils/quotationDisplayUtils";

const getValidityLabel = (validUntil) => {
  if (!validUntil) {
    return "Validity date not set";
  }

  const today = new Date();
  const expiry = new Date(validUntil);
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const dayDiff = Math.ceil((expiry - today) / 86400000);

  if (dayDiff < 0) return `Expired ${Math.abs(dayDiff)} days ago`;
  if (dayDiff === 0) return "Expires today";
  if (dayDiff === 1) return "Expires tomorrow";
  return `Expires in ${dayDiff} days`;
};

const QuotationSummaryCards = ({ quotation }) => {
  const cards = [
    {
      icon: "bi-send-fill",
      label: "Status",
      value: quotation.status || "-",
    },
    {
      icon: "bi-clock-fill",
      label: getValidityLabel(quotation.validUntil),
      value: formatQuotationDate(quotation.validUntil),
      warning: true,
    },
    {
      icon: "bi-graph-up-arrow",
      label: "Gross Profit",
      value: formatQuotationMoney(quotation.grossProfit, quotation.currency),
    },
    {
      icon: "bi-percent",
      label: "Margin",
      value: formatQuotationPercent(quotation.marginPercent),
    },
  ];

  return (
    <section className="quotation-summary-grid">
      {cards.map((card) => (
        <article
          key={card.label}
          className={`quotation-summary-card ${card.warning ? "warning" : ""}`}
        >
          <span>
            <i className={`bi ${card.icon}`} aria-hidden="true"></i>
            {card.label}
          </span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
};

export default QuotationSummaryCards;
