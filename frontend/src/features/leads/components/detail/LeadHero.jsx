import { memo } from "react";
import { Link } from "react-router-dom";

import StatusBadge from "../../../../components/dashboard/common/StatusBadge";
import { formatLeadValue, getScoreVariant } from "../../utils/leadDisplayUtils";
import { getLeadInitials } from "../../utils/leadStatusUtils";

const LeadHero = ({ lead, onLogConversation }) => {
  const contactName = [lead.firstName, lead.lastName].filter(Boolean).join(" ");
  const tradeTags = [
    lead.country,
    lead.incoterm,
    ...(lead.paymentTerms ?? []),
    lead.source,
  ].filter(Boolean);

  return (
    <section className="lead-detail-hero">
      <div className="lead-detail-avatar">{getLeadInitials(lead)}</div>
      <div className="lead-detail-hero-main">
        <div className="lead-detail-hero-topline">
          <h2>{contactName || lead.companyName}</h2>
          <StatusBadge
            label={`${lead.leadScore} ${lead.scoreLabel}`}
            variant={getScoreVariant(lead.scoreLabel)}
          />
        </div>
        <p>
          {lead.companyName}
          {lead.designation ? ` - ${lead.designation}` : ""}
          {lead.country ? ` - ${lead.country}` : ""}
        </p>
        <div className="lead-detail-tags">
          <span className="lead-detail-hot-tag">
            {lead.scoreLabel === "Hot" ? "Hot Lead" : `${lead.scoreLabel} Lead`}
          </span>
          {(lead.chemicals ?? []).map((chemical) => (
            <span key={chemical}>
              <i className="bi bi-droplet" aria-hidden="true"></i>
              {chemical}
            </span>
          ))}
          {tradeTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="lead-detail-hero-side">
        <div className="lead-detail-hero-value">
          <span>Estimated Value</span>
          <strong>{formatLeadValue(lead.estimatedValue, lead.currency)}</strong>
        </div>
        <div className="lead-detail-hero-actions">
          <Link to="/dashboard/quotations/new" className="lead-button lead-button-primary">
            <i className="bi bi-file-plus" aria-hidden="true"></i>
            Create Quotation
          </Link>
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
        </div>
      </div>
    </section>
  );
};

export default memo(LeadHero);
