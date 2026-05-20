import React from 'react';

const ROWS = [
  { label: 'Needs', desc: 'Rent, food, bills, transport, loans', ideal: 50, keys: ['rent','food','bills','transport','loans'], color: 'var(--blue)' },
  { label: 'Wants', desc: 'Leisure & non-essentials', ideal: 30, keys: ['leisure'], color: 'var(--pink)' },
  { label: 'Savings', desc: 'Savings & investments', ideal: 20, keys: ['savings'], color: 'var(--accent)' },
];

export default function RatioChecker({ allocations }) {
  return (
    <div>
      {ROWS.map(row => {
        const actual = row.keys.reduce((s, k) => s + (parseFloat(allocations[k]) || 0), 0);
        const diff = actual - row.ideal;
        const statusColor = diff > 5 ? 'var(--red)' : diff < -5 ? 'var(--amber)' : 'var(--accent)';
        const statusText = diff > 5 ? `▲ ${diff.toFixed(1)}% over target` : diff < -5 ? `▼ ${Math.abs(diff).toFixed(1)}% under target` : 'On track';

        return (
          <div key={row.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, flexWrap: 'wrap', gap: 4 }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</span>
                <span style={{ fontSize: 12, color: 'var(--text-faint)', marginLeft: 8 }}>{row.desc}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}>{actual.toFixed(1)}%</strong> / ideal {row.ideal}%
              </div>
            </div>
            <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3, position: 'relative' }}>
              <div style={{ height: 6, borderRadius: 3, width: `${Math.min(actual, 100)}%`, background: row.color, transition: 'width 0.4s ease' }} />
              <div style={{ position: 'absolute', top: -3, left: `${Math.min(row.ideal, 100)}%`, width: 2, height: 12, background: 'var(--border-mid)', borderRadius: 1 }} />
            </div>
            <div style={{ fontSize: 12, marginTop: 8, fontWeight: 500, color: statusColor }}>{statusText}</div>
          </div>
        );
      })}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        The 50/30/20 rule is a guide, not a law. In high cost-of-living regions, needs often exceed 50%. Adjust to match your own reality.
      </div>
    </div>
  );
}
