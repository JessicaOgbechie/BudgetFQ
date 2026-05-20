import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { getDaysUntil, formatCurrency } from '../utils';

export default function ForecastTab({ allocations, totalIncome, primaryCurrency, bills, salaryDay, setSalaryDay }) {
  const today = new Date();
  const target = new Date(today.getFullYear(), today.getMonth(), salaryDay);
  if (target <= today) target.setMonth(target.getMonth() + 1);
  const daysUntil = Math.ceil((target - today) / 86400000);

  const totalAllocated = Object.values(allocations).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const unallocatedPct = Math.max(0, 100 - totalAllocated);
  const unallocatedAmt = (totalIncome * unallocatedPct) / 100;
  const dailyLimit = daysUntil > 0 ? unallocatedAmt / daysUntil : 0;

  const recurringBills = bills.filter(b => b.recurring).sort((a, b) => a.dueDay - b.dueDay);
  const allCats = CATEGORIES;

  const [dayErrors, setDayErrors] = useState('');

  const handleSalaryDay = (val) => {
    const d = parseInt(val);
    if (d < 1 || d > 28) { setDayErrors('Enter a day between 1 and 28'); return; }
    setDayErrors('');
    setSalaryDay(d);
  };

  const getBillsForDay = (day) => bills.filter(b => b.dueDay === day);

  return (
    <div>
      {/* Salary countdown */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 14 }}>Salary day countdown</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 52, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
              {daysUntil === 0 ? '🎉' : daysUntil}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              {daysUntil === 0 ? 'Payday! Remember to allocate your income.' : `days until payday`}
            </div>
            {daysUntil > 0 && totalIncome > 0 && (
              <div style={{ fontSize: 13, color: 'var(--text-body)', marginTop: 8 }}>
                Daily spending limit: <strong style={{ color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}>{primaryCurrency}{Math.round(dailyLimit)}</strong>
              </div>
            )}
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-faint)', display: 'block', marginBottom: 4 }}>My salary arrives on day</label>
            <input type="number" min="1" max="28" defaultValue={salaryDay} onBlur={e => handleSalaryDay(e.target.value)} aria-label="Salary day of month"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600, color: 'var(--text-primary)', width: 80, outline: 'none' }} />
            {dayErrors && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 4 }}>{dayErrors}</div>}
          </div>
        </div>
      </div>

      {/* Bill calendar strip */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 14 }}>Bill calendar</div>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 4 }}>
          {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
            const dayBills = getBillsForDay(day);
            const hasBills = dayBills.length > 0;
            const isToday = today.getDate() === day;
            return (
              <div key={day} title={hasBills ? dayBills.map(b => `${b.name} — ${primaryCurrency}${b.amount}`).join(', ') : ''}
                style={{ minWidth: 28, flexShrink: 0, textAlign: 'center', cursor: hasBills ? 'pointer' : 'default' }}>
                <div style={{ fontSize: 10, color: isToday ? 'var(--accent)' : 'var(--text-faint)', fontWeight: isToday ? 700 : 400, marginBottom: 3 }}>{day}</div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', margin: '0 auto', background: hasBills ? (CATEGORIES.find(c => c.key === dayBills[0].category)?.color || 'var(--accent)') : 'transparent', border: hasBills ? 'none' : '1px solid var(--border)' }} />
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 8 }}>Hover a dot to see the bill</div>
      </div>

      {/* Next month projection */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 14 }}>Next month forecast</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            ['Total income', totalIncome ? primaryCurrency + Math.round(totalIncome).toLocaleString() : '—', 'var(--text-primary)'],
            ['Committed', totalIncome ? primaryCurrency + Math.round(totalIncome * totalAllocated / 100).toLocaleString() : '—', 'var(--red)'],
            ['Unplanned spending', totalIncome ? primaryCurrency + Math.round(unallocatedAmt).toLocaleString() : '—', 'var(--accent)'],
          ].map(([label, val, color]) => (
            <div key={label} style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>{label}</div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 700, color }}>{val}</div>
            </div>
          ))}
        </div>
        {recurringBills.length > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Recurring bills this month</div>
            {recurringBills.map(bill => (
              <div key={bill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-body)' }}>{bill.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-faint)', marginLeft: 8 }}>· Day {bill.dueDay}</span>
                </div>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{primaryCurrency}{bill.amount}</span>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-faint)', fontStyle: 'italic' }}>
        This forecast is based on your current income and allocation settings. Actual spending may vary.
      </div>
    </div>
  );
}
