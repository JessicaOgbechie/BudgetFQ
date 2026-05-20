import React from 'react';

const TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'bills',     label: 'Bills' },
  { id: 'invest',    label: 'Invest' },
  { id: 'whatif',    label: 'What-If' },
  { id: 'forecast',  label: 'Forecast' },
  { id: 'history',   label: 'History' },
  { id: 'ratio',     label: '50/30/20' },
];

export default function TabBar({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
      position: 'sticky',
      top: 145,
      zIndex: 98,
      padding: '0 4px',
    }}>
      <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          style={{
            padding: '13px 14px',
            fontSize: 13,
            fontWeight: activeTab === tab.id ? 600 : 500,
            color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-faint)',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: -1,
            whiteSpace: 'nowrap',
            transition: 'color 0.15s',
            fontFamily: 'DM Sans, sans-serif',
            flexShrink: 0,
            minHeight: 44, // minimum tap target
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
