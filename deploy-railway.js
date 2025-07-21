import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 Starting Railway deployment...");

async function deployToRailway() {
  try {
    // Step 1: Build frontend
    console.log("📦 Building frontend...");
    execSync("npm run build", { stdio: "inherit" });
    console.log("✅ Frontend built successfully");

    // Step 2: Install and build backend
    console.log("🔧 Setting up backend...");
    process.chdir("backend");

    // Install backend dependencies
    console.log("📦 Installing backend dependencies...");
    execSync("npm install", { stdio: "inherit" });
    console.log("✅ Backend dependencies installed");

    // Run backend build
    console.log("🔧 Building backend...");
    execSync("npm run build", { stdio: "inherit" });
    console.log("✅ Backend built successfully");

    // Step 3: Verify critical files exist
    console.log("🔍 Verifying deployment files...");

    const frontendBuildPath = path.join(process.cwd(), "../dist");
    const backendPath = process.cwd();

    if (!fs.existsSync(frontendBuildPath)) {
      throw new Error("Frontend build not found");
    }

    if (!fs.existsSync(path.join(backendPath, "node_modules"))) {
      throw new Error("Backend node_modules not found");
    }

    console.log("✅ All deployment files verified");

    // Step 4: Start the server
    console.log("🚀 Starting server...");
    execSync("node startup.js", { stdio: "inherit" });
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

deployToRailway();
