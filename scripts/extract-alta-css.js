const fs = require('fs');
const html = fs.readFileSync('scripts/altastudio_work.html', 'utf8');

// Find the CSS classes for Project Stack and Card
const cardSnippet = html.match(/data-framer-name="Main Container"[^>]*class="([^"]+)"/);
console.log('Main container classes:', cardSnippet ? cardSnippet[1] : 'none');

// Find all CSS rules in the document
const styleTags = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
const allCss = styleTags.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');

// Find rules containing Switzer
const switzerRules = allCss.split('}').filter(r => r.includes('Switzer')).slice(0, 10);
console.log('\nSwitzer rules sample:');
console.log(switzerRules.join('}\n'));

// Let's find grid layout rules
const gridRules = allCss.split('}').filter(r => r.includes('grid-template-columns') || r.includes('display:grid') || r.includes('display: grid')).slice(0, 10);
console.log('\nGrid rules sample:');
console.log(gridRules.join('}\n'));
