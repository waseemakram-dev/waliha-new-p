const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const assetsToUpload = [
  {
    localFile: 'hero_video.mp4',
    folder: 'waliha-portfolio/hero',
    publicId: 'hero_video',
    resourceType: 'video',
  },
  {
    localFile: 'waliha.png',
    folder: 'waliha-portfolio/profile',
    publicId: 'waliha_avatar',
    resourceType: 'image',
  },
  {
    localFile: 'spider.png',
    folder: 'waliha-portfolio/elements',
    publicId: 'spider',
    resourceType: 'image',
  },
  {
    localFile: 'icon_pr.png',
    folder: 'waliha-portfolio/icons',
    publicId: 'icon_premiere_pro',
    resourceType: 'image',
  },
  {
    localFile: 'icon_ae.png',
    folder: 'waliha-portfolio/icons',
    publicId: 'icon_after_effects',
    resourceType: 'image',
  },
  {
    localFile: 'icon_ps.png',
    folder: 'waliha-portfolio/icons',
    publicId: 'icon_photoshop',
    resourceType: 'image',
  },
  {
    localFile: 'icon_ai.png',
    folder: 'waliha-portfolio/icons',
    publicId: 'icon_illustrator',
    resourceType: 'image',
  },
  {
    localFile: 'icon_davinci.png',
    folder: 'waliha-portfolio/icons',
    publicId: 'icon_davinci_resolve',
    resourceType: 'image',
  },
  {
    localFile: 'icon_figma.png',
    folder: 'waliha-portfolio/icons',
    publicId: 'icon_figma',
    resourceType: 'image',
  },
  {
    localFile: 'ChatGPT Image Sep 27, 2026, 04_20_51 PM.png',
    folder: 'waliha-portfolio/artworks',
    publicId: 'artwork_creative_1',
    resourceType: 'image',
  },
  {
    localFile: 'ChatGPT Image Sep 27, 2026, 05_18_39 PM.png',
    folder: 'waliha-portfolio/artworks',
    publicId: 'about_details_visual',
    resourceType: 'image',
  },
  {
    localFile: 'ChatGPT Image Sep 27, 2026, 05_51_13 PM.png',
    folder: 'waliha-portfolio/artworks',
    publicId: 'motion_character',
    resourceType: 'image',
  },
  {
    localFile: 'ChatGPT Image Sep 27, 2026, 06_04_19 PM.png',
    folder: 'waliha-portfolio/artworks',
    publicId: 'product_design_artwork',
    resourceType: 'image',
  },
  {
    localFile: 'brush.jpg',
    folder: 'waliha-portfolio/textures',
    publicId: 'brush_texture',
    resourceType: 'image',
  },
  {
    localFile: 'pencil.jpg',
    folder: 'waliha-portfolio/textures',
    publicId: 'pencil_texture',
    resourceType: 'image',
  },
];

async function uploadAssets() {
  console.log(`Starting upload to Cloudinary [${process.env.CLOUDINARY_CLOUD_NAME}]...`);
  const results = {};

  for (const asset of assetsToUpload) {
    const fullPath = path.resolve(__dirname, '../public/assets', asset.localFile);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }

    try {
      console.log(`Uploading ${asset.localFile} -> ${asset.folder}/${asset.publicId}...`);
      const uploadRes = await cloudinary.uploader.upload(fullPath, {
        folder: asset.folder,
        public_id: asset.publicId,
        resource_type: asset.resourceType,
        overwrite: true,
        use_filename: false,
        unique_filename: false,
      });

      console.log(`✓ Uploaded ${asset.localFile}`);
      console.log(`  URL: ${uploadRes.secure_url}`);
      results[asset.localFile] = {
        secure_url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
        format: uploadRes.format,
        resource_type: uploadRes.resource_type,
        bytes: uploadRes.bytes,
      };
    } catch (err) {
      console.error(`✗ Error uploading ${asset.localFile}:`, err);
    }
  }

  const outPath = path.resolve(__dirname, '../lib/cloudinary-assets.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nAll done! Asset mapping saved to ${outPath}`);
}

uploadAssets().catch(err => {
  console.error('Upload script failed:', err);
  process.exit(1);
});
