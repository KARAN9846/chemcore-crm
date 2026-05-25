import {
  createLead,
  deleteLead,
  getLeadByPublicId,
  listLeadOptions,
  listLeads,
  updateLead,
  updateLeadFollowup,
} from "./leads.service.js";
import {
  validateCreateLeadPayload,
  validateLeadDeleteQuery,
  validateLeadDetailQuery,
  validateLeadListQuery,
  validateLeadOptionsQuery,
  validateFollowupPayload,
  validateUpdateLeadPayload,
} from "./leads.validation.js";

export const createLeadController = async (req, res) => {
  try {
    const validation = validateCreateLeadPayload(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Lead payload validation failed",
        errors: validation.errors,
      });
    }

    const result = await createLead(validation.data);

    if (result.duplicate) {
      return res.status(409).json({
        success: false,
        duplicate: true,
        message: "Possible duplicate lead detected",
        existingLead: result.existingLead,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: result.lead,
    });
  } catch (error) {
    console.error("Lead Create Error:", error);

    if (error?.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const listLeadsController = async (req, res) => {
  try {
    const validation = validateLeadListQuery(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Lead list query validation failed",
        errors: validation.errors,
      });
    }

    const result = await listLeads(validation.data);

    return res.status(200).json({
      success: true,
      data: result.data,
      summary: result.summary,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Lead List Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteLeadController = async (req, res) => {
  try {
    const validation = validateLeadDeleteQuery({
      params: req.params,
      query: req.query,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Lead delete query validation failed",
        errors: validation.errors,
      });
    }

    const result = await deleteLead(validation.data);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Lead Delete Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const listLeadOptionsController = async (req, res) => {
  try {
    const validation = validateLeadOptionsQuery(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Lead options query validation failed",
        errors: validation.errors,
      });
    }

    const options = await listLeadOptions(validation.data);

    return res.status(200).json({
      success: true,
      data: options,
    });
  } catch (error) {
    console.error("Lead Options Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getLeadController = async (req, res) => {
  try {
    const validation = validateLeadDetailQuery({
      params: req.params,
      query: req.query,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Lead detail query validation failed",
        errors: validation.errors,
      });
    }

    const lead = await getLeadByPublicId(validation.data);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Lead Detail Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateLeadController = async (req, res) => {
  try {
    const validation = validateUpdateLeadPayload({
      params: req.params,
      body: req.body,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Lead update validation failed",
        errors: validation.errors,
      });
    }

    const lead = await updateLead(validation.data);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Lead Update Error:", error);

    if (error?.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateLeadFollowupController = async (req, res) => {
  try {
    const validation = validateFollowupPayload({
      params: req.params,
      body: req.body,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Follow-up validation failed",
        errors: validation.errors,
      });
    }

    const lead = await updateLeadFollowup(validation.data);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Follow-up updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Lead Follow-up Update Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
