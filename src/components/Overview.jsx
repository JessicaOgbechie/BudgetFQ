import React, { useState } from 'react';
import { CATEGORIES, CUSTOM_CATEGORY_COLORS } from '../constants';
import { formatCurrency } from '../utils';
import AlertBanner from './AlertBanner';

function AllocationRow({ cat, pct, amt, currency, totalIncome, onChange, onDelete, isCustom }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className={`ti ${cat.icon}`} aria-hidden="true" style={{ fontSize: 16, color: cat.color }} />
      </div>
      <div style={{ width: 130, fontSize: 14, fontWeight: 500, color: 'var(--text-body)', flexShrink: 0 }}>{cat.label}</div>
      <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 3, height: 5 }}>
        <div style={{ height: 5, borderRadius: 3, width: `${Math.min(pct, 100)}%`, background: cat.color, transition: 'width 0.4s ease', minWidth: pct > 0 ? 2 : 0 }} />
      </div>
      <input type="number" min="0" max="100" step="0.5" value={pct} onChange={e => onChange(e.target.value)}
        aria-label={`${cat.label} allocation percentage`}
        style={{ width: 54, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 7, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, textAlign: 'center', padding: '5px 4px', outline: 'none' }} />
      <span style={{ fontSize: 12, color: 'var(--text-faint)', marginLeft: -4 }}>%</span>
      <div style={{ width: 82, textAlign: 'right', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}>
        {totalIncome ? formatCurrency(amt, currency) : '—'}
      </div>
      {isCustom && (
        <button onClick={onDelete} aria-label={`Delete ${cat.label} category`}
          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, width: 30, height: 30, color: 'var(--text-faint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-faint)'; }}>
          <i className="ti ti-x" aria-hidden="true" style={{ fontSize: 13 }} />
        </button>
      )}
    </div>
  );
}

export default function Overview({ allocations, setAllocations, customCategories, setCustomCategories, totalIncome, primaryCurrency }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCat, setNewCat] = useState({ label: '', pct: '' });
  const [error, setError] = useState('');

  const total = Object.values(allocations).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const rem = Math.round((100 - total) * 10) / 10;
  const committed = (totalIncome * total) / 100;
  const free = totalIncome * Math.max(0, rem) / 100;

  const allCats = [
    ...CATEGORIES,
    ...customCategories.map((cc, i) => ({ ...cc, icon: 'ti-star', bg: cc.color + '22' })),
  ];

  const handleAdd = () => {
    if (!newCat.label.trim()) { setError('Name required'); return; }
    if (newCat.label.length > 30) { setError('Max 30 characters'); return; }
    if (customCategories.some(c => c.label.toLowerCase() === newCat.label.toLowerCase())) { setError('Name already exists'); return; }
    if (parseFloat(newCat.pct) < 0) { setError('Must be 0 or greater'); return; }
    const key = 'custom_' + crypto.randomUUID().slice(0, 8);
    const color = CUSTOM_CATEGORY_COLORS[customCategories.length % CUSTOM_CATEGORY_COLORS.length];
    setCustomCategories(prev => [...prev, { key, label: newCat.label.trim(), color, defaultPct: parseFloat(newCat.pct) || 0 }]);
    setAllocations(prev => ({ ...prev, [key]: parseFloat(newCat.pct) || 0 }));
    setNewCat({ label: '', pct: '' });
    setShowAddForm(false);
    setError('');
  };

  const handleDelete = (key) => {
    setCustomCategories(prev => prev.filter(c => c.key !== key));
    setAllocations(prev => { const next = { ...prev }; delete next[key]; return next; });
  };

  return (
    <div>
      <AlertBanner variant={rem < 0 ? 'error' : 'ok'} style={{ marginBottom: 20 }}>
        {rem < 0
          ? `Over-allocated by ${Math.abs(rem).toFixed(1)}%. Reduce some categories.`
          : rem === 0
            ? 'Fully allocated — every euro has a job.'
            : `${rem.toFixed(1)}% unallocated — consider moving it to savings or investments.`}
      </AlertBanner>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Total income', val: totalIncome ? primaryCurrency + Math.round(totalIncome).toLocaleString() : '—', color: 'var(--text-primary)' },
          { label: 'Committed', val: totalIncome ? primaryCurrency + Math.round(committed).toLocaleString() : '—', color: 'var(--red)' },
          { label: 'Free to invest', val: totalIncome ? primaryCurrency + Math.round(free).toLocaleString() : '—', color: 'var(--accent)' },
        ].map(card => (
          <div key={card.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', color: card.color }}>{card.val}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 14 }}>Budget allocation</div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
        {allCats.map((cat, idx) => {
          const pct = parseFloat(allocations[cat.key]) || 0;
          const amt = (totalIncome * pct) / 100;
          const isCustom = customCategories.some(c => c.key === cat.key);
          return (
            <AllocationRow key={cat.key} cat={cat} pct={pct} amt={amt} currency={primaryCurrency} totalIncome={totalIncome}
              onChange={val => setAllocations(prev => ({ ...prev, [cat.key]: parseFloat(val) || 0 }))}
              onDelete={() => handleDelete(cat.key)} isCustom={isCustom}
            />
          );
        })}
      </div>

      {showAddForm ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-faint)', display: 'block', marginBottom: 4 }}>Category name</label>
              <input value={newCat.label} onChange={e => setNewCat(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Childcare" maxLength={30}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', width: 160, outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-faint)', display: 'block', marginBottom: 4 }}>Percentage</label>
              <input type="number" min="0" value={newCat.pct} onChange={e => setNewCat(p => ({ ...p, pct: e.target.value }))} placeholder="0"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', width: 80, outline: 'none' }} />
            </div>
            <button onClick={handleAdd} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
            <button onClick={() => { setShowAddForm(false); setError(''); }} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
          </div>
          {error && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 6 }}>{error}</div>}
        </div>
      ) : (
        <button onClick={() => setShowAddForm(true)} style={{ background: 'var(--bg-surface)', border: '1.5px dashed var(--border-mid)', borderRadius: 10, color: 'var(--text-faint)', padding: '12px 18px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.color = 'var(--text-faint)'; }}>
          <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 15 }} /> Add custom category
        </button>
      )}
    </div>
  );
}
