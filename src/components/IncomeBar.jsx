import React, { useState } from 'react';
import { CURRENCIES } from '../constants';
import { formatCurrency, toPrimary } from '../utils';

export default function IncomeBar({ incomeSources, setIncomeSources, primaryCurrency, totalIncome, unallocated }) {
  const [showSources, setShowSources] = useState(false);

  const updateSource = (id, field, value) => {
    setIncomeSources(prev => prev.map(s => s.id === id ? { ...s, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : s));
  };

  const addSource = () => {
    setIncomeSources(prev => [...prev, { id: crypto.randomUUID(), label: 'Additional income', amount: 0, currency: primaryCurrency }]);
  };

  const removeSource = (id) => {
    setIncomeSources(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
  };

  const daily = totalIncome ? primaryCurrency + Math.round(totalIncome / 30).toLocaleString() : '—';
  const weekly = totalIncome ? primaryCurrency + Math.round(totalIncome / 4.33).toLocaleString() : '—';
  const unallocStr = unallocated.toFixed(1) + '%';

  return (
    <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '20px 24px', position: 'sticky', top: 67, zIndex: 99 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 10 }}>Monthly take-home pay</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 36, fontWeight: 700, color: 'var(--text-faint)', lineHeight: 1 }}>{primaryCurrency}</span>
        <input
          type="number"
          value={incomeSources[0]?.amount || ''}
          placeholder="0"
          onChange={e => updateSource(incomeSources[0].id, 'amount', e.target.value)}
          aria-label="Primary monthly income"
          style={{ background: 'transparent', border: 'none', borderBottom: '2px solid var(--accent)', color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif', fontSize: 36, fontWeight: 700, width: 200, outline: 'none', paddingBottom: 2, letterSpacing: '-1px' }}
        />
        <div style={{ display: 'flex', gap: 24, marginLeft: 'auto', flexWrap: 'wrap' }}>
          {[['Daily', daily], ['Weekly', weekly], ['Unallocated', unallocStr]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 15, fontWeight: 500, fontFamily: 'Sora, sans-serif', color: label === 'Unallocated' ? (unallocated < 0 ? 'var(--red)' : 'var(--accent)') : 'var(--text-body)' }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setShowSources(s => !s)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 10, padding: 0, fontFamily: 'DM Sans, sans-serif' }}>
        {showSources ? '▲ Hide income sources' : '▼ Manage income sources'}
      </button>

      {showSources && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          {incomeSources.map((src, idx) => (
            <div key={src.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
              <input value={src.label} onChange={e => updateSource(src.id, 'label', e.target.value)} placeholder="Label" aria-label="Income source label"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', width: 160, outline: 'none' }} />
              <input type="number" value={src.amount || ''} onChange={e => updateSource(src.id, 'amount', e.target.value)} placeholder="0" aria-label="Income source amount"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif', width: 110, outline: 'none' }} />
              <select value={src.currency} onChange={e => updateSource(src.id, 'currency', e.target.value)} aria-label="Income source currency"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer' }}>
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
              {incomeSources.length > 1 && (
                <button onClick={() => removeSource(src.id)} aria-label={`Remove ${src.label} income source`}
                  style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, width: 30, height: 30, color: 'var(--text-faint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-x" aria-hidden="true" style={{ fontSize: 14 }} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addSource} style={{ background: 'var(--bg-surface)', border: '1.5px dashed var(--border-mid)', borderRadius: 10, color: 'var(--text-faint)', padding: '8px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 14 }} /> Add income source
          </button>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 8 }}>ℹ Exchange rates are approximate. Verify with your bank for exact conversions.</div>
        </div>
      )}
    </div>
  );
}
