import pool from "../config/db.js";
import { completeOnboarding } from "../utils/completeOnboarding.js";
import { updateOnboardingStep } from "../utils/updateOnboardingStep.js";
import {
  companySchema,
} from "../../../shared/validation/company.schema.js";

const clean = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeRequestBody = (body = {}) =>
  Object.fromEntries(
    Object.entries(body).map(([key, value]) => [key, clean(value)]),
  );

const validateCompanyPayload = (body) => {
  const result = companySchema.safeParse(sanitizeRequestBody(body));

  if (result.success) {
    return { errors: [], data: result.data };
  }

  return {
    errors: result.error.issues.map((issue) => ({
      field: issue.path[0] || "form",
      message: issue.message,
    })),
    data: null,
  };
};

const mapCompanyPayload = (payload) => ({
  company_name: payload.companyName,
  company_type: payload.companyType,
  description: payload.description,
  gst_number: payload.gstNumber,
  iec_code: payload.iecCode,
  pan_number: payload.panNumber,
  year_established: payload.yearEstablished,
  address: payload.addressLine1,
  address2: payload.addressLine2,
  city: payload.city,
  state: payload.state,
  pincode: payload.pinCode,
  country: payload.country,
  currency: payload.baseCurrency,
  contact_email: payload.companyEmail,
  contact_phone: payload.companyPhone,
  website: payload.website,
  timezone: payload.timezone,
});

export const createCompany = async (req, res) => {
  try {
    const { errors: validationError, data: validatedPayload } =
      validateCompanyPayload(req.body);

    if (validationError.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationError,
      });
    }

    const dbPayload = mapCompanyPayload(validatedPayload);
    const logo = req.file ? req.file.filename : null;

    const result = await pool.query(
      `INSERT INTO companies (
        company_name,
        company_type,
        description,
        gst_number,
        iec_code,
        pan_number,
        year_established,
        address,
        address2,
        city,
        state,
        pincode,
        country,
        currency,
        contact_email,
        contact_phone,
        website,
        timezone,
        logo_url
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19
      )
      RETURNING *`,
      [
        dbPayload.company_name,
        dbPayload.company_type,
        dbPayload.description,
        dbPayload.gst_number,
        dbPayload.iec_code,
        dbPayload.pan_number,
        dbPayload.year_established,
        dbPayload.address,
        dbPayload.address2,
        dbPayload.city,
        dbPayload.state,
        dbPayload.pincode,
        dbPayload.country,
        dbPayload.currency,
        dbPayload.contact_email,
        dbPayload.contact_phone,
        dbPayload.website,
        dbPayload.timezone,
        logo,
      ],
    );

    const savedCompany = result.rows[0];

    await updateOnboardingStep(savedCompany.id, 2);

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      companyId: savedCompany.id,
      data: {
        companyId: savedCompany.id,
      },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { errors: validationError, data: validatedPayload } =
      validateCompanyPayload(req.body);

    if (validationError.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationError,
      });
    }

    const dbPayload = mapCompanyPayload(validatedPayload);
    const logo = req.file ? req.file.filename : null;

    const result = await pool.query(
      `UPDATE companies
      SET
        company_name = $1,
        company_type = $2,
        description = $3,
        gst_number = $4,
        iec_code = $5,
        pan_number = $6,
        year_established = $7,
        address = $8,
        address2 = $9,
        city = $10,
        state = $11,
        pincode = $12,
        country = $13,
        currency = $14,
        contact_email = $15,
        contact_phone = $16,
        website = $17,
        timezone = $18,
        logo_url = COALESCE($19, logo_url)
      WHERE id = $20
      RETURNING *`,
      [
        dbPayload.company_name,
        dbPayload.company_type,
        dbPayload.description,
        dbPayload.gst_number,
        dbPayload.iec_code,
        dbPayload.pan_number,
        dbPayload.year_established,
        dbPayload.address,
        dbPayload.address2,
        dbPayload.city,
        dbPayload.state,
        dbPayload.pincode,
        dbPayload.country,
        dbPayload.currency,
        dbPayload.contact_email,
        dbPayload.contact_phone,
        dbPayload.website,
        dbPayload.timezone,
        logo,
        id,
      ],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    const savedCompany = result.rows[0];

    await updateOnboardingStep(savedCompany.id, 2);

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      companyId: savedCompany.id,
      data: {
        companyId: savedCompany.id,
      },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM companies WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.status(200).json({
      message: "Company fetched successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getOnboardingStatus = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId || Number.isNaN(Number(companyId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const result = await pool.query(
      `SELECT
        id,
        COALESCE(onboarding_step, 1) AS onboarding_step,
        COALESCE(onboarding_completed, false) AS onboarding_completed
      FROM companies
      WHERE id = $1`,
      [companyId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const status = result.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        companyId: status.id,
        onboarding_step: status.onboarding_step,
        onboarding_completed: status.onboarding_completed,
      },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const saveOnboardingStep = async (req, res) => {
  try {
    const { companyId } = req.params;
    const step = Number(req.body?.step);

    if (!companyId || Number.isNaN(Number(companyId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    if (!Number.isInteger(step) || step < 1 || step > 6) {
      return res.status(400).json({
        success: false,
        message: "Invalid onboarding step",
      });
    }

    await updateOnboardingStep(companyId, step);

    return res.status(200).json({
      success: true,
      data: {
        companyId: Number(companyId),
        onboarding_step: step,
      },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const markOnboardingComplete = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId || Number.isNaN(Number(companyId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    await completeOnboarding(companyId);

    return res.status(200).json({
      success: true,
      data: {
        companyId: Number(companyId),
        onboarding_step: 6,
        onboarding_completed: true,
      },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getOnboardingSummary = async (req, res) => {
  const { companyId } = req.params;

  try {
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID required",
      });
    }

    const companyRes = await pool.query(
      "SELECT * FROM companies WHERE id=$1",
      [companyId],
    );

    const company = companyRes.rows[0] || null;

    const brandingRes = await pool.query(
      "SELECT * FROM branding WHERE company_id=$1",
      [companyId],
    );

    const branding = brandingRes.rows[0] || null;

    const teamRes = await pool.query(
      "SELECT COUNT(*) FROM users WHERE company_id=$1",
      [companyId],
    );

    const teamCount = parseInt(teamRes.rows[0].count, 10);

    const chemRes = await pool.query(
      "SELECT * FROM chemicals WHERE company_id=$1",
      [companyId],
    );

    const chemicals = chemRes.rows;

    const supplierRes = await pool.query(
      "SELECT * FROM suppliers WHERE company_id=$1 ORDER BY created_at DESC LIMIT 1",
      [companyId],
    );

    const supplier = supplierRes.rows[0] || null;

    return res.status(200).json({
      success: true,
      data: {
        company,
        branding,
        teamCount,
        chemicals,
        supplier,
      },
    });
  } catch (error) {
    console.error("Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
