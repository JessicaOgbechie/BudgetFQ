import React from 'react';

export default function EmptyState({ title, subtitle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 20px', textAlign: 'center' }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="12" y="10" width="46" height="56" rx="6" fill="#E8E9EC"/>
        <rect x="20" y="22" width="24" height="3" rx="1.5" fill="#D1D5DB"/>
        <rect x="20" y="30" width="30" height="3" rx="1.5" fill="#D1D5DB"/>
        <rect x="20" y="38" width="18" height="3" rx="1.5" fill="#D1D5DB"/>
        <circle cx="58" cy="58" r="14" fill="#F4F5F7" stroke="#D1D5DB" strokeWidth="1.5"/>
        <path d="M58 50v8l5 3" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 16, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 280 }}>{subtitle}</div>
    </div>
  );
}
