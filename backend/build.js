import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🔧 Building backend for deployment...");

// Ensure we're in the correct directory
const backendDir = path.resolve(process.cwd());
process.chdir(backendDir);

// Clean install dependencies
console.log("📦 Installing dependencies...");
try {
  execSync("npm ci --production", { stdio: "inherit" });
  console.log("✅ Dependencies installed successfully");
} catch (error) {
  console.log("⚠️  npm ci failed, trying npm install...");
  try {
    execSync("npm install", { stdio: "inherit" });
    console.log("✅ Dependencies installed successfully");
  } catch (installError) {
    console.error("❌ Failed to install dependencies:", installError.message);
    process.exit(1);
  }
}

// Verify critical dependencies
console.log("🔍 Verifying critical dependencies...");
const criticalDeps = ["dotenv", "express", "cors"];
for (const dep of criticalDeps) {
  try {
    await import(dep);
    console.log(`✅ ${dep} is available`);
  } catch (error) {
    console.error(`❌ ${dep} is missing`);
    process.exit(1);
  }
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(backendDir, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

// Check if frontend build exists, if not, build it
console.log("🔍 Checking frontend build...");
const frontendBuildPath = path.join(backendDir, "../dist");
if (!fs.existsSync(frontendBuildPath)) {
  console.log("⚠️  Frontend build not found, building...");
  try {
    process.chdir(path.join(backendDir, ".."));
    execSync("npm run build", { stdio: "inherit" });
    console.log("✅ Frontend built successfully");
  } catch (buildError) {
    console.error("❌ Failed to build frontend:", buildError.message);
    process.exit(1);
  }
} else {
  console.log("✅ Frontend build found");
}

console.log("🎉 Backend build completed successfully!");
