import { memo, useEffect } from "react";

import { getLeadInitials } from "../../utils/leadStatusUtils";
import { getRecentActivities } from "../../utils/activityTimelineUtils";
import LeadActivityCard from "./LeadActivityCard";
import LeadActivityEmptyState from "./LeadActivityEmptyState";
import LeadActivityForm from "./LeadActivityForm";

const getLeadName = (lead = {}) =>
  [lead.firstName, lead.lastName].filter(Boolean).join(" ") ||
  lead.companyName ||
  "Lead";

const LeadActivityDrawer = ({
  activities = [],
  companyId,
  isOpen,
  lead,
  onActivityCreated,
  onClose,
}) => {
  const recentActivities = getRecentActivities(activities, 3);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="lead-activity-drawer-shell" role="presentation">
      <button
        type="button"
        className="lead-followup-backdrop lead-activity-backdrop"
        aria-label="Close activity drawer"
        onClick={onClose}
      ></button>

      <aside
        className="lead-followup-drawer lead-activity-drawer"
        aria-label="Log conversation"
      >
        <header className="lead-followup-drawer-header">
          <div>
            <h2>
              <i className="bi bi-chat-dots-fill" aria-hidden="true"></i>
              Log Conversation
            </h2>
            <div className="lead-followup-lead-info">
              <div className="lead-detail-avatar">{getLeadInitials(lead)}</div>
              <div>
                <strong>{getLeadName(lead)}</strong>
                <span>
                  {lead.companyName}
                  {lead.country ? ` - ${lead.country}` : ""}
                  {lead.scoreLabel ? ` - ${lead.scoreLabel}` : ""}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="lead-followup-close"
            aria-label="Close activity drawer"
            onClick={onClose}
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </header>

        <div className="lead-followup-drawer-body lead-activity-drawer-body">
          <LeadActivityForm
            companyId={companyId}
            currentStage={lead.currentStage || lead.status}
            lead={lead}
            publicId={lead.publicId}
            onCancel={onClose}
            onCreated={onActivityCreated}
          />

          <section className="lead-activity-recent">
            <div className="lead-followup-divider">Previous Conversations</div>
            <div className="lead-activity-recent-header">
              <strong>Last 3 conversations</strong>
              <span>{activities.length} total</span>
            </div>
            {recentActivities.length ? (
              <div className="lead-activity-recent-list">
                {recentActivities.map((activity) => (
                  <LeadActivityCard
                    key={activity.publicId}
                    activity={activity}
                    compact
                  />
                ))}
              </div>
            ) : (
              <LeadActivityEmptyState compact />
            )}
          </section>
        </div>
      </aside>
    </div>
  );
};

export default memo(LeadActivityDrawer);
