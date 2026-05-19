import { memo, useCallback, useMemo, useRef, useState } from "react";

import {
  activitySchema,
  normalizeActivityInput,
} from "../../../../../../shared/validation/activity.schema.js";
import { createLeadActivity } from "../../api/leadActivities.api";
import {
  activityOutcomes,
  communicationTypes,
} from "../../utils/activityBadgeUtils";
import {
  getCurrentInputTime,
  getTodayInputDate,
} from "../../utils/activityTimelineUtils";

const stageOptions = [
  { value: "", label: "Keep current stage" },
  { value: "New Inquiry", label: "New Inquiry" },
  { value: "Negotiating", label: "Negotiating" },
  { value: "Quote Sent", label: "Quote Sent" },
  { value: "Quote Revised", label: "Quote Revised" },
  { value: "Order Confirmed", label: "Order Confirmed" },
  { value: "Won", label: "Won" },
  { value: "Lost", label: "Lost" },
];

const followupMethods = ["Call", "Email", "WhatsApp", "Meeting"];
const MIN_SUBMIT_LOCK_MS = 1500;

const initialActivityForm = () => ({
  activityType: "Call",
  activityDate: getTodayInputDate(),
  activityTime: getCurrentInputTime(),
  subject: "",
  notes: "",
  outcome: "",
  newStage: "",
  followUp: {
    date: "",
    time: "",
    via: "Call",
  },
});

const buildErrors = (issues = []) =>
  issues.reduce((acc, issue) => {
    const [field, nestedField] = issue.path;
    const key = nestedField ? `${field}.${nestedField}` : field;

    if (!key || acc[key]) {
      return acc;
    }

    return {
      ...acc,
      [key]: issue.message,
    };
  }, {});

const hasTouchedFields = (touched) => Object.values(touched).some(Boolean);

const validateActivityForm = (form) => {
  const result = activitySchema.safeParse(normalizeActivityInput(form));

  if (result.success) {
    return {};
  }

  return buildErrors(result.error.issues);
};

