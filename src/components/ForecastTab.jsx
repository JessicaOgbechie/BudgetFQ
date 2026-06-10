import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend,
} from 'recharts';
import { CATEGORIES } from '../constants';
import { getDaysUntil } from '../utils';

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (c, n) => n === null || n === undefined ? '—' : c + Math.round(n).toLocaleString();

function Section({ title, children, style = {} }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', marginBottom: 14, ...style }}>
      {title && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 14 }}>{title}</div>}
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, color = 'var(--text-primary)', trend }) {
  return (
    <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.9px', color: 'var(--text-faint)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>{sub}</div>}
      {trend && <div style={{ fontSize: 11, marginTop: 4, color: trend > 0 ? 'var(--accent)' : trend < 0 ? 'var(--red)' : 'var(--text-faint)' }}>
        {trend > 0 ? '▲' : trend < 0 ? '▼' : '→'} {trend > 0 ? '+' : ''}{trend}%
      </div>}
    </div>
  );
}

function RingScore({ score, size = 80 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const fill = circ * (score / 100);
  const color = score >= 70 ? 'var(--accent)' : score >= 40 ? 'var(--amber)' : 'var(--red)';
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: size > 60 ? 18 : 13, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: 'var(--text-faint)' }}>/100</span>
      </div>
    </div>
  );
}

const CHART_COLORS = { income: '#00C27A', expenses: '#EF4444', balance: '#3B82F6', savings: '#8B5CF6' };

