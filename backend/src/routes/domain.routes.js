import express from "express";
import { checkDomainAvailability } from "../controllers/domain.controller.js";

const router = express.Router();

router.get("/check", checkDomainAvailability);

export default router;
