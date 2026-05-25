import CompareDiffRow from "./CompareDiffRow";

const CompareSection = ({ mode, section }) => (
  <section className="quotation-compare-section">
    <h3>{section.title}</h3>
    {section.rows.map((row) => (
      <CompareDiffRow key={row.label} label={row.label} mode={mode} row={row} />
    ))}
  </section>
);

export default CompareSection;
