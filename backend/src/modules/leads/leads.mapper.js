const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const calculateEstimatedValue = (leadForm) => {
  const quantity = toNumberOrNull(leadForm.chemicalRequirements.quantity);
  const price = toNumberOrNull(leadForm.chemicalRequirements.pricePerUnit);

  if (quantity === null || price === null) {
    return null;
  }

  return quantity * price;
};

export const mapCreateLeadToDb = ({ companyId, leadForm, intelligence }) => ({
  company_id: companyId,
  first_name: leadForm.contact.firstName,
  last_name: leadForm.contact.lastName,
  company_name: leadForm.contact.companyName,
  designation: leadForm.contact.designation,
  email: leadForm.contact.email,
  phone: leadForm.contact.phone,
  country: leadForm.contact.country,
  city: leadForm.contact.city,
  chemical_names: leadForm.chemicalRequirements.chemicals,
  quantity_required: toNumberOrNull(leadForm.chemicalRequirements.quantity),
  unit: leadForm.chemicalRequirements.unit,
  frequency: leadForm.chemicalRequirements.frequency,
  price_per_unit: toNumberOrNull(leadForm.chemicalRequirements.pricePerUnit),
  currency: leadForm.chemicalRequirements.currency,
  estimated_value: calculateEstimatedValue(leadForm),
  incoterm: leadForm.tradeTerms.incoterms[0] ?? null,
  payment_terms: leadForm.tradeTerms.paymentTerms,
  packaging_requirement: leadForm.tradeTerms.packaging,
  port_of_destination: leadForm.tradeTerms.destinationPort,
  source: leadForm.sourceAssignment.source,
  source_detail: leadForm.sourceAssignment.sourceDetail,
  assigned_to: leadForm.sourceAssignment.assignedTo,
  initial_stage: leadForm.sourceAssignment.initialStage,
  current_stage: leadForm.sourceAssignment.initialStage || "new",
  lead_score: intelligence.score ?? 0,
  score_label: intelligence.status ?? "Cold",
  followup_date: leadForm.followUp.date,
  followup_time: leadForm.followUp.time,
  followup_via: leadForm.followUp.via,
  notes: leadForm.followUp.notes,
  status: leadForm.sourceAssignment.initialStage || "new",
});

export const mapLeadResponse = (row = {}) => ({
  id: row.id,
  publicId: row.public_id,
  companyId: row.company_id,
  firstName: row.first_name,
  lastName: row.last_name,
  companyName: row.company_name,
  designation: row.designation,
  email: row.email,
  phone: row.phone,
  country: row.country,
  city: row.city,
  chemicals: row.chemical_names ?? [],
  quantityRequired: row.quantity_required,
  unit: row.unit,
  frequency: row.frequency,
  pricePerUnit: row.price_per_unit,
  estimatedValue: row.estimated_value,
  currency: row.currency,
  incoterm: row.incoterm,
  paymentTerms: row.payment_terms ?? [],
  packagingRequirement: row.packaging_requirement,
  portOfDestination: row.port_of_destination,
  source: row.source,
  sourceDetail: row.source_detail,
  assignedTo: row.assigned_to,
  initialStage: row.initial_stage,
  currentStage: row.current_stage,
  leadScore: row.lead_score,
  scoreLabel: row.score_label,
  followupDate: row.followup_date,
  followupTime: row.followup_time,
  followupVia: row.followup_via,
  notes: row.notes,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapLeadListResponse = (row = {}) => ({
  publicId: row.public_id,
  companyName: row.company_name,
  contactName: [row.first_name, row.last_name].filter(Boolean).join(" "),
  email: row.email,
  phone: row.phone,
  country: row.country,
  chemicals: row.chemical_names ?? [],
  estimatedValue: row.estimated_value,
  currency: row.currency,
  leadScore: row.lead_score,
  scoreLabel: row.score_label,
  assignedTo: row.assigned_to,
  status: row.status,
  currentStage: row.current_stage,
  followupDate: row.followup_date,
  createdAt: row.created_at,
});
