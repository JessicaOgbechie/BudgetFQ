import React from 'react';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'bills', label: 'Priority Bills' },
  { id: 'invest', label: 'Invest Score' },
  { id: 'whatif', label: 'What-If' },
  { id: 'forecast', label: 'Forecast' },
  { id: 'history', label: 'History' },
  { id: 'ratio', label: '50/30/20' },
];

export default function TabBar({ activeTab, setActiveTab }) {
  return (
    <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '0 24px', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', position: 'sticky', top: 163, zIndex: 98 }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          style={{
            padding: '14px 16px', fontSize: 13,
            fontWeight: activeTab === tab.id ? 600 : 500,
            color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-faint)',
            border: 'none', background: 'transparent', cursor: 'pointer',
            borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: -1, whiteSpace: 'nowrap', transition: 'color 0.15s',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
