import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import resumeRoutes from "./routes/resume.js";
import analysisRoutes from "./routes/analysis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://resumeparser-production-02e4.up.railway.app",
      "http://resumeparser-production-02e4.up.railway.app",
      "https://web-production-36b3f.up.railway.app",
      "http://web-production-36b3f.up.railway.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Simple in-memory storage for testing
global.resumes = new Map();
global.analyses = new Map();

// Health check endpoint for Railway
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
  });
});

// Root endpoint for debugging
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Job Hunt Insights Engine API",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      resume: "/api/resume",
      analysis: "/api/analysis",
    },
  });
});

// API routes
app.use("/api/resume", resumeRoutes);
app.use("/api/analysis", analysisRoutes);

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, "../dist")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

export default app;
