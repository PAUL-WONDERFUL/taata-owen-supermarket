'use client';

import { useState } from 'react';
import ImageUploadField from './ImageUploadField.js';

export default function SiteSettingsClient({ initialBackgroundImageUrl }) {
  const [imageUrl, setImageUrl] = useState(initialBackgroundImageUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChange(url) {
    setImageUrl(url);
    setSaving(true);
    setSaved(false);
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backgroundImageUrl: url }),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="admin-panel">
      <h2>Website Background Photo</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: 16 }}>
        This photo (usually of the building) is used for a brief splash and the homepage hero
        background, plus the admin login page background. It does <strong>not</strong> appear in
        the public Gallery, and only a Super Admin can change it.
      </p>
      <ImageUploadField label="Background Photo" value={imageUrl} onChange={handleChange} />
      {saving && <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Saving…</span>}
      {saved && !saving && <span style={{ fontSize: '0.8rem', color: 'var(--green)' }}>Saved.</span>}
      {!imageUrl && (
        <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: 12 }}>
          No background photo set yet — the homepage will use its default green gradient until one is added.
        </p>
      )}
    </div>
  );
}
