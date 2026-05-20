import React from 'react';
import { CURRENCIES } from '../constants';
import { generateCSV } from '../utils';

export default function Header({ primaryCurrency, setPrimaryCurrency, state, totalIncome }) {
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
  };

  return (
    <header style={{
      background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
      padding: '15px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div>
        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
          Budget<span style={{ color: 'var(--accent)' }}>FQ</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>Smart budgeting for real life</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <select
          value={primaryCurrency}
          onChange={e => setPrimaryCurrency(e.target.value)}
          aria-label="Select currency"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, padding: '6px 10px', cursor: 'pointer' }}
        >
          {CURRENCIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={handleCSV} aria-label="Export CSV" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-download" aria-hidden="true" style={{ fontSize: 14 }} /> Export CSV
        </button>
        <button onClick={handleJSONExport} aria-label="Export JSON backup" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-database-export" aria-hidden="true" style={{ fontSize: 14 }} /> Backup
        </button>
      </div>
    </header>
  );
}
