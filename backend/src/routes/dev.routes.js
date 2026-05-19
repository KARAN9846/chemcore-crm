import express from "express";
import { resetOnboarding } from "../controllers/dev.controller.js";

const router = express.Router();

router.post("/reset-onboarding/:companyId", resetOnboarding);

export default router;
