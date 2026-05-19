const typeConfig = {
  Call: { icon: "bi-telephone-fill", variant: "green" },
  Email: { icon: "bi-envelope-fill", variant: "amber" },
  WhatsApp: { icon: "bi-whatsapp", variant: "green" },
  Meeting: { icon: "bi-people-fill", variant: "blue" },
  "Send Quotation": { icon: "bi-file-earmark-text-fill", variant: "blue" },
  Quotation: { icon: "bi-file-earmark-text-fill", variant: "blue" },
  Note: { icon: "bi-sticky-fill", variant: "neutral" },
  Other: { icon: "bi-pin-angle-fill", variant: "neutral" },
};

const toSafeString = (value) =>
  value === null || value === undefined ? "" : String(value);

export const communicationTypes = [
  { label: "Call", icon: "bi-telephone-fill" },
  { label: "Email", icon: "bi-envelope-fill" },
  { label: "WhatsApp", icon: "bi-whatsapp" },
  { label: "Meeting", icon: "bi-people-fill" },
  { label: "Quotation", icon: "bi-file-earmark-text-fill" },
  { label: "Other", icon: "bi-pin-angle-fill" },
];

export const activityOutcomes = [
  "Positive - moving forward",
  "Pending - awaiting reply",
  "Negative - lost interest",
  "Needs revision",
  "Agreed to follow-up",
];

export const getActivityTypeConfig = (type) =>
  typeConfig[type] ?? typeConfig.Other;

export const getOutcomeVariant = (outcome = "") => {
  const normalized = toSafeString(outcome).trim().toLowerCase();

  if (!normalized) {
    return "neutral";
  }

  if (normalized.includes("positive") || normalized.includes("moving")) {
    return "success";
  }

  if (normalized.includes("negative") || normalized.includes("lost")) {
    return "danger";
  }

  if (normalized.includes("revision") || normalized.includes("pending")) {
    return "warning";
  }

  return "neutral";
};

export const getActivityLabel = (value, fallback = "Activity") => {
  const label = toSafeString(value).trim();

  return label || fallback;
};
