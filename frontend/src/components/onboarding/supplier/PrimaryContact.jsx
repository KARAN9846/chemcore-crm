const PrimaryContact = ({ supplier, updateSupplierField, errors }) => {
  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-person-lines-fill"></i> Primary Contact
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="supplier-contact-person">
            Contact Person <span className="req">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.contactPerson ? "field-error" : ""}`}
            id="supplier-contact-person"
            placeholder="Full name"
            value={supplier.contactPerson}
            onChange={(event) =>
              updateSupplierField("contactPerson", event.target.value)
            }
            required
          />
          {errors.contactPerson && (
            <div className="field-feedback">Contact name is required.</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="supplier-designation">
            Designation
          </label>
          <input
            type="text"
            className="form-control"
            id="supplier-designation"
            placeholder="e.g. Sales Manager"
            value={supplier.designation}
            onChange={(event) =>
              updateSupplierField("designation", event.target.value)
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="supplier-email">
            Email <span className="req">*</span>
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "field-error" : ""}`}
            id="supplier-email"
            placeholder="supplier@company.com"
            value={supplier.email}
            onChange={(event) => updateSupplierField("email", event.target.value)}
            required
          />
          {errors.email && (
            <div className="field-feedback">Valid email is required.</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="supplier-phone">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            className="form-control"
            id="supplier-phone"
            placeholder="+91 98765 43210"
            value={supplier.phone}
            onChange={(event) => updateSupplierField("phone", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PrimaryContact;
