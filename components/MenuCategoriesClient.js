'use client';

import { useState } from 'react';
import ImageUploadField from './ImageUploadField.js';

export default function MenuCategoriesClient({ initialCategories, canDelete = true }) {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState({ name: '', imageUrl: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/menu-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created.error);
      setCategories((prev) => [...prev, created]);
      setForm({ name: '', imageUrl: '' });
    } catch (err) {
      setError(err.message || 'Could not add section.');
    } finally {
      setSaving(false);
    }
  }

  async function updateCategory(id, patch) {
    const res = await fetch(`/api/admin/menu-categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const updated = await res.json();
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }

  async function deleteCategory(id) {
    if (!confirm('Delete this menu section? It must have no items in it.')) return;
    const res = await fetch(`/api/admin/menu-categories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Could not delete this section.');
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <>
      <div className="admin-panel">
        <h2>Add a New Menu Section</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: 16 }}>
          Only use this form for a section that doesn&apos;t exist yet. To add or change the photo on an <strong>existing</strong> section (like Breakfast or Pizza), scroll down to &quot;All Sections&quot; and upload it directly on that row.
        </p>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleAdd}>
          <div className="form-field">
            <label>Section Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <ImageUploadField label="Section Photo (optional)" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <button type="submit" className="btn btn-primary btn-small" disabled={saving}>{saving ? 'Adding…' : 'Add Section'}</button>
        </form>
      </div>

      <div className="admin-panel">
        <h2>All Sections ({categories.length})</h2>
        {categories.length === 0 ? (
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>No sections yet — add your first one above.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Photo</th><th>Name</th><th>Order</th><th></th></tr></thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ minWidth: 140 }}>
                    <ImageUploadField value={cat.imageUrl} onChange={(url) => updateCategory(cat.id, { imageUrl: url })} />
                  </td>
                  <td>
                    <input
                      type="text" defaultValue={cat.name}
                      onBlur={(e) => e.target.value !== cat.name && updateCategory(cat.id, { name: e.target.value })}
                      style={{ border: '1px solid transparent', padding: '4px 6px', font: 'inherit', width: '100%' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number" defaultValue={cat.sortOrder}
                      onBlur={(e) => Number(e.target.value) !== cat.sortOrder && updateCategory(cat.id, { sortOrder: e.target.value })}
                      style={{ width: 60, border: '1px solid var(--gray-light)', borderRadius: 4, padding: '4px 6px' }}
                    />
                  </td>
                  <td>{canDelete && <button type="button" className="btn-danger" onClick={() => deleteCategory(cat.id)}>Delete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
