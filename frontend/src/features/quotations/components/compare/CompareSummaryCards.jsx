const CompareSummaryCards = ({ cards = [], title }) => (
  <section className="quotation-compare-summary">
    <header>
      <i className="bi bi-lightning-fill" aria-hidden="true"></i>
      {title}
    </header>
    <div>
      {cards.map((card) => (
        <article key={card.label} className={`quotation-compare-summary-card ${card.tone}`}>
          <i className={`bi ${card.icon}`} aria-hidden="true"></i>
          <strong>{card.value}</strong>
          <span>{card.label}</span>
        </article>
      ))}
    </div>
  </section>
);

export default CompareSummaryCards;
