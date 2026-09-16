'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';

const CATEGORIES = ['SUPERMARKET', 'RESTAURANT', 'FOOD', 'PRODUCTS', 'EVENTS', 'OTHER'];

export default function MediaLibraryClient({ initialImages }) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('SUPERMARKET');
  const [error, setError] = useState('');

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const blob = await upload(file.name, file, { access: 'public', handleUploadUrl: '/api/admin/upload' });
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: blob.url, category: uploadCategory }),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created.error);
      setImages((prev) => [created, ...prev]);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function updateImage(id, patch) {
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const updated = await res.json();
    setImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
  }

  async function deleteImage(id) {
    if (!confirm('Delete this photo? This cannot be undone.')) return;
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  return (
    <>
      <div className="admin-panel">
        <h2>Upload a Photo</h2>
        {error && <div className="form-error">{error}</div>}
        <div className="form-row" style={{ alignItems: 'end' }}>
          <div className="form-field">
            <label>Category</label>
            <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Photo</label>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleUpload} disabled={uploading} />
          </div>
        </div>
        {uploading && <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>Uploading…</p>}
      </div>

      <div className="admin-panel">
        <h2>All Photos ({images.length})</h2>
        {images.length === 0 ? (
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>No photos yet. Upload your first one above.</p>
        ) : (
          <div className="media-grid">
            {images.map((img) => (
              <div className="media-item" key={img.id}>
                {img.isFeatured && <span className="featured-badge">Featured</span>}
                <img src={img.url} alt={img.caption || ''} />
                <div className="media-meta">
                  <input
                    type="text"
                    placeholder="Caption"
                    defaultValue={img.caption || ''}
                    onBlur={(e) => updateImage(img.id, { caption: e.target.value })}
                    style={{ width: '100%', marginBottom: 6, padding: '4px 6px', fontSize: '0.75rem', border: '1px solid var(--gray-light)', borderRadius: 4 }}
                  />
                  <select
                    value={img.category}
                    onChange={(e) => updateImage(img.id, { category: e.target.value })}
                    style={{ width: '100%', marginBottom: 6, padding: '4px 6px', fontSize: '0.75rem', border: '1px solid var(--gray-light)', borderRadius: 4 }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', marginBottom: 6 }}>
                    <input type="checkbox" checked={img.isFeatured} onChange={(e) => updateImage(img.id, { isFeatured: e.target.checked })} />
                    Featured
                  </label>
                  <button type="button" className="btn-danger" style={{ width: '100%' }} onClick={() => deleteImage(img.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
