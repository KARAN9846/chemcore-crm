const QuotationSection = ({ children, description, icon, title }) => (
  <section className="quotation-section">
    <header className="quotation-section-header">
      <span className="quotation-section-icon">
        <i className={`bi ${icon}`} aria-hidden="true"></i>
      </span>
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </header>
    <div className="quotation-section-body">{children}</div>
  </section>
);

export default QuotationSection;
