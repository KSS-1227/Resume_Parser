import fs from "fs";
import path from "path";
import { execSync } from "child_process";

async function checkDependencies() {
  try {
    console.log("Checking dependencies...");
    // Try to import dotenv to check if it's available
    await import("dotenv");
    console.log("✅ Dependencies are properly installed");
  } catch (error) {
    console.log("⚠️  Dependencies missing, installing...");
    try {
      execSync("npm install", { stdio: "inherit" });
      console.log("✅ Dependencies installed successfully");
    } catch (installError) {
      console.error("❌ Failed to install dependencies:", installError.message);
      process.exit(1);
    }
  }
}

async function startServer() {
  try {
    // Check dependencies first
    await checkDependencies();

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log("Created uploads directory");
    }

    // Import and start the server
    console.log("🚀 Starting server...");
    await import("./server.js");
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

// Start the server
startServer().catch((error) => {
  console.error("❌ Startup failed:", error.message);
  process.exit(1);
});
