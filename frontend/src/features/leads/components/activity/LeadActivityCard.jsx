import { memo } from "react";

import {
  getActivityLabel,
  getActivityTypeConfig,
  getOutcomeVariant,
} from "../../utils/activityBadgeUtils";
import { formatActivityDateTime } from "../../utils/activityTimelineUtils";

const LeadActivityCard = ({ activity = {}, compact = false }) => {
  const activityType = getActivityLabel(activity.activityType, "Activity");
  const subject = getActivityLabel(activity.subject, activityType);
  const notes = getActivityLabel(activity.notes, "");
  const outcome = getActivityLabel(activity.outcome, "");
  const previousStage = getActivityLabel(activity.previousStage, "");
  const newStage = getActivityLabel(activity.newStage, "");
  const followUp = activity.followUp ?? {};
  const typeConfig = getActivityTypeConfig(activity.activityType);
  const outcomeVariant = getOutcomeVariant(outcome);
  const hasStageChange = previousStage && newStage;
  const hasFollowup = Boolean(followUp.date);

  return (
    <article className={`lead-activity-card ${compact ? "compact" : ""}`}>
      <span className={`lead-activity-icon ${typeConfig.variant}`}>
        <i className={`bi ${typeConfig.icon}`} aria-hidden="true"></i>
      </span>

      <div className="lead-activity-card-body">
        <div className="lead-activity-card-top">
          <div>
            <strong>{subject}</strong>
            <span>{activityType}</span>
          </div>
          <time>
            {formatActivityDateTime(activity.activityDate, activity.activityTime)}
          </time>
        </div>

        {notes ? <p>{notes}</p> : null}

        <div className="lead-activity-meta">
          {outcome ? (
            <span className={`lead-activity-outcome ${outcomeVariant}`}>
              {outcome}
            </span>
          ) : null}
          {hasStageChange ? (
            <span className="lead-activity-stage-change">
              {previousStage} <i className="bi bi-arrow-right"></i> {newStage}
            </span>
          ) : null}
          {hasFollowup ? (
            <span className="lead-activity-followup">
              <i className="bi bi-alarm"></i>
              {formatActivityDateTime(
                followUp.date,
                followUp.time,
              )}{" "}
              via {getActivityLabel(followUp.via, "follow-up")}
            </span>
          ) : null}
        </div>

        <small>{activity.createdBy || "Sales Team"}</small>
      </div>
    </article>
  );
};

export default memo(LeadActivityCard);
