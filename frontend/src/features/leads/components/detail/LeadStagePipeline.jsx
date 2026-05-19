import { memo } from "react";

import {
  getLeadStageIndex,
  getNormalizedLeadStage,
  leadPipelineStages,
} from "../../utils/leadStatusUtils";

const LeadStagePipeline = ({ status }) => {
  const activeIndex = getLeadStageIndex(status);

  return (
    <section className="lead-detail-card lead-stage-card">
      <div className="lead-detail-card-header">
        <h3>
          <i className="bi bi-diagram-3-fill" aria-hidden="true"></i>
          Lead Stage
        </h3>
        <select
          className="lead-stage-select"
          value={getNormalizedLeadStage(status)}
          disabled
        >
          {leadPipelineStages.map((stage) => (
            <option key={stage.key} value={stage.key}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>
      <div className="lead-stage-pipeline">
        {leadPipelineStages.map((stage, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <div
              key={stage.key}
              className={`lead-stage-step ${isComplete ? "complete" : ""} ${
                isActive ? "active" : ""
              }`}
            >
              <span className="lead-stage-dot">
                {isComplete ? (
                  <i className="bi bi-check-lg" aria-hidden="true"></i>
                ) : (
                  index + 1
                )}
              </span>
              <span>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default memo(LeadStagePipeline);
