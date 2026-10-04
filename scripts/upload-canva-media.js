const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const mediaItems = [
  // Video Editing Section (7 videos)
  {
    key: 'editing_01',
    url: 'https://kzgraphix.my.canva.site/_assets/video/be37f760057a8cdb326b9f835b8cde1d.mp4',
    folder: 'waliha-portfolio/videos/editing',
    publicId: 'editing_01',
    resourceType: 'video',
  },
  {
    key: 'editing_02',
    url: 'https://kzgraphix.my.canva.site/_assets/video/1c68480ead5277bb24c9de047469959f.mp4',
    folder: 'waliha-portfolio/videos/editing',
    publicId: 'editing_02',
    resourceType: 'video',
  },
  {
    key: 'editing_03',
    url: 'https://kzgraphix.my.canva.site/_assets/video/b95b51fda8852ade95786d8ffc566258.mp4',
    folder: 'waliha-portfolio/videos/editing',
    publicId: 'editing_03',
    resourceType: 'video',
  },
  {
    key: 'editing_04',
    url: 'https://kzgraphix.my.canva.site/_assets/video/917d618be713436689e4343859987f70.mp4',
    folder: 'waliha-portfolio/videos/editing',
    publicId: 'editing_04',
    resourceType: 'video',
  },
  {
    key: 'editing_05',
    url: 'https://kzgraphix.my.canva.site/_assets/video/2c3e9cdd40164010d56e1513a122bf94.mp4',
    folder: 'waliha-portfolio/videos/editing',
    publicId: 'editing_05',
    resourceType: 'video',
  },
  {
    key: 'editing_06',
    url: 'https://kzgraphix.my.canva.site/_assets/video/65134291c048b24901c67c00fdffffa6.mp4',
    folder: 'waliha-portfolio/videos/editing',
    publicId: 'editing_06',
    resourceType: 'video',
  },
  {
    key: 'editing_07',
    url: 'https://kzgraphix.my.canva.site/_assets/video/db2263a3170e6595581b48975bb61c64.mp4',
    folder: 'waliha-portfolio/videos/editing',
    publicId: 'editing_07',
    resourceType: 'video',
  },

  // Motion Design Section (6 videos)
  {
    key: 'motion_01',
    url: 'https://kzgraphix.my.canva.site/_assets/video/cf0d57644417714d25bf4e9fc2d43a02.mp4',
    folder: 'waliha-portfolio/videos/motion',
    publicId: 'motion_01',
    resourceType: 'video',
  },
  {
    key: 'motion_02',
    url: 'https://kzgraphix.my.canva.site/_assets/video/e5aa850706ed2f6ad5aa67514b51056e.mp4',
    folder: 'waliha-portfolio/videos/motion',
    publicId: 'motion_02',
    resourceType: 'video',
  },
  {
    key: 'motion_03',
    url: 'https://kzgraphix.my.canva.site/_assets/video/6c7b8e0de4fae7359353a8661e3997d8.mp4',
    folder: 'waliha-portfolio/videos/motion',
    publicId: 'motion_03',
    resourceType: 'video',
  },
  {
    key: 'motion_04',
    url: 'https://kzgraphix.my.canva.site/_assets/video/4ffbfabb1c4e7314112b114c3d6b35e8.mp4',
    folder: 'waliha-portfolio/videos/motion',
    publicId: 'motion_04',
    resourceType: 'video',
  },
  {
    key: 'motion_05',
    url: 'https://kzgraphix.my.canva.site/_assets/video/7f523dc25fd6853985a56bb8af3d4cdb.mp4',
    folder: 'waliha-portfolio/videos/motion',
    publicId: 'motion_05',
    resourceType: 'video',
  },
  {
    key: 'motion_06',
    url: 'https://kzgraphix.my.canva.site/_assets/video/df5f5c6ed7d4eb8b8cef0fcc85911195.mp4',
    folder: 'waliha-portfolio/videos/motion',
    publicId: 'motion_06',
    resourceType: 'video',
  },

  // Social Creatives Section (8 videos)
  {
    key: 'social_01',
    url: 'https://kzgraphix.my.canva.site/_assets/video/928c3dac3809fee29bbf78cb2affe548.mp4',
    folder: 'waliha-portfolio/videos/social',
    publicId: 'social_01',
    resourceType: 'video',
  },
  {
    key: 'social_02',
    url: 'https://kzgraphix.my.canva.site/_assets/video/95f34f6368c6ebd64ed42d2e4e9e4851.mp4',
    folder: 'waliha-portfolio/videos/social',
    publicId: 'social_02',
    resourceType: 'video',
  },
  {
    key: 'social_03',
    url: 'https://kzgraphix.my.canva.site/_assets/video/eb3f3cd21cd923ef03e621da675838c9.mp4',
    folder: 'waliha-portfolio/videos/social',
    publicId: 'social_03',
    resourceType: 'video',
  },
  {
    key: 'social_04',
    url: 'https://kzgraphix.my.canva.site/_assets/video/951f03bf982336ec2db638bc305bbe6e.mp4',
    folder: 'waliha-portfolio/videos/social',
    publicId: 'social_04',
    resourceType: 'video',
  },
  {
    key: 'social_05',
    url: 'https://kzgraphix.my.canva.site/_assets/video/fc2f9dd4e04d6e937c320b1a50bde991.mp4',
    folder: 'waliha-portfolio/videos/social',
    publicId: 'social_05',
    resourceType: 'video',
  },
  {
    key: 'social_06',
    url: 'https://kzgraphix.my.canva.site/_assets/video/d9ba2923f2f833087b589d0733e23174.mp4',
    folder: 'waliha-portfolio/videos/social',
    publicId: 'social_06',
    resourceType: 'video',
  },
  {
    key: 'social_07',
    url: 'https://kzgraphix.my.canva.site/_assets/video/82fe78e8c67fca694aaf1c49fbd35cad.mp4',
    folder: 'waliha-portfolio/videos/social',
    publicId: 'social_07',
    resourceType: 'video',
  },
  {
    key: 'social_08',
    url: 'https://kzgraphix.my.canva.site/_assets/video/6bda1eb70a6c6eefdcf23a6af9fdf072.mp4',
    folder: 'waliha-portfolio/videos/social',
    publicId: 'social_08',
    resourceType: 'video',
  },

  // Product Design Gallery Images (3 images)
  {
    key: 'product_01',
    url: 'https://kzgraphix.my.canva.site/_assets/media/754f18096f0fc2fe6da12d7394b61f6e.png',
    folder: 'waliha-portfolio/products',
    publicId: 'product_packaging_01',
    resourceType: 'image',
  },
  {
    key: 'product_02',
    url: 'https://kzgraphix.my.canva.site/_assets/media/49ff9a622ff9a6538a0ebf8a4d4d10e8.png',
    folder: 'waliha-portfolio/products',
    publicId: 'product_packaging_02',
    resourceType: 'image',
  },
  {
    key: 'product_03',
    url: 'https://kzgraphix.my.canva.site/_assets/media/6c98678c071e0f172e6706ab3098038f.png',
    folder: 'waliha-portfolio/products',
    publicId: 'product_packaging_03',
    resourceType: 'image',
  },
];

