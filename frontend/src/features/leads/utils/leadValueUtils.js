const currencyLabels = {
  USD: "USD",
  EUR: "EUR",
  INR: "INR",
};

export const parseLeadNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

export const calculateEstimatedLeadValue = ({
  quantity,
  pricePerUnit,
  currency,
}) => {
  const parsedQuantity = parseLeadNumber(quantity);
  const parsedPrice = parseLeadNumber(pricePerUnit);

  if (parsedQuantity === null || parsedPrice === null) {
    return {
      amount: null,
      formatted: "",
    };
  }

  const amount = parsedQuantity * parsedPrice;
  const currencyCode = currencyLabels[currency] ?? currency ?? "USD";

  return {
    amount,
    formatted: `${currencyCode} ${amount.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`,
  };
};
