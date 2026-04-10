const AddressSection = ({
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
    const isValid = isTouched && !hasError && Boolean(formData[fieldName]?.trim());

    return { hasError, showError, isValid };
  };

  const addressState = getFieldState("address");
  const cityState = getFieldState("city");
  const pincodeState = getFieldState("pincode");
  const countryState = getFieldState("country");
  const currencyState = getFieldState("currency");

  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-geo-alt"></i> Registered Address
      </div>

      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">
            Address Line 1 <span className="req">*</span>
          </label>
          <div className="field-shell">
            <input
              type="text"
              name="address"
              className={`form-control ${
                addressState.hasError
                  ? "field-error"
                  : addressState.isValid
                    ? "field-success"
                    : ""
              }`}
              placeholder="Street / Building / Plot No."
              value={formData.address || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {addressState.isValid ? (
              <span className="field-status-icon" aria-hidden="true">
                <i className="bi bi-check-lg"></i>
              </span>
            ) : null}
          </div>
          {addressState.showError ? (
            <div className="field-feedback">{errors.address}</div>
          ) : null}
        </div>

        <div className="col-12">
          <label className="form-label">Address Line 2</label>
          <input
            type="text"
            name="address2"
            className="form-control"
            placeholder="Area / Locality (optional)"
            value={formData.address2 || ""}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">
            City <span className="req">*</span>
          </label>
          <div className="field-shell">
            <input
              type="text"
              name="city"
              className={`form-control ${
                cityState.hasError
                  ? "field-error"
                  : cityState.isValid
                    ? "field-success"
                    : ""
              }`}
              placeholder="City"
              value={formData.city || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {cityState.isValid ? (
              <span className="field-status-icon" aria-hidden="true">
                <i className="bi bi-check-lg"></i>
              </span>
            ) : null}
          </div>
          {cityState.showError ? (
            <div className="field-feedback">{errors.city}</div>
          ) : null}
        </div>

        <div className="col-md-4">
          <label className="form-label">State</label>
          <input
            type="text"
            name="state"
            className="form-control"
            placeholder="State"
            value={formData.state || ""}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">
            PIN / ZIP Code <span className="req">*</span>
          </label>
          <div className="field-shell">
            <input
              type="text"
              name="pincode"
              className={`form-control ${
                pincodeState.hasError
                  ? "field-error"
                  : pincodeState.isValid
                    ? "field-success"
                    : ""
              }`}
              placeholder="PIN Code"
              value={formData.pincode || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength="10"
            />
            {pincodeState.isValid ? (
              <span className="field-status-icon" aria-hidden="true">
                <i className="bi bi-check-lg"></i>
              </span>
            ) : null}
          </div>
          {pincodeState.showError ? (
            <div className="field-feedback">{errors.pincode}</div>
          ) : null}
        </div>

        <div className="col-md-6">
          <label className="form-label">
            Country <span className="req">*</span>
          </label>
          <div className="field-shell">
            <select
              name="country"
              className={`form-select ${
                countryState.hasError
                  ? "field-error"
                  : countryState.isValid
                    ? "field-success"
                    : ""
              }`}
              value={formData.country || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select country</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="UAE">UAE</option>
              <option value="Singapore">Singapore</option>
              <option value="China">China</option>
            </select>
            {countryState.isValid ? (
              <span className="field-status-icon" aria-hidden="true">
                <i className="bi bi-check-lg"></i>
              </span>
            ) : null}
          </div>
          {countryState.showError ? (
            <div className="field-feedback">{errors.country}</div>
          ) : null}
        </div>

        <div className="col-md-6">
          <label className="form-label">
            Base Currency <span className="req">*</span>
          </label>
          <div className="field-shell">
            <select
              name="currency"
              className={`form-select ${
                currencyState.hasError
                  ? "field-error"
                  : currencyState.isValid
                    ? "field-success"
                    : ""
              }`}
              value={formData.currency || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select currency</option>
              <option value="INR">India INR - Indian Rupee</option>
              <option value="USD">United States USD - US Dollar</option>
              <option value="EUR">Europe EUR - Euro</option>
              <option value="GBP">United Kingdom GBP - British Pound</option>
              <option value="AED">UAE AED - UAE Dirham</option>
            </select>
            {currencyState.isValid ? (
              <span className="field-status-icon" aria-hidden="true">
                <i className="bi bi-check-lg"></i>
              </span>
            ) : null}
          </div>
          {currencyState.showError ? (
            <div className="field-feedback">{errors.currency}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
