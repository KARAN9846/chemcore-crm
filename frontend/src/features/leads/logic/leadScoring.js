import { calculateEstimatedLeadValue, parseLeadNumber } from "../utils/leadValueUtils";

const isValidEmail = (email = "") => /\S+@\S+\.\S+/.test(email.trim());

const getScoreStatus = (score) => {
  if (score >= 75) {
    return "Hot";
  }

  if (score >= 45) {
    return "Warm";
  }

  return "Cold";
};

export const calculateLeadScore = (leadForm) => {
  const estimatedValue = calculateEstimatedLeadValue({
    quantity: leadForm.chemicalRequirements.quantity,
    pricePerUnit: leadForm.chemicalRequirements.pricePerUnit,
    currency: leadForm.chemicalRequirements.currency,
  });
  const quantity = parseLeadNumber(leadForm.chemicalRequirements.quantity);
  const source = leadForm.sourceAssignment.source;

  const factors = [
    {
      label: "Valid email captured",
      complete: isValidEmail(leadForm.contact.email),
      points: 15,
    },
    {
      label: "Phone / WhatsApp provided",
      complete: leadForm.contact.phone.trim().length >= 7,
      points: 10,
    },
    {
      label: "Buyer specified quantity",
      complete: quantity !== null && quantity > 0,
      points: 15,
    },
    {
      label: "Incoterm selected",
      complete: leadForm.tradeTerms.incoterms.length > 0,
      points: 15,
    },
    {
      label: "Follow-up scheduled",
      complete: Boolean(leadForm.followUp.date),
      points: 10,
    },
    {
      label: "High-intent source",
      complete: ["Referral", "Trade Fair"].includes(source),
      points: 15,
    },
    {
      label: "Estimated value above threshold",
      complete: estimatedValue.amount !== null && estimatedValue.amount >= 25000,
      points: 20,
    },
  ];

  const score = factors.reduce(
    (total, factor) => total + (factor.complete ? factor.points : 0),
    0,
  );

  return {
    score,
    status: getScoreStatus(score),
    factors,
    estimatedValue,
  };
};
