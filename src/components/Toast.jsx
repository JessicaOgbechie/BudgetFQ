import React, { useEffect, useState } from 'react';

export default function Toast({ message, onDismiss }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onDismiss && onDismiss(); }, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  if (!visible) return null;
  return (
    <div role="alert" style={{
      background: 'var(--accent-light)', border: '1px solid var(--accent-border)',
      borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--accent-text)',
      fontWeight: 500, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <i className="ti ti-circle-check" aria-hidden="true" style={{ fontSize: 14 }} />
      {message}
    </div>
  );
}
