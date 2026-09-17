'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';

export default function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
      });
      onChange(blob.url);
    } catch {
      setError('Upload failed. Please try a smaller image or check your connection.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="form-field">
      {label && <label>{label}</label>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Preview" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
      )}
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFileChange} disabled={uploading} />
      {uploading && <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Uploading…</span>}
      {error && <span style={{ fontSize: '0.8rem', color: '#d64545' }}>{error}</span>}
    </div>
  );
}
