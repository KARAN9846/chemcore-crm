import { memo } from "react";

import { formatLeadValue } from "../../utils/leadDisplayUtils";

const daysBetween = (date) => {
  if (!date) {
    return 0;
  }

  const created = new Date(date);
  const now = new Date();
  const diff = now.getTime() - created.getTime();

  return Math.max(0, Math.ceil(diff / 86400000));
};

const LeadStatsSidebar = ({ lead }) => {
  const stats = [
    { label: "Conversations", value: "0" },
    { label: "Quotations", value: "0" },
    { label: "Days in Pipeline", value: String(daysBetween(lead.createdAt)) },
    { label: "Lead Value", value: formatLeadValue(lead.estimatedValue, lead.currency) },
    { label: "Win Probability", value: `${Math.min(90, Math.max(15, lead.leadScore || 0))}%` },
  ];

  return (
    <section className="lead-detail-side-card">
      <div className="lead-detail-card-header">
        <h3>Lead Stats</h3>
        <span>CRM health</span>
      </div>
      <div className="lead-side-stat-grid">
        {stats.map((stat) => (
          <div key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(LeadStatsSidebar);
