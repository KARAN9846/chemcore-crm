const QuickActions = ({ navigate }) => {
  return (
    <>
      <div className="quickstart-title">
        <i className="bi bi-lightning-charge-fill me-1"></i>
        What do you want to do first?
      </div>

      <div className="quickstart-grid">
        <button
          type="button"
          className="qs-card"
          onClick={() => navigate("/leads")}
        >
          <div className="qs-icon">
            <i className="bi bi-people-fill"></i>
          </div>
          <div className="qs-label">Add a Lead</div>
          <div className="qs-hint">Start your sales pipeline</div>
        </button>

        <button
          type="button"
          className="qs-card"
          onClick={() => navigate("/quotations")}
        >
          <div className="qs-icon">
            <i className="bi bi-file-earmark-text-fill"></i>
          </div>
          <div className="qs-label">Create Quotation</div>
          <div className="qs-hint">Send your first quote</div>
        </button>

        <button
          type="button"
          className="qs-card"
          onClick={() => navigate("/suppliers")}
        >
          <div className="qs-icon">
            <i className="bi bi-building-fill"></i>
          </div>
          <div className="qs-label">Add Supplier</div>
          <div className="qs-hint">Build your supplier base</div>
        </button>

        <button
          type="button"
          className="qs-card"
          onClick={() => navigate("/settings")}
        >
          <div className="qs-icon">
            <i className="bi bi-gear-fill"></i>
          </div>
          <div className="qs-label">Settings</div>
          <div className="qs-hint">Customise your workspace</div>
        </button>
      </div>
    </>
  );
};

export default QuickActions;
