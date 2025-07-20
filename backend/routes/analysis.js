import express from "express";
import {
  startAnalysis,
  getAnalysis,
} from "../controllers/analysisController.js";

const router = express.Router();

router.post("/analyze", startAnalysis);
router.get("/:id", getAnalysis);

export default router;
