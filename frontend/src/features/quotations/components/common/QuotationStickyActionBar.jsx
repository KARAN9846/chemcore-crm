import { Link } from "react-router-dom";

const QuotationStickyActionBar = ({
  canPreview = true,
  canSend = true,
  hasBlockingErrors = false,
  isSaving = false,
  onSubmitAttempt,
  warnings = [],
}) => (
  <div className="quotation-sticky-action-bar">
    <Link to="/dashboard/quotations" className="lead-button lead-button-secondary">
      <i className="bi bi-arrow-left" aria-hidden="true"></i>
      Cancel
    </Link>

    <div className="quotation-action-group">
      <button type="button" className="lead-button lead-button-secondary">
        <i className="bi bi-floppy2" aria-hidden="true"></i>
        Save Draft
      </button>
      <button
        type="button"
        className="lead-button lead-button-secondary"
        disabled={!canPreview}
        onClick={onSubmitAttempt}
      >
        <i className="bi bi-eye" aria-hidden="true"></i>
        Preview PDF
      </button>
      <button
        type="button"
        className="lead-button lead-button-primary"
        disabled={!canSend || isSaving}
        onClick={onSubmitAttempt}
      >
        {isSaving ? (
          <span className="lead-button-spinner" aria-hidden="true"></span>
        ) : (
          <i className="bi bi-send-fill" aria-hidden="true"></i>
        )}
        {isSaving ? "Saving..." : "Save & Send"}
      </button>
    </div>
    {hasBlockingErrors ? (
      <div className="quotation-footer-warnings error">
        <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
        Fix required quotation fields before preview/send.
      </div>
    ) : warnings.length ? (
      <div className="quotation-footer-warnings">
        <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
        {warnings[0]}
      </div>
    ) : null}
  </div>
);

export default QuotationStickyActionBar;
