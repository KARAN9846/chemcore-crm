import express from "express";
import {
  createQuotationController,
  getQuotationController,
} from "./quotations.controller.js";

const router = express.Router();

router.post("/", createQuotationController);
router.get("/:publicId", getQuotationController);

export default router;
