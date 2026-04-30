import express from "express";
import { saveChemicals } from "../controllers/chemical.controller.js";

const router = express.Router();

router.post("/:companyId", saveChemicals);
router.post("/save/:companyId", saveChemicals);

export default router;
