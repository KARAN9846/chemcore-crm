const QuotationTradeTerms = ({ quotation }) => {
  const fields = [
    ["Incoterm", quotation.incoterm],
    ["Payment Terms", quotation.paymentTerms],
    ["Loading Port", quotation.loadingPort],
    ["Discharge Port", quotation.dischargePort],
    ["Packaging", quotation.packagingDetails],
  ];

  return (
    <section className="quotation-section">
      <header className="quotation-section-header">
        <span className="quotation-section-icon">
          <i className="bi bi-file-earmark-text-fill" aria-hidden="true"></i>
        </span>
        <h2>Trade Terms</h2>
      </header>
      <div className="quotation-detail-fields">
        {fields.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value || "-"}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuotationTradeTerms;
