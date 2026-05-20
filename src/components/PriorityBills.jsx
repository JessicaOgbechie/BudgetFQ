import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { getDaysUntil, detectBillClusters } from '../utils';
import AlertBanner from './AlertBanner';
import ConfirmInline from './ConfirmInline';
import EmptyState from './EmptyState';
import InvoiceUpload from './InvoiceUpload';

const BILL_ICONS = { bills: 'ti-bolt', leisure: 'ti-device-gamepad-2', rent: 'ti-home', food: 'ti-shopping-cart', transport: 'ti-car', loans: 'ti-receipt', savings: 'ti-piggy-bank' };
const BILL_COLORS = { bills: '#06B6D4', leisure: '#EC4899', rent: '#3B82F6', food: '#F59E0B', transport: '#8B5CF6', loans: '#EF4444', savings: '#00C27A' };
const BILL_BG = { bills: '#ECFEFF', leisure: '#FDF2F8', rent: '#EFF6FF', food: '#FFFBEB', transport: '#F5F3FF', loans: '#FEF2F2', savings: '#ECFDF5' };

function urgencyColor(days) {
  if (days <= 0) return 'var(--red)';
  if (days <= 3) return 'var(--red)';
  if (days <= 7) return 'var(--amber)';
  return 'var(--accent)';
}

