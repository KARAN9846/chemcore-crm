import { memo } from "react";

const LeadActivityEmptyState = ({ compact = false }) => (
  <div className={`lead-activity-empty ${compact ? "compact" : ""}`}>
    <i className="bi bi-chat-dots" aria-hidden="true"></i>
    <strong>No conversations logged yet</strong>
    <span>Calls, emails, meetings, notes, and quotation touchpoints will appear here.</span>
  </div>
);

export default memo(LeadActivityEmptyState);
