const RegistrationSection = ({
  formData,
  setFormData,
  setTouched,
  clearFieldError,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearFieldError(name);
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-patch-check"></i> Registration Details
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">GST / Tax Number</label>
          <input
            type="text"
            name="gstNumber"
            className="form-control"
            placeholder="e.g. 24AAACA1234B1Z5"
            value={formData.gstNumber || ""}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="form-hint">
            Used on invoices and compliance documents.
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">IEC Code (Import Export Code)</label>
          <input
            type="text"
            name="iecCode"
            className="form-control"
            placeholder="e.g. 0812012345"
            value={formData.iecCode || ""}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="form-hint">
            Mandatory for export shipments in India.
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">PAN Number</label>
          <input
            type="text"
            name="panNumber"
            className="form-control"
            placeholder="e.g. AAACA1234B"
            value={formData.panNumber || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength="10"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Year Established</label>
          <input
            type="number"
            name="yearEstablished"
            className="form-control"
            placeholder="e.g. 2015"
            value={formData.yearEstablished || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1900"
            max="2026"
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationSection;
