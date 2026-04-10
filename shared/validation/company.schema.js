import { z } from "zod";

const clean = (value) => (typeof value === "string" ? value.trim() : value);

const requiredString = (message) =>
  z.string().transform(clean).pipe(z.string().min(1, message));

const optionalString = () =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => {
      const cleaned = clean(value);
      return cleaned === "" || cleaned === undefined ? null : cleaned;
    });

export const companySchema = z.object({
  companyName: requiredString("Company name is required"),
  companyType: requiredString("Company type is required"),
  baseCurrency: requiredString("Currency is required"),
  companyEmail: requiredString("Company email is required").pipe(
    z.string().email("Invalid email"),
  ),
  companyPhone: requiredString("Company phone is required")
    .pipe(z.string().regex(/^[0-9]+$/, "Phone must be numeric"))
    .pipe(z.string().min(10, "Phone must be at least 10 digits")),
  addressLine1: requiredString("Address is required"),
  city: requiredString("City is required"),
  pinCode: requiredString("PIN code is required").pipe(
    z.string().regex(/^[0-9]{6}$/, "Invalid PIN code"),
  ),
  country: requiredString("Country is required"),
  timezone: requiredString("Timezone is required"),
  description: optionalString(),
  gstNumber: optionalString(),
  iecCode: optionalString(),
  panNumber: optionalString(),
  yearEstablished: optionalString(),
  addressLine2: optionalString(),
  state: optionalString(),
  website: optionalString(),
}).strict();

export const normalizeCompanyInput = (input = {}) => ({
  companyName: clean(input.companyName ?? input.company_name ?? ""),
  companyType: clean(input.companyType ?? input.company_type ?? ""),
  baseCurrency: clean(input.baseCurrency ?? input.currency ?? ""),
  companyEmail: clean(input.companyEmail ?? input.contact_email ?? ""),
  companyPhone: clean(input.companyPhone ?? input.contact_phone ?? ""),
  addressLine1: clean(input.addressLine1 ?? input.address ?? ""),
  city: clean(input.city ?? ""),
  pinCode: clean(input.pinCode ?? input.pincode ?? ""),
  country: clean(input.country ?? ""),
  timezone: clean(input.timezone ?? ""),
  description: clean(input.description ?? "") || null,
  gstNumber: clean(input.gstNumber ?? "") || null,
  iecCode: clean(input.iecCode ?? "") || null,
  panNumber: clean(input.panNumber ?? "") || null,
  yearEstablished: clean(input.yearEstablished ?? "") || null,
  addressLine2: clean(input.addressLine2 ?? input.address2 ?? "") || null,
  state: clean(input.state ?? "") || null,
  website: clean(input.website ?? "") || null,
});

export const companyFormFieldMap = {
  companyName: "companyName",
  companyType: "companyType",
  baseCurrency: "currency",
  companyEmail: "email",
  companyPhone: "phone",
  addressLine1: "address",
  city: "city",
  pinCode: "pincode",
  country: "country",
  timezone: "timezone",
};
