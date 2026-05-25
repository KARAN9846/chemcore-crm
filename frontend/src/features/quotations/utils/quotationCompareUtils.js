import {
  formatQuotationDate,
  formatQuotationMoney,
  formatQuotationPercent,
} from "./quotationDisplayUtils";
import { getChangeType, normalizeCompareValue } from "./quotationDiffUtils";

const firstItem = (version) => version?.items?.[0] || {};

const makeRow = ({ currentValue, label, oldValue }) => ({
  label,
  currentValue: normalizeCompareValue(currentValue),
  oldValue: normalizeCompareValue(oldValue),
  changeType: getChangeType(oldValue, currentValue),
});

export const getVersionLabel = (version) =>
  `${version?.label || version?.quotation?.quotationNumber || "Version"}${
    version?.isCurrent ? " (Current)" : ""
  }`;

export const getCompareSections = (left, right) => {
  const leftItem = firstItem(left);
  const rightItem = firstItem(right);
  const currency = left?.quotation?.currency || right?.quotation?.currency || "USD";

  return [
    {
      title: "Pricing",
      rows: [
        makeRow({
          label: "Unit Price",
          currentValue: formatQuotationMoney(leftItem.unitPrice, currency),
          oldValue: formatQuotationMoney(rightItem.unitPrice, currency),
        }),
        makeRow({
          label: "Quantity",
          currentValue: `${leftItem.quantity || "-"} ${leftItem.unit || ""}`.trim(),
          oldValue: `${rightItem.quantity || "-"} ${rightItem.unit || ""}`.trim(),
        }),
        makeRow({
          label: "Total Value",
          currentValue: formatQuotationMoney(left?.quotation?.grandTotal, currency),
          oldValue: formatQuotationMoney(right?.quotation?.grandTotal, currency),
        }),
        makeRow({
          label: "Discount",
          currentValue: formatQuotationMoney(left?.quotation?.discountTotal, currency),
          oldValue: formatQuotationMoney(right?.quotation?.discountTotal, currency),
        }),
        makeRow({
          label: "Gross Margin",
          currentValue: formatQuotationPercent(left?.quotation?.marginPercent),
          oldValue: formatQuotationPercent(right?.quotation?.marginPercent),
        }),
      ],
    },
    {
      title: "Trade Terms",
      rows: [
        makeRow({
          label: "Incoterm",
          currentValue: left?.quotation?.incoterm,
          oldValue: right?.quotation?.incoterm,
        }),
        makeRow({
          label: "Payment Terms",
          currentValue: left?.quotation?.paymentTerms,
          oldValue: right?.quotation?.paymentTerms,
        }),
        makeRow({
          label: "Currency",
          currentValue: left?.quotation?.currency,
          oldValue: right?.quotation?.currency,
        }),
        makeRow({
          label: "Valid Until",
          currentValue: formatQuotationDate(left?.quotation?.validUntil),
          oldValue: formatQuotationDate(right?.quotation?.validUntil),
        }),
      ],
    },
    {
      title: "Product",
      rows: [
        makeRow({
          label: "Chemical",
          currentValue: leftItem.chemicalName,
          oldValue: rightItem.chemicalName,
        }),
        makeRow({
          label: "Grade",
          currentValue: leftItem.gradeSpec,
          oldValue: rightItem.gradeSpec,
        }),
        makeRow({
          label: "Packaging",
          currentValue: left?.quotation?.packagingDetails,
          oldValue: right?.quotation?.packagingDetails,
        }),
      ],
    },
  ];
};

export const getCompareSummaryCards = (comparison, currency = "USD") => [
  {
    label: "Total Value",
    value: formatQuotationMoney(comparison?.summary?.valueDiff || 0, currency),
    tone: Number(comparison?.summary?.valueDiff || 0) >= 0 ? "up" : "down",
    icon: "bi-cash-stack",
  },
  {
    label: "Unit Price",
    value: formatQuotationMoney(comparison?.summary?.unitPriceDiff || 0, currency),
    tone: Number(comparison?.summary?.unitPriceDiff || 0) >= 0 ? "up" : "down",
    icon: "bi-tag",
  },
  {
    label: "Gross Margin",
    value: formatQuotationPercent(comparison?.summary?.marginDiff || 0),
    tone: Number(comparison?.summary?.marginDiff || 0) >= 0 ? "up" : "down",
    icon: "bi-percent",
  },
  {
    label: "Terms Changed",
    value: comparison?.summary?.termsChangedCount || 0,
    tone: "changed",
    icon: "bi-arrow-left-right",
  },
];
