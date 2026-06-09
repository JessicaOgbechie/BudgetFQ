import React, { useState } from 'react';
import { CATEGORIES, CUSTOM_CATEGORY_COLORS } from '../constants';
import AlertBanner from './AlertBanner';
import ConfirmInline from './ConfirmInline';

function AllocationRow({ cat, pct, amt, currency, totalIncome, onChangeAmount, onChangePct, onDelete, onLabelChange, canDelete }) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelDraft, setLabelDraft] = useState(cat.label);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Local draft for the amount input so typing feels instant
  const [amtDraft, setAmtDraft] = useState('');
  const [amtFocused, setAmtFocused] = useState(false);

  const saveLabel = () => {
    if (labelDraft.trim()) onLabelChange(labelDraft.trim());
    setEditingLabel(false);
  };

  const handleAmtFocus = () => {
    setAmtFocused(true);
    setAmtDraft(amt > 0 ? String(Math.round(amt)) : '');
  };

  const handleAmtChange = (val) => {
    setAmtDraft(val);
    const num = parseFloat(val) || 0;
    if (totalIncome > 0) {
      onChangeAmount(num);
    }
  };

  const handleAmtBlur = () => {
    setAmtFocused(false);
    const num = parseFloat(amtDraft) || 0;
    onChangeAmount(num);
  };

  const displayAmt = amtFocused ? amtDraft : (amt > 0 && totalIncome ? Math.round(amt).toString() : '');

  return (
    <div
      style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'transparent', transition: 'background 0.1s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>

        {/* Icon chip */}
        <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className={`ti ${cat.icon}`} aria-hidden="true" style={{ fontSize: 16, color: cat.color }} />
        </div>

        {/* Label — tap to rename */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {editingLabel ? (
            <input
              autoFocus
              value={labelDraft}
              onChange={e => setLabelDraft(e.target.value)}
              onBlur={saveLabel}
              onKeyDown={e => {
                if (e.key === 'Enter') saveLabel();
                if (e.key === 'Escape') { setLabelDraft(cat.label); setEditingLabel(false); }
              }}
              maxLength={30}
              aria-label="Edit category name"
              style={{
                background: 'var(--bg-input)', border: '1px solid var(--accent)',
                borderRadius: 6, padding: '4px 8px', fontSize: 14, fontWeight: 500,
                color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif',
                width: '100%', outline: 'none',
              }}
            />
          ) : (
            <div
              onClick={() => { setLabelDraft(cat.label); setEditingLabel(true); }}
              title="Tap to rename"
              style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-body)', cursor: 'text', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {cat.label}
              <i className="ti ti-pencil" aria-hidden="true" style={{ fontSize: 11, color: 'var(--text-faint)', opacity: 0.6 }} />
            </div>
          )}
        </div>

        {/* Amount input — primary control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          <span style={{ fontSize: 13, color: 'var(--text-faint)', fontFamily: 'Sora, sans-serif' }}>{currency}</span>
          <input
            type="number"
            min="0"
            step="1"
            value={displayAmt}
            placeholder="0"
            disabled={!totalIncome}
            onFocus={handleAmtFocus}
            onChange={e => handleAmtChange(e.target.value)}
            onBlur={handleAmtBlur}
            aria-label={`${cat.label} amount`}
            style={{
              width: 72,
              background: totalIncome ? 'var(--bg-input)' : 'transparent',
              border: `1px solid ${amtFocused ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 7,
              color: 'var(--text-primary)',
              fontFamily: 'Sora, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              textAlign: 'right',
              padding: '6px 8px',
              outline: 'none',
              transition: 'border-color 0.15s',
              cursor: totalIncome ? 'text' : 'default',
            }}
          />
        </div>

        {/* Percentage — calculated, read-only display */}
        <div style={{
          width: 44, textAlign: 'right', fontSize: 13,
          fontWeight: 500, color: 'var(--text-faint)', flexShrink: 0,
        }}>
          {totalIncome ? pct.toFixed(1) + '%' : '—'}
        </div>

        {/* Delete */}
        {canDelete && (
          <button
            onClick={() => setConfirmDelete(v => !v)}
            aria-label={`Delete ${cat.label}`}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 6, width: 28, height: 28, color: 'var(--text-faint)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-faint)'; }}
          >
            <i className="ti ti-x" aria-hidden="true" style={{ fontSize: 12 }} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ background: '#F3F4F6', borderRadius: 3, height: 5 }}>
        <div style={{
          height: 5, borderRadius: 3,
          width: `${Math.min(pct, 100)}%`,
          background: cat.color,
          transition: 'width 0.4s ease',
          minWidth: pct > 0 ? 4 : 0,
        }} />
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div style={{ marginTop: 10 }}>
          <ConfirmInline
            message={`Remove "${cat.label}"?`}
            onConfirm={() => { onDelete(); setConfirmDelete(false); }}
            onCancel={() => setConfirmDelete(false)}
          />
        </div>
      )}
    </div>
  );
}

