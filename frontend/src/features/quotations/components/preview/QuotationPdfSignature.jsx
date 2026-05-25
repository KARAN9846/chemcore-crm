const QuotationPdfSignature = ({ company, quotation }) => (
  <section className="quotation-pdf-signature">
    <div>
      <span></span>
      <strong>{quotation?.createdBy || quotation?.metadata?.createdBy || "Sales Team"}</strong>
      <p>Prepared By - {company?.name}</p>
      <small>Date: ___________________</small>
    </div>
    <div>
      <span></span>
      <strong>Authorized Signatory</strong>
      <p>{quotation?.companyName || quotation?.clientName}</p>
      <small>Date: ___________________</small>
    </div>
  </section>
);

export default QuotationPdfSignature;
