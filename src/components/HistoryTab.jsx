import React, { useState } from 'react';
import { buildSnapshot, currentMonthId } from '../utils';
import EmptyState from './EmptyState';
import Toast from './Toast';

function SnapshotCard({ snap, isCurrentMonth }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{snap.label}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {isCurrentMonth && <span style={{ background: 'var(--accent-light)', color: 'var(--accent-text)', border: '1px solid var(--accent-border)', borderRadius: 20, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>Current month</span>}
          <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{snap.trigger === 'manual' ? 'Manual save' : 'Auto-snapshot'}</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          ['Income', snap.currency + Math.round(snap.income).toLocaleString(), 'var(--text-primary)'],
          ['Bills total', snap.currency + Math.round(snap.billsTotal).toLocaleString(), 'var(--text-primary)'],
          ['Investable', snap.currency + Math.round(snap.investableAmount).toLocaleString(), snap.investableAmount > 0 ? 'var(--accent)' : 'var(--text-faint)'],
        ].map(([label, val, color]) => (
          <div key={label} style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 3 }}>{label}</div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{snap.paidCount} / {snap.billCount} bills paid</div>
    </div>
  );
}

export default function HistoryTab({ history, setHistory, state }) {
  const [toast, setToast] = useState('');
  const thisMonth = currentMonthId();
  const displayHistory = history.slice(0, 24);

  const handleManualSave = () => {
    const snap = buildSnapshot(state, 'manual');
    setHistory(prev => {
      const filtered = prev.filter(s => !(s.id === thisMonth && s.trigger === 'manual'));
      return [snap, ...filtered];
    });
    setToast(`✓ Snapshot saved for ${snap.label}.`);
  };

  // Year overview bar chart (last 12 months)
  const last12 = displayHistory.slice(0, 12);
  const maxInvestable = Math.max(...last12.map(s => s.investableAmount), 1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Monthly snapshots</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Auto-saved on 1st of each month · manual saves anytime</div>
        </div>
        <button onClick={handleManualSave} aria-label="Save snapshot for this month"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-camera" aria-hidden="true" style={{ fontSize: 14 }} /> Save this month now
        </button>
      </div>

      {toast && <Toast message={toast} onDismiss={() => setToast('')} />}

      {last12.length >= 3 && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 14 }}>Year at a glance</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
            {[...last12].reverse().map((snap, i) => {
              const h = Math.max(4, (snap.investableAmount / maxInvestable) * 72);
              return (
                <div key={snap.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} title={`${snap.label}: ${snap.currency}${Math.round(snap.investableAmount)} investable`}>
                  <div style={{ width: '100%', height: h, background: 'var(--accent)', borderRadius: '3px 3px 0 0', opacity: 0.85 + (i / last12.length) * 0.15 }} />
                  <div style={{ fontSize: 9, color: 'var(--text-faint)', textAlign: 'center' }}>{snap.label.slice(0, 3)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <EmptyState title="No history yet" subtitle="Snapshots appear here at the start of each new month. You can also save one manually anytime." />
      ) : (
        displayHistory.map(snap => (
          <SnapshotCard key={snap.id + snap.trigger} snap={snap} isCurrentMonth={snap.id === thisMonth} />
        ))
      )}
    </div>
  );
}
