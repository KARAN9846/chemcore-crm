const PAYMENT_TERM_OPTIONS = [
  "Advance",
  "30 Days Credit",
  "Against Delivery",
  "LC",
  "50% Advance",
];

const SupplyTerms = ({
  supplier,
  updateSupplierField,
  togglePaymentTerm,
  errors,
}) => {
  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-file-text"></i> Supply Terms
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label" htmlFor="supplier-min-order">
            Minimum Order
          </label>
          <div
            className={`input-group-unit ${errors.minOrder ? "field-error" : ""}`}
          >
            <input
              type="number"
              className="form-control"
              id="supplier-min-order"
              placeholder="10"
              min="0"
              value={supplier.minOrder}
              onChange={(event) =>
                updateSupplierField("minOrder", event.target.value)
              }
            />
            <span className="input-unit">MT</span>
          </div>
          {errors.minOrder && (
            <div className="field-feedback">{errors.minOrder}</div>
          )}
        </div>

        <div className="col-md-4">
          <label className="form-label" htmlFor="supplier-lead-time">
            Lead Time (days)
          </label>
          <input
            type="number"
            className={`form-control ${errors.leadTime ? "field-error" : ""}`}
            id="supplier-lead-time"
            placeholder="15"
            min="1"
            value={supplier.leadTime}
            onChange={(event) =>
              updateSupplierField("leadTime", event.target.value)
            }
          />
          {errors.leadTime && (
            <div className="field-feedback">{errors.leadTime}</div>
          )}
        </div>

        <div className="col-md-4">
          <label className="form-label" htmlFor="supplier-reliability">
            Reliability
          </label>
          <select
            className="form-select"
            id="supplier-reliability"
            value={supplier.reliability}
            onChange={(event) =>
              updateSupplierField("reliability", event.target.value)
            }
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Payment Terms Offered</label>
          <div className="payment-terms-multi">
            {PAYMENT_TERM_OPTIONS.map((term) => (
              <button
                key={term}
                type="button"
                className={`pt-toggle ${
                  supplier.paymentTerms.includes(term) ? "selected" : ""
                }`}
                onClick={() => togglePaymentTerm(term)}
              >
                {term}
              </button>
            ))}
          </div>
          {errors.paymentTerms && (
            <div className="field-feedback">{errors.paymentTerms}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplyTerms;
