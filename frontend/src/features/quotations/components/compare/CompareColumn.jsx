import { formatQuotationDate } from "../../utils/quotationDisplayUtils";
import CompareRemarksDiff from "./CompareRemarksDiff";
import CompareSection from "./CompareSection";

const CompareColumn = ({ badge, mode, sections = [], version }) => (
  <article className={`quotation-compare-column ${mode}`}>
    <header>
      <div>
        <h2>{version.label}</h2>
        <p>
          {formatQuotationDate(version.quotation.quotationDate)} -{" "}
          {version.createdBy || "Sales Team"}
        </p>
      </div>
      <span>{badge}</span>
    </header>
    {sections.map((section) => (
      <CompareSection key={section.title} mode={mode} section={section} />
    ))}
    <CompareRemarksDiff
      leftText={version.quotation.remarks}
      mode={mode}
      rightText={version.compareAgainst?.quotation?.remarks}
    />
  </article>
);

export default CompareColumn;
