const fs = require('fs');
const content = fs.readFileSync('app/page.js', 'utf8');
const urls = content.match(/https:\/\/kzgraphix\.my\.canva\.site\/[^\s"']+/g) || [];
const uniqueUrls = Array.from(new Set(urls));
console.log('Found', uniqueUrls.length, 'unique Canva URLs');
console.log(JSON.stringify(uniqueUrls, null, 2));
