import { EXCHANGE_RATES } from './constants';

export function getDaysUntil(dueDay) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(today.getFullYear(), today.getMonth(), dueDay);
  if (target <= today) target.setMonth(target.getMonth() + 1);
  return Math.ceil((target - today) / 86400000);
}

export function formatCurrency(amount, currency, income = 1) {
  if (amount === 0 && income === 0) return '—';
  return currency + Math.round(amount).toLocaleString();
}

// Convert amount from one currency to another via EUR as base
// Used ONLY for multi-source income where sources differ in currency
export function toPrimary(amount, from, primary) {
  if (from === primary) return amount;
  const inEUR = amount / (EXCHANGE_RATES[from] || 1);
  return inEUR * (EXCHANGE_RATES[primary] || 1);
}

// Sum all income sources, converting each to primary currency
export function calcTotalIncome(incomeSources, primaryCurrency) {
  return incomeSources.reduce((sum, s) => {
    return sum + toPrimary(s.amount || 0, s.currency, primaryCurrency);
  }, 0);
}

export function calcInvestables(allocations, totalIncome) {
  const totalAllocated = Object.values(allocations).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const unallocated = Math.max(0, 100 - totalAllocated);
  const investablePct = unallocated;
  const investableAmount = (totalIncome * investablePct) / 100;
  const savingsPct = parseFloat(allocations.savings) || 0;
  const score = Math.min(100, Math.max(0, Math.round(investablePct + savingsPct - 5)));
  return { totalAllocated, unallocated, investablePct, investableAmount, score };
}

export function detectBillClusters(bills) {
  const unpaid = bills.filter(b => !b.paid);
  const withDays = unpaid.map(b => ({ ...b, days: getDaysUntil(b.dueDay) }));
  const clusters = [];
  const used = new Set();
  for (let i = 0; i < withDays.length; i++) {
    if (used.has(i)) continue;
    const group = [withDays[i]];
    for (let j = i + 1; j < withDays.length; j++) {
      if (!used.has(j) && Math.abs(withDays[i].days - withDays[j].days) <= 3) {
        group.push(withDays[j]);
        used.add(j);
      }
    }
    if (group.length >= 2) {
      clusters.push({ bills: group, nearestDay: Math.min(...group.map(b => b.days)) });
      used.add(i);
    }
  }
  return clusters;
}

export function currentMonthId() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function buildSnapshot(state, trigger) {
  const now = new Date();
  const id = currentMonthId();
  const label = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const billsTotal = state.bills.reduce((s, b) => s + b.amount, 0);
  const totalAllocated = Object.values(state.allocations).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const investablePct = Math.max(0, 100 - totalAllocated);
  return {
    id, label,
    savedAt: now.toISOString(),
    trigger,
    income: state.totalIncome,
    currency: state.primaryCurrency,
    allocations: { ...state.allocations },
    billsTotal: Math.round(billsTotal * 100) / 100,
    investablePct: Math.round(investablePct * 10) / 10,
    investableAmount: Math.round((state.totalIncome * investablePct / 100) * 100) / 100,
    billCount: state.bills.length,
    paidCount: state.bills.filter(b => b.paid).length,
  };
}

export function assignProfile(answers) {
  let score = 0;
  if (answers.q1 === '1–3 years') score += 1;
  if (answers.q1 === '3–10 years') score += 1;
  if (answers.q1 === '10+ years') score += 2;
  if (answers.q2 === 'Feel uncomfortable but hold') score += 1;
  if (answers.q2 === 'Feel completely fine') score += 2;
  if (answers.q3 === 'Grow wealth' || answers.q3 === 'Retirement') score += 1;
  if (answers.q4 === 'Yes') score += 1;
  if (answers.q5 === 'Yes') score += 1;
  if (score <= 2) return 'cautious';
  if (score <= 5) return 'balanced';
  return 'growth';
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

export function parseInvoiceResponse(data) {
  try {
    const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return {
      vendorName: parsed.vendor_name ?? '',
      amountDue: parsed.amount_due ?? '',
      dueDay: parsed.due_day ?? '',
    };
  } catch { return null; }
}

export function generateCSV(state, totalIncome) {
  const now = new Date();
  const monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const c = state.primaryCurrency;
  const allCats = [
    { key: 'savings', label: 'Savings' }, { key: 'loans', label: 'Loans / Debt' },
    { key: 'rent', label: 'Rent / Mortgage' }, { key: 'food', label: 'Food & Groceries' },
    { key: 'transport', label: 'Fuel / Transport' }, { key: 'leisure', label: 'Leisure' },
    { key: 'bills', label: 'Recurring Bills' },
    ...(state.customCategories || []).map(cc => ({ key: cc.key, label: cc.label })),
  ];
  let csv = `BudgetFQ Report — ${monthLabel}\n"Smart budgeting for real life"\n\n`;
  csv += `INCOME\nSource,Amount,Currency\n`;
  (state.incomeSources || []).forEach(s => { csv += `"${s.label}",${s.amount},${s.currency}\n`; });
  csv += `\nALLOCATIONS\nCategory,Percentage,Monthly Amount\n`;
  allCats.forEach(cat => {
    const pct = state.allocations[cat.key] || 0;
    const amt = (totalIncome * pct) / 100;
    csv += `"${cat.label}",${pct}%,${c}${Math.round(amt)}\n`;
  });
  csv += `\nBILLS\nName,Amount,Due Day,Category,Recurring,Paid\n`;
  (state.bills || []).forEach(b => {
    const catLabel = allCats.find(c => c.key === b.category)?.label || b.category;
    csv += `"${b.name}",${c}${b.amount},${b.dueDay},"${catLabel}",${b.recurring ? 'Yes' : 'No'},${b.paid ? 'Yes' : 'No'}\n`;
  });
  return csv;
}
