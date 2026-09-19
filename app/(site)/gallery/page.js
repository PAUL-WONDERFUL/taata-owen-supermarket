import { prisma } from '../../../lib/prisma.js';
import GalleryGrid from '../../../components/GalleryGrid.js';

export const revalidate = 30;

export const metadata = {
  title: 'Gallery | Taata Owen Supermarket',
  description: 'Photos of Taata Owen Supermarket and restaurant in Jinja, Uganda.',
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <section className="hero" style={{ padding: '56px 0' }}>
        <div className="container" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <span className="hero-eyebrow">Gallery</span>
            <h1>A look inside Taata Owen</h1>
            <p>Explore the supermarket, restaurant and the spaces that make Taata Owen part of everyday life in Jinja</p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {images.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray)' }}>Photos will appear here once uploaded in the admin dashboard.</p>
          ) : (
            <GalleryGrid images={images} />
          )}
        </div>
      </section>
    </>
  );
}
