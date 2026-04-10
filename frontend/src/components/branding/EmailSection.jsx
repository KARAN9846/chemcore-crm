const EmailSection = ({ form, errors, touched, onChange, onBlur }) => {
  const fromNameInvalid = touched.fromName && errors.fromName;
  const replyToInvalid = touched.replyTo && errors.replyTo;

  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-envelope"></i> Email Settings
      </div>

      <div className="mb-3">
        <label className="form-label">
          From Name <span className="req">*</span>
        </label>
        <input
          type="text"
          name="fromName"
          className={`form-control ${fromNameInvalid ? "field-error" : ""}`}
          placeholder="e.g. ArchemCore CRM"
          value={form.fromName}
          onChange={(e) => onChange("fromName", e.target.value)}
          onBlur={() => onBlur("fromName")}
        />
        {fromNameInvalid ? (
          <div className="field-feedback">{errors.fromName}</div>
        ) : null}
        <div className="form-hint">
          Shown as sender name in all system emails to clients and team.
        </div>
      </div>

      <div>
        <label className="form-label">
          Reply-To Email <span className="req">*</span>
        </label>
        <input
          type="email"
          name="replyTo"
          className={`form-control ${replyToInvalid ? "field-error" : ""}`}
          placeholder="e.g. crm@archemcore.com"
          value={form.replyTo}
          onChange={(e) => onChange("replyTo", e.target.value)}
          onBlur={() => onBlur("replyTo")}
        />
        {replyToInvalid ? (
          <div className="field-feedback">{errors.replyTo}</div>
        ) : null}
        <div className="form-hint">
          Clients reply to this address when they receive quotations and
          documents.
        </div>
      </div>
    </div>
  );
};

export default EmailSection;
