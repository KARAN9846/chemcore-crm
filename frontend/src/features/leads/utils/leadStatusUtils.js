export const leadPipelineStages = [
  { key: "new", label: "New Inquiry" },
  { key: "negotiating", label: "Negotiating" },
  { key: "quoted", label: "Quote Sent" },
  { key: "quote_revised", label: "Quote Revised" },
  { key: "order_confirmed", label: "Order Confirmed" },
  { key: "converted", label: "Won" },
];

const stageAliases = {
  qualified: "negotiating",
  lost: "negotiating",
  "New Inquiry": "new",
  Negotiating: "negotiating",
  "Quote Sent": "quoted",
  "Quote Revised": "quote_revised",
  "Order Confirmed": "order_confirmed",
  Won: "converted",
  Lost: "negotiating",
};

export const getNormalizedLeadStage = (status) =>
  stageAliases[status] ?? status ?? "new";

export const getLeadStageIndex = (status) => {
  const normalizedStatus = getNormalizedLeadStage(status);
  const index = leadPipelineStages.findIndex(
    (stage) => stage.key === normalizedStatus,
  );

  return index >= 0 ? index : 0;
};

export const getLeadInitials = (lead = {}) => {
  const source = lead.companyName || `${lead.firstName ?? ""} ${lead.lastName ?? ""}`;
  const words = source.trim().split(/\s+/).filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "LD";
};

export const isFollowupOverdue = (followupDate) => {
  if (!followupDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextFollowup = new Date(`${followupDate}T00:00:00`);

  return nextFollowup < today;
};
