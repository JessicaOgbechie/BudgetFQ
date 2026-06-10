import React, { useState, useRef } from 'react';
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
  const timerRef = useRef(null);

  const showTooltip = (e, tabId) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    // Clamp so tooltip never goes off-screen
    const x = Math.max(110, Math.min(rect.left + rect.width / 2, window.innerWidth - 110));
    setTooltip({ id: tabId, x, y: rect.bottom + 10 });
  };

  const hideTooltip = () => {
    timerRef.current = setTimeout(() => setTooltip(null), 100);
  };

  const handleClick = (e, tabId) => {
    showTooltip(e, tabId);
    setTimeout(() => setTooltip(null), 1600);
    setActiveTab(tabId);
  };

  return (
    <>
      <nav style={{
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
        display: 'flex', overflowX: 'auto', scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch', position: 'sticky', top: 57, zIndex: 98,
      }}>
        <style>{`nav::-webkit-scrollbar{display:none}`}</style>
        {TABS.map(tab => (
          <button key={tab.id}
            onClick={e => handleClick(e, tab.id)}
            onMouseEnter={e => showTooltip(e, tab.id)}
            onMouseLeave={hideTooltip}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            style={{
              padding: '13px 14px', fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-faint)',
              border: 'none', background: 'transparent', cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1, whiteSpace: 'nowrap', transition: 'color 0.15s',
              fontFamily: 'DM Sans, sans-serif', minHeight: 44, flexShrink: 0,
            }}
          >{tab.label}</button>
        ))}
      </nav>

      {tooltip && (
        <div role="tooltip" style={{
          position: 'fixed',
          left: tooltip.x,
          top: tooltip.y,
          transform: 'translateX(-50%)',
          background: '#111827', color: '#f5f5f5',
          fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
          padding: '7px 12px', borderRadius: 8, maxWidth: 200, textAlign: 'center',
          lineHeight: 1.5, zIndex: 9999, pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          whiteSpace: 'normal', wordBreak: 'break-word',
        }}>
          <div style={{
            position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderBottom: '5px solid #111827',
          }} />
          {TAB_DESCRIPTIONS[tooltip.id]}
        </div>
      )}
    </>
  );
}
