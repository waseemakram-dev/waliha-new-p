import media from "./cloudinary-portfolio.json";

export function portfolioMediaUrl(localPath) {
  const url = media[localPath]?.secure_url;
  if (!url) throw new Error(`Missing Cloudinary upload: ${localPath}`);
  return url;
}
