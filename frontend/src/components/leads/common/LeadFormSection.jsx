const LeadFormSection = ({ icon, title, children }) => {
  return (
    <section className="lead-form-section">
      <header className="lead-form-section-header">
        <span className="lead-form-section-icon">
          <i className={`bi ${icon}`} aria-hidden="true"></i>
        </span>
        <h2>{title}</h2>
      </header>
      <div className="lead-form-section-body">{children}</div>
    </section>
  );
};

export default LeadFormSection;
