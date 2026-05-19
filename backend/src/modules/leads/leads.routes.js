import express from "express";
import leadActivitiesRoutes from "../leadActivities/leadActivities.routes.js";
import {
  createLeadController,
  getLeadController,
  listLeadOptionsController,
  listLeadsController,
  updateLeadController,
  updateLeadFollowupController,
} from "./leads.controller.js";

const router = express.Router();

router.get("/", listLeadsController);
router.get("/options", listLeadOptionsController);
router.use("/:publicId/activities", leadActivitiesRoutes);
router.patch("/:publicId/follow-up", updateLeadFollowupController);
router.patch("/:publicId", updateLeadController);
router.get("/:publicId", getLeadController);
router.post("/", createLeadController);

export default router;
