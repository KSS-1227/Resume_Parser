import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import resumeRoutes from "./routes/resume.js";
import analysisRoutes from "./routes/analysis.js";
import jobsRoutes from "./routes/jobs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:8080",
        "http://192.168.0.100:8080",
        "http://192.168.0.100:3000",
        "https://resumeparser-production-02e4.up.railway.app",
        "http://resumeparser-production-02e4.up.railway.app",
        "https://web-production-36b3f.up.railway.app",
        "http://web-production-36b3f.up.railway.app",
      ];

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
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

// Root endpoint for debugging
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Job Hunt Insights Engine API",
    endpoints: {
      health: "/health",
      resume: "/api/resume",
      analysis: "/api/analysis",
      jobs: "/api/jobs",
    },
  });
});

// API routes
app.use("/api/resume", resumeRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/jobs", jobsRoutes);

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, "../dist")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

export default app;
