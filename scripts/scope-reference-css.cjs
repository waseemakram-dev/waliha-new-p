const fs = require('fs');
const postcss = require('postcss');
const root = postcss.parse(fs.readFileSync('scripts/alta-reference-raw.css','utf8'));
root.walkRules(rule => {
  let parent = rule.parent;
  while (parent) { if (parent.type === 'atrule' && /keyframes/.test(parent.name)) return; parent = parent.parent; }
  rule.selectors = rule.selectors.map(selector => {
    let next = selector.replace(/:root\b/g,'.alta-source').replace(/html\s+body\b/g,'.alta-source').replace(/\b(html|body)\b/g,'.alta-source').replace(/#main\b/g,'.alta-source');
    return next.includes('.alta-source') ? next : ':where(.alta-source) ' + next;
  });
});
fs.writeFileSync('app/work/reference/source.css','/* Layout extracted from the public Alta Work page, scoped to this route. */\n'+root.toString());
