import { z } from "zod";

export const chemicalSchema = z.object({
  name: z.string().min(1, "Name required"),
  formula: z.string().optional(),
  category: z.string().optional(),
  hsCode: z.string().optional(),
  unit: z.string().optional(),
});

export const chemicalBulkSchema = z.object({
  chemicals: z.array(chemicalSchema).min(1, "At least 1 chemical required"),
});
