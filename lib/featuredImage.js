import { prisma } from './prisma.js';

// The single "Featured" photo from the Media Library, used as the Home
// page hero/splash background and the admin login background.
export async function getFeaturedImage() {
  return prisma.galleryImage.findFirst({ where: { isFeatured: true }, orderBy: { createdAt: 'desc' } });
}