export default function PriorityBills({ bills, setBills, primaryCurrency }) {
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDay: '', category: 'bills', recurring: true });
  const [addErrors, setAddErrors] = useState({});

  const sorted = [...bills].sort((a, b) => {
    if (a.paid !== b.paid) return a.paid ? 1 : -1;
    return getDaysUntil(a.dueDay) - getDaysUntil(b.dueDay);
  });

  const clusters = detectBillClusters(bills);

  const togglePaid = (id) => setBills(prev => prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b));

  const startEdit = (bill) => { setEditingId(bill.id); setEditDraft({ ...bill }); };
  const saveEdit = () => {
    if (!editDraft.name || !editDraft.amount || !editDraft.dueDay) return;
    setBills(prev => prev.map(b => b.id === editingId ? { ...editDraft, amount: parseFloat(editDraft.amount), dueDay: parseInt(editDraft.dueDay) } : b));
    setEditingId(null);
  };

  const deleteBill = (id) => { setBills(prev => prev.filter(b => b.id !== id)); setConfirmId(null); };

  const validateAdd = () => {
    const errs = {};
    if (!newBill.name.trim()) errs.name = 'Please enter a bill name';
    if (!newBill.amount || parseFloat(newBill.amount) <= 0) errs.amount = 'Amount must be greater than 0';
    if (!newBill.dueDay || parseInt(newBill.dueDay) < 1 || parseInt(newBill.dueDay) > 28) errs.dueDay = 'Enter a day between 1 and 28';
    return errs;
  };

  const handleAdd = () => {
    const errs = validateAdd();
    if (Object.keys(errs).length) { setAddErrors(errs); return; }
    setBills(prev => [...prev, { id: crypto.randomUUID(), name: newBill.name.trim(), amount: parseFloat(newBill.amount), dueDay: parseInt(newBill.dueDay), category: newBill.category, paid: false, recurring: newBill.recurring }]);
    setNewBill({ name: '', amount: '', dueDay: '', category: 'bills', recurring: true });
    setShowAddForm(false);
    setAddErrors({});
  };

  const handleInvoiceSave = (data) => {
    setBills(prev => [...prev, { id: crypto.randomUUID(), name: data.name, amount: parseFloat(data.amount), dueDay: parseInt(data.dueDay), category: data.category, paid: false, recurring: data.recurring }]);
  };

  const inp = (val, onChange, placeholder, type = 'text', extra = {}) => (
    <input type={type} value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder} {...extra}
      style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', fontSize: 13, color: 'var(--text-primary)', fontFamily: type === 'number' ? 'Sora, sans-serif' : 'DM Sans, sans-serif', outline: 'none', width: '100%' }} />
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Upcoming bills</div>
        <div style={{ display: 'flex', gap: 14 }}>
          {[['var(--red)', '≤ 3 days'], ['var(--amber)', '4–7 days'], ['var(--accent)', '8+ days']].map(([color, label]) => (
            <span key={label} style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />{label}
            </span>
          ))}
        </div>
      </div>

      {clusters.map((cluster, i) => (
        <AlertBanner key={i} variant="warning" style={{ marginBottom: 10 }}>
          Bill cluster: <strong style={{ marginLeft: 4 }}>{cluster.bills[0].name}</strong> and <strong style={{ marginLeft: 4 }}>{cluster.bills[1].name}</strong> both due around day {Math.min(...cluster.bills.map(b => b.dueDay))}. Prepare ahead.
        </AlertBanner>
      ))}

      <InvoiceUpload onSave={handleInvoiceSave} primaryCurrency={primaryCurrency} />

      {bills.length === 0 ? (
        <EmptyState title="No bills yet" subtitle="Add one and we'll keep you ahead of due dates." />
      ) : (
        sorted.map(bill => {
          const days = getDaysUntil(bill.dueDay);
          const uc = urgencyColor(days);
          const icon = BILL_ICONS[bill.category] || 'ti-receipt';
          const chipColor = bill.paid ? '#9CA3AF' : (BILL_COLORS[bill.category] || 'var(--accent)');
          const chipBg = bill.paid ? '#F3F4F6' : (BILL_BG[bill.category] || 'var(--accent-light)');

          return (
            <div key={bill.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 8, overflow: 'hidden', opacity: bill.paid ? 0.45 : 1, transition: 'opacity 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px' }}>
                <div style={{ width: 3, height: 36, borderRadius: 2, background: bill.paid ? 'var(--border-mid)' : uc, flexShrink: 0 }} />
                <div style={{ width: 34, height: 34, borderRadius: 9, background: chipBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 15, color: chipColor }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: bill.paid ? 'var(--text-faint)' : 'var(--text-primary)', textDecoration: bill.paid ? 'line-through' : 'none' }}>{bill.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 1 }}>
                    {CATEGORIES.find(c => c.key === bill.category)?.label || bill.category} · Due day {bill.dueDay}
                    {bill.paid && <span style={{ color: 'var(--accent)', marginLeft: 4 }}>· ✓ Paid</span>}
                  </div>
                </div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: bill.paid ? 'var(--text-faint)' : 'var(--text-primary)', marginRight: 4 }}>{primaryCurrency}{bill.amount}</div>
                {!bill.paid && <div style={{ fontSize: 12, fontWeight: 600, color: uc, width: 64, textAlign: 'right' }}>{days === 0 ? 'Due today!' : `in ${days}d`}</div>}
                {bill.paid && <div style={{ width: 64 }} />}
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: 4 }}>
                  <input type="checkbox" checked={bill.paid} onChange={() => togglePaid(bill.id)} aria-label={`Mark ${bill.name} as ${bill.paid ? 'unpaid' : 'paid'}`} style={{ accentColor: 'var(--accent)', width: 15, height: 15, cursor: 'pointer' }} />
                </label>
                <div style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
                  <button onClick={() => editingId === bill.id ? setEditingId(null) : startEdit(bill)} aria-label={`Edit ${bill.name} bill`}
                    style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, width: 30, height: 30, color: 'var(--text-faint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-faint)'; }}>
                    <i className="ti ti-edit" aria-hidden="true" style={{ fontSize: 14 }} />
                  </button>
                  <button onClick={() => setConfirmId(confirmId === bill.id ? null : bill.id)} aria-label={`Delete ${bill.name} bill`}
                    style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, width: 30, height: 30, color: 'var(--text-faint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-faint)'; }}>
                    <i className="ti ti-trash" aria-hidden="true" style={{ fontSize: 14 }} />
                  </button>
                </div>
              </div>

              {confirmId === bill.id && (
                <div style={{ padding: '0 16px 10px 16px', borderTop: '1px solid var(--border)' }}>
                  <ConfirmInline message="Remove this bill?" onConfirm={() => deleteBill(bill.id)} onCancel={() => setConfirmId(null)} />
                </div>
              )}

              {editingId === bill.id && (
                <div style={{ background: 'var(--bg-input)', borderTop: '1px solid var(--border)', padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 10 }}>Edit bill</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div><label style={{ fontSize: 11, color: 'var(--text-faint)', display: 'block', marginBottom: 3 }}>Name</label>{inp(editDraft.name, v => setEditDraft(d => ({ ...d, name: v })), 'Bill name')}</div>
                    <div><label style={{ fontSize: 11, color: 'var(--text-faint)', display: 'block', marginBottom: 3 }}>Amount</label>{inp(editDraft.amount, v => setEditDraft(d => ({ ...d, amount: v })), '0', 'number')}</div>
                    <div><label style={{ fontSize: 11, color: 'var(--text-faint)', display: 'block', marginBottom: 3 }}>Due day</label>{inp(editDraft.dueDay, v => setEditDraft(d => ({ ...d, dueDay: v })), '1–28', 'number', { min: 1, max: 28 })}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <select value={editDraft.category} onChange={e => setEditDraft(d => ({ ...d, category: e.target.value }))} aria-label="Bill category"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', fontSize: 13, cursor: 'pointer', flex: 1 }}>
                      {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                    </select>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editDraft.recurring} onChange={e => setEditDraft(d => ({ ...d, recurring: e.target.checked }))} style={{ accentColor: 'var(--accent)' }} />
                      Recurring monthly
                    </label>
                    <button onClick={saveEdit} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      {showAddForm ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', marginTop: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 10 }}>New bill</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
            <div>
              {inp(newBill.name, v => setNewBill(b => ({ ...b, name: v })), 'Bill name', 'text', { maxLength: 40 })}
              {addErrors.name && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 3 }}>{addErrors.name}</div>}
            </div>
            <div>
              {inp(newBill.amount, v => setNewBill(b => ({ ...b, amount: v })), '0.00', 'number')}
              {addErrors.amount && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 3 }}>{addErrors.amount}</div>}
            </div>
            <div>
              {inp(newBill.dueDay, v => setNewBill(b => ({ ...b, dueDay: v })), '1–28', 'number', { min: 1, max: 28 })}
              {addErrors.dueDay && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 3 }}>{addErrors.dueDay}</div>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={newBill.category} onChange={e => setNewBill(b => ({ ...b, category: e.target.value }))} aria-label="New bill category"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', fontSize: 13, cursor: 'pointer', flex: 1 }}>
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" checked={newBill.recurring} onChange={e => setNewBill(b => ({ ...b, recurring: e.target.checked }))} style={{ accentColor: 'var(--accent)' }} />
              Recurring monthly
            </label>
            <button onClick={handleAdd} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
            <button onClick={() => { setShowAddForm(false); setAddErrors({}); }} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAddForm(true)} style={{ background: 'var(--bg-surface)', border: '1.5px dashed var(--border-mid)', borderRadius: 10, color: 'var(--text-faint)', padding: '12px 18px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginTop: 10, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.color = 'var(--text-faint)'; }}>
          <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 15 }} /> Add bill manually
        </button>
      )}
    </div>
  );
}
