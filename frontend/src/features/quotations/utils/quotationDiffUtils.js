export const normalizeCompareValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

export const getChangeType = (oldValue, currentValue) => {
  const oldText = normalizeCompareValue(oldValue);
  const currentText = normalizeCompareValue(currentValue);

  if (oldText === currentText) return "unchanged";
  if (oldText === "-") return "added";
  if (currentText === "-") return "removed";
  return "changed";
};

export const buildTextDiff = (currentText = "", oldText = "") => ({
  current: normalizeCompareValue(currentText),
  old: normalizeCompareValue(oldText),
  changed: normalizeCompareValue(currentText) !== normalizeCompareValue(oldText),
});
