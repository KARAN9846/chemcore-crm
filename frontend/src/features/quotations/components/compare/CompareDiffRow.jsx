const CompareDiffRow = ({ label, mode = "current", row }) => {
  const value = mode === "current" ? row.currentValue : row.oldValue;

  return (
    <div className="quotation-compare-diff-row">
      <span>{label}</span>
      <strong className={row.changeType}>{value}</strong>
    </div>
  );
};

export default CompareDiffRow;
