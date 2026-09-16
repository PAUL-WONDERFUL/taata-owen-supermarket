'use client';

import { useState } from 'react';
import Image from 'next/image';

const CATEGORY_LABELS = {
  SUPERMARKET: 'Supermarket',
  RESTAURANT: 'Restaurant',
  FOOD: 'Food',
  PRODUCTS: 'Products',
  EVENTS: 'Events',
  OTHER: 'Other',
};

export default function GalleryGrid({ images }) {
  const [filter, setFilter] = useState('ALL');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = ['ALL', ...Object.keys(CATEGORY_LABELS)];
  const visible = filter === 'ALL' ? images : images.filter((img) => img.category === filter);

  return (
    <>
      <div className="gallery-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`gallery-filter-btn${filter === cat ? ' active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'ALL' ? 'All' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--gray)' }}>No photos in this category yet.</p>
      ) : (
        <div className="gallery-grid">
          {visible.map((img) => (
            <div className="gallery-photo" key={img.id} onClick={() => setLightboxImage(img)}>
              <Image src={img.url} alt={img.caption || 'Taata Owen Supermarket'} width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {img.caption && <div className="caption">{img.caption}</div>}
            </div>
          ))}
        </div>
      )}

      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImage(null)} aria-label="Close">✕</button>
          <div>
            <Image src={lightboxImage.url} alt={lightboxImage.caption || 'Taata Owen Supermarket'} width={900} height={900} style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '82vh', borderRadius: 8 }} />
            {lightboxImage.caption && <div className="lightbox-caption">{lightboxImage.caption}</div>}
          </div>
        </div>
      )}
    </>
  );
}
