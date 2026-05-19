import { memo, useCallback, useEffect, useState } from "react";

import { getLeadActivities } from "../../api/leadActivities.api";
import LeadActivityCard from "./LeadActivityCard";
import LeadActivityEmptyState from "./LeadActivityEmptyState";

const LeadActivityTimeline = ({
  companyId,
  onActivitiesChange,
  publicId,
  refreshKey = 0,
}) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivities = useCallback(async () => {
    if (!companyId || !publicId) {
      setActivities([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await getLeadActivities(publicId, { companyId });
      const nextActivities = response.data ?? [];
      setActivities(nextActivities);
      onActivitiesChange?.(nextActivities);
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Unable to load lead activities";
      setError(message);
      onActivitiesChange?.([]);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, onActivitiesChange, publicId]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities, refreshKey]);

  return (
    <section className="lead-detail-card">
      <div className="lead-detail-card-header">
        <h3>
          <i className="bi bi-chat-dots-fill" aria-hidden="true"></i>
          Conversation Timeline
        </h3>
        <span>{activities.length} logs</span>
      </div>

      {isLoading ? (
        <div className="lead-activity-loading">
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : error ? (
        <div className="lead-submit-alert lead-submit-alert-error">
          <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
          {error}
        </div>
      ) : activities.length ? (
        <div className="lead-activity-timeline">
          {activities.map((activity) => (
            <LeadActivityCard key={activity.publicId} activity={activity} />
          ))}
        </div>
      ) : (
        <LeadActivityEmptyState />
      )}
    </section>
  );
};

export default memo(LeadActivityTimeline);
