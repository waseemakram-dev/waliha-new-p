from pathlib import Path
import json,re,subprocess
root=Path.cwd();items=json.loads(Path('app/data/artwork.json').read_text(encoding='utf-8'))
used=set()
for item in items:
 for field in ['src','original']:used.add('public/'+item[field].split('#')[0].lstrip('/'))
for p in Path('public/assets/mockups').glob('*.webp'):used.add(p.as_posix())
used.add('public/assets/mockups/generation-manifest.json')
for folder in ['app','lib']:
 for p in Path(folder).rglob('*'):
  if p.suffix not in ['.js','.jsx','.css','.json','.ts','.tsx']:continue
  if p.name in ['artwork.json','generation-manifest.json']:continue
  text=p.read_text(encoding='utf-8')
  for m in re.findall(r'/assets/[^\"\'<>\n)]+',text):
   candidate='public/'+m.split('#')[0].split('?')[0].strip()
   if Path(candidate).is_file():used.add(candidate)
unused=sorted(p.as_posix() for p in Path('public/assets').rglob('*') if p.is_file() and p.as_posix() not in used)
ignore=Path('.gitignore');text=ignore.read_text(encoding='utf-8');start='# BEGIN unused portfolio assets';end='# END unused portfolio assets'
if start in text:text=text[:text.index(start)]+text[text.index(end)+len(end):]
block=start+'\n# Local originals, duplicates and archives that are not referenced by the site.\n'+'\n'.join('/'+p for p in unused)+'\n/artifacts/\n'+end+'\n'
ignore.write_text(text.rstrip()+'\n\n'+block,encoding='utf-8')
tracked=set(subprocess.check_output(['git','ls-files','-z'],text=True).split('\0'))
remove=[p for p in unused if p in tracked]
if remove:subprocess.run(['git','rm','--cached','--',*remove],check=True,stdout=subprocess.DEVNULL)
Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/unused-assets-report.json').write_text(json.dumps({'ignored':unused,'removedFromIndex':remove,'keptReferencedFiles':len(used)},indent=2),encoding='utf-8')
print('Unused asset files ignored:',len(unused),'Previously tracked assets removed from index:',len(remove),'Used assets preserved:',len(used))
