import { createQuotation } from "./quotations.service.js";
import { reviseQuotation } from "./quotations.revision.service.js";
import {
  compareQuotationVersions,
  getQuotationVersions,
} from "./quotations.compare.service.js";
import {
  deleteQuotation,
  getQuotationByPublicId,
  listQuotations,
} from "./quotations.read.service.js";
import {
  validateCreateQuotationPayload,
  validateQuotationCompareQuery,
  validateQuotationDeleteQuery,
  validateQuotationDetailQuery,
  validateQuotationListQuery,
  validateReviseQuotationPayload,
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

export const reviseQuotationController = async (req, res) => {
  try {
    const validation = validateReviseQuotationPayload({
      body: req.body,
      params: req.params,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Quotation revision payload validation failed",
        errors: validation.errors,
      });
    }

    const quotation = await reviseQuotation(validation.data);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Quotation revision created successfully",
      data: quotation,
    });
  } catch (error) {
    console.error("Quotation Revision Error:", error);

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

export const listQuotationsController = async (req, res) => {
  try {
    const validation = validateQuotationListQuery(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Quotation list query validation failed",
        errors: validation.errors,
      });
    }

    const result = await listQuotations(validation.data);

    return res.status(200).json({
      success: true,
      data: result.data,
      summary: result.summary,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Quotation List Error:", error);

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

export const getQuotationVersionsController = async (req, res) => {
  try {
    const validation = validateQuotationDetailQuery({
      params: req.params,
      query: req.query,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Quotation versions query validation failed",
        errors: validation.errors,
      });
    }

    const result = await getQuotationVersions(validation.data);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Quotation Versions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const compareQuotationVersionsController = async (req, res) => {
  try {
    const validation = validateQuotationCompareQuery({
      params: req.params,
      query: req.query,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Quotation compare query validation failed",
        errors: validation.errors,
      });
    }

    const result = await compareQuotationVersions(validation.data);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Quotation Compare Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteQuotationController = async (req, res) => {
  try {
    const validation = validateQuotationDeleteQuery({
      params: req.params,
      query: req.query,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Quotation delete query validation failed",
        errors: validation.errors,
      });
    }

    const result = await deleteQuotation(validation.data);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quotation deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Quotation Delete Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
