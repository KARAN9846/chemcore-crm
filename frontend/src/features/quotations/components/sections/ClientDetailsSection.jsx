import QuotationSection from "../common/QuotationSection";

const ClientDetailsSection = ({
  client,
  errors = {},
  isLoadingLeadOptions = false,
  leadOptions = [],
  onBlur,
  onClientChange,
  onClientSelect,
  onQuotationInfoChange,
  quotationInfo,
}) => {
  const clientErrors = errors.client ?? {};
  const quotationErrors = errors.quotationInfo ?? {};
  const controlClass = (hasError) =>
    `lead-form-control ${hasError ? "lead-form-control-invalid" : ""}`;
  const readonlyClass = (hasError) =>
    `${controlClass(hasError)} quotation-readonly`;

  return (
    <QuotationSection
      description="Choose a lead and confirm the billing contact before pricing."
      icon="bi-person-lines-fill"
      title="Client & Quotation Details"
    >
    <div className="row g-3">
      <div className="col-md-6">
        <label className="lead-form-label" htmlFor="quotation-client">
          Lead / Client <span className="req">*</span>
        </label>
        <select
          id="quotation-client"
          className="lead-form-control"
          value={client.leadId}
          onChange={(event) => onClientSelect(event.target.value)}
          onBlur={() => onBlur("client", "leadId")}
        >
          <option value="">
            {isLoadingLeadOptions ? "Loading leads..." : "Select from existing leads..."}
          </option>
          {leadOptions.map((lead) => (
            <option key={lead.publicId} value={lead.publicId}>
              {lead.displayLabel}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label className="lead-form-label" htmlFor="quotation-reference">
          Quotation Reference
        </label>
        <input
          id="quotation-reference"
          className={readonlyClass(quotationErrors.reference)}
          readOnly
          placeholder="Generated when saved"
          value={quotationInfo.reference}
          onBlur={() => onBlur("quotationInfo", "reference")}
        />
        {quotationErrors.reference ? (
          <div className="lead-field-error">{quotationErrors.reference}</div>
        ) : null}
        <div className="lead-form-hint">Auto-generated. Version will be added when saved.</div>
      </div>

      <div className="col-md-6">
        <label className="lead-form-label" htmlFor="quotation-client-name">
          Client Name <span className="req">*</span>
        </label>
        <input
          id="quotation-client-name"
          className={controlClass(clientErrors.name)}
          placeholder="Client contact name"
          value={client.name}
          onBlur={() => onBlur("client", "name")}
          onChange={(event) => onClientChange("name", event.target.value)}
        />
        {clientErrors.name ? (
          <div className="lead-field-error">{clientErrors.name}</div>
        ) : null}
      </div>

      <div className="col-md-6">
        <label className="lead-form-label" htmlFor="quotation-client-email">
          Client Email <span className="req">*</span>
        </label>
        <input
          id="quotation-client-email"
          type="email"
          className={controlClass(clientErrors.email)}
          placeholder="client@company.com"
          value={client.email}
          onBlur={() => onBlur("client", "email")}
          onChange={(event) => onClientChange("email", event.target.value)}
        />
        {clientErrors.email ? (
          <div className="lead-field-error">{clientErrors.email}</div>
        ) : null}
      </div>

      <div className="col-md-6">
        <label className="lead-form-label" htmlFor="quotation-company">
          Client Company
        </label>
        <input
          id="quotation-company"
          className={controlClass(clientErrors.company)}
          placeholder="Company name"
          value={client.company}
          onBlur={() => onBlur("client", "company")}
          onChange={(event) => onClientChange("company", event.target.value)}
        />
        {clientErrors.company ? (
          <div className="lead-field-error">{clientErrors.company}</div>
        ) : null}
      </div>

      <div className="col-md-3">
        <label className="lead-form-label" htmlFor="quotation-country">
          Country
        </label>
        <input
          id="quotation-country"
          className={controlClass(clientErrors.country)}
          placeholder="Country"
          value={client.country}
          onBlur={() => onBlur("client", "country")}
          onChange={(event) => onClientChange("country", event.target.value)}
        />
        {clientErrors.country ? (
          <div className="lead-field-error">{clientErrors.country}</div>
        ) : null}
      </div>

      <div className="col-md-3">
        <label className="lead-form-label" htmlFor="quotation-currency">
          Currency <span className="req">*</span>
        </label>
        <select
          id="quotation-currency"
          className={controlClass(quotationErrors.currency)}
          value={quotationInfo.currency}
          onBlur={() => onBlur("quotationInfo", "currency")}
          onChange={(event) => onQuotationInfoChange("currency", event.target.value)}
        >
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="INR">INR - Indian Rupee</option>
        </select>
      </div>

      <div className="col-md-6">
        <label className="lead-form-label" htmlFor="quotation-date">
          Quotation Date <span className="req">*</span>
        </label>
        <input
          id="quotation-date"
          type="date"
          className={controlClass(quotationErrors.quotationDate)}
          value={quotationInfo.quotationDate}
          onBlur={() => onBlur("quotationInfo", "quotationDate")}
          onChange={(event) =>
            onQuotationInfoChange("quotationDate", event.target.value)
          }
        />
        {quotationErrors.quotationDate ? (
          <div className="lead-field-error">{quotationErrors.quotationDate}</div>
        ) : null}
      </div>

      <div className="col-md-6">
        <label className="lead-form-label" htmlFor="quotation-valid-until">
          Valid Until <span className="req">*</span>
        </label>
        <input
          id="quotation-valid-until"
          type="date"
          className={controlClass(quotationErrors.validUntil)}
          value={quotationInfo.validUntil}
          onBlur={() => onBlur("quotationInfo", "validUntil")}
          onChange={(event) =>
            onQuotationInfoChange("validUntil", event.target.value)
          }
        />
        {quotationErrors.validUntil ? (
          <div className="lead-field-error">{quotationErrors.validUntil}</div>
        ) : null}
        <div className="lead-form-hint">Standard validity: 14 days from quotation date.</div>
      </div>
    </div>
    </QuotationSection>
  );
};

export default ClientDetailsSection;
