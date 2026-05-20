import React from 'react';

const VARIANTS = {
  ok:      { bg: 'var(--accent-light)',  border: 'var(--accent-border)', color: 'var(--accent-text)',  icon: 'ti-circle-check' },
  error:   { bg: 'var(--red-light)',     border: 'var(--red-border)',    color: 'var(--red-text)',     icon: 'ti-alert-circle' },
  warning: { bg: 'var(--amber-light)',   border: 'var(--amber-border)',  color: 'var(--amber-text)',   icon: 'ti-alert-triangle' },
};

export default function AlertBanner({ variant = 'ok', children, style = {} }) {
  const v = VARIANTS[variant];
  return (
    <div role="alert" style={{
      background: v.bg, border: `1px solid ${v.border}`, color: v.color,
      borderRadius: 10, padding: '12px 16px', fontSize: 13, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 8, ...style
    }}>
      <i className={`ti ${v.icon}`} aria-hidden="true" style={{ fontSize: 15, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
}