const LeadActivityForm = ({
  companyId,
  currentStage,
  lead,
  onCancel,
  onCreated,
  publicId,
}) => {
  const [form, setForm] = useState(initialActivityForm);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitLockRef = useRef(false);

  const errors = useMemo(() => {
    if (!submitAttempted && !hasTouchedFields(touched)) {
      return {};
    }

    return validateActivityForm(form);
  }, [form, submitAttempted, touched]);

  const setField = useCallback((field, value) => {
    setSubmitError("");
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }, []);

  const setFollowupField = useCallback((field, value) => {
    setSubmitError("");
    setForm((current) => ({
      ...current,
      followUp: {
        ...current.followUp,
        [field]: value,
      },
    }));
  }, []);

  const markTouched = useCallback((field) => {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  }, []);

  const getError = useCallback(
    (field) => (submitAttempted || touched[field] ? errors[field] : ""),
    [errors, submitAttempted, touched],
  );

  const controlClass = useCallback(
    (field, extra = "") =>
      `lead-form-control ${extra} ${
        getError(field) ? "lead-form-control-invalid" : ""
      }`,
    [getError],
  );

  const handleSubmit = useCallback(async () => {
    if (submitLockRef.current) {
      return;
    }

    setSubmitAttempted(true);
    const nextErrors = validateActivityForm(form);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    submitLockRef.current = true;
    const lockStartedAt = Date.now();
    setIsSaving(true);
    setSubmitError("");

    try {
      const payload = {
        companyId,
        activityType: form.activityType,
        subject: form.subject.trim(),
        notes: form.notes.trim(),
        outcome: form.outcome,
        activityDate: form.activityDate,
        activityTime: form.activityTime,
        followUp: form.followUp,
        newStage: form.newStage || null,
        createdBy: lead.assignedTo || "Sales Team",
      };
      const response = await createLeadActivity(publicId, payload);
      onCreated?.(response.data, response.message);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.message ||
          "Unable to save conversation right now",
      );
    } finally {
      const elapsed = Date.now() - lockStartedAt;
      const remainingLock = Math.max(0, MIN_SUBMIT_LOCK_MS - elapsed);

      window.setTimeout(() => {
        submitLockRef.current = false;
        setIsSaving(false);
      }, remainingLock);
    }
  }, [companyId, form, lead.assignedTo, onCreated, publicId]);

  return (
    <>
      <form className="lead-activity-form" noValidate>
        <div>
          <label className="lead-form-label">
            Communication Type <span className="req">*</span>
          </label>
          <div className="lead-activity-comm-grid">
            {communicationTypes.map((type) => (
              <button
                key={type.label}
                type="button"
                className={`lead-followup-card-button ${
                  form.activityType === type.label ? "selected" : ""
                }`}
                aria-pressed={form.activityType === type.label}
                onBlur={() => markTouched("activityType")}
                onClick={() => setField("activityType", type.label)}
              >
                <i className={`bi ${type.icon}`} aria-hidden="true"></i>
                {type.label}
              </button>
            ))}
          </div>
          {getError("activityType") ? (
            <div className="lead-field-error">{getError("activityType")}</div>
          ) : null}
        </div>

        <div className="lead-followup-divider">Details</div>

        <div className="lead-followup-form-grid">
          <div>
            <label className="lead-form-label" htmlFor="activity-date">
              Date <span className="req">*</span>
            </label>
            <input
              id="activity-date"
              type="date"
              className={controlClass("activityDate")}
              value={form.activityDate}
              onBlur={() => markTouched("activityDate")}
              onChange={(event) => setField("activityDate", event.target.value)}
            />
            {getError("activityDate") ? (
              <div className="lead-field-error">{getError("activityDate")}</div>
            ) : null}
          </div>
          <div>
            <label className="lead-form-label" htmlFor="activity-time">
              Time
            </label>
            <input
              id="activity-time"
              type="time"
              className={controlClass("activityTime")}
              value={form.activityTime}
              onBlur={() => markTouched("activityTime")}
              onChange={(event) => setField("activityTime", event.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="lead-form-label" htmlFor="activity-subject">
            Subject / Topic <span className="req">*</span>
          </label>
          <input
            id="activity-subject"
            type="text"
            className={controlClass("subject")}
            placeholder="e.g. Pricing discussion on Caustic Soda quotation"
            value={form.subject}
            onBlur={() => markTouched("subject")}
            onChange={(event) => setField("subject", event.target.value)}
          />
          {getError("subject") ? (
            <div className="lead-field-error">{getError("subject")}</div>
          ) : null}
        </div>

        <div>
          <label className="lead-form-label" htmlFor="activity-notes">
            Conversation Notes <span className="req">*</span>
          </label>
          <textarea
            id="activity-notes"
            className={controlClass("notes", "lead-textarea")}
            maxLength="2000"
            placeholder="Summarise key points, feedback, pricing discussed, objections, and agreed next steps..."
            rows="5"
            value={form.notes}
            onBlur={() => markTouched("notes")}
            onChange={(event) => setField("notes", event.target.value)}
          />
          <div className="lead-activity-char-count">{form.notes.length}/2000</div>
          {getError("notes") ? (
            <div className="lead-field-error">{getError("notes")}</div>
          ) : null}
        </div>

        <div>
          <label className="lead-form-label">Outcome</label>
          <div className="lead-activity-outcome-list">
            {activityOutcomes.map((outcome) => (
              <button
                key={outcome}
                type="button"
                className={`lead-activity-outcome-pill ${
                  form.outcome === outcome ? "selected" : ""
                }`}
                onClick={() => setField("outcome", outcome)}
              >
                {outcome}
              </button>
            ))}
          </div>
        </div>

        <div className="lead-followup-divider">Stage & Follow-up</div>

        <div className="lead-activity-stage-box">
          <span>Move lead to a different stage after this conversation?</span>
          <div className="lead-activity-stage-row">
            <strong>{currentStage || "Current stage"}</strong>
            <i className="bi bi-arrow-right" aria-hidden="true"></i>
            <select
              className={controlClass("newStage")}
              value={form.newStage}
              onBlur={() => markTouched("newStage")}
              onChange={(event) => setField("newStage", event.target.value)}
            >
              {stageOptions.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="lead-form-label">Set Follow-up Reminder</label>
          <div className="lead-activity-followup-grid">
            <input
              type="date"
              className={controlClass("followUp.date")}
              value={form.followUp.date}
              onBlur={() => markTouched("followUp.date")}
              onChange={(event) => setFollowupField("date", event.target.value)}
            />
            <input
              type="time"
              className={controlClass("followUp.time")}
              value={form.followUp.time}
              onBlur={() => markTouched("followUp.time")}
              onChange={(event) => setFollowupField("time", event.target.value)}
            />
            <select
              className={controlClass("followUp.via")}
              value={form.followUp.via}
              onBlur={() => markTouched("followUp.via")}
              onChange={(event) => setFollowupField("via", event.target.value)}
            >
              {followupMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
          <div className="lead-form-hint">
            Reminder will update this lead's next follow-up after saving.
          </div>
        </div>

        {submitError ? (
          <div className="lead-submit-alert lead-submit-alert-error">
            <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
            {submitError}
          </div>
        ) : null}
      </form>

      <div className="lead-followup-drawer-footer">
        <button
          type="button"
          className="lead-button lead-button-secondary"
          onClick={onCancel}
        >
          <i className="bi bi-x-lg" aria-hidden="true"></i>
          Cancel
        </button>
        <button
          type="button"
          className="lead-button lead-button-primary"
          disabled={isSaving}
          onClick={handleSubmit}
        >
          {isSaving ? (
            <span className="lead-button-spinner" aria-hidden="true"></span>
          ) : (
            <i className="bi bi-chat-dots-fill" aria-hidden="true"></i>
          )}
          {isSaving ? "Saving..." : "Save Conversation"}
        </button>
      </div>
    </>
  );
};

export default memo(LeadActivityForm);
