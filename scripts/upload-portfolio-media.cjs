const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
require('dotenv').config({path:path.join(root,'.env.local'),quiet:true});
require('dotenv').config({path:path.join(root,'.env'),quiet:true});
const cloudinary = require('cloudinary').v2;
cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET,secure:true});
const manifestPath=path.join(root,'lib/cloudinary-portfolio.json');
const manifest=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):{};
const artwork=JSON.parse(fs.readFileSync(path.join(root,'app/data/artwork.json'),'utf8'));
const files=[...new Set(artwork.map(item=>item.src.startsWith('/assets/')?item.src:null).filter(Boolean))];
const covers=['pure-leaf','posters','social-media','thumbnails','product-creatives','logo-design','nova-glow','pustimate','babies-pal','buraq','banners-billboard'];
files.push(...covers.map(slug=>`/assets/mockups/${slug}.webp`));
async function upload(local){
  const full=path.join(root,'public',local);
  const hash=crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
  if(manifest[local]?.hash===hash)return;
  const publicId=`waliha-portfolio/${local.split('/')[2]}/${path.basename(local,'.webp')}-${hash.slice(0,12)}`;
  let result;
  for(let attempt=1;attempt<=3;attempt++){
    try{result=await cloudinary.uploader.upload(full,{public_id:publicId,resource_type:'image',overwrite:false,timeout:120000});break;}
    catch(error){if(attempt===3)throw new Error(`Upload failed for ${local}: ${error.message}`);}
  }
  manifest[local]={secure_url:result.secure_url,public_id:result.public_id,bytes:result.bytes,hash};
  fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
  console.log(`Uploaded ${local}`);
}
async function main(){
  if(!process.env.CLOUDINARY_API_SECRET)throw new Error('Cloudinary credentials are missing');
  let cursor=0;
  await Promise.all(Array.from({length:3},async()=>{while(cursor<files.length)await upload(files[cursor++]);}));
  console.log(`Cloudinary media ready: ${files.length} files`);
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
