import express from "express";
import { getJobRecommendations } from "../controllers/jobRecommendationsController.js";

const router = express.Router();

// POST /api/jobs/recommendations - Get job recommendations based on resume
router.post("/recommendations", getJobRecommendations);

export default router;