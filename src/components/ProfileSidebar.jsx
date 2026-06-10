import React, { useState } from 'react';
import { CURRENCIES } from '../constants';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fi', label: 'Finnish' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'ig', label: 'Igbo' },
  { code: 'ha', label: 'Hausa' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'es', label: 'Spanish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'sv', label: 'Swedish' },
  { code: 'no', label: 'Norwegian' },
];

const COUNTRIES = [
  '🇳🇬 Nigeria','🇫🇮 Finland','🇬🇧 United Kingdom','🇺🇸 United States',
  '🇬🇭 Ghana','🇰🇪 Kenya','🇿🇦 South Africa','🇨🇦 Canada',
  '🇦🇺 Australia','🇮🇳 India','🇸🇪 Sweden','🇳🇴 Norway','🇩🇪 Germany',
  '🇫🇷 France','🇪🇸 Spain','🇵🇹 Portugal','🇧🇷 Brazil','🌍 Other',
];

const AVATARS = ['👤','👩','👨','👩🏾','👨🏾','👩🏻','👨🏻','👩🏿','👨🏿','🧑','🧑🏾','🧑🏻'];

const inp = (val, onChange, placeholder, type = 'text') => (
  <input type={type} value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', width: '100%', outline: 'none' }} />
);

const sel = (val, onChange, options, ariaLabel) => (
  <select value={val} onChange={e => onChange(e.target.value)} aria-label={ariaLabel}
    style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', width: '100%', cursor: 'pointer', outline: 'none' }}>
    {options.map(o => typeof o === 'string'
      ? <option key={o} value={o}>{o}</option>
      : <option key={o.code || o.value} value={o.code || o.value}>{o.label || o.name}</option>
    )}
  </select>
);

export default function ProfileSidebar({ open, onClose, profile, setProfile, primaryCurrency, setPrimaryCurrency }) {
  const [saved, setSaved] = useState(false);

  const update = (key, val) => setProfile(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1000);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.22)', zIndex: 300, transition: 'opacity 0.2s' }} />

      {/* Sidebar panel */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 320,
        maxWidth: '90vw', background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)', zIndex: 301,
        display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(0,0,0,0.10)',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Profile & Settings</div>
          <button onClick={onClose} aria-label="Close sidebar"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <i className="ti ti-x" aria-hidden="true" style={{ fontSize: 15 }} />
          </button>
        </div>

        <div style={{ padding: '18px', flex: 1 }}>
          {/* Avatar picker */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 52, marginBottom: 8, lineHeight: 1 }}>{profile.avatar || '👤'}</div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 10 }}>Choose avatar</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {AVATARS.map(av => (
                <button key={av} onClick={() => update('avatar', av)}
                  style={{
                    fontSize: 22, background: profile.avatar === av ? 'var(--accent-light)' : 'var(--bg-input)',
                    border: `2px solid ${profile.avatar === av ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 10, width: 44, height: 44, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                  }}>{av}</button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-faint)', display: 'block', marginBottom: 6 }}>Display name</label>
            {inp(profile.name || '', v => update('name', v), 'Your name')}
          </div>

          {/* Country */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-faint)', display: 'block', marginBottom: 6 }}>Country</label>
            {sel(profile.country || '', v => update('country', v), ['Select country...', ...COUNTRIES], 'Country')}
          </div>

          {/* Language */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-faint)', display: 'block', marginBottom: 6 }}>Language</label>
            {sel(profile.language || 'en', v => update('language', v), LANGUAGES, 'Language')}
          </div>

          {/* Currency */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-faint)', display: 'block', marginBottom: 6 }}>Primary currency</label>
            <select value={primaryCurrency} onChange={e => setPrimaryCurrency(e.target.value)} aria-label="Primary currency"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', width: '100%', cursor: 'pointer', outline: 'none' }}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
            </select>
          </div>

          {/* Notification preferences */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-faint)', display: 'block', marginBottom: 10 }}>Notifications</label>
            {[
              { key: 'notifyBills', label: 'Bill reminders', desc: '3 days before a bill is due' },
              { key: 'notifyOverspend', label: 'Overspend alerts', desc: 'When allocations exceed 100%' },
              { key: 'notifySnapshot', label: 'Monthly snapshot', desc: 'When a new month snapshot is saved' },
            ].map(item => (
              <label key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={!!profile[item.key]} onChange={e => update(item.key, e.target.checked)}
                  style={{ accentColor: 'var(--accent)', marginTop: 3, width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-body)' }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{item.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {/* App version */}
          <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center', marginBottom: 20 }}>
            BudgetFQ v1.0 · <span style={{ color: 'var(--accent)' }}>Smart budgeting for real life</span>
          </div>
        </div>

        {/* Save button */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <button onClick={handleSave} style={{
            width: '100%', background: saved ? 'var(--accent)' : 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 10, padding: '12px', fontFamily: 'DM Sans, sans-serif',
            fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s',
          }}>
            {saved ? '✓ Saved!' : 'Save changes'}
          </button>
        </div>
      </div>
    </>
  );
}
