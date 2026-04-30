import express from "express";
import {
  getBranding,
  saveBranding,
} from "../controllers/branding.controller.js";

const router = express.Router();

router.post("/:companyId", saveBranding);
router.get("/:companyId", getBranding);

export default router;
