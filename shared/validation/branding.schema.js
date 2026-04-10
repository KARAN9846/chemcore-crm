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

export const brandingSchema = z
  .object({
    primaryColor: z
      .string()
      .transform(clean)
      .pipe(
        z
          .string()
          .regex(/^#([0-9a-fA-F]{6})$/, "Select a valid brand color"),
      ),
    workspaceName: requiredString("Workspace name is required", 50),
    tagline: optionalString(60),
    fromName: requiredString("From name is required", 50),
    replyTo: requiredString("Reply-to email is required", 255).pipe(
      z.string().email("Enter a valid reply-to email"),
    ),
    subdomain: optionalString(63).pipe(
      z.union([
        z
          .string()
          .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers or hyphens")
          .max(63),
        z.null(),
      ]),
    ),
    customDomain: optionalString(255),
  })
  .strict();

export const normalizeBrandingInput = (input = {}) => ({
  primaryColor: clean(input.primaryColor ?? ""),
  workspaceName: clean(input.workspaceName ?? ""),
  tagline: clean(input.tagline ?? "") || null,
  fromName: clean(input.fromName ?? ""),
  replyTo: clean(input.replyTo ?? ""),
  subdomain: clean(input.subdomain ?? "") || null,
  customDomain: clean(input.customDomain ?? "") || null,
});