function uploadBufferToCloudinary(buffer, item) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: item.folder,
        public_id: item.publicId,
        resource_type: item.resourceType,
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

async function run() {
  console.log(`Starting media download and Cloudinary upload [${mediaItems.length} items]...`);
  const mapping = {};

  for (let i = 0; i < mediaItems.length; i++) {
    const item = mediaItems[i];
    console.log(`[${i + 1}/${mediaItems.length}] Downloading ${item.key} from Canva...`);
    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      console.log(`  Downloaded ${(buffer.length / 1024 / 1024).toFixed(2)} MB. Uploading to Cloudinary (${item.folder}/${item.publicId})...`);

      const result = await uploadBufferToCloudinary(buffer, item);
      console.log(`  ✓ Uploaded to: ${result.secure_url}`);

      mapping[item.key] = {
        originalUrl: item.url,
        cloudinaryUrl: result.secure_url,
        publicId: result.public_id,
        resourceType: item.resourceType,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (err) {
      console.error(`  ✗ Failed for ${item.key}:`, err.message);
    }
  }

  const outPath = path.resolve(__dirname, '../lib/cloudinary-canva-media.json');
  fs.writeFileSync(outPath, JSON.stringify(mapping, null, 2));
  console.log(`\nCompleted! Mapping written to ${outPath}`);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
