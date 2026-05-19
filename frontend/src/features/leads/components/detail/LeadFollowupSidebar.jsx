import { memo } from "react";
import { Link } from "react-router-dom";

import { formatLeadDate } from "../../utils/leadDisplayUtils";
import { isFollowupOverdue } from "../../utils/leadStatusUtils";

const LeadFollowupSidebar = ({ lead }) => {
  const overdue = isFollowupOverdue(lead.followupDate);
  const followupLabel = overdue
    ? "Overdue"
    : lead.followupDate
      ? "Scheduled"
      : "Not Scheduled";

  return (
    <section className={`lead-detail-side-card ${overdue ? "urgent" : ""}`}>
      <div className="lead-detail-card-header">
        <h3>
          <i className="bi bi-alarm-fill" aria-hidden="true"></i>
          Next Follow-up
        </h3>
        <span>{followupLabel}</span>
      </div>
      <div className="lead-followup-card-body">
        <i className="bi bi-calendar2-check-fill" aria-hidden="true"></i>
        <div>
          <strong>{formatLeadDate(lead.followupDate)}</strong>
          <span>
            {lead.followupTime || "--:--"} - {lead.followupVia || "No channel"}
          </span>
        </div>
      </div>
      <Link
        to={`/dashboard/leads/${lead.publicId}/follow-up`}
        className="lead-button lead-button-primary"
      >
        <i className="bi bi-plus-circle" aria-hidden="true"></i>
        Update Follow-up
      </Link>
    </section>
  );
};

export default memo(LeadFollowupSidebar);
