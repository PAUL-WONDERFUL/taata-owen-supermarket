'use client';

import { useState } from 'react';

export default function MessagesClient({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);

  async function deleteMessage(id) {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  if (messages.length === 0) {
    return <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>No messages yet — anything submitted through the Contact page will show up here.</p>;
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {messages.map((m) => (
        <div className="admin-panel" key={m.id} style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
            <div>
              <strong>{m.subject}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{m.name} · {m.contact}</div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{new Date(m.createdAt).toLocaleString()}</div>
          </div>
          <p style={{ fontSize: '0.92rem', whiteSpace: 'pre-wrap' }}>{m.message}</p>
          <button type="button" className="btn-danger" style={{ marginTop: 10 }} onClick={() => deleteMessage(m.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
