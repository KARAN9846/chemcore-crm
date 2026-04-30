import { z } from "zod";

export const supplierSchema = z.object({
  companyName: z.string().min(1, "Company name required"),
  supplierType: z.enum(["manufacturer", "trader", "distributor", "stockist"]),
  city: z.string().optional(),
  country: z.string().min(1, "Country required"),
  contactPerson: z.string().min(1, "Contact person required"),
  designation: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  chemicals: z.array(z.string()).optional(),
  minOrder: z.union([z.string(), z.number()]).optional(),
  leadTime: z.union([z.string(), z.number()]).optional(),
  reliability: z.enum(["High", "Medium", "Low"]),
  paymentTerms: z.array(z.string()).default([]),
  rating: z.number().min(0).max(5).default(0),
  notes: z.string().optional(),
});
