from bs4 import BeautifulSoup, Comment
from pathlib import Path
from urllib.parse import urljoin
import re,json
src=BeautifulSoup(Path('scripts/altastudio_work.html').read_text(encoding='utf-8'),'html.parser')
root=src.select_one('.framer-LfkEw')
# Keep reference markup, responsive variants and original media, without Framer runtime/tracking.
nav=root.select_one('.framer-1shwj3s-container')
nav.parent.decompose()
root.select_one('.framer-11dkd49-container').decompose()
for e in root.select('script,style,.framer-o8sjt6-container,#overlay,#template-overlay'):e.decompose()
for comment in root.find_all(string=lambda x:isinstance(x,Comment)):comment.extract()
for text in root.find_all(string=True):
 if 'Alta' in text:text.replace_with(str(text).replace('Alta','Waliha'))
for el in root.find_all(True):
 for attr in list(el.attrs):
  if attr.lower().startswith('on'):del el[attr]
 if el.has_attr('data-framer-appear-id') or ('will-change:transform' in el.get('style','') and 'opacity:0' in el.get('style','')):
  el['data-reference-reveal']=''
  el['style']=re.sub(r'(?:opacity|transform):[^;]+;?','',el.get('style',''))
 if 'text-reveal' in el.get('class',[]):
  for child in el.find_all(recursive=False):
   child['style']=re.sub(r'opacity:0(?:\.001)?(?=;|$)','opacity:1',child.get('style',''))
 if el.name=='a' and el.get('href','').startswith('./'):el['href']=urljoin('https://altastudio.framer.website/work',el['href'])
 if el.name=='form':
  el.attrs.pop('action',None)
  el['data-reference-form']='newsletter' if 'Subscribe' in el.get_text() else 'contact'
 if el.name=='input' and el.get('placeholder')=='Search...':el['aria-label']='Search projects'
 if el.name=='select':el['aria-label']='Filter projects by category'
hero=root.select_one('[data-framer-name="Section - Hero"]');hero['id']='heroSection'
root.select_one('#xAu9CCxeq')['data-shader-slot']=''
# Mark each CMS item wrapper to preserve original flex spacing when filtered.
for a in root.select('a[href*="/projects/"]'):
 a['data-reference-project']=a['href'].split('/')[-1]
 a.parent['data-reference-project-item']=''
for stack in root.select('[data-framer-name="Project Stack"]'):
 empty=src.new_tag('p');empty['class']='reference-empty';empty['hidden']='';empty.string='No projects in this category yet. Try another search.';stack.append(empty)
# The reference now supplies only the hero; real portfolio and shared chrome are React components.
content=root.select_one('.framer-S1Nsh')
for child in list(content.find_all(recursive=False)):
 if child is not hero:child.decompose()
for e in root.select('.framer-4k0qqt'):e.decompose()
for text in hero.find_all(string=True):
 if '2024-2026' in text:text.replace_with('Selected work')
 elif 'Every project here asked' in text:text.replace_with('Brand identities, campaigns and original designs by Waliha Idrees.')
# Source SVG symbol sprites are needed by the original icons.
sprites=src.select_one('#svg-templates')
html=str(root)+(str(sprites) if sprites else '')
Path('app/work/reference').mkdir(exist_ok=True)
Path('app/work/reference/markup.json').write_text(json.dumps(html,ensure_ascii=False),encoding='utf-8')
styles='\n'.join(e.text for e in src.select('style') if len(e.text)>100)
Path('scripts/alta-reference-raw.css').write_text(styles,encoding='utf-8')
print('markup',len(html),'styles',len(styles))
