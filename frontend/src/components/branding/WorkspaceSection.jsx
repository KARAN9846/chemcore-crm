const WorkspaceSection = ({ form, errors, touched, onChange, onBlur }) => {
  const workspaceInvalid = touched.workspaceName && errors.workspaceName;

  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-type"></i> Workspace Display Name
      </div>

      <div className="mb-3">
        <label className="form-label">
          Workspace Name <span className="req">*</span>
        </label>
        <input
          type="text"
          name="workspaceName"
          className={`form-control ${workspaceInvalid ? "field-error" : ""}`}
          placeholder="e.g. ArchemCore CRM"
          value={form.workspaceName}
          onChange={(e) => onChange("workspaceName", e.target.value)}
          onBlur={() => onBlur("workspaceName")}
          maxLength="50"
        />
        {workspaceInvalid ? (
          <div className="field-feedback">{errors.workspaceName}</div>
        ) : null}
        <div className="form-hint">
          Shown in the browser tab, navbar and emails.
        </div>
      </div>

      <div>
        <label className="form-label">
          Tagline <span className="label-optional">(optional)</span>
        </label>
        <input
          type="text"
          name="tagline"
          className="form-control"
          placeholder="e.g. Chemical Export Management"
          value={form.tagline}
          onChange={(e) => onChange("tagline", e.target.value)}
          onBlur={() => onBlur("tagline")}
          maxLength="60"
        />
        <div className="form-hint">Shown below the logo in the navbar.</div>
      </div>
    </div>
  );
};

export default WorkspaceSection;
