const fs = require("fs");
const data = JSON.parse(fs.readFileSync("artifacts/detailed-unused-breakdown.json", "utf8"));

console.log("--- Unused files NOT in assets/assets/ and NOT in mockups/ ---");
data.unusedFiles
  .filter(f => !f.file.includes("public/assets/assets/") && !f.file.includes("public/assets/mockups/"))
  .forEach(f => console.log(f.file, f.size, f.reason));

console.log("\n--- Used files NOT in portfolio/ and NOT in fonts/ ---");
data.usedFiles
  .filter(f => !f.file.includes("public/assets/portfolio/") && !f.file.includes("public/fonts/"))
  .forEach(f => console.log(f.file, f.size, f.reason));
