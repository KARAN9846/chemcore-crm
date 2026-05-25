import { Link } from "react-router-dom";

const QuotationPreviewToolbar = ({
  detailPath,
  isDownloading,
  onDownload,
  onPrint,
  onSend,
  quotation,
  summary,
}) => (
  <div className="quotation-preview-toolbar">
    <div className="quotation-preview-toolbar-left">
      <Link to={detailPath} className="quotation-preview-back">
        <i className="bi bi-arrow-left" aria-hidden="true"></i>
        Back
      </Link>
      <div>
        <h1>{quotation.quotationNumber} - PDF Preview</h1>
        <p>{summary}</p>
      </div>
    </div>
    <div className="quotation-preview-actions">
      <button type="button" className="lead-button lead-button-secondary" onClick={onPrint}>
        <i className="bi bi-printer-fill" aria-hidden="true"></i>
        Print
      </button>
      <button type="button" className="lead-button lead-button-secondary" onClick={onSend}>
        <i className="bi bi-send-fill" aria-hidden="true"></i>
        Send to Client
      </button>
      <button
        type="button"
        className="lead-button lead-button-primary"
        disabled={isDownloading}
        onClick={onDownload}
      >
        <i className="bi bi-download" aria-hidden="true"></i>
        {isDownloading ? "Preparing..." : "Download PDF"}
      </button>
    </div>
  </div>
);

export default QuotationPreviewToolbar;
