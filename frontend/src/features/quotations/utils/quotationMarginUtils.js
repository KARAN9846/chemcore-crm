export const getQuotationMarginSnapshot = (totals) => {
  const grossProfit = totals.grossProfit ?? totals.grandTotal - totals.totalSupplierCost;
  const marginPercent = totals.marginPercent ?? 0;
  const marginHealth =
    marginPercent >= 25
      ? "excellent"
      : marginPercent >= 15
        ? "healthy"
        : marginPercent >= 8
          ? "watch"
          : grossProfit < 0
            ? "loss"
            : "low";

  return {
    grossProfit,
    marginPercent,
    marginHealth,
    minSellPrice: totals.totalSupplierCost / 0.9,
    targetMargin: 15,
  };
};

export const getMarginHealthLabel = (health) => {
  if (health === "excellent") {
    return "Excellent margin. Strong profitability.";
  }

  if (health === "healthy") {
    return "Healthy margin. Above target.";
  }

  if (health === "watch") {
    return "Low margin. Review costs before sending.";
  }

  if (health === "loss") {
    return "Loss risk. Quotation needs review.";
  }

  return "Margin is too low for approval.";
};

export const getMarginHealthTitle = (health) => {
  if (health === "excellent") {
    return "Excellent Margin";
  }

  if (health === "healthy") {
    return "Healthy";
  }

  if (health === "watch") {
    return "Low Margin";
  }

  if (health === "loss") {
    return "Loss Risk";
  }

  return "Needs Review";
};
