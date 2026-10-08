const fs = require("fs");
const path = require("path");

const artwork = JSON.parse(fs.readFileSync("app/data/artwork.json", "utf8"));
const artworkMap = new Map();
artwork.forEach(a => artworkMap.set(a.src.replace(/^\//, ""), a));

const portfolioFiles = fs.readdirSync("public/assets/portfolio").map(f => "assets/portfolio/" + f);

console.log("Total entries in artwork.json:", artwork.length);
console.log("Total files in public/assets/portfolio:", portfolioFiles.length);

const unreferencedInArtwork = portfolioFiles.filter(f => !artworkMap.has(f));
console.log("Portfolio files NOT in artwork.json:", unreferencedInArtwork);

const missingFromDisk = artwork.filter(a => !fs.existsSync("public/" + a.src.replace(/^\//, "")));
console.log("Artwork entries missing on disk:", missingFromDisk);
