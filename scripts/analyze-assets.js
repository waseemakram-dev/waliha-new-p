const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(fullPath));
      } else {
        results.push(fullPath);
      }
    }
  } catch (e) {}
  return results;
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

// 1. Load artwork.json
const artwork = JSON.parse(fs.readFileSync("app/data/artwork.json", "utf8"));
const artworkSrcs = new Set(artwork.map(a => a.src.replace(/^\//, "")));
const artworkOriginals = new Set(artwork.map(a => a.original.replace(/^\//, "").split("#")[0]));

// 2. Read all files in public
const allPublic = walk("public").map(p => path.relative(".", p).replace(/\\/g, "/"));

// 3. Scan code files in app/ and lib/
const codeFiles = [...walk("app"), ...walk("lib")].filter(f => !f.includes("node_modules"));
const codeTexts = codeFiles.map(f => ({
  path: path.relative(".", f).replace(/\\/g, "/"),
  text: fs.readFileSync(f, "utf8")
}));

// Function to check if a public file is referenced in code
function checkUsage(pubFile) {
  const norm = pubFile.replace(/^public\//, "");
  const base = path.basename(pubFile);
  const webPath = "/" + norm;

  // Is it in artwork src?
  if (artworkSrcs.has(norm)) {
    return { used: true, reason: "Referenced in artwork.json (src: used in portfolio gallery)" };
  }

  // Is it in fonts?
  if (norm.startsWith("fonts/")) {
    for (const c of codeTexts) {
      if (c.text.includes(webPath) || c.text.includes(base)) {
        return { used: true, reason: `Font used in ${c.path}` };
      }
    }
  }

  // Is it in mockups?
  if (norm.startsWith("assets/mockups/")) {
    if (base === "generation-manifest.json") {
      return { used: false, reason: "Mockup generation log / manifest file" };
    }
    // Check in portfolio.js
    for (const c of codeTexts) {
      if (c.text.includes(base) || c.text.includes(webPath) || c.text.includes(norm)) {
        return { used: true, reason: `Mockup referenced in ${c.path}` };
      }
    }
    // Check if covered by dynamic pattern in portfolio.js
    // generated = ["pure-leaf","posters","social-media","thumbnails","product-creatives","banners","logo-design","nova-glow","pustimate","babies-pal","buraq"];
    // `${slug}.webp`
    const slug = base.replace(/\.webp$/, "");
    const generatedSlugs = ["pure-leaf","posters","social-media","thumbnails","product-creatives","banners","logo-design","nova-glow","pustimate","babies-pal","buraq"];
    if (base === "banners-billboard.webp") {
      return { used: true, reason: "Banners cover in app/data/portfolio.js" };
    }
    if (base === "banners.webp") {
      return { used: false, reason: "Replaced by banners-billboard.webp in portfolio.js" };
    }
    if (generatedSlugs.includes(slug) && base.endsWith(".webp")) {
      return { used: true, reason: `Dynamic cover mockup for ${slug} in portfolio.js` };
    }
    return { used: false, reason: "Unused mockup" };
  }

  // Is it in public/assets/assets/?
  if (norm.startsWith("assets/assets/")) {
    // This is raw/source files before optimization into public/assets/portfolio/*.webp!
    return {
      used: false,
      reason: "Raw original/source archive file (Already converted to WebP in public/assets/portfolio/)"
    };
  }

  // Root assets
  for (const c of codeTexts) {
    if (c.path === "app/data/artwork.json") continue; // artwork src already checked
    if (c.text.includes(webPath) || c.text.includes(base) || c.text.includes(norm)) {
      return { used: true, reason: `Referenced in ${c.path}` };
    }
  }

  return { used: false, reason: "Not referenced in any app or lib code" };
}

const categorized = allPublic.map(file => {
  const size = fs.statSync(file).size;
  const usage = checkUsage(file);
  return {
    file,
    size,
    used: usage.used,
    reason: usage.reason
  };
});

const usedList = categorized.filter(c => c.used);
const unusedList = categorized.filter(c => !c.used);

const usedSize = usedList.reduce((a, b) => a + b.size, 0);
const unusedSize = unusedList.reduce((a, b) => a + b.size, 0);
const totalSize = categorized.reduce((a, b) => a + b.size, 0);

console.log("=== SUMMARY ===");
console.log(`Total public files: ${categorized.length} (${formatSize(totalSize)})`);
console.log(`Used files:         ${usedList.length} (${formatSize(usedSize)})`);
console.log(`Unused files:       ${unusedList.length} (${formatSize(unusedSize)})`);

// Breakdown of unused files by category
const breakdown = {};
unusedList.forEach(u => {
  let cat = "Other";
  if (u.file.includes(".zip")) cat = "ZIP Archives";
  else if (u.file.startsWith("public/assets/assets/")) cat = "Raw Original Assets (assets/assets/)";
  else if (u.file.startsWith("public/assets/mockups/")) cat = "Unused Mockups / Manifest";
  else if (u.file.startsWith("public/assets/")) cat = "Root public/assets files (icons, chatgpt images, etc.)";
  else if (u.file.startsWith("public/fonts/")) cat = "Fonts";
  
  if (!breakdown[cat]) breakdown[cat] = { count: 0, bytes: 0, items: [] };
  breakdown[cat].count++;
  breakdown[cat].bytes += u.size;
  breakdown[cat].items.push({ file: u.file, size: formatSize(u.size), reason: u.reason });
});

console.log("\n=== UNUSED BREAKDOWN ===");
for (const [k, v] of Object.entries(breakdown)) {
  console.log(`${k}: ${v.count} files, ${formatSize(v.bytes)}`);
}

fs.writeFileSync("artifacts/detailed-unused-breakdown.json", JSON.stringify({
  totalCount: categorized.length,
  totalSize: formatSize(totalSize),
  usedCount: usedList.length,
  usedSize: formatSize(usedSize),
  unusedCount: unusedList.length,
  unusedSize: formatSize(unusedSize),
  breakdown,
  unusedFiles: unusedList.map(u => ({ file: u.file, size: formatSize(u.size), reason: u.reason })),
  usedFiles: usedList.map(u => ({ file: u.file, size: formatSize(u.size), reason: u.reason }))
}, null, 2));

console.log("\nWrote artifacts/detailed-unused-breakdown.json");