export default function Overview({ allocations, setAllocations, customCategories, setCustomCategories, deletedCoreKeys, setDeletedCoreKeys, totalIncome, primaryCurrency }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCat, setNewCat] = useState({ label: '', amt: '' });
  const [error, setError] = useState('');
  const [coreLabelOverrides, setCoreLabelOverrides] = useState({});

  const total = Object.values(allocations).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const rem = Math.round((100 - total) * 10) / 10;
  const committed = (totalIncome * total) / 100;
  const free = totalIncome * Math.max(0, rem) / 100;

  const coreRows = CATEGORIES
    .filter(cat => !deletedCoreKeys.includes(cat.key))
    .map(cat => ({ ...cat, label: coreLabelOverrides[cat.key] || cat.label }));

  const customRows = customCategories.map(cc => ({ ...cc, icon: 'ti-star', bg: cc.color + '22' }));
  const allRows = [...coreRows, ...customRows];

  // Convert an amount to a percentage of income
  const amtToPct = (amt) => totalIncome > 0 ? (amt / totalIncome) * 100 : 0;

  const handleChangeAmount = (key, newAmt) => {
    const newPct = amtToPct(newAmt);
    setAllocations(prev => ({ ...prev, [key]: Math.round(newPct * 10) / 10 }));
  };

  const handleCoreRename = (key, newLabel) => setCoreLabelOverrides(prev => ({ ...prev, [key]: newLabel }));
  const handleCustomRename = (key, newLabel) => setCustomCategories(prev => prev.map(c => c.key === key ? { ...c, label: newLabel } : c));

  const handleDeleteCategory = (key) => {
    const isCustom = customCategories.some(c => c.key === key);
    if (isCustom) {
      setCustomCategories(prev => prev.filter(c => c.key !== key));
    } else {
      setDeletedCoreKeys(prev => [...prev, key]);
    }
    setAllocations(prev => { const next = { ...prev }; delete next[key]; return next; });
  };

  const handleAdd = () => {
    if (!newCat.label.trim()) { setError('Name required'); return; }
    if (newCat.label.length > 30) { setError('Max 30 characters'); return; }
    const allLabels = allRows.map(c => c.label.toLowerCase());
    if (allLabels.includes(newCat.label.toLowerCase())) { setError('Name already exists'); return; }
    const amt = parseFloat(newCat.amt) || 0;
    if (amt < 0) { setError('Amount must be 0 or greater'); return; }
    const key = 'custom_' + crypto.randomUUID().slice(0, 8);
    const color = CUSTOM_CATEGORY_COLORS[customCategories.length % CUSTOM_CATEGORY_COLORS.length];
    const pct = amtToPct(amt);
    setCustomCategories(prev => [...prev, { key, label: newCat.label.trim(), color, defaultPct: pct }]);
    setAllocations(prev => ({ ...prev, [key]: Math.round(pct * 10) / 10 }));
    setNewCat({ label: '', amt: '' });
    setShowAddForm(false);
    setError('');
  };

  return (
    <div>
      <AlertBanner variant={rem < 0 ? 'error' : 'ok'} style={{ marginBottom: 16 }}>
        {rem < 0
          ? `Over-allocated by ${Math.abs(rem).toFixed(1)}%. Reduce some categories.`
          : rem === 0
            ? 'Fully allocated — every euro has a job.'
            : `${primaryCurrency}${Math.round(free).toLocaleString()} unallocated — consider moving it to savings.`}
      </AlertBanner>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Income', val: totalIncome ? primaryCurrency + Math.round(totalIncome).toLocaleString() : '—', color: 'var(--text-primary)' },
          { label: 'Committed', val: totalIncome ? primaryCurrency + Math.round(committed).toLocaleString() : '—', color: 'var(--red)' },
          { label: 'Free', val: totalIncome ? primaryCurrency + Math.round(free).toLocaleString() : '—', color: 'var(--accent)' },
        ].map(card => (
          <div key={card.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', color: card.color }}>{card.val}</div>
          </div>
        ))}
      </div>

      {/* Hint row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Budget allocation</div>
        <div style={{ fontSize: 11, color: 'var(--text-faint)', display: 'flex', gap: 12 }}>
          {!totalIncome && <span style={{ color: 'var(--amber)', fontWeight: 500 }}>Enter your income first</span>}
          <span><i className="ti ti-pencil" aria-hidden="true" style={{ fontSize: 11 }} /> tap label to rename</span>
        </div>
      </div>

      {/* Column headers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 6px', marginBottom: 0 }}>
        <div style={{ width: 36, flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 10, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Category</div>
        <div style={{ width: 86, fontSize: 10, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'right' }}>Amount</div>
        <div style={{ width: 44, fontSize: 10, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'right' }}>%</div>
        <div style={{ width: 28, flexShrink: 0 }} />
      </div>

      {/* Allocation list */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
        {allRows.map(cat => {
          const isCustom = customCategories.some(c => c.key === cat.key);
          const pct = parseFloat(allocations[cat.key]) || 0;
          const amt = totalIncome ? (totalIncome * pct) / 100 : 0;
          return (
            <AllocationRow
              key={cat.key}
              cat={cat}
              pct={pct}
              amt={amt}
              currency={primaryCurrency}
              totalIncome={totalIncome}
              onChangeAmount={(newAmt) => handleChangeAmount(cat.key, newAmt)}
              onChangePct={(newPct) => setAllocations(prev => ({ ...prev, [cat.key]: parseFloat(newPct) || 0 }))}
              onDelete={() => handleDeleteCategory(cat.key)}
              onLabelChange={newLabel => isCustom ? handleCustomRename(cat.key, newLabel) : handleCoreRename(cat.key, newLabel)}
              canDelete={allRows.length > 1}
            />
          );
        })}
      </div>

      {/* Add custom category */}
      {showAddForm ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: 120 }}>
              <label style={{ fontSize: 11, color: 'var(--text-faint)', display: 'block', marginBottom: 4 }}>Category name</label>
              <input
                value={newCat.label}
                onChange={e => setNewCat(p => ({ ...p, label: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. Childcare"
                maxLength={30}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 10px', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', width: '100%', outline: 'none' }}
              />
            </div>
            <div style={{ width: 100 }}>
              <label style={{ fontSize: 11, color: 'var(--text-faint)', display: 'block', marginBottom: 4 }}>Amount ({primaryCurrency})</label>
              <input
                type="number" min="0" value={newCat.amt}
                onChange={e => setNewCat(p => ({ ...p, amt: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="0"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 10px', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif', width: '100%', outline: 'none' }}
              />
            </div>
            <button onClick={handleAdd} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Add</button>
            <button onClick={() => { setShowAddForm(false); setError(''); }} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
          </div>
          {error && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 6 }}>{error}</div>}
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          style={{ background: 'var(--bg-surface)', border: '1.5px dashed var(--border-mid)', borderRadius: 10, color: 'var(--text-faint)', padding: '13px 18px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.color = 'var(--text-faint)'; }}
        >
          <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 15 }} /> Add custom category
        </button>
      )}

      {/* Restore deleted core categories */}
      {deletedCoreKeys.length > 0 && (
        <div style={{ marginTop: 12, padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8 }}>Removed categories</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.filter(c => deletedCoreKeys.includes(c.key)).map(cat => (
              <button
                key={cat.key}
                onClick={() => {
                  setDeletedCoreKeys(prev => prev.filter(k => k !== cat.key));
                  setAllocations(prev => ({ ...prev, [cat.key]: 0 }));
                }}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                aria-label={`Restore ${cat.label} category`}
              >
                <i className={`ti ${cat.icon}`} aria-hidden="true" style={{ fontSize: 13, color: cat.color }} />
                + Restore {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
