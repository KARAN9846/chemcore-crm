import LeadDocumentsCard from "./LeadDocumentsCard";
import LeadScoreCard from "./LeadScoreCard";
import LeadTipsCard from "./LeadTipsCard";

const LeadInsightsPanel = ({
  scorePreview,
  compliancePreview,
  workflowHints,
}) => {
  return (
    <aside className="lead-insights-panel" aria-label="CRM lead insights">
      <LeadScoreCard scorePreview={scorePreview} />
      <LeadTipsCard workflowHints={workflowHints} />
      <LeadDocumentsCard compliancePreview={compliancePreview} />
    </aside>
  );
};

export default LeadInsightsPanel;
