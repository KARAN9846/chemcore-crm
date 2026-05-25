const defaultDocuments = [
  "Certificate of Analysis (COA)",
  "MSDS / SDS",
  "Packing List",
  "Commercial Invoice",
];

const QuotationPdfDocuments = ({ documents = [] }) => {
  const visibleDocuments = documents.length
    ? documents.map((document) => document.label)
    : defaultDocuments;

  return (
    <section className="quotation-pdf-documents">
      <h3>Documents Provided With Shipment</h3>
      <div>
        {visibleDocuments.map((document) => (
          <span key={document}>
            <i className="bi bi-check-circle-fill" aria-hidden="true"></i>
            {document}
          </span>
        ))}
      </div>
    </section>
  );
};

export default QuotationPdfDocuments;
