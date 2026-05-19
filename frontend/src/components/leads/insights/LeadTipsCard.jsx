const defaultHotLeadTips = [
  "Log conversations within 24 hours of every interaction",
  "Set a follow-up within 2-3 days of sending a quotation",
  "Note specific chemical grade and packaging requirements",
  "Record incoterm preference early -- it affects pricing",
];

const LeadTipsCard = ({ workflowHints }) => {
  const tips = workflowHints?.length ? workflowHints : defaultHotLeadTips;

  return (
    <section className="lead-insight-card lead-tips-card">
      <header className="lead-insight-card-header">
        <span className="lead-insight-icon lead-insight-icon-tips">
          <i className="bi bi-lightbulb" aria-hidden="true"></i>
        </span>
        <div>
          <h3>Tips for Hot Leads</h3>
          <p>Workflow guidance</p>
        </div>
      </header>

      <ul className="lead-insight-list lead-guidance-list">
        {tips.map((tip) => (
          <li key={tip}>
            <span className="lead-guidance-bullet">
              <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
            </span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LeadTipsCard;
