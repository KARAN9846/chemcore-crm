import express from "express";
import {
  compareQuotationVersionsController,
  createQuotationController,
  deleteQuotationController,
  getQuotationController,
  getQuotationVersionsController,
  listQuotationsController,
  reviseQuotationController,
} from "./quotations.controller.js";

const router = express.Router();

router.get("/", listQuotationsController);
router.post("/", createQuotationController);
router.get("/:publicId/versions", getQuotationVersionsController);
router.get("/:publicId/compare", compareQuotationVersionsController);
router.post("/:publicId/revise", reviseQuotationController);
router.get("/:publicId", getQuotationController);
router.delete("/:publicId", deleteQuotationController);

export default router;
