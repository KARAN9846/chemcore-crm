const sensitiveChemicalWarnings = {
  Nitrocellulose: [
    "MSDS/SDS required before quotation and shipment planning",
    "Hazardous shipment handling should be confirmed early",
    "Export clearance and end-use details may be required",
  ],
  "Ammonium Nitrate": [
    "MSDS/SDS and regulatory clearance are required for most buyers",
    "Hazardous cargo handling and storage controls should be verified",
    "Certificate of Origin and end-use declaration are often requested",
  ],
};

const baseDocumentNotes = [
  "Most buyers require COA and MSDS/SDS before placing order",
  "Some countries require Certificate of Origin at inquiry stage",
];

export const getLeadComplianceWarnings = (leadForm) => {
  const selectedChemicals = leadForm.chemicalRequirements.chemicals;
  const chemicalWarnings = selectedChemicals.flatMap((chemical) =>
    (sensitiveChemicalWarnings[chemical] ?? []).map((message) => ({
      chemical,
      message,
    })),
  );

  return {
    documentNotes: [
      ...baseDocumentNotes,
      ...(chemicalWarnings.length
        ? []
        : ["Nitrocellulose and AN have additional compliance requirements"]),
    ],
    chemicalWarnings,
  };
};

export const getLeadWorkflowHints = (leadForm, scorePreview) => {
  const hints = [
    "Log conversations within 24 hours of every interaction",
    "Set a follow-up within 2-3 days of sending a quotation",
    "Note specific chemical grade and packaging requirements",
    "Record incoterm preference early -- it affects pricing",
  ];

  if (["Monthly", "Quarterly", "Bi-annual", "Annual"].includes(
    leadForm.chemicalRequirements.frequency,
  )) {
    hints.unshift("Recurring requirement detected -- qualify this buyer for repeat supply potential");
  }

  if (scorePreview.estimatedValue.amount !== null && scorePreview.estimatedValue.amount >= 50000) {
    hints.unshift("High estimated value -- prioritize senior sales follow-up");
  }

  if (!leadForm.followUp.date) {
    hints.unshift("Follow-up is missing -- schedule the next action before saving");
  }

  return hints;
};
