import { z } from "zod";

const clean = (value) => (typeof value === "string" ? value.trim() : value);

const requiredString = (message, max = 255) =>
  z
    .string()
    .transform(clean)
    .pipe(z.string().min(1, message).max(max));

const optionalString = (max = 255) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => {
      const cleaned = clean(value);
      return cleaned === "" || cleaned === undefined ? null : cleaned;
    })
    .pipe(z.union([z.string().max(max), z.null()]));

const optionalNumericString = (message) =>
  optionalString(40).refine(
    (value) => value === null || !Number.isNaN(Number(value)),
    message,
  );

const todayAtStart = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const isTodayOrFutureDate = (value) => {
  if (!value) {
    return true;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date >= todayAtStart();
};

export const leadSchema = z
  .object({
    contact: z
      .object({
        firstName: requiredString("First name is required", 80),
        lastName: optionalString(80),
        companyName: requiredString("Company name is required", 140),
        designation: optionalString(100),
        email: requiredString("Email is required", 255).pipe(
          z.string().email("Enter a valid email"),
        ),
        phone: requiredString("Phone / WhatsApp is required", 40).pipe(
          z.string().min(7, "Phone must be at least 7 characters"),
        ),
        country: requiredString("Country is required", 80),
        city: optionalString(80),
      })
      .strict(),
    chemicalRequirements: z
      .object({
        chemicals: z
          .array(z.string().transform(clean).pipe(z.string().min(1)))
          .min(1, "Select at least one chemical"),
        gradeSpecification: optionalString(255),
        quantity: optionalNumericString("Quantity must be numeric"),
        unit: requiredString("Unit is required", 20),
        frequency: optionalString(40),
        pricePerUnit: optionalNumericString("Price per unit must be numeric"),
        currency: requiredString("Currency is required", 10),
        estimatedValue: optionalString(40),
      })
      .strict(),
    tradeTerms: z
      .object({
        incoterms: z.array(z.string()).min(1, "Select an incoterm"),
        paymentTerms: z.array(z.string()).default([]),
        destinationPort: optionalString(120),
        packaging: optionalString(120),
      })
      .strict(),
    sourceAssignment: z
      .object({
        source: optionalString(80),
        sourceDetail: optionalString(180),
        assignedTo: requiredString("Assigned team member is required", 100),
        initialStage: requiredString("Initial stage is required", 40),
        initialScore: requiredString("Initial score is required", 40),
      })
      .strict(),
    followUp: z
      .object({
        date: optionalString(20).refine(
          isTodayOrFutureDate,
          "Follow-up date cannot be in the past",
        ),
        time: optionalString(20),
        via: optionalString(40),
        notes: optionalString(500),
      })
      .strict(),
    metadata: z
      .object({
        mode: optionalString(20),
        draftId: z.union([z.string(), z.null()]).optional(),
        restoredFromDraft: z.boolean().optional(),
      })
      .strict(),
  })
  .strict();

export const normalizeLeadInput = (input = {}) => ({
  contact: {
    firstName: clean(input.contact?.firstName ?? ""),
    lastName: clean(input.contact?.lastName ?? ""),
    companyName: clean(input.contact?.companyName ?? ""),
    designation: clean(input.contact?.designation ?? ""),
    email: clean(input.contact?.email ?? ""),
    phone: clean(input.contact?.phone ?? ""),
    country: clean(input.contact?.country ?? ""),
    city: clean(input.contact?.city ?? ""),
  },
  chemicalRequirements: {
    chemicals: input.chemicalRequirements?.chemicals ?? [],
    gradeSpecification: clean(
      input.chemicalRequirements?.gradeSpecification ?? "",
    ),
    quantity: clean(input.chemicalRequirements?.quantity ?? ""),
    unit: clean(input.chemicalRequirements?.unit ?? ""),
    frequency: clean(input.chemicalRequirements?.frequency ?? ""),
    pricePerUnit: clean(input.chemicalRequirements?.pricePerUnit ?? ""),
    currency: clean(input.chemicalRequirements?.currency ?? ""),
    estimatedValue: clean(input.chemicalRequirements?.estimatedValue ?? ""),
  },
  tradeTerms: {
    incoterms: input.tradeTerms?.incoterms ?? [],
    paymentTerms: input.tradeTerms?.paymentTerms ?? [],
    destinationPort: clean(input.tradeTerms?.destinationPort ?? ""),
    packaging: clean(input.tradeTerms?.packaging ?? ""),
  },
  sourceAssignment: {
    source: clean(input.sourceAssignment?.source ?? ""),
    sourceDetail: clean(input.sourceAssignment?.sourceDetail ?? ""),
    assignedTo: clean(input.sourceAssignment?.assignedTo ?? ""),
    initialStage: clean(input.sourceAssignment?.initialStage ?? ""),
    initialScore: clean(input.sourceAssignment?.initialScore ?? ""),
  },
  followUp: {
    date: clean(input.followUp?.date ?? ""),
    time: clean(input.followUp?.time ?? ""),
    via: clean(input.followUp?.via ?? ""),
    notes: clean(input.followUp?.notes ?? ""),
  },
  metadata: {
    mode: clean(input.metadata?.mode ?? "create"),
    draftId: input.metadata?.draftId ?? null,
    restoredFromDraft: Boolean(input.metadata?.restoredFromDraft),
  },
});
