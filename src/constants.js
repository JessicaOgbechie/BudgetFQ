export const CURRENCIES = [
  { code: '€',   name: 'Euro',                flag: '🇪🇺' },
  { code: '£',   name: 'British Pound',        flag: '🇬🇧' },
  { code: '$',   name: 'US Dollar',            flag: '🇺🇸' },
  { code: '₦',   name: 'Nigerian Naira',       flag: '🇳🇬' },
  { code: 'kr',  name: 'Swedish Krona',        flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone',      flag: '🇳🇴' },
  { code: 'CAD', name: 'Canadian Dollar',      flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar',    flag: '🇦🇺' },
  { code: 'INR', name: 'Indian Rupee',         flag: '🇮🇳' },
  { code: 'GHS', name: 'Ghanaian Cedi',        flag: '🇬🇭' },
  { code: 'KES', name: 'Kenyan Shilling',      flag: '🇰🇪' },
  { code: 'ZAR', name: 'South African Rand',   flag: '🇿🇦' },
];

// Exchange rates relative to EUR (1 EUR = X of currency)
// Used ONLY for multi-source income conversion where sources are in different currencies
export const EXCHANGE_RATES = {
  '€':   1,
  '£':   0.86,
  '$':   1.08,
  '₦':   1650,    // 1 EUR ≈ 1650 NGN
  'kr':  11.40,   // 1 EUR ≈ 11.40 SEK
  'NOK': 11.70,
  'CAD': 1.47,
  'AUD': 1.65,
  'INR': 90.0,
  'GHS': 13.50,
  'KES': 140.0,
  'ZAR': 20.0,
};

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

// Fix 3: All allocations default to 0 — user builds from scratch
export const getDefaultState = () => ({
  incomeSources: [{ id: crypto.randomUUID(), label: 'Primary salary', amount: 0, currency: '€' }],
  primaryCurrency: '€',
  allocations: { savings: 0, loans: 0, rent: 0, food: 0, transport: 0, leisure: 0, bills: 0 },
  bills: [
    { id: crypto.randomUUID(), name: 'Electricity', amount: 0, dueDay: 5,  category: 'bills',   paid: false, recurring: true },
    { id: crypto.randomUUID(), name: 'Internet',    amount: 0, dueDay: 12, category: 'bills',   paid: false, recurring: true },
    { id: crypto.randomUUID(), name: 'Phone',       amount: 0, dueDay: 20, category: 'bills',   paid: false, recurring: true },
    { id: crypto.randomUUID(), name: 'Gym',         amount: 0, dueDay: 1,  category: 'leisure', paid: false, recurring: true },
  ],
  customCategories: [],
  investProfile: null,
  salaryDay: 1,
  lastOpenedMonth: currentMonthId(),
});

export const INVEST_CARDS = {
  cautious: [
    { title: 'High-Yield Savings Account', icon: 'ti-building-bank', risk: 1, description: 'A savings account offering higher interest than standard accounts. Your money is safe and instantly accessible. Ideal as a first step before exploring other options.', returns: '2–4%/yr', minimum: 'Any amount', horizon: 'Any', link: 'https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts' },
    { title: 'Government Bonds', icon: 'ti-certificate', risk: 2, description: 'Loans you make to governments, repaid with interest. Very low risk with predictable returns. Available through most banks and brokerages.', returns: '3–5%/yr', minimum: '~100', horizon: '1–5 years', link: 'https://www.investopedia.com/terms/g/government-bond.asp' },
    { title: 'Pension Top-Up', icon: 'ti-shield-check', risk: 1, description: 'Adding extra contributions to a pension scheme. Often tax-advantaged, meaning the government effectively adds to your savings. One of the highest effective returns available.', returns: 'Varies + tax benefit', minimum: 'Any amount', horizon: 'Long-term', link: 'https://www.investopedia.com/terms/p/pensionplan.asp' },
  ],
  balanced: [
    { title: 'Global Index Fund', icon: 'ti-world', risk: 3, description: 'A fund tracking thousands of companies worldwide. Diversified, low-cost, and historically one of the best long-term performers available to ordinary investors.', returns: '6–10%/yr', minimum: '~50/month', horizon: '5+ years', link: 'https://www.investopedia.com/terms/i/indexfund.asp' },
    { title: 'ETF (Exchange Traded Fund)', icon: 'ti-chart-bar', risk: 3, description: 'Similar to index funds but traded like stocks. Available on platforms like Degiro, Nordnet, or Trading 212. Low fees and broad diversification.', returns: '5–9%/yr', minimum: '~50', horizon: '3–10 years', link: 'https://www.investopedia.com/terms/e/etf.asp' },
    { title: 'Pension Top-Up', icon: 'ti-shield-check', risk: 1, description: 'Adding extra contributions to a pension scheme. Often tax-advantaged, meaning the government effectively adds to your savings.', returns: 'Varies + tax benefit', minimum: 'Any amount', horizon: 'Long-term', link: 'https://www.investopedia.com/terms/p/pensionplan.asp' },
    { title: 'High-Yield Savings Account', icon: 'ti-building-bank', risk: 1, description: 'Recommended for the portion you may need within 1 year. Safe, accessible, and a solid complement to longer-term investments.', returns: '2–4%/yr', minimum: 'Any amount', horizon: 'Any', link: 'https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts' },
  ],
  growth: [
    { title: 'Global Index Fund', icon: 'ti-world', risk: 3, description: 'The foundation of most long-term growth strategies. Diversified, low-cost, and proven over decades of market cycles.', returns: '6–10%/yr', minimum: '~50/month', horizon: '5+ years', link: 'https://www.investopedia.com/terms/i/indexfund.asp' },
    { title: 'S&P 500 Index Fund', icon: 'ti-chart-line', risk: 3, description: 'Tracks the 500 largest US companies. Historically returned ~10%/yr over long periods. High short-term volatility, strong long-term performance.', returns: '~10%/yr (historical)', minimum: '~50/month', horizon: '10+ years', link: 'https://www.investopedia.com/terms/s/sp500.asp' },
    { title: 'REITs', icon: 'ti-building', risk: 4, description: 'Own shares in income-generating real estate without buying property. Often pay regular dividends alongside capital growth.', returns: '4–8%/yr', minimum: '~100', horizon: '5+ years', link: 'https://www.investopedia.com/terms/r/reit.asp' },
    { title: 'Individual Stocks', icon: 'ti-trending-up', risk: 5, description: 'Buying shares in specific companies. Higher potential returns but significantly higher risk. Only recommended once diversified through index funds.', returns: 'Varies widely', minimum: '~50', horizon: '5+ years', link: 'https://www.investopedia.com/terms/s/stock.asp' },
  ],
};

export const TAB_DESCRIPTIONS = {
  overview:  'Allocate your monthly income across spending categories',
  bills:     'Track upcoming bills sorted by urgency and due date',
  invest:    'See your Financial Quotient score and investment options',
  whatif:    'Simulate how spending cuts affect your savings over time',
  forecast:  'Preview next month\'s budget and salary countdown',
  history:   'Monthly snapshots and year-at-a-glance overview',
  ratio:     'Compare your budget against the 50/30/20 rule',
};

export const FAQ_ITEMS = [
  {
    q: 'What is BudgetFQ?',
    a: 'BudgetFQ (Financial Quotient) is a personal budget planner that helps you allocate your income, track bills, understand how much you can safely invest, and plan ahead — all without linking a bank account.',
  },
  {
    q: 'Is my data safe? Where is it stored?',
    a: 'All your data is stored locally in your browser using localStorage. Nothing is sent to any server except when you use the AI invoice scanner or AI adviser, which send data to the Anthropic Claude API and are not stored.',
  },
  {
    q: 'How do I sync across devices?',
    a: 'Use the Backup button in the header to export your data as a JSON file, then use Import data on another device to restore it. Full cloud sync is on the roadmap.',
  },
  {
    q: 'What does the Invest Score mean?',
    a: 'The Invest Score (0–100) is your Financial Quotient — it measures how much of your income is safely available to invest after all commitments, with a 5% emergency buffer factored in. Higher is better.',
  },
  {
    q: 'Why does the percentage calculate automatically?',
    a: 'You enter amounts in your currency and BudgetFQ calculates the percentage of your income automatically. This is more intuitive than trying to work out what percentage €600 is of your salary.',
  },
  {
    q: 'What is the 50/30/20 rule?',
    a: '50% of income goes to needs (rent, food, bills), 30% to wants (leisure), and 20% to savings. It\'s a popular budgeting guideline — but a guide, not a rule. In high cost-of-living cities, needs often exceed 50%.',
  },
  {
    q: 'How does the invoice upload work?',
    a: 'Upload a PDF or photo of a bill. BudgetFQ sends it to an AI model which extracts the vendor name, amount, and due date. You review the details before anything is saved — nothing is added automatically.',
  },
  {
    q: 'How do multi-currency income sources work?',
    a: 'If you earn in multiple currencies, add each source separately with its own currency. BudgetFQ converts all sources to your primary currency using approximate exchange rates so you see one total. Rates are static — check with your bank for exact values.',
  },
  {
    q: 'What happens to my data at the start of a new month?',
    a: 'BudgetFQ automatically saves a snapshot of your budget on the first day of each new month. Bill paid-statuses reset so you start fresh. You can also save a snapshot manually anytime from the History tab.',
  },
  {
    q: 'Is the AI investment advice regulated financial advice?',
    a: 'No. The AI adviser provides general financial education only. It is not a licensed financial adviser. Always consult a qualified professional before making investment decisions.',
  },
];

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fi', label: 'Finnish' },
  { code: 'fr', label: 'French' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'ig', label: 'Igbo' },
  { code: 'ha', label: 'Hausa' },
  { code: 'sw', label: 'Swahili' },
  { code: 'de', label: 'German' },
  { code: 'es', label: 'Spanish' },
  { code: 'pt', label: 'Portuguese' },
];

export const COUNTRIES = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
];

export const AVATARS = ['😊','🧑','👩','👨','🧕','👳','🧔','👩‍💼','👨‍💼','🦸','🧑‍🎓','👩‍🦱','👨‍🦱','🧑‍🦰','😎','🤓'];

export const DEFAULT_PROFILE = {
  name: '',
  avatar: '😊',
  country: '',
  language: 'en',
  notifications: false,
};

export const GOAL_PRESETS = [
  { label: 'Emergency Fund', icon: '🛡️' },
  { label: 'Vacation',       icon: '✈️' },
  { label: 'Home Purchase',  icon: '🏠' },
  { label: 'Vehicle',        icon: '🚗' },
  { label: 'Education',      icon: '🎓' },
  { label: 'Custom Goal',    icon: '⭐' },
];
