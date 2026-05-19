import { memo } from "react";
import { Link } from "react-router-dom";

const mockQuotations = [
  { id: "draft", label: "Draft quotation", amount: "Pending" },
  { id: "history", label: "Quotation history", amount: "No quotes yet" },
];

const LeadQuotationsSidebar = () => {
  return (
    <section className="lead-detail-side-card">
      <div className="lead-detail-card-header">
        <h3>Related Quotations</h3>
        <span>Preview</span>
      </div>
      <div className="lead-quotation-list">
        {mockQuotations.map((quote) => (
          <div key={quote.id}>
            <strong>{quote.label}</strong>
            <span>{quote.amount}</span>
          </div>
        ))}
      </div>
      <Link to="/dashboard/quotations/new" className="lead-button lead-button-primary">
        Create Quotation
      </Link>
    </section>
  );
};

export default memo(LeadQuotationsSidebar);
