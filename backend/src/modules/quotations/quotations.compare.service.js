import { getQuotationByPublicId } from "./quotations.read.service.js";

const toNumber = (value) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

const addDays = (value, days) => {
  if (!value) {
    return value;
  }

  const date = new Date(value);
  date.setDate(date.getDate() + days);

  return date.toISOString().slice(0, 10);
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const recalculate = (snapshot) => {
  const subtotal = snapshot.items.reduce(
    (sum, item) => sum + toNumber(item.quantity) * toNumber(item.unitPrice),
    0,
  );
  const freightTotal = toNumber(snapshot.quotation.freightTotal);
  const additionalCharges = toNumber(snapshot.quotation.additionalCharges);
  const discountTotal = toNumber(snapshot.quotation.discountTotal);
  const grandTotal = subtotal + freightTotal + additionalCharges - discountTotal;
  const totalCost =
    snapshot.items.reduce(
      (sum, item) => sum + toNumber(item.quantity) * toNumber(item.supplierCost),
      0,
    ) + freightTotal;
  const grossProfit = grandTotal - totalCost;
  const marginPercent = grandTotal > 0 ? (grossProfit / grandTotal) * 100 : 0;

  snapshot.items = snapshot.items.map((item) => ({
    ...item,
    lineTotal: toNumber(item.quantity) * toNumber(item.unitPrice),
  }));
  snapshot.quotation = {
    ...snapshot.quotation,
    subtotal,
    grandTotal,
    grossProfit,
    marginPercent,
  };

  return snapshot;
};

const buildVersion = (detail, versionId, index, mutator = (value) => value) => {
  const snapshot = mutator(clone(detail));
  const quotation = snapshot.quotation;

  return recalculate({
    ...snapshot,
    versionId,
    versionNumber: index,
    label: `${quotation.quotationNumber} v${index}`,
    isCurrent: versionId === "current",
    createdAt: quotation.updatedAt || quotation.createdAt,
    createdBy: quotation.createdBy || quotation.metadata?.createdBy || "Sales Team",
  });
};

const getMockVersions = (detail) => {
  const current = buildVersion(detail, "current", 3);

  const v2 = buildVersion(detail, "v2", 2, (snapshot) => {
    const item = snapshot.items[0];

    if (item) {
      item.unitPrice = Math.round(toNumber(item.unitPrice) * 1.035 * 100) / 100;
    }

    snapshot.quotation = {
      ...snapshot.quotation,
      status: "Revised",
      validUntil: addDays(snapshot.quotation.validUntil, -1),
      remarks:
        snapshot.quotation.remarks ||
        "Prices are subject to market conditions and stock availability.",
    };

    return snapshot;
  });

  const v1 = buildVersion(detail, "v1", 1, (snapshot) => {
    const item = snapshot.items[0];

    if (item) {
      item.unitPrice = Math.round(toNumber(item.unitPrice) * 1.075 * 100) / 100;
    }

    snapshot.quotation = {
      ...snapshot.quotation,
      status: "Sent",
      incoterm: snapshot.quotation.incoterm === "CIF" ? "FOB" : "CIF",
      validUntil: addDays(snapshot.quotation.validUntil, -2),
      discountTotal: 0,
      remarks:
        "Prices are subject to market conditions and stock availability. COA and MSDS/SDS will be provided where applicable.",
    };

    return snapshot;
  });

  return [current, v2, v1];
};

const buildStoredVersion = (detail) =>
  recalculate({
    quotation: detail.quotation,
    items: detail.items,
    lead: detail.lead,
    versionId: detail.quotation.isLatestVersion ? "current" : detail.quotation.publicId,
    versionNumber: detail.quotation.versionNumber ?? 1,
    label: `${detail.quotation.quotationNumber} v${detail.quotation.versionNumber ?? 1}`,
    isCurrent: detail.quotation.isLatestVersion ?? false,
    createdAt: detail.quotation.createdAt,
    createdBy: detail.quotation.createdBy || "Sales Team",
  });

const getByVersionId = (versions, id) =>
  versions.find((version) => version.versionId === id) ||
  versions.find((version) => `v${version.versionNumber}` === id) ||
  versions.find((version) => version.isCurrent) ||
  versions[0];

const compareField = ({ field, oldValue, currentValue, reason }) => {
  const normalizedOld = oldValue ?? "-";
  const normalizedCurrent = currentValue ?? "-";
  const changeType =
    normalizedOld === normalizedCurrent
      ? "unchanged"
      : normalizedOld === "-"
        ? "added"
        : normalizedCurrent === "-"
          ? "removed"
          : "changed";

  return {
    field,
    oldValue: normalizedOld,
    currentValue: normalizedCurrent,
    changeType,
    reason: changeType === "unchanged" ? "No change" : reason,
  };
};

const buildComparison = (current, older) => {
  const currentItem = current.items[0] || {};
  const oldItem = older.items[0] || {};
  const changes = [
    compareField({
      field: "Unit Price",
      oldValue: oldItem.unitPrice,
      currentValue: currentItem.unitPrice,
      reason: "Pricing negotiation update",
    }),
    compareField({
      field: "Total Value",
      oldValue: older.quotation.grandTotal,
      currentValue: current.quotation.grandTotal,
      reason: "Quotation value recalculated",
    }),
    compareField({
      field: "Gross Margin",
      oldValue: Number(older.quotation.marginPercent || 0).toFixed(1),
      currentValue: Number(current.quotation.marginPercent || 0).toFixed(1),
      reason: "Margin changed with price and terms",
    }),
    compareField({
      field: "Incoterm",
      oldValue: older.quotation.incoterm,
      currentValue: current.quotation.incoterm,
      reason: "Trade term revised",
    }),
    compareField({
      field: "Valid Until",
      oldValue: older.quotation.validUntil,
      currentValue: current.quotation.validUntil,
      reason: "Validity adjusted",
    }),
    compareField({
      field: "Remarks",
      oldValue: older.quotation.remarks,
      currentValue: current.quotation.remarks,
      reason: "Client-facing terms updated",
    }),
  ];
  const changed = changes.filter((change) => change.changeType !== "unchanged");

  return {
    summary: {
      valueDiff: toNumber(current.quotation.grandTotal) - toNumber(older.quotation.grandTotal),
      unitPriceDiff: toNumber(currentItem.unitPrice) - toNumber(oldItem.unitPrice),
      marginDiff:
        toNumber(current.quotation.marginPercent) - toNumber(older.quotation.marginPercent),
      termsChangedCount: changed.filter((change) =>
        ["Incoterm", "Valid Until", "Remarks"].includes(change.field),
      ).length,
    },
    changes,
    changeCount: changed.length,
    added: changes.filter((change) => change.changeType === "added").length,
    removed: changes.filter((change) => change.changeType === "removed").length,
    modified: changes.filter((change) => change.changeType === "changed").length,
  };
};

export const getQuotationVersions = async ({ companyId, publicId }) => {
  const detail = await getQuotationByPublicId({ companyId, publicId });

  if (!detail) {
    return null;
  }

  let versions = getMockVersions(detail);

  if (detail.versionHistory?.length > 1) {
    const versionDetails = await Promise.all(
      detail.versionHistory.map((version) =>
        getQuotationByPublicId({ companyId, publicId: version.publicId }),
      ),
    );
    versions = versionDetails
      .filter(Boolean)
      .map(buildStoredVersion)
      .sort((left, right) => right.versionNumber - left.versionNumber);
  }

  return {
    quotation: detail.quotation,
    versions,
  };
};

export const compareQuotationVersions = async ({ companyId, publicId, v1, v2 }) => {
  const result = await getQuotationVersions({ companyId, publicId });

  if (!result) {
    return null;
  }

  const current = getByVersionId(result.versions, v1);
  const older = getByVersionId(result.versions, v2);

  return {
    quotation: result.quotation,
    versions: result.versions,
    left: current,
    right: older,
    comparison: buildComparison(current, older),
  };
};
