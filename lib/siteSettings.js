import { prisma } from './prisma.js';

const SETTINGS_ID = 'singleton';

// Site-wide look-and-feel settings (currently just the background photo used
// for the Home splash/hero and admin login) -- deliberately separate from
// GalleryImage so it never appears in the public Gallery, and gated to
// Super Admin only since it's a major, site-wide visual choice.
export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
}

export async function getBackgroundImageUrl() {
  const settings = await getSiteSettings();
  return settings.backgroundImageUrl;
}

export { SETTINGS_ID };
