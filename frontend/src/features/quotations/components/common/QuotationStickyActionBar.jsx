import { Link } from "react-router-dom";

const QuotationStickyActionBar = ({
  canPreview = true,
  canSend = true,
  cancelTo = "/dashboard/quotations",
  draftLabel = "Save Draft",
  hasBlockingErrors = false,
  isSaving = false,
  onDraftAttempt,
  onPreviewAttempt,
  onSubmitAttempt,
  previewLabel = "Preview PDF",
  primaryLabel = "Save & Send",
  warnings = [],
}) => (
  <div className="quotation-sticky-action-bar">
    <Link to={cancelTo} className="lead-button lead-button-secondary">
      <i className="bi bi-arrow-left" aria-hidden="true"></i>
      Cancel
    </Link>

    <div className="quotation-action-group">
      <button
        type="button"
        className="lead-button lead-button-secondary"
        disabled={isSaving}
        onClick={onDraftAttempt}
      >
        <i className="bi bi-floppy2" aria-hidden="true"></i>
        {draftLabel}
      </button>
      {onPreviewAttempt ? (
        <button
          type="button"
          className="lead-button lead-button-secondary"
          disabled={!canPreview}
          onClick={onPreviewAttempt}
        >
          <i className="bi bi-eye" aria-hidden="true"></i>
          {previewLabel}
        </button>
      ) : null}
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
        {isSaving ? "Saving..." : primaryLabel}
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
