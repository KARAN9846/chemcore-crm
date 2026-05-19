import { Link } from "react-router-dom";

const LeadEmptyState = ({ message = "Lead not found" }) => {
  return (
    <section className="lead-detail-empty">
      <i className="bi bi-search" aria-hidden="true"></i>
      <h2>{message}</h2>
      <p>The lead may have been removed, or the link may be incorrect.</p>
      <Link to="/dashboard/leads" className="lead-button lead-button-primary">
        View All Leads
      </Link>
    </section>
  );
};

export default LeadEmptyState;
