export const timelineIconMap = {
  call: "bi-telephone-fill",
  email: "bi-envelope-fill",
  whatsapp: "bi-whatsapp",
  quotation: "bi-file-earmark-text-fill",
  note: "bi-sticky-fill",
  lead_created: "bi-plus-circle-fill",
};

export const getLeadTimelineItems = (lead = {}) => [
  {
    id: "lead-created",
    type: "lead_created",
    title: "Lead created",
    description: `${lead.companyName || "Lead"} entered the CRM pipeline.`,
    user: lead.assignedTo || "Sales Team",
    timestamp: lead.createdAt,
  },
  {
    id: "followup-planned",
    type: "call",
    title: "First follow-up planned",
    description: lead.followupDate
      ? `${lead.followupVia || "Follow-up"} scheduled with buyer.`
      : "No follow-up scheduled yet.",
    user: lead.assignedTo || "Sales Team",
    timestamp: lead.followupDate,
  },
  {
    id: "requirement-note",
    type: "note",
    title: "Requirement captured",
    description: lead.notes || "Buyer requirements and context will appear here.",
    user: lead.assignedTo || "Sales Team",
    timestamp: lead.updatedAt || lead.createdAt,
  },
  {
    id: "quotation-placeholder",
    type: "quotation",
    title: "Quotation activity",
    description: "Quotation events will appear here once the quotation module is connected.",
    user: "ChemCore CRM",
    timestamp: null,
  },
];
