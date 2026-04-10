const StepHeader = () => {
  return (
    <div className="step-header">
      <div className="step-badge">
        <i className="bi bi-building"></i> Step 1 of 6
      </div>

      <h2 className="step-title">Company Profile</h2>

      <p className="step-sub">
        Tell us about your company. This information appears on quotations,
        invoices and compliance documents.
      </p>
    </div>
  );
};

export default StepHeader;
