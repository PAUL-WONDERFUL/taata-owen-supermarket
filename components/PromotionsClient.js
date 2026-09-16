'use client';

import { useState } from 'react';
import ImageUploadField from './ImageUploadField.js';

function toDateInputValue(dateStr) {
  return new Date(dateStr).toISOString().slice(0, 10);
}

function getStatus(promo) {
  const now = new Date();
  const start = new Date(promo.startDate);
  const end = new Date(promo.endDate);
  if (now < start) return { label: 'Scheduled', color: 'var(--gold-dark)' };
  if (now > end) return { label: 'Expired', color: 'var(--gray)' };
  return { label: 'Active', color: 'var(--green)' };
}

export default function PromotionsClient({ initialPromotions }) {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '', price: '', startDate: '', endDate: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created.error);
      setPromotions((prev) => [created, ...prev]);
      setForm({ title: '', description: '', imageUrl: '', price: '', startDate: '', endDate: '' });
    } catch (err) {
      setError(err.message || 'Could not add promotion.');
    } finally {
      setSaving(false);
    }
  }

  async function updatePromotion(id, patch) {
    const res = await fetch(`/api/admin/promotions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const updated = await res.json();
    setPromotions((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }

  async function deletePromotion(id) {
    if (!confirm('Delete this promotion? This cannot be undone.')) return;
    await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' });
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <>
      <div className="admin-panel">
        <h2>Add a Promotion</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleAdd}>
          <div className="form-field">
            <label>Title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-field">
            <label>Description (optional)</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Start Date</label>
              <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="form-field">
              <label>End Date</label>
              <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <div className="form-field">
            <label>Price (optional, UGX)</label>
            <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <ImageUploadField label="Photo (optional)" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <button type="submit" className="btn btn-primary btn-small" disabled={saving}>{saving ? 'Adding…' : 'Add Promotion'}</button>
        </form>
      </div>

      <div className="admin-panel">
        <h2>All Promotions ({promotions.length})</h2>
        {promotions.length === 0 ? (
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>No promotions yet — add your first one above.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th></th><th>Title</th><th>Status</th><th>Start</th><th>End</th><th></th></tr></thead>
            <tbody>
              {promotions.map((promo) => {
                const status = getStatus(promo);
                return (
                  <tr key={promo.id}>
                    <td>{promo.imageUrl ? <img src={promo.imageUrl} alt="" className="thumb" /> : '—'}</td>
                    <td>
                      <input
                        type="text" defaultValue={promo.title}
                        onBlur={(e) => e.target.value !== promo.title && updatePromotion(promo.id, { title: e.target.value })}
                        style={{ border: '1px solid transparent', padding: '4px 6px', font: 'inherit', width: '100%' }}
                      />
                    </td>
                    <td><span style={{ color: status.color, fontWeight: 700, fontSize: '0.8rem' }}>{status.label}</span></td>
                    <td>
                      <input
                        type="date" defaultValue={toDateInputValue(promo.startDate)}
                        onChange={(e) => updatePromotion(promo.id, { startDate: e.target.value })}
                        style={{ border: '1px solid var(--gray-light)', borderRadius: 4, padding: '4px 6px', fontSize: '0.85rem' }}
                      />
                    </td>
                    <td>
                      <input
                        type="date" defaultValue={toDateInputValue(promo.endDate)}
                        onChange={(e) => updatePromotion(promo.id, { endDate: e.target.value })}
                        style={{ border: '1px solid var(--gray-light)', borderRadius: 4, padding: '4px 6px', fontSize: '0.85rem' }}
                      />
                    </td>
                    <td><button type="button" className="btn-danger" onClick={() => deletePromotion(promo.id)}>Delete</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
