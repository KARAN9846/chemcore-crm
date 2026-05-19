export const normalizeQuotationNumber = (value) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatQuotationPercent = (value) =>
  `${normalizeQuotationNumber(value).toFixed(1)}%`;

export const formatQuotationMoney = (amount, currency = "USD") =>
  `${currency} ${normalizeQuotationNumber(amount).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;

export const getLineItemTotal = (item) =>
  normalizeQuotationNumber(item.quantity) *
  normalizeQuotationNumber(item.unitPrice);

export const getLineItemSupplierTotal = (item) =>
  normalizeQuotationNumber(item.quantity) *
  normalizeQuotationNumber(item.supplierCost);

export const getLineItemFreight = (item) =>
  normalizeQuotationNumber(item.freight);

export const getLineItemGrossProfit = (item) =>
  getLineItemTotal(item) - getLineItemSupplierTotal(item) - getLineItemFreight(item);

export const getLineItemMarginPercent = (item) => {
  const lineTotal = getLineItemTotal(item);

  return lineTotal > 0 ? (getLineItemGrossProfit(item) / lineTotal) * 100 : 0;
};

export const getDerivedLineItem = (item) => ({
  ...item,
  quantityNumber: normalizeQuotationNumber(item.quantity),
  unitPriceNumber: normalizeQuotationNumber(item.unitPrice),
  supplierCostNumber: normalizeQuotationNumber(item.supplierCost),
  freightNumber: getLineItemFreight(item),
  lineTotal: getLineItemTotal(item),
  supplierTotal: getLineItemSupplierTotal(item),
  grossProfit: getLineItemGrossProfit(item),
  marginPercent: getLineItemMarginPercent(item),
});

export const getQuotationTotals = ({
  charges,
  currency,
  lineItems,
}) => {
  const derivedLineItems = lineItems.map(getDerivedLineItem);
  const subtotal = derivedLineItems.reduce((total, item) => total + item.lineTotal, 0);
  const supplierTotal = derivedLineItems.reduce(
    (total, item) => total + item.supplierTotal,
    0,
  );
  const lineFreightTotal = derivedLineItems.reduce(
    (total, item) => total + item.freightNumber,
    0,
  );
  const freight = normalizeQuotationNumber(charges.freight);
  const otherCharges = normalizeQuotationNumber(charges.otherCharges);
  const discount = normalizeQuotationNumber(charges.discount);
  const discountAmount =
    charges.discountType === "pct" ? subtotal * (discount / 100) : discount;
  const grandTotal = subtotal + freight + otherCharges - discountAmount;
  const totalSupplierCost = supplierTotal + lineFreightTotal;
  const grossProfit = grandTotal - totalSupplierCost;
  const marginPercent = grandTotal > 0 ? (grossProfit / grandTotal) * 100 : 0;
  const totalQuantity = derivedLineItems.reduce(
    (total, item) => total + item.quantityNumber,
    0,
  );

  return {
    currency,
    lineItems: derivedLineItems,
    subtotal,
    freight,
    lineFreightTotal,
    otherCharges,
    discountAmount,
    grandTotal,
    supplierTotal,
    totalSupplierCost,
    grossProfit,
    marginPercent,
    totalQuantity,
  };
};
