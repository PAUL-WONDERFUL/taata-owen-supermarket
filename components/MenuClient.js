'use client';

import { useState } from 'react';
import ImageUploadField from './ImageUploadField.js';

export default function MenuClient({ initialItems, canDelete = true }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState({ name: '', category: '', description: '', price: '', imageUrl: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created.error);
      setItems((prev) => [...prev, created]);
      setForm({ name: '', category: '', description: '', price: '', imageUrl: '' });
    } catch (err) {
      setError(err.message || 'Could not add menu item.');
    } finally {
      setSaving(false);
    }
  }

  async function updateItem(id, patch) {
    const res = await fetch(`/api/admin/menu/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
  }

  async function deleteItem(id) {
    if (!confirm('Delete this menu item? This cannot be undone.')) return;
    await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <>
      <div className="admin-panel">
        <h2>Add a Menu Item</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-field">
              <label>Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Menu Category (e.g. Breakfast, Lunch, Drinks)</label>
              <input type="text" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Price (UGX)</label>
              <input type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Description (optional)</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <ImageUploadField label="Photo (optional)" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <button type="submit" className="btn btn-primary btn-small" disabled={saving}>{saving ? 'Adding…' : 'Add Menu Item'}</button>
        </form>
      </div>

      <div className="admin-panel">
        <h2>All Menu Items ({items.length})</h2>
        {items.length === 0 ? (
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>No menu items yet — add your first one above.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Available</th><th></th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    <input
                      type="number" defaultValue={item.price} min="0"
                      onBlur={(e) => Number(e.target.value) !== item.price && updateItem(item.id, { price: e.target.value })}
                      style={{ width: 100, border: '1px solid var(--gray-light)', borderRadius: 4, padding: '4px 6px' }}
                    />
                  </td>
                  <td>
                    <input type="checkbox" checked={item.isAvailable} onChange={(e) => updateItem(item.id, { isAvailable: e.target.checked })} />
                  </td>
                  <td>{canDelete && <button type="button" className="btn-danger" onClick={() => deleteItem(item.id)}>Delete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
