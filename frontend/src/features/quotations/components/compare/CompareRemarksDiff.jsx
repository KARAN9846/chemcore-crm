import { buildTextDiff } from "../../utils/quotationDiffUtils";

const CompareRemarksDiff = ({ leftText, mode = "current", rightText }) => {
  const diff = buildTextDiff(leftText, rightText);
  const highlightClass = mode === "older" ? "diff-rem" : "diff-add";

  return (
    <section className="quotation-compare-section">
      <h3>Remarks Diff</h3>
      <div className="quotation-remarks-diff">
        <span className={diff.changed ? highlightClass : ""}>{diff.current}</span>
      </div>
    </section>
  );
};

export default CompareRemarksDiff;