// ─── main component ──────────────────────────────────────────────────────────
export default function ForecastTab({ allocations, totalIncome, primaryCurrency: c, bills, salaryDay, setSalaryDay }) {
  const [period, setPeriod] = useState('monthly'); // monthly | quarterly | yearly
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', monthly: '', icon: '🎯' });
  const [debts, setDebts] = useState([]);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [newDebt, setNewDebt] = useState({ name: '', balance: '', rate: '', payment: '' });
  const [expandDebt, setExpandDebt] = useState(null);
  const [extraPayment, setExtraPayment] = useState({});

  const allCats = CATEGORIES.map(cat => ({ ...cat, pct: parseFloat(allocations[cat.key]) || 0 }));
  const totalAllocated = allCats.reduce((s, c) => s + c.pct, 0);
  const savingsPct = parseFloat(allocations.savings) || 0;
  const loansPct = parseFloat(allocations.loans) || 0;
  const unallocated = Math.max(0, 100 - totalAllocated);
  const monthlyExpenses = totalIncome * (totalAllocated - savingsPct) / 100;
  const monthlySavings = totalIncome * savingsPct / 100;
  const monthlyFree = totalIncome * unallocated / 100;
  const netCashFlow = totalIncome - monthlyExpenses;

  // Salary day countdown
  const today = new Date(); today.setHours(0,0,0,0);
  const payTarget = new Date(today.getFullYear(), today.getMonth(), salaryDay);
  if (payTarget <= today) payTarget.setMonth(payTarget.getMonth() + 1);
  const daysUntilPay = Math.ceil((payTarget - today) / 86400000);
  const dailyLimit = daysUntilPay > 0 ? monthlyFree / daysUntilPay : 0;

  // Health score
  const healthScore = useMemo(() => {
    if (!totalIncome) return 0;
    let s = 50;
    if (savingsPct >= 20) s += 15; else if (savingsPct >= 10) s += 8;
    if (loansPct === 0) s += 10; else if (loansPct <= 10) s += 5; else s -= 10;
    if (unallocated >= 5) s += 10;
    if (netCashFlow > 0) s += 10; else s -= 15;
    if (monthlySavings > 0) s += 5;
    return Math.min(100, Math.max(0, Math.round(s)));
  }, [savingsPct, loansPct, unallocated, netCashFlow, monthlySavings, totalIncome]);

  const healthStatus = healthScore >= 70 ? { label: 'Healthy', color: 'var(--accent)' } : healthScore >= 40 ? { label: 'Fair', color: 'var(--amber)' } : { label: 'At Risk', color: 'var(--red)' };

  const healthRec = useMemo(() => {
    if (!totalIncome) return 'Enter your income and allocations to unlock your health score.';
    if (savingsPct < 10) return `Increase savings to at least 10% — that's ${c}${Math.round(totalIncome * 0.1)}/month.`;
    if (loansPct > 20) return 'High loan commitment. Prioritise paying down debt to improve your score.';
    if (unallocated < 5) return 'You have very little unallocated income. Try to keep at least 5% as a buffer.';
    if (netCashFlow < 0) return 'Your expenses exceed your income. Review your allocations urgently.';
    return 'Great position. Consider increasing your savings or investment contributions.';
  }, [savingsPct, loansPct, unallocated, netCashFlow, totalIncome, c]);

  // Forecast chart data
  const chartData = useMemo(() => {
    const months = period === 'monthly' ? 12 : period === 'quarterly' ? 4 : 5;
    const stepLabel = period === 'quarterly' ? ['Q1','Q2','Q3','Q4'] : period === 'yearly' ? ['Y1','Y2','Y3','Y4','Y5'] : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const multiplier = period === 'quarterly' ? 3 : period === 'yearly' ? 12 : 1;
    let balance = 0;
    return Array.from({ length: months }, (_, i) => {
      const inc = totalIncome * multiplier;
      const exp = monthlyExpenses * multiplier;
      const sav = monthlySavings * multiplier;
      balance += (inc - exp);
      return { month: stepLabel[i], income: Math.round(inc), expenses: Math.round(exp), savings: Math.round(sav), balance: Math.round(balance) };
    });
  }, [totalIncome, monthlyExpenses, monthlySavings, period]);

  // Projected balances
  const proj30  = netCashFlow * 1;
  const proj90  = netCashFlow * 3;
  const proj365 = netCashFlow * 12;

  // Monthly forecast table (6 months)
  const forecastTable = useMemo(() => {
    const now = new Date();
    let cumBalance = 0;
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      cumBalance += netCashFlow;
      return { label, income: totalIncome, expenses: monthlyExpenses, net: netCashFlow, balance: cumBalance };
    });
  }, [totalIncome, monthlyExpenses, netCashFlow]);

  // Category breakdown for expense forecast
  const categoryBreakdown = allCats
    .filter(cat => cat.key !== 'savings' && cat.pct > 0)
    .sort((a, b) => b.pct - a.pct);

  // Savings goals helpers
  const addGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.monthly) return;
    const target = parseFloat(newGoal.target);
    const monthly = parseFloat(newGoal.monthly);
    setGoals(g => [...g, { id: Date.now(), ...newGoal, target, monthly, saved: 0 }]);
    setNewGoal({ name: '', target: '', monthly: '', icon: '🎯' });
    setShowGoalForm(false);
  };

  // Debt payoff helpers
  const calcPayoff = (balance, rate, payment, extra = 0) => {
    if (!balance || !payment) return { months: null, totalInterest: 0 };
    const monthly = rate / 100 / 12;
    const pmt = payment + (extra || 0);
    if (monthly === 0) return { months: Math.ceil(balance / pmt), totalInterest: 0 };
    let bal = balance, months = 0, totalInterest = 0;
    while (bal > 0 && months < 600) {
      const interest = bal * monthly;
      totalInterest += interest;
      bal = bal + interest - pmt;
      months++;
    }
    return { months, totalInterest: Math.round(totalInterest) };
  };

  const addDebt = () => {
    if (!newDebt.name || !newDebt.balance || !newDebt.payment) return;
    setDebts(d => [...d, { id: Date.now(), ...newDebt, balance: parseFloat(newDebt.balance), rate: parseFloat(newDebt.rate) || 0, payment: parseFloat(newDebt.payment) }]);
    setNewDebt({ name: '', balance: '', rate: '', payment: '' });
    setShowDebtForm(false);
  };

  const noIncome = !totalIncome;

  const inpStyle = { background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', outline: 'none', width: '100%' };

  return (
    <div>
      {/* ── 0. Empty state ─────────────────────────────────── */}
      {noIncome && (
        <div style={{ background: 'var(--amber-light)', border: '1px solid var(--amber-border)', borderRadius: 10, padding: '14px 16px', marginBottom: 16, fontSize: 13, color: 'var(--amber-text)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <i className="ti ti-alert-triangle" aria-hidden="true" style={{ fontSize: 16, flexShrink: 0 }} />
          Enter your monthly income and allocations in the Overview tab to unlock personalised forecasting.
        </div>
      )}

      {/* ── 1. Salary countdown ────────────────────────────── */}
      <Section>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 6 }}>Days until payday</div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 52, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
              {daysUntilPay === 0 ? '🎉' : daysUntilPay}
            </div>
            {daysUntilPay === 0
              ? <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Payday! Remember to allocate your income.</div>
              : <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>days to go</div>}
            {totalIncome > 0 && daysUntilPay > 0 && (
              <div style={{ fontSize: 13, color: 'var(--text-body)', marginTop: 8 }}>
                Daily spending limit: <strong style={{ fontFamily: 'Sora, sans-serif', color: 'var(--text-primary)' }}>{fmt(c, dailyLimit)}</strong>
              </div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 6 }}>My salary arrives on day</div>
            <input type="number" min="1" max="28" defaultValue={salaryDay}
              onBlur={e => { const v = parseInt(e.target.value); if (v >= 1 && v <= 28) setSalaryDay(v); }}
              aria-label="Salary day of month"
              style={{ ...inpStyle, width: 80, fontSize: 18, fontFamily: 'Sora, sans-serif', fontWeight: 700, textAlign: 'center' }} />
          </div>
        </div>
      </Section>

      {/* ── 2. Forecast Health Score ───────────────────────── */}
      <Section title="Forecast health score">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <RingScore score={healthScore} size={90} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 700, color: healthStatus.color }}>{healthScore}/100</span>
              <span style={{ background: healthStatus.color + '18', border: `1px solid ${healthStatus.color}40`, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600, color: healthStatus.color }}>{healthStatus.label}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.6 }}>
              <i className="ti ti-bulb" aria-hidden="true" style={{ marginRight: 5, color: 'var(--amber)', fontSize: 13 }} />
              {healthRec}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
          <StatCard label="Savings rate" value={savingsPct.toFixed(1) + '%'} sub="target ≥ 20%" color={savingsPct >= 20 ? 'var(--accent)' : 'var(--amber)'} />
          <StatCard label="Debt load" value={loansPct.toFixed(1) + '%'} sub="target ≤ 15%" color={loansPct <= 15 ? 'var(--accent)' : 'var(--red)'} />
          <StatCard label="Buffer" value={unallocated.toFixed(1) + '%'} sub="target ≥ 5%" color={unallocated >= 5 ? 'var(--accent)' : 'var(--amber)'} />
        </div>
      </Section>

      {/* ── 3. Projected balances ──────────────────────────── */}
      <Section title="Forecasted balance">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          <StatCard label="In 30 days" value={fmt(c, proj30)} color={proj30 >= 0 ? 'var(--accent)' : 'var(--red)'} trend={totalIncome ? Math.round((proj30 / totalIncome) * 100) : null} />
          <StatCard label="In 90 days" value={fmt(c, proj90)} color={proj90 >= 0 ? 'var(--accent)' : 'var(--red)'} />
          <StatCard label="In 12 months" value={fmt(c, proj365)} color={proj365 >= 0 ? 'var(--accent)' : 'var(--red)'} />
        </div>
        {/* Period toggle */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {[['monthly','Monthly'],['quarterly','Quarterly'],['yearly','Yearly']].map(([k, l]) => (
            <button key={k} onClick={() => setPeriod(k)}
              style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${period===k ? 'var(--accent)' : 'var(--border)'}`, background: period===k ? 'var(--accent-light)' : 'var(--bg-input)', color: period===k ? 'var(--accent-text)' : 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {l}
            </button>
          ))}
        </div>
        {totalIncome > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C27A" stopOpacity={0.12}/>
                  <stop offset="95%" stopColor="#00C27A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-faint)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-faint)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={v => c + Math.round(v/1000) + 'k'} />
              <Tooltip formatter={(v, n) => [fmt(c, v), n.charAt(0).toUpperCase()+n.slice(1)]} contentStyle={{ fontFamily: 'DM Sans', fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
              <Area type="monotone" dataKey="balance" name="balance" stroke={CHART_COLORS.balance} fill="url(#balGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="income" name="income" stroke={CHART_COLORS.income} fill="url(#incGrad)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expenses" name="expenses" stroke={CHART_COLORS.expenses} strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: 13 }}>Add income to see forecast chart</div>
        )}
      </Section>

      {/* ── 4. Cash flow table ─────────────────────────────── */}
      <Section title="Cash flow forecast — next 6 months">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {['Month','Income','Expenses','Net Cash Flow','Running Balance'].map(h => (
                  <th key={h} style={{ padding: '6px 10px', textAlign: h === 'Month' ? 'left' : 'right', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {forecastTable.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-input)' }}>
                  <td style={{ padding: '10px 10px', fontWeight: 600, color: 'var(--text-body)' }}>{row.label}</td>
                  <td style={{ padding: '10px 10px', textAlign: 'right', color: 'var(--accent)', fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>{fmt(c, row.income)}</td>
                  <td style={{ padding: '10px 10px', textAlign: 'right', color: 'var(--red)', fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>{fmt(c, row.expenses)}</td>
                  <td style={{ padding: '10px 10px', textAlign: 'right', color: row.net >= 0 ? 'var(--accent)' : 'var(--red)', fontFamily: 'Sora, sans-serif', fontWeight: 700 }}>{fmt(c, row.net)}</td>
                  <td style={{ padding: '10px 10px', textAlign: 'right', color: row.balance >= 0 ? 'var(--text-primary)' : 'var(--red)', fontFamily: 'Sora, sans-serif', fontWeight: 700 }}>{fmt(c, row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 5. Expense breakdown ───────────────────────────── */}
      {categoryBreakdown.length > 0 && (
        <Section title="Expense category forecast">
          <div style={{ marginBottom: 10 }}>
            {categoryBreakdown.map(cat => {
              const monthly = totalIncome * cat.pct / 100;
              const annual = monthly * 12;
              return (
                <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`ti ${cat.icon}`} aria-hidden="true" style={{ fontSize: 14, color: cat.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-body)' }}>{cat.label}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fmt(c, monthly)}/mo · {fmt(c, annual)}/yr</span>
                    </div>
                    <div style={{ height: 5, background: '#F3F4F6', borderRadius: 3 }}>
                      <div style={{ height: 5, borderRadius: 3, width: `${Math.min(cat.pct, 100)}%`, background: cat.color, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-faint)', width: 36, textAlign: 'right' }}>{cat.pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
          {totalIncome > 0 && (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={categoryBreakdown.slice(0,6).map(cat => ({ name: cat.label.split(' ')[0], value: Math.round(totalIncome * cat.pct / 100), color: cat.color }))} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-faint)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={v => [fmt(c, v), 'Monthly']} contentStyle={{ fontFamily: 'DM Sans', fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
                <Bar dataKey="value" radius={[4,4,0,0]} fill="var(--accent)">
                  {categoryBreakdown.slice(0,6).map((cat, i) => (
                    <rect key={i} fill={cat.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Section>
      )}

      {/* ── 6. Savings goals ───────────────────────────────── */}
      <Section title="Savings goal forecasting">
        {goals.length === 0 && !showGoalForm && (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-faint)', fontSize: 13 }}>
            No goals yet. Add a goal to see when you'll reach it.
          </div>
        )}
        {goals.map(goal => {
          const months = goal.monthly > 0 ? Math.ceil((goal.target - goal.saved) / goal.monthly) : null;
          const completion = months ? new Date(Date.now() + months * 30 * 86400000).toLocaleString('default', { month: 'long', year: 'numeric' }) : '—';
          const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
          return (
            <div key={goal.id} style={{ background: 'var(--bg-input)', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{goal.icon} {goal.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>Target: {fmt(c, goal.target)} · {fmt(c, goal.monthly)}/month</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{pct}%</div>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>done</div>
                </div>
              </div>
              <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, marginBottom: 8 }}>
                <div style={{ height: 8, borderRadius: 4, width: pct + '%', background: 'var(--accent)', transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-faint)' }}>Saved: {fmt(c, goal.saved)}</span>
                <span style={{ color: 'var(--text-body)', fontWeight: 500 }}>Est. completion: {completion}</span>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="number" placeholder="Add to saved" min="0"
                  style={{ ...inpStyle, width: 130, fontSize: 12 }}
                  onBlur={e => {
                    const v = parseFloat(e.target.value) || 0;
                    if (v > 0) { setGoals(g => g.map(g2 => g2.id === goal.id ? { ...g2, saved: g2.saved + v } : g2)); e.target.value = ''; }
                  }} />
                <button onClick={() => setGoals(g => g.filter(g2 => g2.id !== goal.id))}
                  style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>Remove</button>
              </div>
            </div>
          );
        })}

        {showGoalForm ? (
          <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>Goal name</div>
                <input value={newGoal.name} onChange={e => setNewGoal(g => ({...g, name: e.target.value}))} placeholder="e.g. Vacation" style={inpStyle} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>Icon</div>
                <select value={newGoal.icon} onChange={e => setNewGoal(g => ({...g, icon: e.target.value}))} style={inpStyle}>
                  {['🎯','✈️','🏠','🚗','📚','💍','🏖️','💻','🏋️','🌍','💰','🎓'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>Target amount ({c})</div>
                <input type="number" value={newGoal.target} onChange={e => setNewGoal(g => ({...g, target: e.target.value}))} placeholder="0" style={inpStyle} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>Monthly contribution ({c})</div>
                <input type="number" value={newGoal.monthly} onChange={e => setNewGoal(g => ({...g, monthly: e.target.value}))} placeholder="0" style={inpStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={addGoal} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add goal</button>
              <button onClick={() => setShowGoalForm(false)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowGoalForm(true)}
            style={{ background: 'var(--bg-surface)', border: '1.5px dashed var(--border-mid)', borderRadius: 10, color: 'var(--text-faint)', padding: '11px 18px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginTop: 4, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.color = 'var(--text-faint)'; }}>
            <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 15 }} /> Add savings goal
          </button>
        )}
      </Section>

      {/* ── 7. Debt payoff ─────────────────────────────────── */}
      <Section title="Debt payoff forecasting">
        {debts.length === 0 && !showDebtForm && (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-faint)', fontSize: 13 }}>No debts added. Add a loan or credit card to see payoff timeline.</div>
        )}
        {debts.map(debt => {
          const base = calcPayoff(debt.balance, debt.rate, debt.payment);
          const extra = parseFloat(extraPayment[debt.id] || 0);
          const boosted = extra > 0 ? calcPayoff(debt.balance, debt.rate, debt.payment, extra) : null;
          const monthsLeft = base.months;
          const payoffDate = monthsLeft ? new Date(Date.now() + monthsLeft * 30 * 86400000).toLocaleString('default', { month: 'long', year: 'numeric' }) : '—';
          return (
            <div key={debt.id} style={{ background: 'var(--bg-input)', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{debt.name}</div>
                <button onClick={() => setDebts(d => d.filter(d2 => d2.id !== debt.id))} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>Remove</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
                <div><div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase' }}>Balance</div><div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--red)' }}>{fmt(c, debt.balance)}</div></div>
                <div><div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase' }}>Rate</div><div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}>{debt.rate}%</div></div>
                <div><div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase' }}>Payment/mo</div><div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}>{fmt(c, debt.payment)}</div></div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-body)', marginBottom: 8 }}>
                Payoff: <strong>{payoffDate}</strong> ({monthsLeft ? monthsLeft + ' months' : '—'}) · Total interest: <strong style={{ color: 'var(--red)' }}>{fmt(c, base.totalInterest)}</strong>
              </div>
              {/* What if I pay more */}
              <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 10, marginTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>What if I pay more?</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="number" placeholder={`Extra ${c}/month`} value={extraPayment[debt.id] || ''}
                    onChange={e => setExtraPayment(p => ({...p, [debt.id]: e.target.value}))}
                    style={{ ...inpStyle, width: 150, fontSize: 13 }} />
                  {boosted && (
                    <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>
                      Paid off {base.months - boosted.months} months sooner · saves {fmt(c, base.totalInterest - boosted.totalInterest)} in interest
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {showDebtForm ? (
          <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              {[['Debt name','name','text','e.g. Car loan'],['Balance','balance','number','0'],['Interest rate (%)','rate','number','0'],['Monthly payment','payment','number','0']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>{label}</div>
                  <input type={type} value={newDebt[key]} onChange={e => setNewDebt(d => ({...d, [key]: e.target.value}))} placeholder={ph} style={inpStyle} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={addDebt} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add debt</button>
              <button onClick={() => setShowDebtForm(false)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowDebtForm(true)}
            style={{ background: 'var(--bg-surface)', border: '1.5px dashed var(--border-mid)', borderRadius: 10, color: 'var(--text-faint)', padding: '11px 18px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginTop: 4, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.color = 'var(--text-faint)'; }}>
            <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 15 }} /> Add debt
          </button>
        )}
      </Section>

      {/* ── 8. Net worth projection ────────────────────────── */}
      <Section title="Net worth forecast">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 14 }}>
          <StatCard label="6-month projection" value={fmt(c, netCashFlow * 6)} color={netCashFlow >= 0 ? 'var(--accent)' : 'var(--red)'} />
          <StatCard label="1-year projection" value={fmt(c, netCashFlow * 12)} color={netCashFlow >= 0 ? 'var(--accent)' : 'var(--red)'} />
        </div>
        {totalIncome > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-faint)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-faint)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={v => c + Math.round(v/1000) + 'k'} />
              <Tooltip formatter={(v, n) => [fmt(c, v), n.charAt(0).toUpperCase()+n.slice(1)]} contentStyle={{ fontFamily: 'DM Sans', fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
              <Area type="monotone" dataKey="savings" name="savings" stroke="#8B5CF6" fill="url(#nwGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: 13 }}>Add income to see net worth chart</div>
        )}
        {totalIncome > 0 && netCashFlow > 0 && (
          <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: 8, padding: '10px 14px', marginTop: 12, fontSize: 13, color: 'var(--accent-text)' }}>
            <i className="ti ti-trending-up" aria-hidden="true" style={{ marginRight: 6, fontSize: 14 }} />
            At your current savings rate, your net worth is projected to grow by <strong>{fmt(c, proj365)}</strong> over the next year.
          </div>
        )}
      </Section>

      <div style={{ fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', fontStyle: 'italic', marginTop: 4 }}>
        Forecasts are based on current income and allocation settings. Actual results may vary.
      </div>
    </div>
  );
}
