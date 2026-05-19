const LeadDocumentsCard = ({ compliancePreview }) => {
  const documentNotes = compliancePreview?.documentNotes ?? [];
  const chemicalWarnings = compliancePreview?.chemicalWarnings ?? [];

  return (
    <section className="lead-insight-card lead-documents-card">
      <header className="lead-insight-card-header">
        <span className="lead-insight-icon lead-insight-icon-docs">
          <i className="bi bi-file-earmark-check" aria-hidden="true"></i>
        </span>
        <div>
          <h3>Required Documents</h3>
          <p>Export readiness</p>
        </div>
      </header>

      <ul className="lead-insight-list lead-document-list">
        {documentNotes.map((note) => (
          <li key={note}>
            <span className="lead-document-alert">
              <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
            </span>
            <span>{note}</span>
          </li>
        ))}
        {chemicalWarnings.map((warning) => (
          <li key={`${warning.chemical}-${warning.message}`}>
            <span className="lead-document-alert">
              <i className="bi bi-shield-exclamation" aria-hidden="true"></i>
            </span>
            <span>
              <strong>{warning.chemical}:</strong> {warning.message}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LeadDocumentsCard;
