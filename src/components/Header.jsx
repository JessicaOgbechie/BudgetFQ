import React, { useState } from 'react';
import { CURRENCIES, FAQ_ITEMS } from '../constants';
import { generateCSV } from '../utils';

function FAQModal({ onClose }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
      <div style={{ position: 'relative', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '82vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Frequently Asked Questions</div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>Everything you need to know about BudgetFQ</div>
          </div>
          <button onClick={onClose} aria-label="Close FAQ" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <i className="ti ti-x" aria-hidden="true" style={{ fontSize: 15 }} />
          </button>
        </div>
        <div style={{ overflowY: 'auto', padding: '8px 20px 20px' }}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} style={{ borderBottom: i < FAQ_ITEMS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{item.q}</span>
                <i className={`ti ${open === i ? 'ti-chevron-up' : 'ti-chevron-down'}`} aria-hidden="true" style={{ fontSize: 14, color: 'var(--text-faint)', flexShrink: 0 }} />
              </button>
              {open === i && <div style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.7, paddingBottom: 14 }}>{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header({ primaryCurrency, setPrimaryCurrency, state, totalIncome, onOpenProfile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  const handleCSV = () => {
    const csv = generateCSV(state, totalIncome);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    a.download = `budgetfq-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}.csv`;
    a.click(); URL.revokeObjectURL(url); setMenuOpen(false);
  };

  const handleJSONExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budgetfq-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url); setMenuOpen(false);
  };

  const selected = CURRENCIES.find(c => c.code === primaryCurrency) || CURRENCIES[0];

  return (
    <>
      <header style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Hamburger / profile button */}
          <button onClick={onOpenProfile} aria-label="Open profile and settings"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <i className="ti ti-menu-2" aria-hidden="true" style={{ fontSize: 22, color: 'var(--text-body)' }} />
          </button>
          <div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
              Budget<span style={{ color: 'var(--accent)' }}>FQ</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 1 }}>Smart budgeting for real life</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          {/* Currency selector — flag + code + chevron */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 8, fontSize: 15, pointerEvents: 'none', zIndex: 1 }}>{selected.flag}</span>
            <select value={primaryCurrency} onChange={e => setPrimaryCurrency(e.target.value)}
              aria-label="Select primary currency"
              style={{
                background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8,
                color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', fontSize: 13,
                padding: '7px 32px 7px 28px', cursor: 'pointer',
                appearance: 'none', WebkitAppearance: 'none',
              }}>
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
              ))}
            </select>
            {/* Dropdown arrow */}
            <i className="ti ti-chevron-down" aria-hidden="true" style={{ position: 'absolute', right: 8, fontSize: 13, color: 'var(--text-faint)', pointerEvents: 'none' }} />
          </div>

          {/* FAQ */}
          <button onClick={() => setFaqOpen(true)} aria-label="Open FAQ" title="Help & FAQ"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            <i className="ti ti-help" aria-hidden="true" style={{ fontSize: 17 }} />
          </button>

          {/* Three-dot menu */}
          <button onClick={() => setMenuOpen(o => !o)} aria-label="More options"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <i className="ti ti-dots-vertical" aria-hidden="true" style={{ fontSize: 18 }} />
          </button>

          {menuOpen && (
            <>
              <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 200 }} />
              <div style={{ position: 'absolute', top: 42, right: 0, zIndex: 201, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 6, minWidth: 170, boxShadow: '0 4px 20px rgba(0,0,0,0.10)' }}>
                {[{ label: 'Export CSV', icon: 'ti-download', action: handleCSV }, { label: 'Backup data', icon: 'ti-database-export', action: handleJSONExport }].map(item => (
                  <button key={item.label} onClick={item.action}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-body)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <i className={`ti ${item.icon}`} aria-hidden="true" style={{ fontSize: 16, color: 'var(--accent)' }} />{item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>
      {faqOpen && <FAQModal onClose={() => setFaqOpen(false)} />}
    </>
  );
}
