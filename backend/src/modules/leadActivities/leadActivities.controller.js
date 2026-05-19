import {
  createLeadActivity,
  listLeadActivities,
} from "./leadActivities.service.js";
import {
  validateCreateActivityPayload,
  validateListActivitiesQuery,
} from "./leadActivities.validation.js";

export const createLeadActivityController = async (req, res) => {
  try {
    const validation = validateCreateActivityPayload({
      params: req.params,
      query: req.query,
      body: req.body,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Lead activity validation failed",
        errors: validation.errors,
      });
    }

    const activity = await createLeadActivity(validation.data);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Lead activity created successfully",
      data: activity,
    });
  } catch (error) {
    console.error("Lead Activity Create Error:", error);

    if (error?.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Invalid lead or company reference",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const listLeadActivitiesController = async (req, res) => {
  try {
    const validation = validateListActivitiesQuery({
      params: req.params,
      query: req.query,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Lead activities query validation failed",
        errors: validation.errors,
      });
    }

    const activities = await listLeadActivities(validation.data);

    if (!activities) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Lead Activities List Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
