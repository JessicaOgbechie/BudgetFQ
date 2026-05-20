import { v4 as uuid } from 'uuid';

export const EXCHANGE_RATES = { '€': 1, '£': 0.86, '$': 1.08, '₦': 0.00067, 'kr': 0.088 };

export const CURRENCIES = ['€', '£', '$', '₦', 'kr'];

export const CATEGORIES = [
  { key: 'savings',   label: 'Savings',          icon: 'ti-piggy-bank',       color: '#00C27A', bg: '#ECFDF5' },
  { key: 'loans',     label: 'Loans / Debt',      icon: 'ti-receipt',          color: '#EF4444', bg: '#FEF2F2' },
  { key: 'rent',      label: 'Rent / Mortgage',   icon: 'ti-home',             color: '#3B82F6', bg: '#EFF6FF' },
  { key: 'food',      label: 'Food & Groceries',  icon: 'ti-shopping-cart',    color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'transport', label: 'Fuel / Transport',  icon: 'ti-car',              color: '#8B5CF6', bg: '#F5F3FF' },
  { key: 'leisure',   label: 'Leisure',           icon: 'ti-device-gamepad-2', color: '#EC4899', bg: '#FDF2F8' },
  { key: 'bills',     label: 'Recurring Bills',   icon: 'ti-bolt',             color: '#06B6D4', bg: '#ECFEFF' },
];

export const CUSTOM_CATEGORY_COLORS = ['#fb923c', '#e879f9', '#22d3ee', '#84cc16'];

export const currentMonthId = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getDefaultState = () => ({
  incomeSources: [{ id: crypto.randomUUID(), label: 'Primary salary', amount: 0, currency: '€' }],
  primaryCurrency: '€',
  allocations: { savings: 20, loans: 10, rent: 30, food: 12, transport: 8, leisure: 8, bills: 7 },
  bills: [
    { id: crypto.randomUUID(), name: 'Electricity', amount: 80,  dueDay: 5,  category: 'bills',   paid: false, recurring: true },
    { id: crypto.randomUUID(), name: 'Internet',    amount: 45,  dueDay: 12, category: 'bills',   paid: false, recurring: true },
    { id: crypto.randomUUID(), name: 'Phone',       amount: 30,  dueDay: 20, category: 'bills',   paid: false, recurring: true },
    { id: crypto.randomUUID(), name: 'Gym',         amount: 35,  dueDay: 1,  category: 'leisure', paid: false, recurring: true },
  ],
  customCategories: [],
  investProfile: null,
  salaryDay: 1,
  lastOpenedMonth: currentMonthId(),
});

export const INVEST_CARDS = {
  cautious: [
    { title: 'High-Yield Savings Account', icon: 'ti-building-bank', risk: 1, description: 'A savings account offering higher interest than standard accounts. Your money is safe and instantly accessible. Ideal as a first step before exploring other options.', returns: '2–4%/yr', minimum: 'Any amount', horizon: 'Any', link: 'https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts' },
    { title: 'Government Bonds', icon: 'ti-certificate', risk: 2, description: 'Loans you make to governments, repaid with interest. Very low risk with predictable returns. Available through most banks and brokerages.', returns: '3–5%/yr', minimum: '~€100', horizon: '1–5 years', link: 'https://www.investopedia.com/terms/g/government-bond.asp' },
    { title: 'Pension Top-Up', icon: 'ti-shield-check', risk: 1, description: 'Adding extra contributions to a pension scheme. Often tax-advantaged, meaning the government effectively adds to your savings. One of the highest effective returns available.', returns: 'Varies + tax benefit', minimum: 'Any amount', horizon: 'Long-term', link: 'https://www.investopedia.com/terms/p/pensionplan.asp' },
  ],
  balanced: [
    { title: 'Global Index Fund', icon: 'ti-world', risk: 3, description: 'A fund tracking thousands of companies worldwide. Diversified, low-cost, and historically one of the best long-term performers available to ordinary investors.', returns: '6–10%/yr', minimum: '~€50/month', horizon: '5+ years', link: 'https://www.investopedia.com/terms/i/indexfund.asp' },
    { title: 'ETF (Exchange Traded Fund)', icon: 'ti-chart-bar', risk: 3, description: 'Similar to index funds but traded like stocks. Available on platforms like Degiro, Nordnet, or Trading 212. Low fees and broad diversification.', returns: '5–9%/yr', minimum: '~€50', horizon: '3–10 years', link: 'https://www.investopedia.com/terms/e/etf.asp' },
    { title: 'Pension Top-Up', icon: 'ti-shield-check', risk: 1, description: 'Adding extra contributions to a pension scheme. Often tax-advantaged, meaning the government effectively adds to your savings.', returns: 'Varies + tax benefit', minimum: 'Any amount', horizon: 'Long-term', link: 'https://www.investopedia.com/terms/p/pensionplan.asp' },
    { title: 'High-Yield Savings Account', icon: 'ti-building-bank', risk: 1, description: 'Recommended for the portion you may need within 1 year. Safe, accessible, and a solid complement to longer-term investments.', returns: '2–4%/yr', minimum: 'Any amount', horizon: 'Any', link: 'https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts' },
  ],
  growth: [
    { title: 'Global Index Fund', icon: 'ti-world', risk: 3, description: 'The foundation of most long-term growth strategies. Diversified, low-cost, and proven over decades of market cycles.', returns: '6–10%/yr', minimum: '~€50/month', horizon: '5+ years', link: 'https://www.investopedia.com/terms/i/indexfund.asp' },
    { title: 'S&P 500 Index Fund', icon: 'ti-chart-line', risk: 3, description: 'Tracks the 500 largest US companies. Historically returned ~10%/yr over long periods. High short-term volatility, strong long-term performance.', returns: '~10%/yr (historical)', minimum: '~€50/month', horizon: '10+ years', link: 'https://www.investopedia.com/terms/s/sp500.asp' },
    { title: 'REITs', icon: 'ti-building', risk: 4, description: 'Own shares in income-generating real estate without buying property. Often pay regular dividends alongside capital growth.', returns: '4–8%/yr', minimum: '~€100', horizon: '5+ years', link: 'https://www.investopedia.com/terms/r/reit.asp' },
    { title: 'Individual Stocks', icon: 'ti-trending-up', risk: 5, description: 'Buying shares in specific companies. Higher potential returns but significantly higher risk. Only recommended once diversified through index funds.', returns: 'Varies widely', minimum: '~€50', horizon: '5+ years', link: 'https://www.investopedia.com/terms/s/stock.asp' },
  ],
};
