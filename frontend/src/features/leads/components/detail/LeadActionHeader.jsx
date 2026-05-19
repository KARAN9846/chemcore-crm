import { memo } from "react";
import { Link } from "react-router-dom";

const LeadActionHeader = ({ lead, onLogConversation }) => {
  const contactName = [lead.firstName, lead.lastName].filter(Boolean).join(" ");
  const leadTitle = [contactName, lead.companyName].filter(Boolean).join(" - ");

  return (
    <header className="lead-detail-action-header">
      <nav className="lead-breadcrumb" aria-label="Breadcrumb">
        <Link to="/dashboard/leads">
          <i className="bi bi-funnel" aria-hidden="true"></i>
          Leads
        </Link>
        <span className="lead-breadcrumb-separator">/</span>
        <span>{leadTitle}</span>
      </nav>

      <div className="lead-detail-actions">
        <button
          type="button"
          className="lead-button lead-button-secondary"
          onClick={onLogConversation}
        >
          <i className="bi bi-chat-dots" aria-hidden="true"></i>
          Log Conversation
        </button>
        <Link
          to={`/dashboard/leads/${lead.publicId}/follow-up`}
          className="lead-button lead-button-secondary"
        >
          <i className="bi bi-alarm" aria-hidden="true"></i>
          Set Follow-up
        </Link>
        <Link to="/dashboard/quotations/new" className="lead-button lead-button-primary">
          <i className="bi bi-file-plus" aria-hidden="true"></i>
          Create Quotation
        </Link>
        <Link
          to={`/dashboard/leads/${lead.publicId}/edit`}
          className="lead-button lead-button-secondary"
        >
          <i className="bi bi-pencil" aria-hidden="true"></i>
          Edit
        </Link>
        <button type="button" className="lead-button lead-button-danger">
          <i className="bi bi-x-circle" aria-hidden="true"></i>
          Close Lead
        </button>
      </div>
    </header>
  );
};

export default memo(LeadActionHeader);
