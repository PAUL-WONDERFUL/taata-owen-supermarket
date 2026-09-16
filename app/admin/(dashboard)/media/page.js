import { prisma } from '../../../../lib/prisma.js';
import MediaLibraryClient from '../../../../components/MediaLibraryClient.js';

export const dynamic = 'force-dynamic';

export default async function MediaLibraryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <div className="admin-topline"><h1>Media Library</h1></div>
      <MediaLibraryClient initialImages={images} />
    </>
  );
}
