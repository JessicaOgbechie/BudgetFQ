import React, { useState } from 'react';
import { CURRENCIES } from '../constants';

export default function IncomeBar({ incomeSources, setIncomeSources, primaryCurrency, totalIncome, unallocated }) {
  const [showSources, setShowSources] = useState(false);

  const updateSource = (id, field, value) => {
    setIncomeSources(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : s
    ));
  };

  const addSource = () => {
    setIncomeSources(prev => [...prev, {
      id: crypto.randomUUID(), label: 'Additional income', amount: 0, currency: primaryCurrency
    }]);
  };

  const removeSource = (id) => {
    setIncomeSources(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
  };

  const daily = totalIncome ? primaryCurrency + Math.round(totalIncome / 30).toLocaleString() : '—';
  const weekly = totalIncome ? primaryCurrency + Math.round(totalIncome / 4.33).toLocaleString() : '—';
  const unallocStr = unallocated.toFixed(1) + '%';
  const unallocColor = unallocated < 0 ? 'var(--red)' : 'var(--accent)';

  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      padding: '16px 16px 12px',
      position: 'sticky',
      top: 57,
      zIndex: 99,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '1.2px',
        textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8,
      }}>Monthly take-home pay</div>

      {/* Income input row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <span style={{
          fontFamily: 'Sora, sans-serif', fontSize: 32, fontWeight: 700,
          color: 'var(--text-faint)', lineHeight: 1, flexShrink: 0,
        }}>{primaryCurrency}</span>
        <input
          type="number"
          value={incomeSources[0]?.amount || ''}
          placeholder="0"
          onChange={e => updateSource(incomeSources[0].id, 'amount', e.target.value)}
          aria-label="Primary monthly income"
          style={{
            background: 'transparent', border: 'none',
            borderBottom: '2px solid var(--accent)',
            color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif',
            fontSize: 32, fontWeight: 700, flex: 1, minWidth: 0,
            outline: 'none', paddingBottom: 2, letterSpacing: '-1px',
          }}
        />
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 8 }}>
        {[
          ['Daily', daily, 'var(--text-body)'],
          ['Weekly', weekly, 'var(--text-body)'],
          ['Unallocated', unallocStr, unallocColor],
        ].map(([label, val, color], i) => (
          <div key={label} style={{
            flex: 1,
            paddingRight: i < 2 ? 12 : 0,
            borderRight: i < 2 ? '1px solid var(--border)' : 'none',
            marginRight: i < 2 ? 12 : 0,
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Sora, sans-serif', color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Toggle income sources */}
      <button
        onClick={() => setShowSources(s => !s)}
        style={{
          background: 'none', border: 'none', color: 'var(--accent)',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          padding: 0, fontFamily: 'DM Sans, sans-serif',
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        <i className={`ti ${showSources ? 'ti-chevron-up' : 'ti-chevron-down'}`} aria-hidden="true" style={{ fontSize: 13 }} />
        {showSources ? 'Hide income sources' : 'Manage income sources'}
      </button>

      {showSources && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          {incomeSources.map(src => (
            <div key={src.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
              <input
                value={src.label}
                onChange={e => updateSource(src.id, 'label', e.target.value)}
                placeholder="Label"
                aria-label="Income source label"
                style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '8px 10px', fontSize: 13,
                  color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif',
                  flex: 2, minWidth: 100, outline: 'none',
                }}
              />
              <input
                type="number"
                value={src.amount || ''}
                onChange={e => updateSource(src.id, 'amount', e.target.value)}
                placeholder="0"
                aria-label="Income source amount"
                style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '8px 10px', fontSize: 13,
                  color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif',
                  flex: 1, minWidth: 80, outline: 'none',
                }}
              />
              <select
                value={src.currency}
                onChange={e => updateSource(src.id, 'currency', e.target.value)}
                aria-label="Income source currency"
                style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '8px 8px', fontSize: 13,
                  color: 'var(--text-primary)', cursor: 'pointer',
                }}
              >
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
              {incomeSources.length > 1 && (
                <button
                  onClick={() => removeSource(src.id)}
                  aria-label={`Remove ${src.label}`}
                  style={{
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: 7, width: 34, height: 34, color: 'var(--text-faint)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <i className="ti ti-x" aria-hidden="true" style={{ fontSize: 14 }} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addSource}
            style={{
              background: 'var(--bg-surface)', border: '1.5px dashed var(--border-mid)',
              borderRadius: 10, color: 'var(--text-faint)', padding: '8px 14px',
              fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              marginTop: 4, transition: 'all 0.15s',
            }}
          >
            <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 14 }} /> Add income source
          </button>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 8, lineHeight: 1.5 }}>
            ℹ Exchange rates are approximate. Verify with your bank for exact conversions.
          </div>
        </div>
      )}
    </div>
  );
}
