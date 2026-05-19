import { createQuotation } from "./quotations.service.js";
import { getQuotationByPublicId } from "./quotations.read.service.js";
import {
  validateCreateQuotationPayload,
  validateQuotationDetailQuery,
} from "./quotations.validation.js";

export const createQuotationController = async (req, res) => {
  try {
    const validation = validateCreateQuotationPayload(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Quotation payload validation failed",
        errors: validation.errors,
      });
    }

    const result = await createQuotation(validation.data);

    if (result.duplicate) {
      return res.status(409).json({
        success: false,
        duplicate: true,
        message: "Quotation number already exists",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Quotation created successfully",
      data: result.quotation,
    });
  } catch (error) {
    console.error("Quotation Create Error:", error);

    if (error?.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Invalid company or lead reference",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getQuotationController = async (req, res) => {
  try {
    const validation = validateQuotationDetailQuery({
      params: req.params,
      query: req.query,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Quotation detail query validation failed",
        errors: validation.errors,
      });
    }

    const quotation = await getQuotationByPublicId(validation.data);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    console.error("Quotation Detail Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
