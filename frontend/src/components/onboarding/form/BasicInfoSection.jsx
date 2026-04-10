import { useEffect, useRef, useState } from "react";

const BasicInfoSection = ({
  formData,
  setFormData,
  setLogoFile,
  errors,
  touched,
  setTouched,
  clearFieldError,
}) => {
  const [logoPreview, setLogoPreview] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

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
    const isValid = isTouched && !hasError && Boolean(formData[fieldName]?.trim());

    return { hasError, showError, isValid };
  };

  const companyNameState = getFieldState("companyName");
  const companyTypeState = getFieldState("companyType");

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoPreview(URL.createObjectURL(file));
    setLogoFile(file);
  };

  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-info-circle"></i> Basic Information
      </div>

      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label">
            Company Name <span className="req">*</span>
          </label>
          <div className="field-shell">
            <input
              type="text"
              name="companyName"
              className={`form-control ${
                companyNameState.hasError
                  ? "field-error"
                  : companyNameState.isValid
                    ? "field-success"
                    : ""
              }`}
              placeholder="e.g. ArchemCore Industries Pvt Ltd"
              value={formData.companyName || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength="100"
            />
            {companyNameState.isValid ? (
              <span className="field-status-icon" aria-hidden="true">
                <i className="bi bi-check-lg"></i>
              </span>
            ) : null}
          </div>
          {companyNameState.showError ? (
            <div className="field-feedback">{errors.companyName}</div>
          ) : null}
        </div>

        <div className="col-md-4">
          <label className="form-label">
            Company Type <span className="req">*</span>
          </label>
          <div className="field-shell">
            <select
              name="companyType"
              className={`form-select ${
                companyTypeState.hasError
                  ? "field-error"
                  : companyTypeState.isValid
                    ? "field-success"
                    : ""
                }`}
              value={formData.companyType || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select type</option>
              <option value="Pvt Ltd">Pvt Ltd</option>
              <option value="Ltd">Ltd</option>
              <option value="LLP">LLP</option>
              <option value="Proprietorship">Proprietorship</option>
              <option value="Partnership">Partnership</option>
            </select>
            {companyTypeState.isValid ? (
              <span className="field-status-icon" aria-hidden="true">
                <i className="bi bi-check-lg"></i>
              </span>
            ) : null}
          </div>
          {companyTypeState.showError ? (
            <div className="field-feedback">{errors.companyType}</div>
          ) : null}
        </div>

        <div className="col-12">
          <label className="form-label">Company Logo</label>

          <div
            className={`logo-upload${logoPreview ? " has-file" : ""}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {logoPreview ? (
              <img className="logo-preview logo-preview-visible" src={logoPreview} alt="Logo Preview" />
            ) : (
              <div className="logo-placeholder">
                <div className="logo-upload-icon">
                  <i className="bi bi-cloud-arrow-up"></i>
                </div>
                <p>Click to upload your company logo</p>
                <small>PNG, JPG or SVG - Max 2MB - Recommended 200x60px</small>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            hidden
          />
        </div>

        <div className="col-12">
          <label className="form-label">
            Short Description <span className="label-optional">(optional)</span>
          </label>
          <textarea
            name="description"
            className="form-control"
            rows="2"
            maxLength="200"
            placeholder="e.g. Global chemical exporter specialising in industrial and specialty chemicals"
            value={formData.description || ""}
            onChange={handleChange}
            onBlur={handleBlur}
          ></textarea>
          <div className="char-count">
            {(formData.description || "").length}/200
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
