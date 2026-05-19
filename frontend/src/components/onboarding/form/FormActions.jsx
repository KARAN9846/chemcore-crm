import { useNavigate } from "react-router-dom";

const FormActions = ({ loading, onBack, onContinue }) => {
  const navigate = useNavigate();

  return (
    <div className="form-actions">
      <button
        type="button"
        className="btn-back"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          if (onBack) {
            onBack(event);
            return;
          }

          navigate("/");
        }}
      >
        <i className="bi bi-arrow-left"></i> Back
      </button>

      <div className="save-note">
        <i className="bi bi-cloud-check" style={{ color: "var(--g500)" }}></i>
        Progress auto-saved
      </div>

      <button
        type="button"
        className="btn-next"
        onClick={(event) => {
          console.log("BUTTON CLICK");
          onContinue?.(event);
        }}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="btn-spinner" aria-hidden="true"></span>
            Saving...
          </>
        ) : (
          <>
            Save & Continue <i className="bi bi-arrow-right"></i>
          </>
        )}
      </button>
    </div>
  );
};

export default FormActions;
