const QuotationPdfParties = ({ company, quotation }) => (
  <section className="quotation-pdf-parties">
    <div className="quotation-pdf-party-box">
      <span>Quotation To</span>
      <strong>{quotation?.companyName || quotation?.clientName}</strong>
      <p>
        {quotation?.clientName}
        <br />
        {quotation?.country || "Country not specified"}
        <br />
        {quotation?.clientEmail || "Email not specified"}
      </p>
    </div>
    <div className="quotation-pdf-party-box">
      <span>From</span>
      <strong>{company?.name}</strong>
      <p>
        {quotation?.createdBy || quotation?.metadata?.createdBy || "Sales Team"}
        <br />
        {company?.address}
        <br />
        {company?.email} - {company?.phone}
      </p>
    </div>
  </section>
);

export default QuotationPdfParties;
