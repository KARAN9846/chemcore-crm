export const formatLeadDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const formatLeadValue = (amount, currency = "USD") => {
  if (amount === null || amount === undefined || amount === "") {
    return "-";
  }

  return `${currency} ${Number(amount).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
};

export const getScoreVariant = (label) => {
  if (label === "Hot") {
    return "success";
  }

  if (label === "Warm") {
    return "warning";
  }

  return "neutral";
};

export const getStatusVariant = (status) => {
  if (["converted", "qualified"].includes(status)) {
    return "success";
  }

  if (["quoted", "negotiating"].includes(status)) {
    return "info";
  }

  if (status === "lost") {
    return "danger";
  }

  return "neutral";
};
