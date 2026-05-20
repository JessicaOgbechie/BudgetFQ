import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { formatCurrency } from '../utils';

export default function WhatIfSimulator({ totalIncome, primaryCurrency }) {
  const [rows, setRows] = useState([{ id: 1, catKey: 'food', amount: '' }]);

  const addRow = () => {
    if (rows.length >= 3) return;
    setRows(r => [...r, { id: Date.now(), catKey: 'leisure', amount: '' }]);
  };
  const removeRow = (id) => setRows(r => r.filter(x => x.id !== id));
  const updateRow = (id, field, val) => setRows(r => r.map(x => x.id === id ? { ...x, [field]: val } : x));

  const totals = rows.map(r => parseFloat(r.amount) || 0);
  const combined = totals.reduce((s, v) => s + v, 0);

  return (
    <div>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 14 }}>Simulate a spending change</div>
        {rows.map((row, idx) => (
          <div key={row.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 2 }}>
              {idx === 0 && <label style={{ fontSize: 11, color: 'var(--text-faint)', display: 'block', marginBottom: 4 }}>Reduce this category</label>}
              <select value={row.catKey} onChange={e => updateRow(row.id, 'catKey', e.target.value)} aria-label="Category to reduce"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', width: '100%' }}>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              {idx === 0 && <label style={{ fontSize: 11, color: 'var(--text-faint)', display: 'block', marginBottom: 4 }}>By how much / month</label>}
              <input type="number" min="0" value={row.amount} onChange={e => updateRow(row.id, 'amount', e.target.value)} placeholder="0" aria-label="Amount to reduce"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 16, fontWeight: 600, fontFamily: 'Sora, sans-serif', color: 'var(--text-primary)', width: '100%', outline: 'none' }} />
            </div>
            {rows.length > 1 && (
              <button onClick={() => removeRow(row.id)} aria-label="Remove this reduction row"
                style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, width: 34, height: 34, color: 'var(--text-faint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 0 }}>
                <i className="ti ti-x" aria-hidden="true" style={{ fontSize: 14 }} />
              </button>
            )}
          </div>
        ))}
        {rows.length < 3 && (
          <button onClick={addRow} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 13 }} /> Add another reduction
          </button>
        )}
      </div>

      {rows.length > 1 && combined > 0 && (
        <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: 10, padding: '10px 16px', marginBottom: 14, fontSize: 13, color: 'var(--accent-text)', fontWeight: 600 }}>
          Combined monthly saving: {primaryCurrency}{Math.round(combined).toLocaleString()}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {[['Monthly saving', combined], ['1-year saving', combined * 12], ['5-year saving', combined * 60]].map(([label, val]) => (
          <div key={label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 700, color: label === 'Monthly saving' ? 'var(--text-primary)' : 'var(--accent)' }}>
              {primaryCurrency}{Math.round(val).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {combined > 0 && (
        <div style={{ background: 'var(--amber-light)', border: '1px solid var(--amber-border)', borderRadius: 10, padding: '13px 16px', fontSize: 13, color: 'var(--amber-text)', lineHeight: 1.5 }}>
          <i className="ti ti-bulb" aria-hidden="true" style={{ fontSize: 14, marginRight: 6, verticalAlign: '-2px' }} />
          Cutting {primaryCurrency}{Math.round(combined).toLocaleString()}/month from {rows.length === 1 ? CATEGORIES.find(c => c.key === rows[0].catKey)?.label : 'these categories'} saves you {primaryCurrency}{Math.round(combined * 60).toLocaleString()} over 5 years — without investing a single cent.
        </div>
      )}
    </div>
  );
}
