'use client';

import { useState } from 'react';

export default function StaffClient({ initialStaff, currentUserId }) {
  const [staff, setStaff] = useState(initialStaff);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwSaving(true);
    setPwError('');
    setPwSuccess(false);
    try {
      const res = await fetch(`/api/admin/staff/${currentUserId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pwForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPwSuccess(true);
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwError(err.message || 'Could not change password.');
    } finally {
      setPwSaving(false);
    }
  }

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
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.message || 'Could not add staff account.');
    } finally {
      setSaving(false);
    }
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
        <h2>Change Your Password</h2>
        {pwError && <div className="form-error">{pwError}</div>}
        {pwSuccess && <div className="form-success">Password updated.</div>}
        <form onSubmit={handleChangePassword}>
          <div className="form-row">
            <div className="form-field">
              <label>Current Password</label>
              <input
                type="password" required value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>New Password (min. 8 characters)</label>
              <input
                type="password" required minLength={8} value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-small" disabled={pwSaving}>
            {pwSaving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

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
          <div className="form-field">
            <label>Password (min. 8 characters)</label>
            <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary btn-small" disabled={saving}>{saving ? 'Adding…' : 'Add Staff Account'}</button>
        </form>
      </div>

      <div className="admin-panel">
        <h2>All Accounts ({staff.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Added</th><th></th></tr></thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id}>
                <td>{s.name} {s.id === currentUserId && <em style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>(you)</em>}</td>
                <td>{s.email}</td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td><button type="button" className="btn-danger" onClick={() => deleteStaff(s.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
