const ProgressBar = ({ currentStep = 1 }) => {
  const isDone = (step) => currentStep > step;
  const isActive = (step) => currentStep === step;

  return (
    <div className="progress-bar-wrap">
      <div className="progress-steps">
        <div
          className={`prog-step ${
            isDone(1) ? "done" : isActive(1) ? "active" : ""
          }`}
        >
          <div className="prog-dot">
            {isDone(1) ? <i className="bi bi-check-lg prog-check"></i> : "1"}
          </div>
          <span className="prog-label">Company</span>
        </div>

        <div
          className={`prog-step ${
            isDone(2) ? "done" : isActive(2) ? "active" : ""
          }`}
        >
          <div className="prog-dot">
            {isDone(2) ? <i className="bi bi-check-lg prog-check"></i> : "2"}
          </div>
          <span className="prog-label">Branding</span>
        </div>

        <div
          className={`prog-step ${
            isDone(3) ? "done" : isActive(3) ? "active" : ""
          }`}
        >
          <div className="prog-dot">
            {isDone(3) ? <i className="bi bi-check-lg prog-check"></i> : "3"}
          </div>
          <span className="prog-label">Team</span>
        </div>

        <div
          className={`prog-step ${
            isDone(4) ? "done" : isActive(4) ? "active" : ""
          }`}
        >
          <div className="prog-dot">
            {isDone(4) ? <i className="bi bi-check-lg prog-check"></i> : "4"}
          </div>
          <span className="prog-label">Chemicals</span>
        </div>

        <div
          className={`prog-step ${
            isDone(5) ? "done" : isActive(5) ? "active" : ""
          }`}
        >
          <div className="prog-dot">
            {isDone(5) ? <i className="bi bi-check-lg prog-check"></i> : "5"}
          </div>
          <span className="prog-label">Supplier</span>
        </div>

        <div className={`prog-step ${currentStep > 5 ? "active" : ""}`}>
          <div className="prog-dot">
            <i className="bi bi-check-lg prog-check"></i>
          </div>
          <span className="prog-label">Done</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
