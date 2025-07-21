import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Ensure dependencies are installed
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

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

// Import and start the server
import("./server.js");
