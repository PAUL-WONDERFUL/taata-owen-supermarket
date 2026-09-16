'use client';

import { useState } from 'react';
import ImageUploadField from './ImageUploadField.js';

export default function CategoriesClient({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created.error);
      setCategories((prev) => [...prev, created]);
      setForm({ name: '', description: '', imageUrl: '' });
    } catch (err) {
      setError(err.message || 'Could not add category.');
    } finally {
      setSaving(false);
    }
  }

  async function updateCategory(id, patch) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const updated = await res.json();
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }

  async function deleteCategory(id) {
    if (!confirm('Delete this department? This cannot be undone.')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <>
      <div className="admin-panel">
        <h2>Add a Department</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-field">
              <label>Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Short Description</label>
              <input type="text" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <ImageUploadField label="Photo" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <button type="submit" className="btn btn-primary btn-small" disabled={saving}>{saving ? 'Adding…' : 'Add Department'}</button>
        </form>
      </div>

      <div className="admin-panel">
        <h2>All Departments ({categories.length})</h2>
        {categories.length === 0 ? (
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>No departments yet — add your first one above.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th></th><th>Name</th><th>Description</th><th></th></tr></thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.imageUrl ? <img src={cat.imageUrl} alt="" className="thumb" /> : '—'}</td>
                  <td>
                    <input
                      type="text" defaultValue={cat.name}
                      onBlur={(e) => e.target.value !== cat.name && updateCategory(cat.id, { name: e.target.value })}
                      style={{ border: '1px solid transparent', padding: '4px 6px', font: 'inherit', width: '100%' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text" defaultValue={cat.description}
                      onBlur={(e) => e.target.value !== cat.description && updateCategory(cat.id, { description: e.target.value })}
                      style={{ border: '1px solid transparent', padding: '4px 6px', font: 'inherit', width: '100%' }}
                    />
                  </td>
                  <td><button type="button" className="btn-danger" onClick={() => deleteCategory(cat.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
