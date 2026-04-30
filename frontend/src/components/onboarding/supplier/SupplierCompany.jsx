const SupplierCompany = ({ supplier, updateSupplierField, errors }) => {
  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-building"></i> Supplier Company
      </div>

      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label" htmlFor="supplier-company-name">
            Company Name <span className="req">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.companyName ? "field-error" : ""}`}
            id="supplier-company-name"
            placeholder="e.g. ChemSource India Pvt Ltd"
            value={supplier.companyName}
            onChange={(event) =>
              updateSupplierField("companyName", event.target.value)
            }
            required
          />
          {errors.companyName && (
            <div className="field-feedback">Supplier name is required.</div>
          )}
        </div>

        <div className="col-md-4">
          <label className="form-label" htmlFor="supplier-type">
            Supplier Type
          </label>
          <select
            className="form-select"
            id="supplier-type"
            value={supplier.supplierType}
            onChange={(event) =>
              updateSupplierField("supplierType", event.target.value)
            }
          >
            <option value="manufacturer">Manufacturer</option>
            <option value="trader">Trader / Agent</option>
            <option value="distributor">Distributor</option>
            <option value="stockist">Stockist</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="supplier-city">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="supplier-city"
            placeholder="e.g. Mumbai"
            value={supplier.city}
            onChange={(event) => updateSupplierField("city", event.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="supplier-country">
            Country <span className="req">*</span>
          </label>
          <select
            className={`form-select ${errors.country ? "field-error" : ""}`}
            id="supplier-country"
            value={supplier.country}
            onChange={(event) =>
              updateSupplierField("country", event.target.value)
            }
            required
          >
            <option value="">Select country</option>
            <option value="IN">India</option>
            <option value="CN">China</option>
            <option value="DE">Germany</option>
            <option value="US">United States</option>
            <option value="AE">UAE</option>
            <option value="SG">Singapore</option>
            <option value="JP">Japan</option>
          </select>
          {errors.country && (
            <div className="field-feedback">Country is required.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierCompany;
