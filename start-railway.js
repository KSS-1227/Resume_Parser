import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 Railway startup script...");

try {
  // Check if we're in the right directory
  const currentDir = process.cwd();
  console.log(`📁 Current directory: ${currentDir}`);

  // Check if backend exists
  const backendPath = path.join(currentDir, "backend");
  if (!fs.existsSync(backendPath)) {
    throw new Error("Backend directory not found");
  }

  // Check if dist exists (frontend build)
  const distPath = path.join(currentDir, "dist");
  if (!fs.existsSync(distPath)) {
    console.log("⚠️  Frontend build not found, building...");
    execSync("npm run build", { stdio: "inherit" });
  }

  // Change to backend directory
  process.chdir(backendPath);
  console.log(`📁 Changed to backend directory: ${process.cwd()}`);

  // Install dependencies if needed
  const nodeModulesPath = path.join(process.cwd(), "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    console.log("📦 Installing backend dependencies...");
    execSync("npm install", { stdio: "inherit" });
  }

  // Start the server
  console.log("🚀 Starting server...");
  execSync("node startup.js", { stdio: "inherit" });
} catch (error) {
  console.error("❌ Startup failed:", error.message);
  process.exit(1);
}
