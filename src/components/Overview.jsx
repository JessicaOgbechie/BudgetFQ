import React, { useState } from 'react';
import { CATEGORIES, CUSTOM_CATEGORY_COLORS } from '../constants';
import AlertBanner from './AlertBanner';
import ConfirmInline from './ConfirmInline';

function AllocationRow({ cat, pct, amt, currency, totalIncome, onChange, onDelete, onLabelChange, canDelete }) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelDraft, setLabelDraft] = useState(cat.label);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const saveLabel = () => {
    if (labelDraft.trim()) onLabelChange(labelDraft.trim());
    setEditingLabel(false);
  };

  return (
    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'transparent', transition: 'background 0.1s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

      {/* Top row: icon + label + controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>

        {/* Icon chip */}
        <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className={`ti ${cat.icon}`} aria-hidden="true" style={{ fontSize: 16, color: cat.color }} />
        </div>

        {/* Label — editable on tap */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {editingLabel ? (
            <input
              autoFocus
              value={labelDraft}
              onChange={e => setLabelDraft(e.target.value)}
              onBlur={saveLabel}
              onKeyDown={e => { if (e.key === 'Enter') saveLabel(); if (e.key === 'Escape') { setLabelDraft(cat.label); setEditingLabel(false); } }}
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
              style={{
                fontSize: 14, fontWeight: 500, color: 'var(--text-body)',
                cursor: 'text', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {cat.label}
              <i className="ti ti-pencil" aria-hidden="true" style={{ fontSize: 11, color: 'var(--text-faint)', opacity: 0.6 }} />
            </div>
          )}
        </div>

        {/* Percentage input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
          <input
            type="number" min="0" max="100" step="0.5" value={pct}
            onChange={e => onChange(e.target.value)}
            aria-label={`${cat.label} percentage`}
            style={{
              width: 52, background: 'var(--bg-input)', border: '1px solid var(--border)',
              borderRadius: 7, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif',
              fontSize: 14, textAlign: 'center', padding: '6px 4px', outline: 'none',
            }}
          />
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>%</span>
        </div>

        {/* Amount */}
        <div style={{ width: 64, textAlign: 'right', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif', flexShrink: 0 }}>
          {totalIncome ? currency + Math.round(amt).toLocaleString() : '—'}
        </div>

        {/* Delete button */}
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

      {/* Progress bar — full width */}
      <div style={{ background: '#F3F4F6', borderRadius: 3, height: 5 }}>
        <div style={{
          height: 5, borderRadius: 3,
          width: `${Math.min(pct, 100)}%`,
          background: cat.color,
          transition: 'width 0.4s ease',
          minWidth: pct > 0 ? 4 : 0,
        }} />
      </div>

      {/* Inline delete confirm */}
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

export default function Overview({ allocations, setAllocations, customCategories, setCustomCategories, totalIncome, primaryCurrency }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCat, setNewCat] = useState({ label: '', pct: '' });
  const [error, setError] = useState('');

  // Merge core categories with any label overrides stored in customCategories metadata
  const [coreLabelOverrides, setCoreLabelOverrides] = useState({});

  const total = Object.values(allocations).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const rem = Math.round((100 - total) * 10) / 10;
  const committed = (totalIncome * total) / 100;
  const free = totalIncome * Math.max(0, rem) / 100;

  const coreRows = CATEGORIES.map(cat => ({
    ...cat,
    label: coreLabelOverrides[cat.key] || cat.label,
  }));

  const customRows = customCategories.map(cc => ({
    ...cc,
    icon: 'ti-star',
    bg: cc.color + '22',
  }));

  const allRows = [...coreRows, ...customRows];

  const handleCoreRename = (key, newLabel) => {
    setCoreLabelOverrides(prev => ({ ...prev, [key]: newLabel }));
  };

  const handleCustomRename = (key, newLabel) => {
    setCustomCategories(prev => prev.map(c => c.key === key ? { ...c, label: newLabel } : c));
  };

  const handleDeleteCustom = (key) => {
    setCustomCategories(prev => prev.filter(c => c.key !== key));
    setAllocations(prev => { const next = { ...prev }; delete next[key]; return next; });
  };

  const handleAdd = () => {
    if (!newCat.label.trim()) { setError('Name required'); return; }
    if (newCat.label.length > 30) { setError('Max 30 characters'); return; }
    const allLabels = [...coreRows, ...customRows].map(c => c.label.toLowerCase());
    if (allLabels.includes(newCat.label.toLowerCase())) { setError('Name already exists'); return; }
    if (parseFloat(newCat.pct) < 0) { setError('Must be 0 or greater'); return; }
    const key = 'custom_' + crypto.randomUUID().slice(0, 8);
    const color = CUSTOM_CATEGORY_COLORS[customCategories.length % CUSTOM_CATEGORY_COLORS.length];
    setCustomCategories(prev => [...prev, { key, label: newCat.label.trim(), color, defaultPct: parseFloat(newCat.pct) || 0 }]);
    setAllocations(prev => ({ ...prev, [key]: parseFloat(newCat.pct) || 0 }));
    setNewCat({ label: '', pct: '' });
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
            : `${rem.toFixed(1)}% unallocated — consider moving it to savings.`}
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

      {/* Hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Budget allocation</div>
        <div style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 4 }}>
          <i className="ti ti-pencil" aria-hidden="true" style={{ fontSize: 11 }} /> tap any label to rename
        </div>
      </div>

      {/* Allocation list */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
        {allRows.map(cat => {
          const isCustom = customCategories.some(c => c.key === cat.key);
          const pct = parseFloat(allocations[cat.key]) || 0;
          const amt = (totalIncome * pct) / 100;
          return (
            <AllocationRow
              key={cat.key}
              cat={cat}
              pct={pct}
              amt={amt}
              currency={primaryCurrency}
              totalIncome={totalIncome}
              onChange={val => setAllocations(prev => ({ ...prev, [cat.key]: parseFloat(val) || 0 }))}
              onDelete={() => handleDeleteCustom(cat.key)}
              onLabelChange={newLabel => isCustom ? handleCustomRename(cat.key, newLabel) : handleCoreRename(cat.key, newLabel)}
              canDelete={isCustom}
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
            <div style={{ width: 80 }}>
              <label style={{ fontSize: 11, color: 'var(--text-faint)', display: 'block', marginBottom: 4 }}>%</label>
              <input
                type="number" min="0" value={newCat.pct}
                onChange={e => setNewCat(p => ({ ...p, pct: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="0"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 10px', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', width: '100%', outline: 'none' }}
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
          style={{
            background: 'var(--bg-surface)', border: '1.5px dashed var(--border-mid)', borderRadius: 10,
            color: 'var(--text-faint)', padding: '13px 18px', fontFamily: 'DM Sans, sans-serif',
            fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: 8, width: '100%', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.color = 'var(--text-faint)'; }}
        >
          <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 15 }} /> Add custom category
        </button>
      )}
    </div>
  );
}
