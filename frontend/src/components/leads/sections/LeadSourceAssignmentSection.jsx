import { memo } from "react";

import LeadFormSection from "../common/LeadFormSection";

const sources = [
  { icon: "bi-buildings-fill", label: "Trade Fair" },
  { icon: "bi-globe2", label: "Website Inquiry" },
  { icon: "bi-people-fill", label: "Referral" },
  { icon: "bi-linkedin", label: "LinkedIn" },
  { icon: "bi-telephone-fill", label: "Direct Outreach" },
  { icon: "bi-pin-angle-fill", label: "Other" },
];

const LeadSourceAssignmentSection = ({
  data,
  errors = {},
  touched = {},
  submitAttempted,
  onInputChange,
  onFieldBlur,
}) => {
  const updateField = (field) => (event) => {
    onInputChange("sourceAssignment", field, event.target.value);
  };
  const getError = (field) =>
    submitAttempted || touched[field] ? errors[field] : "";
  const controlClass = (field) =>
    `lead-form-control ${getError(field) ? "lead-form-control-invalid" : ""}`;

  return (
    <LeadFormSection icon="bi-megaphone-fill" title="Lead Source & Assignment">
      <div className="row g-3">
        <div className="col-12">
          <label className="lead-form-label">
            How did this lead come in? <span className="req">*</span>
          </label>
          <div className="lead-source-grid">
            {sources.map((source) => (
              <button
                key={source.label}
                type="button"
                className={`lead-source-card ${
                  data.source === source.label ? "selected" : ""
                }`}
                aria-pressed={data.source === source.label}
                onBlur={() => onFieldBlur("sourceAssignment", "source")}
                onClick={() =>
                  onInputChange("sourceAssignment", "source", source.label)
                }
              >
                <span className="lead-source-card-icon">
                  <i className={`bi ${source.icon}`} aria-hidden="true"></i>
                </span>
                <span className="lead-source-card-label">{source.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-source-detail">
            Source Detail <span className="lead-label-muted">(optional)</span>
          </label>
          <input
            id="lead-source-detail"
            type="text"
            className={controlClass("sourceDetail")}
            placeholder="e.g. Chemex Dubai 2024, Mr. Ali's referral"
            value={data.sourceDetail}
            onChange={updateField("sourceDetail")}
            onBlur={() => onFieldBlur("sourceAssignment", "sourceDetail")}
          />
        </div>

        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-assigned-to">
            Assigned To <span className="req">*</span>
          </label>
          <select
            id="lead-assigned-to"
            className={controlClass("assignedTo")}
            value={data.assignedTo}
            onChange={updateField("assignedTo")}
            onBlur={() => onFieldBlur("sourceAssignment", "assignedTo")}
            aria-invalid={Boolean(getError("assignedTo"))}
          >
            <option value="">Select team member</option>
            <option value="Priya Sharma">Priya Sharma (Sales)</option>
            <option value="Amit Kumar">Amit Kumar (Sales)</option>
          </select>
          {getError("assignedTo") ? (
            <div className="lead-field-error">{getError("assignedTo")}</div>
          ) : null}
        </div>

        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-initial-stage">
            Initial Stage
          </label>
          <select
            id="lead-initial-stage"
            className={controlClass("initialStage")}
            value={data.initialStage}
            onChange={updateField("initialStage")}
            onBlur={() => onFieldBlur("sourceAssignment", "initialStage")}
          >
            <option value="new">New Inquiry</option>
            <option value="negotiating">Negotiating</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-initial-score">
            Initial Score
          </label>
          <select
            id="lead-initial-score"
            className={controlClass("initialScore")}
            value={data.initialScore}
            onChange={updateField("initialScore")}
            onBlur={() => onFieldBlur("sourceAssignment", "initialScore")}
          >
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </select>
        </div>
      </div>
    </LeadFormSection>
  );
};

export default memo(LeadSourceAssignmentSection);
