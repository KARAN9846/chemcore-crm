import QuotationSection from "../common/QuotationSection";

const QuotationDocumentsSection = ({ documents, onToggleDocument }) => (
  <QuotationSection
    description="Documents referenced in the quotation pack."
    icon="bi-shield-check-fill"
    title="Documents Mentioned in Quotation"
  >
    <div className="quotation-document-list">
      {documents.map((document) => (
        <label key={document.id} className="quotation-document-option">
          <input
            type="checkbox"
            checked={document.selected}
            onChange={() => onToggleDocument(document.id)}
          />
          <span>{document.label}</span>
        </label>
      ))}
    </div>
  </QuotationSection>
);

export default QuotationDocumentsSection;
