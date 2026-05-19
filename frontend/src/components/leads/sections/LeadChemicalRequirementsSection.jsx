import { memo } from "react";

import LeadFormSection from "../common/LeadFormSection";

const chemicals = [
  "Caustic Soda",
  "Soda Ash",
  "Nitrocellulose",
  "Alkyd Resin",
  "Ammonium Nitrate",
  "Sulfuric Acid",
  "Titanium Dioxide",
];

const LeadChemicalRequirementsSection = ({
  data,
  errors = {},
  touched = {},
  submitAttempted,
  onInputChange,
  onFieldBlur,
  onChemicalToggle,
}) => {
  const updateField = (field) => (event) => {
    onInputChange("chemicalRequirements", field, event.target.value);
  };
  const getError = (field) =>
    submitAttempted || touched[field] ? errors[field] : "";
  const controlClass = (field, extraClass = "") =>
    `lead-form-control ${extraClass} ${
      getError(field) ? "lead-form-control-invalid" : ""
    }`;

  return (
    <LeadFormSection icon="bi-droplet-fill" title="Chemical Requirements">
      <div className="row g-3">
        <div className="col-12">
          <label className="lead-form-label">
            Chemical(s) of Interest <span className="req">*</span>
          </label>
          <div className="lead-pill-list">
            {chemicals.map((chemical) => (
              <button
                key={chemical}
                type="button"
                className={`lead-choice-pill ${
                  data.chemicals.includes(chemical) ? "selected" : ""
                } ${getError("chemicals") ? "invalid" : ""}`}
                aria-invalid={Boolean(getError("chemicals"))}
                onBlur={() =>
                  onFieldBlur("chemicalRequirements", "chemicals")
                }
                aria-pressed={data.chemicals.includes(chemical)}
                onClick={() => onChemicalToggle(chemical)}
              >
                {chemical}
              </button>
            ))}
          </div>
          {getError("chemicals") ? (
            <div className="lead-field-error">{getError("chemicals")}</div>
          ) : null}
          <div className="lead-form-hint">
            Select all that apply. You can add more from Chemical Master.
          </div>
        </div>

        <div className="col-12">
          <label className="lead-form-label" htmlFor="lead-grade">
            Grade / Specification
          </label>
          <input
            id="lead-grade"
            type="text"
            className={controlClass("gradeSpecification")}
            placeholder="e.g. Flakes 98% purity, Batch size 25 KG bags"
            value={data.gradeSpecification}
            onChange={updateField("gradeSpecification")}
            onBlur={() =>
              onFieldBlur("chemicalRequirements", "gradeSpecification")
            }
          />
        </div>

        <div className="col-md-4">
          <label className="lead-form-label" htmlFor="lead-quantity">
            Quantity Required <span className="req">*</span>
          </label>
          <input
            id="lead-quantity"
            type="number"
            min="0"
            className={controlClass("quantity")}
            placeholder="e.g. 150"
            value={data.quantity}
            onChange={updateField("quantity")}
            onBlur={() => onFieldBlur("chemicalRequirements", "quantity")}
            aria-invalid={Boolean(getError("quantity"))}
          />
          {getError("quantity") ? (
            <div className="lead-field-error">{getError("quantity")}</div>
          ) : null}
        </div>

        <div className="col-md-4">
          <label className="lead-form-label" htmlFor="lead-unit">
            Unit
          </label>
          <select
            id="lead-unit"
            className={controlClass("unit")}
            value={data.unit}
            onChange={updateField("unit")}
            onBlur={() => onFieldBlur("chemicalRequirements", "unit")}
          >
            <option value="MT">MT (Metric Ton)</option>
            <option value="KG">KG (Kilogram)</option>
            <option value="L">Litre</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="lead-form-label" htmlFor="lead-frequency">
            Frequency
          </label>
          <select
            id="lead-frequency"
            className={controlClass("frequency")}
            value={data.frequency}
            onChange={updateField("frequency")}
            onBlur={() => onFieldBlur("chemicalRequirements", "frequency")}
          >
            <option value="One-time">One-time</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Bi-annual">Bi-annual</option>
            <option value="Annual">Annual</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="lead-form-label" htmlFor="lead-price-unit">
            Price Per Unit (USD)
          </label>
          <input
            id="lead-price-unit"
            type="number"
            className={controlClass("pricePerUnit")}
            placeholder="e.g. 300"
            value={data.pricePerUnit}
            onChange={updateField("pricePerUnit")}
            onBlur={() => onFieldBlur("chemicalRequirements", "pricePerUnit")}
            aria-invalid={Boolean(getError("pricePerUnit"))}
          />
          {getError("pricePerUnit") ? (
            <div className="lead-field-error">{getError("pricePerUnit")}</div>
          ) : null}
        </div>

        <div className="col-md-4">
          <label className="lead-form-label" htmlFor="lead-currency">
            Currency
          </label>
          <select
            id="lead-currency"
            className={controlClass("currency")}
            value={data.currency}
            onChange={updateField("currency")}
            onBlur={() => onFieldBlur("chemicalRequirements", "currency")}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="lead-form-label" htmlFor="lead-estimated-value">
            Estimated Value
          </label>
          <input
            id="lead-estimated-value"
            type="text"
            className={controlClass(
              "estimatedValue",
              "lead-form-control-readonly",
            )}
            placeholder="Auto-calculated"
            value={data.estimatedValue}
            readOnly
          />
        </div>
      </div>
    </LeadFormSection>
  );
};

export default memo(LeadChemicalRequirementsSection);
