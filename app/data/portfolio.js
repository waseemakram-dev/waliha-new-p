import artwork from "./artwork.json";
import { portfolioMediaUrl } from "../../lib/portfolio-media";

const definitions = [
  ["pure-leaf", "Pure Leaf", "Branding", "A green and white visual identity, explored across the logo, stationery, apparel and everyday brand applications."],
  ["velouria", "Velouria", "Branding", "A purple visual identity presented through brand boards and digital applications."],
  ["black-crown", "Black Crown", "Social Media", "A collection of tea campaign creatives, using warm colours, product photography and playful visual ideas."],
  ["nova-glow", "Nova Glow", "Branding", "A beauty identity with purple and yellow colour studies, stationery and packaging presentations."],
  ["pustimate", "Pustimate", "Branding", "A green identity presented across stationery and branded materials."],
  ["babies-pal", "Babies Pal", "Branding", "A colourful brand presentation featuring playful packaging and apparel applications."],
  ["buraq", "Buraq", "Branding", "The original Buraq design document, presented as a gallery with access to the complete PDF."],
  ["posters", "Posters & Event Design", "Posters", "Chess events, sports and expressive graphic posters, collected in one gallery."],
  ["social-media", "Social Media Creatives", "Social Media", "Food campaigns, promotional graphics and product posts designed for social feeds."],
  ["product-creatives", "Product Creatives", "Product Design", "Product-focused compositions featuring skincare, cosmetics and personal care."],
  ["logo-design", "Logo Collection", "Logos", "A selection of logo designs and their existing signage and brand applications."],
  ["banners", "Banner Collection", "Banners", "Campaign banners for events, education, retail and promotional communication."],
  ["thumbnails", "YouTube Thumbnails", "Thumbnails", "Thumbnail designs with bold type, expressive subjects and clear visual hierarchy."],
  ["web-design", "Digital Design", "Digital", "Digital layouts and their existing screen mockup presentations."],
];
export const PORTFOLIO = definitions.map(([slug,title,category,description]) => {
  const images = artwork.filter(item => item.group === slug).map(item => ({ ...item, src: portfolioMediaUrl(item.src), original: portfolioMediaUrl(item.src) }));
  const generated = ["pure-leaf","posters","social-media","thumbnails","product-creatives","banners","logo-design","nova-glow","pustimate","babies-pal","buraq"];
  return { slug,title,category,description,images,cover: slug === "banners" ? portfolioMediaUrl("/assets/mockups/banners-billboard.webp") : generated.includes(slug) ? portfolioMediaUrl(`/assets/mockups/${slug}.webp`) : images[0]?.src, generatedMockup:generated.includes(slug) };
});
export const ARTWORK_COUNT = artwork.length;
