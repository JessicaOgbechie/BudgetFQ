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
  const [tooltip, setTooltip] = useState(null); // { id, x, y }

  const handleMouseEnter = (e, tabId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      id: tabId,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  // On mobile: tap shows tooltip briefly then navigates
  const handleClick = (e, tabId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ id: tabId, x: rect.left + rect.width / 2, y: rect.bottom + 8 });
    setTimeout(() => setTooltip(null), 1800);
    setActiveTab(tabId);
  };

  return (
    <>
      <nav style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        position: 'sticky',
        top: 57,
        zIndex: 98,
        padding: '0 4px',
      }}>
        <style>{`nav::-webkit-scrollbar { display: none; }`}</style>

        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={e => handleClick(e, tab.id)}
            onMouseEnter={e => handleMouseEnter(e, tab.id)}
            onMouseLeave={handleMouseLeave}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            style={{
              padding: '13px 14px',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-faint)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id
                ? '2px solid var(--accent)'
                : '2px solid transparent',
              marginBottom: -1,
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
              fontFamily: 'DM Sans, sans-serif',
              minHeight: 44,
              flexShrink: 0,
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tooltip rendered in a fixed portal — never clipped */}
      {tooltip && (
        <div
          role="tooltip"
          style={{
            position: 'fixed',
            left: Math.min(tooltip.x, window.innerWidth - 220),
            top: tooltip.y,
            transform: 'translateX(-50%)',
            background: '#111827',
            color: '#f5f5f5',
            fontSize: 12,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
            padding: '6px 12px',
            borderRadius: 8,
            maxWidth: 220,
            textAlign: 'center',
            lineHeight: 1.4,
            zIndex: 9999,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            top: -5,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderBottom: '5px solid #111827',
          }} />
          {TAB_DESCRIPTIONS[tooltip.id]}
        </div>
      )}
    </>
  );
}
