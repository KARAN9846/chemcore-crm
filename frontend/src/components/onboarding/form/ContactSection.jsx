const ContactSection = ({
  formData,
  setFormData,
  errors,
  touched,
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

  const getFieldState = (fieldName) => {
    const isTouched = Boolean(touched[fieldName]);
    const hasError = Boolean(errors[fieldName]);
    const showError = isTouched && hasError;
    const isValid = isTouched && !hasError && Boolean((formData[fieldName] || "").trim());

    return { hasError, showError, isValid };
  };

  const phoneState = getFieldState("phone");
  const emailState = getFieldState("email");
  const timezoneState = getFieldState("timezone");

  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-telephone"></i> Contact Information
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">
            Company Phone <span className="req">*</span>
          </label>

          <div
            className={`field-shell field-shell-group ${
              phoneState.hasError
                ? "field-error-group"
                : phoneState.isValid
                  ? "field-success-group has-success-icon"
                  : ""
            }`}
          >
            <div className="input-group">
              <span className="input-group-text">+91</span>

              <input
                type="tel"
                name="phone"
                className={`form-control ${
                  phoneState.hasError
                    ? "field-error"
                    : phoneState.isValid
                      ? "field-success"
                      : ""
                }`}
                placeholder="98765 43210"
                value={formData.phone || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ borderLeft: "none" }}
                maxLength="15"
              />
            </div>
            {phoneState.isValid ? (
              <span className="field-status-icon" aria-hidden="true">
                <i className="bi bi-check-lg"></i>
              </span>
            ) : null}
          </div>
          {phoneState.showError ? (
            <div className="field-feedback">{errors.phone}</div>
          ) : null}
        </div>

        <div className="col-md-6">
          <label className="form-label">
            Company Email <span className="req">*</span>
          </label>
          <div className="field-shell">
            <input
              type="email"
              name="email"
              className={`form-control ${
                emailState.hasError
                  ? "field-error"
                  : emailState.isValid
                    ? "field-success"
                    : ""
              }`}
              placeholder="info@yourcompany.com"
              value={formData.email || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {emailState.isValid ? (
              <span className="field-status-icon" aria-hidden="true">
                <i className="bi bi-check-lg"></i>
              </span>
            ) : null}
          </div>
          {emailState.showError ? (
            <div className="field-feedback">{errors.email}</div>
          ) : null}
        </div>

        <div className="col-md-6">
          <label className="form-label">Company Website</label>
          <input
            type="url"
            name="website"
            className="form-control"
            placeholder="https://www.yourcompany.com"
            value={formData.website || ""}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            Timezone <span className="req">*</span>
          </label>
          <div className="field-shell">
            <select
              name="timezone"
              className={`form-select ${
                timezoneState.hasError
                  ? "field-error"
                  : timezoneState.isValid
                    ? "field-success"
                    : ""
              }`}
              value={formData.timezone || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select timezone</option>
              <option value="Asia/Kolkata">IST - Asia/Kolkata (UTC+5:30)</option>
              <option value="UTC">UTC - Coordinated Universal Time</option>
              <option value="America/New_York">EST - America/New_York (UTC-5)</option>
              <option value="Europe/Berlin">CET - Europe/Berlin (UTC+1)</option>
              <option value="Asia/Dubai">GST - Asia/Dubai (UTC+4)</option>
              <option value="Asia/Singapore">SGT - Asia/Singapore (UTC+8)</option>
            </select>
            {timezoneState.isValid ? (
              <span className="field-status-icon" aria-hidden="true">
                <i className="bi bi-check-lg"></i>
              </span>
            ) : null}
          </div>
          {timezoneState.showError ? (
            <div className="field-feedback">{errors.timezone}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
