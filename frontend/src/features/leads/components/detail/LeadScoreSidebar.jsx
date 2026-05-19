import { memo } from "react";

const getBreakdown = (lead) => [
  { label: "Contact Quality", value: lead.email && lead.phone ? 90 : 45 },
  { label: "Requirement Clarity", value: lead.quantityRequired ? 82 : 35 },
  { label: "Trade Readiness", value: lead.incoterm ? 76 : 28 },
  { label: "Follow-up Discipline", value: lead.followupDate ? 70 : 20 },
];

const LeadScoreSidebar = ({ lead }) => {
  const score = lead.leadScore ?? 0;
  const label = lead.scoreLabel ?? "Cold";

  return (
    <section className="lead-detail-side-card lead-score-side-card">
      <div className="lead-detail-card-header">
        <h3>Lead Score</h3>
        <span>{label}</span>
      </div>

      <div
        className={`lead-detail-score-circle ${label.toLowerCase()}`}
        style={{ "--lead-score": `${score}%` }}
      >
        <strong>{score}</strong>
        <span>{label}</span>
      </div>

      <div className="lead-score-breakdown">
        {getBreakdown(lead).map((item) => (
          <div key={item.label}>
            <div>
              <span>{item.label}</span>
              <strong>{item.value}%</strong>
            </div>
            <span className="lead-score-breakdown-track">
              <i style={{ width: `${item.value}%` }}></i>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(LeadScoreSidebar);
