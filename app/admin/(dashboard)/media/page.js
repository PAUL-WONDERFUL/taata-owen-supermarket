import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { canDeleteContent } from '../../../../lib/permissions.js';
import { prisma } from '../../../../lib/prisma.js';
import MediaLibraryClient from '../../../../components/MediaLibraryClient.js';

export const dynamic = 'force-dynamic';

export default async function MediaLibraryPage() {
  const session = await getServerSession(authOptions);
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <div className="admin-topline"><h1>Media Library</h1></div>
      <MediaLibraryClient initialImages={images} canDelete={canDeleteContent(session?.user?.role)} />
    </>
  );
}
