'use client';

import { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';

export default function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

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
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="form-field">
      {label && <label>{label}</label>}
      <div className="image-upload-row">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="image-upload-preview" />
        ) : (
          <div className="image-upload-preview image-upload-preview-empty">No photo</div>
        )}
        <div>
          <button
            type="button"
            className="btn-sm-outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : value ? 'Change Photo' : 'Upload Photo'}
          </button>
          {error && <div style={{ fontSize: '0.75rem', color: '#d64545', marginTop: 4 }}>{error}</div>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
