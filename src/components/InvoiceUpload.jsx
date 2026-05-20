import React, { useState, useRef } from 'react';
import { CATEGORIES } from '../constants';
import { fileToBase64, parseInvoiceResponse } from '../utils';
import AlertBanner from './AlertBanner';

export default function InvoiceUpload({ onSave, primaryCurrency }) {
  const [scanState, setScanState] = useState('idle'); // idle | scanning | review | error
  const [errorMsg, setErrorMsg] = useState('');
  const [prefill, setPrefill] = useState({ name: '', amount: '', dueDay: '', category: 'bills', recurring: true });
  const [saveMsg, setSaveMsg] = useState('');
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(file.type)) { setErrorMsg('⚠ Unsupported file type. Upload a PDF, JPG, or PNG.'); setScanState('error'); return; }
    if (file.size > 10 * 1024 * 1024) { setErrorMsg('⚠ File too large. Maximum size is 10MB.'); setScanState('error'); return; }
    setScanState('scanning');
    try {
      const base64 = await fileToBase64(file);
      const mediaType = { 'application/pdf': 'application/pdf', 'image/jpeg': 'image/jpeg', 'image/png': 'image/png' }[file.type];
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          messages: [{ role: 'user', content: [
            { type: mediaType === 'application/pdf' ? 'document' : 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            { type: 'text', text: `Extract from this invoice: vendor_name (shortest recognisable name), amount_due (number only, no symbol), due_day (day of month 1-28 or null if not found). Respond ONLY with valid JSON, no markdown: {"vendor_name":"...","amount_due":0.00,"due_day":0}` }
          ]}]
        })
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const parsed = parseInvoiceResponse(data);
      if (!parsed) throw new Error('Parse failed');
      setPrefill(p => ({ ...p, name: parsed.vendorName || '', amount: parsed.amountDue || '', dueDay: parsed.dueDay || '' }));
      setScanState('review');
    } catch (err) {
      if (err.message === 'API error') setErrorMsg('⚠ The AI scanner returned an error. Try again or enter manually.');
      else if (err.message === 'Parse failed') setErrorMsg('⚠ Could not read this invoice. Try again or enter manually.');
      else setErrorMsg('⚠ Could not reach the scanner. Check your connection.');
      setScanState('error');
      setTimeout(() => setScanState('idle'), 5000);
    }
  };

  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };

  const handleConfirmSave = () => {
    if (!prefill.name || !prefill.amount || !prefill.dueDay) return;
    onSave(prefill);
    setSaveMsg(`✓ ${prefill.name} added to bills.`);
    setScanState('idle');
    setPrefill({ name: '', amount: '', dueDay: '', category: 'bills', recurring: true });
    setTimeout(() => setSaveMsg(''), 2500);
  };

  if (scanState === 'scanning') return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, textAlign: 'center', marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Reading invoice with AI</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: `pulse 1s ${delay}s infinite` }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 10 }}>Extracting vendor · amount · due date</div>
    </div>
  );

  if (scanState === 'review') return (
    <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)' }}>✦ AI extracted — review and confirm</span>
        <span style={{ background: '#818cf820', color: 'var(--accent)', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>AI</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
        {[['Vendor name', 'name', 'text', 'Bill name'], ['Amount', 'amount', 'number', '0.00'], ['Due day (1–28)', 'dueDay', 'number', '1–28']].map(([label, field, type, ph]) => (
          <div key={field}>
            <label style={{ fontSize: 11, color: 'var(--accent-text)', display: 'block', marginBottom: 3 }}>{label}</label>
            <input type={type} value={prefill[field]} onChange={e => setPrefill(p => ({ ...p, [field]: e.target.value }))} placeholder={ph}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--accent-border)', borderRadius: 8, padding: '7px 10px', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', width: '100%', outline: 'none' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={prefill.category} onChange={e => setPrefill(p => ({ ...p, category: e.target.value }))} aria-label="Bill category"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--accent-border)', borderRadius: 8, padding: '7px 10px', fontSize: 13, cursor: 'pointer', flex: 1 }}>
          {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <button onClick={handleConfirmSave} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>✓ Save to bills</button>
        <button onClick={() => setScanState('idle')} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Discard</button>
      </div>
    </div>
  );

  return (
    <div style={{ marginBottom: 12 }}>
      {saveMsg && <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'var(--accent-text)', marginBottom: 8 }}>{saveMsg}</div>}
      {scanState === 'error' && <AlertBanner variant="error" style={{ marginBottom: 8 }}>{errorMsg}</AlertBanner>}
      <div
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{ border: '1.5px dashed var(--border-mid)', borderRadius: 12, padding: 20, textAlign: 'center', cursor: 'pointer', background: 'var(--bg-surface)', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
        role="button" aria-label="Upload invoice to auto-fill bill details" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
      >
        <i className="ti ti-file-upload" aria-hidden="true" style={{ fontSize: 26, color: 'var(--border-mid)', marginBottom: 8, display: 'block' }} />
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Upload invoice to auto-fill bill details</div>
        <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 3 }}>Drag & drop or click · PDF, JPG, PNG · AI-powered</div>
      </div>
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} aria-hidden="true" />
    </div>
  );
}
