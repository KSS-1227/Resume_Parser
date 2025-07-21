import fetch from "node-fetch";

async function testServer() {
  const baseUrl = process.env.TEST_URL || "http://localhost:3000";

  console.log("🧪 Testing server endpoints...");

  try {
    // Test health endpoint
    console.log("📡 Testing /health endpoint...");
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health check passed:", healthData);

    // Test root endpoint
    console.log("📡 Testing / endpoint...");
    const rootResponse = await fetch(`${baseUrl}/`);
    const rootData = await rootResponse.json();
    console.log("✅ Root endpoint passed:", rootData);

    console.log("🎉 All tests passed! Server is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

testServer();
