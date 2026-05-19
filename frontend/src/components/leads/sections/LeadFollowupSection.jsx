import { memo } from "react";

import LeadFormSection from "../common/LeadFormSection";

const LeadFollowupSection = ({
  data,
  errors = {},
  touched = {},
  submitAttempted,
  onInputChange,
  onFieldBlur,
}) => {
  const updateField = (field) => (event) => {
    onInputChange("followUp", field, event.target.value);
  };
  const getError = (field) =>
    submitAttempted || touched[field] ? errors[field] : "";
  const controlClass = (field, extraClass = "") =>
    `lead-form-control ${extraClass} ${
      getError(field) ? "lead-form-control-invalid" : ""
    }`;

  return (
    <LeadFormSection icon="bi-alarm-fill" title="First Follow-up">
      <div className="row g-3">
        <div className="col-md-4">
          <label className="lead-form-label" htmlFor="lead-followup-date">
            Follow-up Date
          </label>
          <input
            id="lead-followup-date"
            type="date"
            className={controlClass("date")}
            value={data.date}
            onChange={updateField("date")}
            onBlur={() => onFieldBlur("followUp", "date")}
            aria-invalid={Boolean(getError("date"))}
          />
          {getError("date") ? (
            <div className="lead-field-error">{getError("date")}</div>
          ) : null}
        </div>

        <div className="col-md-4">
          <label className="lead-form-label" htmlFor="lead-followup-time">
            Time
          </label>
          <input
            id="lead-followup-time"
            type="time"
            className={controlClass("time")}
            value={data.time}
            onChange={updateField("time")}
            onBlur={() => onFieldBlur("followUp", "time")}
          />
        </div>

        <div className="col-md-4">
          <label className="lead-form-label" htmlFor="lead-followup-via">
            Via
          </label>
          <select
            id="lead-followup-via"
            className={controlClass("via")}
            value={data.via}
            onChange={updateField("via")}
            onBlur={() => onFieldBlur("followUp", "via")}
          >
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Send Quotation">Send Quotation</option>
            <option value="Meeting">Meeting</option>
          </select>
        </div>

        <div className="col-12">
          <label className="lead-form-label" htmlFor="lead-notes">
            Notes
          </label>
          <textarea
            id="lead-notes"
            className={controlClass("notes", "lead-textarea")}
            rows="3"
            placeholder="Add any notes about this lead - requirements, context, special conditions..."
            value={data.notes}
            onChange={updateField("notes")}
            onBlur={() => onFieldBlur("followUp", "notes")}
            aria-invalid={Boolean(getError("notes"))}
          />
          {getError("notes") ? (
            <div className="lead-field-error">{getError("notes")}</div>
          ) : null}
        </div>
      </div>
    </LeadFormSection>
  );
};

export default memo(LeadFollowupSection);
