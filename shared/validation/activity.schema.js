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

const dateString = (message) =>
  requiredString(message, 20).refine((value) => {
    const date = new Date(`${value}T00:00:00`);

    return !Number.isNaN(date.getTime());
  }, message);

const optionalDateString = () =>
  optionalString(20).refine((value) => {
    if (!value) {
      return true;
    }

    const date = new Date(`${value}T00:00:00`);

    return !Number.isNaN(date.getTime());
  }, "Enter a valid date");

const optionalTimeString = () =>
  optionalString(20).refine(
    (value) => !value || /^([01]\d|2[0-3]):[0-5]\d$/.test(value),
    "Enter a valid time",
  );

export const activityTypes = [
  "Call",
  "Email",
  "WhatsApp",
  "Meeting",
  "Send Quotation",
  "Quotation",
  "Note",
  "Other",
];

export const leadActivityStages = [
  "New Inquiry",
  "Negotiating",
  "Quote Sent",
  "Quote Revised",
  "Order Confirmed",
  "Won",
  "Lost",
  "new",
  "qualified",
  "quoted",
  "negotiating",
  "converted",
  "lost",
];

export const activitySchema = z
  .object({
    activityType: z.enum(activityTypes, {
      error: "Activity type is required",
    }),
    subject: requiredString("Subject is required", 160),
    notes: requiredString("Conversation notes are required", 2000),
    outcome: optionalString(180),
    newStage: z.enum(leadActivityStages).nullable().optional(),
    followUp: z
      .object({
        date: optionalDateString(),
        time: optionalTimeString(),
        via: optionalString(40),
      })
      .strict()
      .optional()
      .default({}),
    activityDate: dateString("Activity date is required"),
    activityTime: optionalTimeString(),
    createdBy: optionalString(100),
  })
  .strict();

export const normalizeActivityInput = (input = {}) => ({
  activityType: clean(input.activityType ?? ""),
  subject: clean(input.subject ?? ""),
  notes: clean(input.notes ?? ""),
  outcome: clean(input.outcome ?? ""),
  newStage: clean(input.newStage ?? "") || null,
  followUp: {
    date: clean(input.followUp?.date ?? ""),
    time: clean(input.followUp?.time ?? ""),
    via: clean(input.followUp?.via ?? ""),
  },
  activityDate: clean(input.activityDate ?? ""),
  activityTime: clean(input.activityTime ?? ""),
  createdBy: clean(input.createdBy ?? ""),
});
