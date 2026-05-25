import { getVersionLabel } from "../../utils/quotationCompareUtils";

const VersionSelectorBar = ({
  leftVersionId,
  onLeftChange,
  onRightChange,
  rightVersionId,
  versions = [],
}) => (
  <section className="quotation-version-selector">
    <div className="quotation-version-control">
      <span>Compare</span>
      <select value={leftVersionId} onChange={(event) => onLeftChange(event.target.value)}>
        {versions.map((version) => (
          <option key={version.versionId} value={version.versionId}>
            {getVersionLabel(version)}
          </option>
        ))}
      </select>
    </div>
    <span className="quotation-version-vs">vs</span>
    <div className="quotation-version-control">
      <span>Against</span>
      <select value={rightVersionId} onChange={(event) => onRightChange(event.target.value)}>
        {versions.map((version) => (
          <option key={version.versionId} value={version.versionId}>
            {getVersionLabel(version)}
          </option>
        ))}
      </select>
    </div>
    <div className="quotation-diff-legend">
      <span><i className="added"></i>Added</span>
      <span><i className="removed"></i>Removed</span>
      <span><i className="changed"></i>Changed</span>
    </div>
  </section>
);

export default VersionSelectorBar;
