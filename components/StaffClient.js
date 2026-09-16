'use client';

import { useState } from 'react';
import { ROLE_LABELS } from '../lib/permissions.js';

const ROLE_OPTIONS = ['SUPER_ADMIN', 'MANAGER', 'STAFF'];

export default function StaffClient({ initialStaff, currentUserId }) {
  const [staff, setStaff] = useState(initialStaff);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STAFF' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created.error);
      setStaff((prev) => [...prev, created]);
      setForm({ name: '', email: '', password: '', role: 'STAFF' });
    } catch (err) {
      setError(err.message || 'Could not add staff account.');
    } finally {
      setSaving(false);
    }
  }

  async function changeRole(id, role) {
    const res = await fetch(`/api/admin/staff/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Could not change role.');
      return;
    }
    setStaff((prev) => prev.map((s) => (s.id === id ? data : s)));
  }

  async function deleteStaff(id) {
    if (!confirm('Remove this staff account? They will no longer be able to log in.')) return;
    const res = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Could not remove this account.');
      return;
    }
    setStaff((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <>
      <div className="admin-panel">
        <h2>Add a Staff Account</h2>
        {error && <div className="form-error">{error}</div>}
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
          <div className="form-row">
            <div className="form-field">
              <label>Password (min. 8 characters)</label>
              <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-small" disabled={saving}>{saving ? 'Adding…' : 'Add Staff Account'}</button>
        </form>
      </div>

      <div className="admin-panel">
        <h2>All Accounts ({staff.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Added</th><th></th></tr></thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id}>
                <td>
                  {s.name} {s.id === currentUserId && <em style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>(you)</em>}
                  {s.isProtected && <span title="Protected account" style={{ marginLeft: 6 }}>🔒</span>}
                </td>
                <td>{s.email}</td>
                <td>
                  <select
                    value={s.role} disabled={s.isProtected}
                    onChange={(e) => changeRole(s.id, e.target.value)}
                    style={{ padding: '4px 6px', fontSize: '0.85rem', border: '1px solid var(--gray-light)', borderRadius: 4 }}
                  >
                    {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                </td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>
                  {!s.isProtected && <button type="button" className="btn-danger" onClick={() => deleteStaff(s.id)}>Remove</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
