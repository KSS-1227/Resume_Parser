import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resume.js";
import analysisRoutes from "./routes/analysis.js";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://resumeparser-production-02e4.up.railway.app",
      "http://resumeparser-production-02e4.up.railway.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Simple in-memory storage for testing
global.resumes = new Map();
global.analyses = new Map();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.use("/api/resume", resumeRoutes);
app.use("/api/analysis", analysisRoutes);

export default app;
