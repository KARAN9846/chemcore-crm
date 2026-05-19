import express from "express";
import {
  createLeadActivityController,
  listLeadActivitiesController,
} from "./leadActivities.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", listLeadActivitiesController);
router.post("/", createLeadActivityController);

export default router;
