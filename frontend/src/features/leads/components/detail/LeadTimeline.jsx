import { memo, useMemo } from "react";

import { formatLeadDate } from "../../utils/leadDisplayUtils";
import {
  getLeadTimelineItems,
  timelineIconMap,
} from "../../utils/leadTimelineUtils";

const LeadTimeline = ({ lead }) => {
  const items = useMemo(() => getLeadTimelineItems(lead), [lead]);

  return (
    <section className="lead-detail-card">
      <div className="lead-detail-card-header">
        <h3>Conversation Timeline</h3>
        <span>Calls, notes, quotations, and buyer touchpoints</span>
      </div>

      <div className="lead-timeline">
        {items.map((item) => (
          <article key={item.id} className={`lead-timeline-item ${item.type}`}>
            <span className="lead-timeline-icon">
              <i className={`bi ${timelineIconMap[item.type]}`} aria-hidden="true"></i>
            </span>
            <div>
              <div className="lead-timeline-title-row">
                <strong>{item.title}</strong>
                <span>{formatLeadDate(item.timestamp)}</span>
              </div>
              <p>{item.description}</p>
              <small>{item.user}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default memo(LeadTimeline);
