import React, { useState } from 'react';
import { CURRENCIES } from '../constants';
import { generateCSV } from '../utils';

export default function Header({ primaryCurrency, setPrimaryCurrency, state, totalIncome }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCSV = () => {
    const csv = generateCSV(state, totalIncome);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    a.download = `budgetfq-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  const handleJSONExport = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    a.download = `budgetfq-backup-${now.toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  return (
    <header style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div>
        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
          Budget<span style={{ color: 'var(--accent)' }}>FQ</span>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 1 }}>Smart budgeting for real life</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        {/* Currency selector — always visible */}
        <select
          value={primaryCurrency}
          onChange={e => setPrimaryCurrency(e.target.value)}
          aria-label="Select currency"
          style={{
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text-primary)',
            fontFamily: 'DM Sans, sans-serif', fontSize: 13,
            padding: '7px 10px', cursor: 'pointer',
          }}
        >
          {CURRENCIES.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Three-dot menu button */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="More options"
          style={{
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 8, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
          }}
        >
          <i className="ti ti-dots-vertical" aria-hidden="true" style={{ fontSize: 18 }} />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 200 }}
            />
            <div style={{
              position: 'absolute', top: 42, right: 0, zIndex: 201,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: 6, minWidth: 170,
              boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
            }}>
              <button onClick={handleCSV} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: 'none', background: 'transparent',
                fontFamily: 'DM Sans, sans-serif', fontSize: 14,
                color: 'var(--text-body)', cursor: 'pointer', textAlign: 'left',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <i className="ti ti-download" aria-hidden="true" style={{ fontSize: 16, color: 'var(--accent)' }} />
                Export CSV
              </button>
              <button onClick={handleJSONExport} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: 'none', background: 'transparent',
                fontFamily: 'DM Sans, sans-serif', fontSize: 14,
                color: 'var(--text-body)', cursor: 'pointer', textAlign: 'left',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <i className="ti ti-database-export" aria-hidden="true" style={{ fontSize: 16, color: 'var(--accent)' }} />
                Backup data
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
