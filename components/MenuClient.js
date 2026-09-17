'use client';

import { Fragment, useState } from 'react';
import ImageUploadField from './ImageUploadField.js';
import VariantEditor from './VariantEditor.js';

function formatPrice(price) {
  return `UGX ${price.toLocaleString('en-US')}`;
}

export default function MenuClient({ initialItems, categories, canDelete = true }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState({
    name: '', categoryId: categories[0]?.id || '', description: '', price: '', imageUrl: '',
  });
  const [useVariants, setUseVariants] = useState(false);
  const [variants, setVariants] = useState([{ label: '', price: '' }]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editVariants, setEditVariants] = useState([]);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, variants: useVariants ? variants : [] }),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created.error);
      setItems((prev) => [...prev, created]);
      setForm({ name: '', categoryId: categories[0]?.id || '', description: '', price: '', imageUrl: '' });
      setUseVariants(false);
      setVariants([{ label: '', price: '' }]);
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

  async function saveVariants(id) {
    await updateItem(id, { variants: editVariants.filter((v) => v.label && v.price !== '') });
    setEditingId(null);
  }

  async function deleteItem(id) {
    if (!confirm('Delete this menu item? This cannot be undone.')) return;
    await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (categories.length === 0) {
    return (
      <div className="admin-panel">
        <p>Create a menu section first (under Menu Sections) before adding menu items.</p>
      </div>
    );
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
              <label>Menu Section</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', marginBottom: 12 }}>
            <input type="checkbox" checked={useVariants} onChange={(e) => setUseVariants(e.target.checked)} />
            This item has multiple sizes/prices (e.g. a cake with 1kg/2kg/Slice, or Medium/Large)
          </label>

          {useVariants ? (
            <VariantEditor variants={variants} onChange={setVariants} />
          ) : (
            <div className="form-field">
              <label>Price (UGX)</label>
              <input type="number" min="0" required={!useVariants} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          )}

          <div className="form-field">
            <label>Description (optional)</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
            <thead><tr><th>Name</th><th>Section</th><th>Price</th><th>Available</th><th></th></tr></thead>
            <tbody>
              {items.map((item) => (
                <Fragment key={item.id}>
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.category?.name}</td>
                    <td>
                      {item.variants?.length > 0 ? (
                        <span style={{ fontSize: '0.82rem' }}>
                          {item.variants.map((v) => `${v.label} ${formatPrice(v.price)}`).join(' · ')}
                        </span>
                      ) : (
                        <input
                          type="number" defaultValue={item.price ?? ''} min="0"
                          onBlur={(e) => Number(e.target.value) !== item.price && updateItem(item.id, { price: e.target.value })}
                          style={{ width: 100, border: '1px solid var(--gray-light)', borderRadius: 4, padding: '4px 6px' }}
                        />
                      )}
                    </td>
                    <td>
                      <input type="checkbox" checked={item.isAvailable} onChange={(e) => updateItem(item.id, { isAvailable: e.target.checked })} />
                    </td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button" className="btn-sm-outline"
                        onClick={() => {
                          setEditingId(editingId === item.id ? null : item.id);
                          setEditVariants(item.variants?.length > 0 ? item.variants.map((v) => ({ label: v.label, price: v.price })) : [{ label: '', price: '' }]);
                        }}
                      >
                        {item.variants?.length > 0 ? 'Edit Prices' : 'Add Sizes'}
                      </button>
                      {canDelete && <button type="button" className="btn-danger" onClick={() => deleteItem(item.id)}>Delete</button>}
                    </td>
                  </tr>
                  {editingId === item.id && (
                    <tr>
                      <td colSpan={5}>
                        <VariantEditor variants={editVariants} onChange={setEditVariants} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button type="button" className="btn btn-primary btn-small" onClick={() => saveVariants(item.id)}>Save</button>
                          <button type="button" className="btn-sm-outline" onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
