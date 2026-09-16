'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', contact: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm({ name: '', contact: '', subject: '', message: '' });
    } catch {
      setError('Could not send your message. Please check your connection and try again.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === 'success' && <div className="form-success">Thanks — your message has been sent. We&apos;ll get back to you soon.</div>}
      {status === 'error' && <div className="form-error">{error}</div>}
      <div style={{ display: 'grid', gap: 14 }}>
        <input
          type="text" placeholder="Your name" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ padding: '12px 14px', border: '1px solid var(--gray-light)', borderRadius: 8, font: 'inherit' }}
        />
        <input
          type="text" placeholder="Your phone or email" required value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          style={{ padding: '12px 14px', border: '1px solid var(--gray-light)', borderRadius: 8, font: 'inherit' }}
        />
        <input
          type="text" placeholder="Subject" required value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          style={{ padding: '12px 14px', border: '1px solid var(--gray-light)', borderRadius: 8, font: 'inherit' }}
        />
        <textarea
          placeholder="Your message" rows={4} required value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ padding: '12px 14px', border: '1px solid var(--gray-light)', borderRadius: 8, font: 'inherit' }}
        />
        <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }} disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}
