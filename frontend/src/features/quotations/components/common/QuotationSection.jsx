const QuotationSection = ({ children, icon, title }) => (
  <section className="quotation-section">
    <header className="quotation-section-header">
      <span className="quotation-section-icon">
        <i className={`bi ${icon}`} aria-hidden="true"></i>
      </span>
      <h2>{title}</h2>
    </header>
    <div className="quotation-section-body">{children}</div>
  </section>
);

export default QuotationSection;
