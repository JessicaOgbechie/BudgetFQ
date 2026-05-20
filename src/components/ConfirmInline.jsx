import React from 'react';

export default function ConfirmInline({ message, onConfirm, onCancel }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 13, color: 'var(--text-muted)' }}>
      <span>{message}</span>
      <button onClick={onConfirm} style={{
        background: 'var(--red-light)', border: '1px solid var(--red-border)', borderRadius: 7,
        color: 'var(--red)', padding: '4px 12px', fontSize: 12, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit',
      }}>Yes, remove</button>
      <button onClick={onCancel} style={{
        background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 7,
        color: 'var(--text-muted)', padding: '4px 12px', fontSize: 12, fontWeight: 500,
        cursor: 'pointer', fontFamily: 'inherit',
      }}>Cancel</button>
    </div>
  );
}
