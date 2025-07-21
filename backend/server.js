import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

// Log environment information for debugging
console.log("🔍 Environment check:");
console.log(`📡 NODE_ENV: ${process.env.NODE_ENV || "development"}`);
console.log(`🌐 PORT: ${process.env.PORT || "3000"}`);
console.log(`📁 CWD: ${process.cwd()}`);

const PORT = process.env.PORT || 3000;

// Add error handling for the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});

// Handle server errors
server.on("error", (error) => {
  console.error("❌ Server error:", error.message);
  if (error.code === "EADDRINUSE") {
    console.error("⚠️  Port is already in use. Please try a different port.");
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
