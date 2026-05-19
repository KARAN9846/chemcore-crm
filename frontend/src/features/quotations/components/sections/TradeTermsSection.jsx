import QuotationSection from "../common/QuotationSection";

const incoterms = ["FOB", "CIF", "CFR", "EXW", "DAP"];
const paymentTerms = [
  "LC at Sight",
  "TT Advance 100%",
  "50% Advance + 50% CAD",
  "CAD",
  "LC 30 Days",
];

const TradeTermsSection = ({ data, errors = {}, onBlur, onInputChange }) => {
  const controlClass = (field) =>
    `lead-form-control ${errors[field] ? "lead-form-control-invalid" : ""}`;

  return (
    <QuotationSection icon="bi-file-earmark-text-fill" title="Trade Terms">
    <div className="row g-3">
      <div className="col-12">
        <label className="lead-form-label">
          Incoterm <span className="req">*</span>
        </label>
        <div className="lead-pill-list">
          {incoterms.map((term) => (
            <button
              key={term}
              type="button"
              className={`lead-choice-pill ${data.incoterm === term ? "selected" : ""} ${
                errors.incoterm ? "invalid" : ""
              }`}
              onBlur={() => onBlur("incoterm")}
              onClick={() => onInputChange("incoterm", term)}
            >
              {term}
            </button>
          ))}
        </div>
        {errors.incoterm ? (
          <div className="lead-field-error">{errors.incoterm}</div>
        ) : null}
      </div>

      <div className="col-md-6">
        <label className="lead-form-label" htmlFor="quotation-loading-port">
          Port of Loading <span className="req">*</span>
        </label>
        <select
          id="quotation-loading-port"
          className={controlClass("loadingPort")}
          value={data.loadingPort}
          onBlur={() => onBlur("loadingPort")}
          onChange={(event) => onInputChange("loadingPort", event.target.value)}
        >
          <option value="">Select port...</option>
          <option value="Mundra Port, Gujarat">Mundra Port, Gujarat</option>
          <option value="JNPT, Mumbai">JNPT, Mumbai</option>
          <option value="Chennai Port">Chennai Port</option>
          <option value="Kandla Port">Kandla Port</option>
          <option value="Vizag Port">Vizag Port</option>
        </select>
        {errors.loadingPort ? (
          <div className="lead-field-error">{errors.loadingPort}</div>
        ) : null}
      </div>

      <div className="col-md-6">
        <label className="lead-form-label" htmlFor="quotation-destination-port">
          Port of Destination
        </label>
        <input
          id="quotation-destination-port"
          className={controlClass("destinationPort")}
          value={data.destinationPort}
          onBlur={() => onBlur("destinationPort")}
          onChange={(event) =>
            onInputChange("destinationPort", event.target.value)
          }
        />
      </div>

      <div className="col-12">
        <label className="lead-form-label">
          Payment Terms <span className="req">*</span>
        </label>
        <div className="lead-pill-list">
          {paymentTerms.map((term) => (
            <button
              key={term}
              type="button"
              className={`lead-choice-pill ${data.paymentTerm === term ? "selected" : ""} ${
                errors.paymentTerm ? "invalid" : ""
              }`}
              onBlur={() => onBlur("paymentTerm")}
              onClick={() => onInputChange("paymentTerm", term)}
            >
              {term}
            </button>
          ))}
        </div>
        {errors.paymentTerm ? (
          <div className="lead-field-error">{errors.paymentTerm}</div>
        ) : null}
      </div>

      <div className="col-md-6">
        <label className="lead-form-label" htmlFor="quotation-packaging">
          Packaging
        </label>
        <select
          id="quotation-packaging"
          className={controlClass("packaging")}
          value={data.packaging}
          onBlur={() => onBlur("packaging")}
          onChange={(event) => onInputChange("packaging", event.target.value)}
        >
          <option value="">Select packaging...</option>
          <option value="25 KG HDPE Bags (ArchemCore branded)">
            25 KG HDPE Bags (ArchemCore branded)
          </option>
          <option value="50 KG HDPE Bags">50 KG HDPE Bags</option>
          <option value="1 MT Jumbo Bags">1 MT Jumbo Bags</option>
          <option value="IBC Totes">IBC Totes</option>
          <option value="As-is from supplier">As-is from supplier</option>
        </select>
        {errors.packaging ? (
          <div className="lead-field-error">{errors.packaging}</div>
        ) : null}
      </div>

      <div className="col-md-6">
        <label className="lead-form-label" htmlFor="quotation-delivery">
          Delivery Timeline
        </label>
        <input
          id="quotation-delivery"
          className={controlClass("deliveryTimeline")}
          value={data.deliveryTimeline}
          onBlur={() => onBlur("deliveryTimeline")}
          onChange={(event) =>
            onInputChange("deliveryTimeline", event.target.value)
          }
        />
      </div>
    </div>
    </QuotationSection>
  );
};

export default TradeTermsSection;
