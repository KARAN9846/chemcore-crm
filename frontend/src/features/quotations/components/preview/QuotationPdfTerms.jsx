import { formatPdfDate } from "../../utils/quotationPdfUtils";

const TermRow = ({ label, value, urgent }) => (
  <div>
    <span>{label}</span>
    <strong className={urgent ? "urgent" : ""}>{value || "-"}</strong>
  </div>
);

const QuotationPdfTerms = ({ quotation }) => (
  <section className="quotation-pdf-terms">
    <div className="quotation-pdf-terms-box">
      <h3>Trade Terms</h3>
      <TermRow label="Incoterm" value={quotation?.incoterm} />
      <TermRow label="Payment" value={quotation?.paymentTerms} />
      <TermRow label="Currency" value={quotation?.currency} />
      <TermRow label="Destination" value={quotation?.dischargePort} />
    </div>
    <div className="quotation-pdf-terms-box">
      <h3>Delivery & Packaging</h3>
      <TermRow label="Loading Port" value={quotation?.loadingPort} />
      <TermRow label="Packaging" value={quotation?.packagingDetails} />
      <TermRow label="Validity" value={formatPdfDate(quotation?.validUntil)} urgent />
      <TermRow label="Status" value={quotation?.status} />
    </div>
  </section>
);

export default QuotationPdfTerms;
