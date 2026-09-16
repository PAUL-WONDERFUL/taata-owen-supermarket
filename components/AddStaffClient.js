'use client';

import { useState } from 'react';

export default function AddStaffClient() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm({ name: '', email: '', password: '' });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Could not add staff account.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-panel">
      <h2>Add a Staff Account</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: 16 }}>
        As a Manager, you can add new Staff accounts. Only a Super Admin can add Managers or view the full staff list.
      </p>
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">Staff account created.</div>}
      <form onSubmit={handleAdd}>
        <div className="form-row">
          <div className="form-field">
            <label>Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="form-field">
          <label>Password (min. 8 characters)</label>
          <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary btn-small" disabled={saving}>{saving ? 'Adding…' : 'Add Staff Account'}</button>
      </form>
    </div>
  );
}
