import { memo } from "react";

import LeadFormSection from "../common/LeadFormSection";

const incoterms = ["FOB", "CIF", "CFR", "EXW", "DAP", "Not decided"];
const paymentTerms = [
  "LC",
  "TT Advance",
  "50% Advance + 50% CAD",
  "Cash Against Document",
  "Not decided",
];

const LeadTradeTermsSection = ({
  data,
  errors = {},
  touched = {},
  submitAttempted,
  onInputChange,
  onFieldBlur,
  onTradeTermToggle,
  onPaymentTermToggle,
}) => {
  const updateField = (field) => (event) => {
    onInputChange("tradeTerms", field, event.target.value);
  };
  const getError = (field) =>
    submitAttempted || touched[field] ? errors[field] : "";
  const controlClass = (field) =>
    `lead-form-control ${getError(field) ? "lead-form-control-invalid" : ""}`;

  return (
    <LeadFormSection icon="bi-file-earmark-text-fill" title="Trade Terms">
      <div className="row g-3">
        <div className="col-12">
          <label className="lead-form-label">Incoterm Preference</label>
          <div className="lead-pill-list">
            {incoterms.map((term) => (
              <button
                key={term}
                type="button"
                className={`lead-choice-pill ${
                  data.incoterms.includes(term) ? "selected" : ""
                } ${getError("incoterms") ? "invalid" : ""}`}
                aria-pressed={data.incoterms.includes(term)}
                aria-invalid={Boolean(getError("incoterms"))}
                onBlur={() => onFieldBlur("tradeTerms", "incoterms")}
                onClick={() => onTradeTermToggle(term)}
              >
                {term}
              </button>
            ))}
          </div>
          {getError("incoterms") ? (
            <div className="lead-field-error">{getError("incoterms")}</div>
          ) : null}
        </div>

        <div className="col-12">
          <label className="lead-form-label">Payment Terms Preference</label>
          <div className="lead-pill-list">
            {paymentTerms.map((term) => (
              <button
                key={term}
                type="button"
                className={`lead-choice-pill ${
                  data.paymentTerms.includes(term) ? "selected" : ""
                }`}
                aria-pressed={data.paymentTerms.includes(term)}
                onBlur={() => onFieldBlur("tradeTerms", "paymentTerms")}
                onClick={() => onPaymentTermToggle(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-destination-port">
            Port of Destination
          </label>
          <input
            id="lead-destination-port"
            type="text"
            className={controlClass("destinationPort")}
            placeholder="e.g. Shuwaikh Port, Kuwait"
            value={data.destinationPort}
            onChange={updateField("destinationPort")}
            onBlur={() => onFieldBlur("tradeTerms", "destinationPort")}
          />
        </div>

        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-packaging">
            Packaging Requirement
          </label>
          <select
            id="lead-packaging"
            className={controlClass("packaging")}
            value={data.packaging}
            onChange={updateField("packaging")}
            onBlur={() => onFieldBlur("tradeTerms", "packaging")}
          >
            <option value="">Not specified</option>
            <option>25 KG HDPE Bags</option>
            <option>50 KG HDPE Bags</option>
            <option>1 MT Jumbo Bags</option>
            <option>IBC Totes</option>
            <option>Drums</option>
            <option>Bulk (Tanker)</option>
            <option>As-is from supplier</option>
          </select>
        </div>
      </div>
    </LeadFormSection>
  );
};

export default memo(LeadTradeTermsSection);
