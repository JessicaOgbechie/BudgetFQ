import React, { useState } from 'react';
import { TAB_DESCRIPTIONS } from '../constants';

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
  const [tooltip, setTooltip] = useState(null);

  return (
    <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', position: 'sticky', top: 57, zIndex: 98, padding: '0 4px' }}>
      <style>{`
        nav::-webkit-scrollbar { display: none; }
        .tab-tooltip {
          position: absolute;
          bottom: -38px;
          left: 50%;
          transform: translateX(-50%);
          background: #111;
          color: #fff;
          font-size: 11px;
          font-family: 'DM Sans', sans-serif;
          padding: 5px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 300;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .tab-wrap:hover .tab-tooltip { opacity: 1; }
        .tab-tooltip::before {
          content: '';
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-bottom-color: #111;
          border-top: none;
        }
      `}</style>

      {TABS.map(tab => (
        <div key={tab.id} className="tab-wrap" style={{ position: 'relative', flexShrink: 0 }}>
          <button
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
              minHeight: 44,
              display: 'block',
            }}
          >
            {tab.label}
          </button>
          {/* Hover tooltip */}
          <div className="tab-tooltip" role="tooltip">
            {TAB_DESCRIPTIONS[tab.id]}
          </div>
        </div>
      ))}
    </nav>
  );
}
