import { Link } from "react-router-dom";

const LeadStickyActionBar = ({
  cancelTo = "/dashboard/leads",
  draftLabel = "Save Draft",
  isSaving,
  onSubmitAttempt,
  primaryLabel = "Add Lead",
  savingLabel = "Saving...",
  showDraft = true,
}) => {
  return (
    <div className="lead-sticky-action-bar">
      <Link to={cancelTo} className="lead-button lead-button-secondary">
        <i className="bi bi-arrow-left" aria-hidden="true"></i>
        Cancel
      </Link>

      <div className="lead-action-group">
        {showDraft ? (
          <button type="button" className="lead-button lead-button-secondary">
            <i className="bi bi-floppy2" aria-hidden="true"></i>
            {draftLabel}
          </button>
        ) : null}
        <button
          type="button"
          className="lead-button lead-button-primary"
          disabled={isSaving}
          onClick={onSubmitAttempt}
        >
          {isSaving ? (
            <span className="lead-button-spinner" aria-hidden="true"></span>
          ) : (
            <i className="bi bi-check-circle-fill" aria-hidden="true"></i>
          )}
          {isSaving ? savingLabel : primaryLabel}
        </button>
      </div>
    </div>
  );
};

export default LeadStickyActionBar;
