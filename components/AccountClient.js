'use client';

import { useState } from 'react';

export default function AccountClient({ userId }) {
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
      const res = await fetch(`/api/admin/staff/${userId}`, {
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

  return (
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
  );
}
