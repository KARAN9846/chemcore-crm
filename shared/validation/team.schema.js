import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["Sales", "Operations", "Accounts", "Admin"]),
});

export const teamInviteSchema = z.object({
  members: z.array(memberSchema).min(1, "At least 1 member required"),
});
