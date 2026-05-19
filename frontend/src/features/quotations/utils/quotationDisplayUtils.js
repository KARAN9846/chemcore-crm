export const formatQuotationDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const formatQuotationMoney = (amount, currency = "USD") => {
  if (amount === null || amount === undefined || amount === "") {
    return "-";
  }

  return `${currency} ${Number(amount).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
};

export const formatQuotationPercent = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return `${Number(value).toFixed(1)}%`;
};
