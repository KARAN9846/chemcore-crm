import {
  formatPdfDate,
  getQuotationVersionLabel,
} from "../../utils/quotationPdfUtils";

const QuotationPdfHeader = ({ company, quotation }) => (
  <header className="quotation-pdf-header">
    <div className="quotation-pdf-logo-area">
      <div className="quotation-pdf-logo">{company?.initials}</div>
      <div>
        <h2>{company?.name}</h2>
        <p className="quotation-pdf-company-sub">{company?.subtitle}</p>
        <p className="quotation-pdf-company-contact">
          {company?.address}
          <br />
          {company?.gst} - {company?.iec}
          <br />
          {company?.email} - {company?.phone}
        </p>
      </div>
    </div>
    <div className="quotation-pdf-meta">
      <span className="quotation-pdf-title">Quotation</span>
      <strong>{quotation?.quotationNumber}</strong>
      <p>Version: {getQuotationVersionLabel(quotation)}</p>
      <p>Date: {formatPdfDate(quotation?.quotationDate)}</p>
      <p>Valid Until: {formatPdfDate(quotation?.validUntil)}</p>
      <span className="quotation-pdf-status">{quotation?.status || "Draft"}</span>
    </div>
  </header>
);

export default QuotationPdfHeader;
