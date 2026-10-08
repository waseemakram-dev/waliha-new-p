const fs = require('fs');
const html = fs.readFileSync('scripts/altastudio_work.html', 'utf8');

// Find background-color occurrences
const bgMatches = html.match(/background(?:-color)?:\s*(?:var\([^)]+\)|#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|[a-z]+)/gi) || [];
console.log('Background matches:', Array.from(new Set(bgMatches)).slice(0, 20));

// Find tokens
const tokenMatches = html.match(/--token-[a-f0-9-]+:\s*[^;}]+/gi) || [];
console.log('\nTokens:');
console.log(tokenMatches.slice(0, 25).join('\n'));

// Let's find the main section structure
const mainMatch = html.match(/data-framer-name="([^"]+)"/g) || [];
console.log('\nFramer section names:');
console.log(Array.from(new Set(mainMatch)).slice(0, 30));
