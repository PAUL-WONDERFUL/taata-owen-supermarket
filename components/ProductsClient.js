'use client';

import { useState } from 'react';
import ImageUploadField from './ImageUploadField.js';

export default function ProductsClient({ initialProducts, categories, canDelete = true }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({
    name: '', categoryId: categories[0]?.id || '', description: '', price: '', imageUrl: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created.error);
      setProducts((prev) => [...prev, created]);
      setForm({ name: '', categoryId: categories[0]?.id || '', description: '', price: '', imageUrl: '' });
    } catch (err) {
      setError(err.message || 'Could not add product.');
    } finally {
      setSaving(false);
    }
  }

  async function updateProduct(id, patch) {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const updated = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (categories.length === 0) {
    return (
      <div className="admin-panel">
        <p>Add a Supermarket department first (under Categories) before adding products.</p>
      </div>
    );
  }

  return (
    <>
      <div className="admin-panel">
        <h2>Add a Product</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-field">
              <label>Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Department</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Price (optional, UGX)</label>
              <input type="number" min="0" placeholder="Leave blank if not shown" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Description (optional)</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <ImageUploadField label="Photo (optional)" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <button type="submit" className="btn btn-primary btn-small" disabled={saving}>{saving ? 'Adding…' : 'Add Product'}</button>
        </form>
      </div>

      <div className="admin-panel">
        <h2>All Products ({products.length})</h2>
        {products.length === 0 ? (
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>No products yet — add your first one above.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Department</th><th>Price</th><th>Available</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category?.name}</td>
                  <td>
                    <input
                      type="number" defaultValue={p.price ?? ''} min="0" placeholder="—"
                      onBlur={(e) => Number(e.target.value || 0) !== (p.price || 0) && updateProduct(p.id, { price: e.target.value })}
                      style={{ width: 100, border: '1px solid var(--gray-light)', borderRadius: 4, padding: '4px 6px' }}
                    />
                  </td>
                  <td>
                    <input type="checkbox" checked={p.isAvailable} onChange={(e) => updateProduct(p.id, { isAvailable: e.target.checked })} />
                  </td>
                  <td>{canDelete && <button type="button" className="btn-danger" onClick={() => deleteProduct(p.id)}>Delete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
