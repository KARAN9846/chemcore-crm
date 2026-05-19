const LeadScoreCard = ({ scorePreview }) => {
  const score = scorePreview?.score ?? 0;
  const status = scorePreview?.status ?? "Cold";
  const factors = scorePreview?.factors ?? [];

  return (
    <section className="lead-insight-card lead-score-card">
      <header className="lead-insight-card-header">
        <span className="lead-insight-icon lead-insight-icon-score">
          <i className="bi bi-stars" aria-hidden="true"></i>
        </span>
        <div>
          <h3>Estimated Lead Score</h3>
          <p>{score > 0 ? `${status} lead preview` : "Fill form to see score"}</p>
        </div>
      </header>

      <div className="lead-score-summary">
        <div
          className={`lead-score-ring lead-score-ring-${status.toLowerCase()}`}
          aria-label={`Lead score ${score}`}
          style={{ "--lead-score": `${score}%` }}
        >
          <span>{score}</span>
        </div>
        <div className="lead-score-copy">
          <strong>{status} lead</strong>
          <span>Complete key sales details to unlock lead quality signals.</span>
        </div>
      </div>

      <div className="lead-score-progress" aria-hidden="true">
        <span style={{ width: `${score}%` }}></span>
      </div>

      <ul className="lead-insight-list lead-score-factor-list">
        {factors.map((factor) => (
          <li
            key={factor.label}
            className={`lead-score-factor ${
              factor.complete ? "complete" : "pending"
            }`}
          >
            <i
              className={`bi ${
                factor.complete
                  ? "bi-check-circle-fill"
                  : "bi-x-circle-fill"
              }`}
              aria-hidden="true"
            ></i>
            <span>{factor.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LeadScoreCard;
