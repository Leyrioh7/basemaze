const fs = require("fs");

const requiredFiles = [
  "index.html",
  "Build/WebGL.data.unityweb",
  "Build/WebGL.framework.js.unityweb",
  "Build/WebGL.wasm.unityweb",
  "Build/WebGL.loader.js",
  "TemplateData/style.css",
  "farcaster.json"
];

console.log("🔍 Checking Unity/Farcaster build integrity...\n");

let ok = true;

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.log("❌ Missing:", file);
    ok = false;
  } else {
    console.log("✔ Found:", file);
  }
}

if (ok) {
  console.log("\n✅ Build looks good. Safe to deploy!");
  process.exit(0);
} else {
  console.log("\n❌ Build incomplete. Fix missing files before deploying.");
  process.exit(1);
}
