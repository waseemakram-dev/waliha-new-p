from pathlib import Path
from PIL import Image,ImageOps
import hashlib,json
root=Path('public/assets/assets');out=Path('public/assets/portfolio');out.mkdir(parents=True,exist_ok=True)
seen=set();items=[]
for p in sorted(root.rglob('*')):
 if p.suffix.lower() not in ['.jpg','.jpeg','.png','.jfif']:continue
 h=hashlib.sha256(p.read_bytes()).hexdigest()
 if h in seen:continue
 seen.add(h)
 rel=str(p.relative_to(root)).replace('\\','/');name=p.name.lower();parts=rel.lower().split('/')
 if name=='pure leaf branding-01.png':group='pure-leaf'
 elif name in ['untitled-1-01.jpg.jpeg','aagttj4xhkm_1788697089706.png','gemini_generated_image_bx1t0obx1t0obx1t.jpg']:group='velouria'
 elif name=='untitled-1-02.jpg.jpeg':group='pustimate'
 elif name=='nova glow-01.jpg.jpeg':group='nova-glow'
 elif name=='dreams2.jpg.jpeg':group='babies-pal'
 elif name in ['untitled-1-03.jpg.jpeg','free macbook mockup on glass cube.png']:group='web-design'
 elif 'blackcrown branding' in parts:group='black-crown'
 elif 'banner' in parts:group='banners'
 elif 'logoo' in parts:group='logo-design'
 elif 'thumbnail' in parts:group='thumbnails'
 elif 'product' in parts:group='product-creatives'
 elif 'posts' in parts:group='social-media'
 else:group='posters'
 dest=out/(h[:16]+'.webp')
 with Image.open(p) as im:
  im.draft('RGB',(1800,1800));im=ImageOps.exif_transpose(im);im.thumbnail((1800,1800));im.convert('RGB').save(dest,'WEBP',quality=88,method=4)
 items.append({'src':'/assets/portfolio/'+dest.name,'original':'/assets/assets/'+rel,'name':p.stem,'group':group,'width':im.width,'height':im.height})
import fitz
pdf=fitz.open(root/'BURAQ.pdf')
for n,page in enumerate(pdf):
 dest=out/f'buraq-{n+1}.webp'
 scale=min(1800/page.rect.width,1800/page.rect.height)
 pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),alpha=False)
 Image.frombytes('RGB',[pix.width,pix.height],pix.samples).save(dest,'WEBP',quality=90)
 items.append({'src':'/assets/portfolio/'+dest.name,'original':f'/assets/assets/BURAQ.pdf#page={n+1}','name':f'Buraq page {n+1}','group':'buraq','width':pix.width,'height':pix.height})
Path('app/data/artwork.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf-8')
print('Optimized',len(items),'unique designs')
