# BudgetFQ — Product Requirements Document
**Version:** 2.0 — Complete & Unified
**Status:** Sole source of truth. All previous documents (v1.0, Addendum v1.1) are superseded.
**Rule:** Build exactly what is described here. Do not infer, assume, or import conventions from other projects. When in doubt, this document is the answer.

---

## 1. PRODUCT OVERVIEW

### 1.1 Name & Identity
- **Product name:** BudgetFQ
- **FQ stands for:** Financial Quotient
- **Tagline:** "Smart budgeting for real life"
- **Logo treatment:** The wordmark is rendered as `Budget` + `FQ` where `FQ` is styled in the primary accent colour (`#00C27A`). The tagline appears below the logo in small muted text. No icon or symbol — wordmark only.

### 1.2 Purpose
BudgetFQ is a fully client-side personal budget planning web application. It helps individuals manage monthly income by:
- Allocating income across fixed and custom expense categories
- Tracking recurring bills sorted by urgency and due date
- Calculating a Financial Quotient investment readiness score
- Educating users on investment options matched to their profile and available amount
- Simulating financial decisions through a what-if engine
- Forecasting next month's budget automatically
- Capturing monthly snapshots for year-over-year review
- Scanning uploaded invoices with AI to auto-fill bill details

### 1.3 Target User
Any working adult worldwide who receives regular income (salary, freelance, pension, multiple sources) and wants a single clear tool to plan forward — not just track the past. Primary markets: Finland, Nigeria, and the broader international audience who cannot or will not link bank accounts. The app requires nothing except a salary number to be immediately useful.

### 1.4 Core Philosophy
BudgetFQ is built around **deciding what happens next**, not tracking what already happened. Every feature should ask: does this help the user make a better financial decision? If not, it does not belong in this version.

---

## 2. TECH STACK

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18, functional components, hooks only | No class components |
| Styling | Inline JS style objects + CSS variables on `:root` | No Tailwind, no shadcn, no CSS modules |
| State | `useState`, `useEffect`, `useMemo` only | No Redux, no Zustand, no Context API |
| Persistence | `localStorage` — fully client-side | All data survives page refresh and browser close |
| Backend | None | Fully client-side application |
| External API | Anthropic Claude API (`api.anthropic.com/v1/messages`) | Invoice scanning and AI investment explainer only |
| Fonts | Google Fonts via `<link>` tag in `public/index.html` | `Sora` (display/numbers) + `DM Sans` (body/UI) |
| Icons | Tabler Icons via CDN | Class names e.g. `ti ti-home` |
| Build | Create React App (CRA) | Entry: `src/index.js` renders `<App />` into `#root` |

**Add to `public/index.html`:**
```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" rel="stylesheet">
```

Do not introduce any npm dependency not listed above without explicit justification in a code comment.

---

## 3. DESIGN SYSTEM

### 3.1 Colour Palette

Apply all tokens as CSS variables on `:root`. Never hardcode hex values in component code.

```css
:root {
  --bg-base:       #F4F5F7;
  --bg-surface:    #FFFFFF;
  --bg-hover:      #FAFAFA;
  --bg-input:      #F4F5F7;
  --border:        #E8E9EC;
  --border-mid:    #D1D5DB;
  --text-primary:  #111111;
  --text-body:     #374151;
  --text-muted:    #6B7280;
  --text-faint:    #9CA3AF;
  --accent:        #00C27A;
  --accent-light:  #ECFDF5;
  --accent-border: #A7F3D0;
  --accent-text:   #065F46;
  --red:           #EF4444;
  --red-light:     #FEF2F2;
  --red-border:    #FECACA;
  --red-text:      #991B1B;
  --amber:         #F59E0B;
  --amber-light:   #FFFBEB;
  --amber-border:  #FDE68A;
  --amber-text:    #92400E;
  --blue:          #3B82F6;
  --blue-light:    #EFF6FF;
  --purple:        #8B5CF6;
  --purple-light:  #F5F3FF;
  --pink:          #EC4899;
  --pink-light:    #FDF2F8;
  --cyan:          #06B6D4;
  --cyan-light:    #ECFEFF;
}
```

### 3.2 Typography

| Use | Font | Weight | Size | Notes |
|---|---|---|---|---|
| Logo wordmark | Sora | 700 | 20px | letter-spacing: -0.5px |
| Large numbers (income) | Sora | 700 | 32–36px | letter-spacing: -1px |
| Card numbers | Sora | 700 | 22–26px | letter-spacing: -0.5px |
| Projection values | Sora | 700 | 17–18px | color: var(--accent) |
| Section labels | DM Sans | 600 | 11px | uppercase, letter-spacing: 1.2px, color: var(--text-faint) |
| Body / row labels | DM Sans | 500 | 14px | color: var(--text-body) |
| Meta / helper text | DM Sans | 400 | 12px | color: var(--text-muted) |
| Buttons | DM Sans | 600 | 13px | |
| Tab labels | DM Sans | 500–600 | 13px | |

### 3.3 Spacing & Layout

- App max-width: **880px**, centred `margin: 0 auto`
- Main content padding: `24px`
- Card padding: `18px 20px`
- Card border-radius: `12px`
- Row gap: `12–14px`
- Section gap: `10–14px`
- Input border-radius: `8px`
- Button border-radius: `8px`
- Icon chip: `36×36px`, border-radius `10px`

### 3.4 Reusable Component Styles

**Card:** `background: var(--bg-surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px`

**Section label:** `font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 12px; display: block`

**Primary button:** `background: var(--accent); color: #fff; border: none; border-radius: 8px; padding: 9px 16px; font-family: 'DM Sans'; font-size: 13px; font-weight: 600; cursor: pointer`

**Ghost button:** `background: var(--bg-input); border: 1px solid var(--border); border-radius: 8px; padding: 8px 14px; color: var(--text-muted); font-family: 'DM Sans'; font-size: 13px; font-weight: 500; cursor: pointer`

**Icon button:** `background: transparent; border: 1px solid var(--border); border-radius: 7px; width: 30px; height: 30px; color: var(--text-faint); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s`
- Edit hover: `border-color: var(--accent); color: var(--accent)`
- Delete hover: `border-color: var(--red); color: var(--red)`

**Alert banners (all):** `border-radius: 10px; padding: 12px 16px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px`
- Ok/green: `background: var(--accent-light); border: 1px solid var(--accent-border); color: var(--accent-text)`
- Error/red: `background: var(--red-light); border: 1px solid var(--red-border); color: var(--red-text)`
- Warning/amber: `background: var(--amber-light); border: 1px solid var(--amber-border); color: var(--amber-text)`

**Dashed add button:** `background: var(--bg-surface); border: 1.5px dashed var(--border-mid); border-radius: 10px; color: var(--text-faint); padding: 12px 18px; width: 100%; font-family: 'DM Sans'; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.15s`
- Hover: `border-color: var(--accent); color: var(--accent)`

### 3.5 Animation Rules

- Progress bar width: `transition: width 0.4s ease`
- Paid bill cards: `transition: opacity 0.3s ease` → opacity 0.4
- Score ring: `transition: background 0.4s ease`
- Hover states: `transition: all 0.15s`
- Tab switching: instant (no animation)
- No animation libraries

### 3.6 Responsive Behaviour

Use a `useWindowWidth()` hook returning current viewport width.

| Breakpoint | Changes |
|---|---|
| < 600px | Tab bar scrolls horizontally (`scrollbar-width: none`) · Allocation rows stack · Grids → 1 column · Header stacks |
| 600–880px | 2-column grids where applicable |
| > 880px | Full layout as specified |

---

## 4. DATA MODEL

### 4.1 Primary Store — `"budgetfq_v1"` in localStorage

```json
{
  "incomeSources": [
    { "id": "uuid", "label": "Primary salary", "amount": 3000, "currency": "€" }
  ],
  "primaryCurrency": "€",
  "allocations": {
    "savings": 20, "loans": 10, "rent": 30,
    "food": 12, "transport": 8, "leisure": 8, "bills": 7
  },
  "bills": [
    { "id": "uuid", "name": "Electricity", "amount": 80, "dueDay": 5,
      "category": "bills", "paid": false, "recurring": true }
  ],
  "customCategories": [
    { "key": "uuid_key", "label": "Childcare", "color": "#fb923c", "defaultPct": 5 }
  ],
  "investProfile": null,
  "salaryDay": 1,
  "lastOpenedMonth": "2026-05"
}
```

### 4.2 History Store — `"budgetfq_history_v1"` in localStorage

```json
[
  {
    "id": "2026-05", "label": "May 2026",
    "savedAt": "2026-05-01T00:04:22.000Z", "trigger": "auto",
    "income": 3000, "currency": "€",
    "allocations": { "savings": 20, "loans": 10, "rent": 30, "food": 12, "transport": 8, "leisure": 8, "bills": 7 },
    "billsTotal": 190, "investablePct": 5, "investableAmount": 150,
    "billCount": 4, "paidCount": 1
  }
]
```

### 4.3 Data Rules

- Load both stores on mount. If absent, load default state (Section 5).
- Write to localStorage on every state change via `useEffect`.
- All localStorage reads and writes wrapped in `try/catch`.
- IDs generated with `crypto.randomUUID()`.
- `lastOpenedMonth` updated on every mount to current `YYYY-MM`.
- `bill.paid` resets to `false` when current month ≠ `lastOpenedMonth` — but only after auto-snapshot is written.
- If localStorage unavailable: amber banner `⚠ Data will not be saved in this session.` All features remain functional.

---

## 5. DEFAULT STATE

```js
incomeSources: [{ id: uuid(), label: "Primary salary", amount: 0, currency: "€" }],
primaryCurrency: "€",
allocations: { savings: 20, loans: 10, rent: 30, food: 12, transport: 8, leisure: 8, bills: 7 },
bills: [
  { id: uuid(), name: "Electricity", amount: 80, dueDay: 5, category: "bills", paid: false, recurring: true },
  { id: uuid(), name: "Internet", amount: 45, dueDay: 12, category: "bills", paid: false, recurring: true },
  { id: uuid(), name: "Phone", amount: 30, dueDay: 20, category: "bills", paid: false, recurring: true },
  { id: uuid(), name: "Gym", amount: 35, dueDay: 1, category: "leisure", paid: false, recurring: true }
],
customCategories: [],
investProfile: null,
salaryDay: 1,
lastOpenedMonth: currentYYYYMM
```

---

## 6. CORE CATEGORIES (FIXED)

Cannot be deleted or renamed.

| Key | Label | Icon class | Colour | Bg tint |
|---|---|---|---|---|
| `savings` | Savings | `ti-piggy-bank` | `#00C27A` | `#ECFDF5` |
| `loans` | Loans / Debt | `ti-receipt` | `#EF4444` | `#FEF2F2` |
| `rent` | Rent / Mortgage | `ti-home` | `#3B82F6` | `#EFF6FF` |
| `food` | Food & Groceries | `ti-shopping-cart` | `#F59E0B` | `#FFFBEB` |
| `transport` | Fuel / Transport | `ti-car` | `#8B5CF6` | `#F5F3FF` |
| `leisure` | Leisure | `ti-device-gamepad-2` | `#EC4899` | `#FDF2F8` |
| `bills` | Recurring Bills | `ti-bolt` | `#06B6D4` | `#ECFEFF` |

---

## 7. NAVIGATION

Seven tabs in this order:

1. Overview
2. Priority Bills
3. Invest Score
4. What-If
5. Forecast
6. History
7. 50/30/20

Tab bar: `background: var(--bg-surface); border-bottom: 1px solid var(--border); padding: 0 24px; display: flex; overflow-x: auto; scrollbar-width: none`

Tab: `padding: 14px 16px; font-size: 13px; font-weight: 500; color: var(--text-faint); border: none; background: transparent; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; transition: color 0.15s`

Active: `color: var(--accent); border-bottom-color: var(--accent); font-weight: 600`

No routing library. `useState('overview')` in `App.jsx`.

---

## 8. FEATURES

### 8.1 HEADER

Always visible. Never scrolls.

**Logo:** `Budget` in `var(--text-primary)` + `FQ` in `var(--accent)`. Sora 700 20px. Tagline below: `"Smart budgeting for real life"` — DM Sans 400 11px `var(--text-faint)`.

**Currency selector:** Options `€ £ $ ₦ kr`. Changing `primaryCurrency` reformats all amounts instantly.

**Export button:** `↓ Export CSV`. Ghost button style. See Section 8.11.

Header: `background: var(--bg-surface); border-bottom: 1px solid var(--border); padding: 15px 24px; display: flex; align-items: center; justify-content: space-between`

---

### 8.2 INCOME INPUT BAR

Always visible below header, above tab bar. Never scrolls.

**Total income:** Sum of all income sources converted to primary currency. Displayed Sora 700 36px. Currency symbol in `var(--text-faint)`. Input underlined with `border-bottom: 2px solid var(--accent)`.

**Meta row:** Daily (`÷30`) · Weekly (`÷4.33`) · Unallocated (`100 - totalPct`%). Unallocated: `var(--accent)` if ≥ 0, `var(--red)` if < 0. All show `—` when income = 0.

**Multiple income sources** (collapsible section `+ Manage income sources`):
- Each row: Label (text, max 30 chars) + Amount (number) + Currency selector + Delete button
- Per-source currency converted to primary using static rates (see 8.2.1)
- Minimum 1 source at all times — last source cannot be deleted
- Dashed add button: `+ Add income source`

**8.2.1 Static Exchange Rates:**
```js
const EXCHANGE_RATES = { '€': 1, '£': 0.86, '$': 1.08, '₦': 0.00067, 'kr': 0.088 };
function toPrimary(amount, from, primary) {
  return (amount * EXCHANGE_RATES[from]) / EXCHANGE_RATES[primary];
}
```
Disclaimer below sources: `ℹ Exchange rates are approximate. Verify with your bank for exact conversions.`

---

### 8.3 OVERVIEW TAB

**Budget health banner** (live, top of tab):
- Total > 100%: red — `⚠ Over-allocated by X.X%. Reduce some categories.`
- Total = 100%: green — `✓ Fully allocated — every euro has a job.`
- Total < 100%: green — `✦ X.X% unallocated — consider moving it to savings or investments.`

**Summary cards** (3-column grid):
1. Total income — `var(--text-primary)`
2. Committed (sum of allocated amounts) — `var(--red)`
3. Free to invest (unallocated amount) — `var(--accent)`

**Allocation list** (white card, `border-radius: 14px; overflow: hidden`):

Each row: icon chip (36×36, tinted bg) · name (130px, 500 weight) · progress bar (flex:1, 5px height) · % input (54px, step 0.5) · `%` symbol · amount (82px, Sora 700, right-aligned)

Bar fill: `Math.min(pct, 100)%`, `transition: width 0.4s ease`, colour = category colour.

**Custom categories:**
- Appear after core categories
- Rotating accent colours: `["#fb923c","#e879f9","#22d3ee","#84cc16"]`
- Icon class: `ti-star`
- Have a `×` delete button. Core categories do not.
- Delete: remove from `customCategories` and `allocations`

**Add custom category** (dashed button below list):
- Inline form: Name + Percentage + Add/Cancel
- Validation: name required, max 30 chars, no duplicates; pct ≥ 0

---

### 8.4 PRIORITY BILLS TAB

**Top to bottom:** Header + legend · Conflict banner · Invoice upload zone · Bill list · Add manually button

**Urgency legend:** `● ≤ 3 days` (red) · `● 4–7 days` (amber) · `● 8+ days` (green)

**Bill conflict detector:** If 2+ bills have `getDaysUntil()` within 3 days of each other, show amber banner per cluster: `⚠ Bill cluster: [A] and [B] both due around day X. Prepare ahead.`

**Sort order:** Unpaid ascending by days · paid at bottom ascending by days

**Bill card:** `[urgency bar 3px] [icon chip 34×34] [name + meta] [amount Sora 700 16px] [days 12px bold] [edit btn] [delete btn]`

- Name: 14px weight 600
- Meta: `[category] · Due day [N]` 12px `var(--text-faint)`
- Due today: show `Due today!` in red
- Paid: opacity 0.4, name line-through, meta shows `· ✓ Paid`

**Mark as paid:** Toggle `paid` field. Fade card. Move to bottom.

**Edit bill (inline):** Edit icon opens panel below card with all fields editable + Save/Cancel. Only one open at a time.

**Delete bill (inline):** Delete icon → `Remove this bill? [Yes, remove] [Cancel]`. Never `window.confirm()`.

**Recurring bills:** `recurring: boolean` field. In add/edit form: `Recurring monthly` toggle (default: true). Recurring bills re-appear each month with `paid: false`. Non-recurring bills removed after being paid for the month.

**Empty state:** SVG + `No bills yet. Add one and we'll keep you ahead of due dates.`

**Invoice upload zone:** See Section 8.9.

**Add bill manually:** Dashed button → inline form: Name + Amount + Due Day (1–28) + Category + Recurring toggle + Add/Cancel.

---

### 8.5 INVEST SCORE TAB

#### 8.5.1 Score Hero

**Calculation:**
```js
const totalAllocated = sum(all allocation values);
const unallocated = Math.max(0, 100 - totalAllocated);
const investablePct = unallocated;
const investableAmount = (totalIncome * investablePct) / 100;
const score = Math.min(100, Math.max(0, Math.round(investablePct + (allocations.savings||0) - 5)));
```

**Score ring:** 88px, `conic-gradient(var(--accent) ${score*3.6}deg, var(--border) 0deg)`. Inner circle 66px white. Score number Sora 700 22px. `/100` DM Sans 11px muted. `transition: background 0.4s ease`.

**Beside ring:**
- Amount: Sora 700 30px + `/month` DM Sans 400 16px muted
- Pct: `X.X% of income safely investable` 13px muted
- Status badge: Score ≥ 70 → accent `✓ Strong position` · 30–69 → amber `~ Moderate` · < 30 → red `⚠ Tight budget`

**Status explanation card** (amber/green/red banner below hero matching score range)

**Projection table** (shown when income > 0 AND investableAmount > 0):
- Label: `PROJECTED GROWTH · 7% AVG/YR COMPOUNDED`
- 4 cards: 1 Year, 5 Years, 10 Years, 20 Years
- `FV = monthly × ((Math.pow(1 + 0.07/12, n) - 1) / (0.07/12))` where n = years × 12
- Values in `var(--accent)` Sora 700 17px
- Hidden when investableAmount = 0; show `Add more income or reduce allocations to unlock projections.`

**Improvement tips card:** 4 static tips (always visible):
1. Increasing savings allocation directly raises this score
2. Paying off loans has the highest per-percentage impact
3. A 5% emergency buffer is already factored in
4. Unallocated income counts toward your investable pool

#### 8.5.2 Investment Profile

**Disclaimer on all pathway cards:** `ℹ This is educational information, not financial advice. Consult a qualified adviser before investing.`

**Profile quiz** (shown when `investProfile === null`):
5 questions answered via button selections:

| # | Question | Options |
|---|---|---|
| 1 | How long can you leave this money untouched? | Under 1 year / 1–3 years / 3–10 years / 10+ years |
| 2 | If your investment dropped 20% temporarily, you would… | Sell immediately / Feel uncomfortable but hold / Feel completely fine |
| 3 | Your primary goal is… | Emergency cushion / Grow wealth / Retirement / Specific purchase |
| 4 | Do you have 3 months of expenses already saved? | Yes / Not yet |
| 5 | Have you invested before? | Yes / No — I'm just starting |

`Complete profile` button appears when all 5 answered. `Retake quiz` link resets `investProfile` to null.

**Profile assignment:**
```js
function assignProfile(answers) {
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
```

**Emergency fund gate** (when q4 = 'Not yet', shown before pathway cards regardless of profile):
```
🛡 Build your emergency fund first
Before investing, financial experts recommend saving 3 months of expenses.
At your current savings rate of [currency][savingsAmt]/month, you'll reach
[currency][3-month target] in approximately [N] months.
This protects you from selling investments at the wrong time.
```
3-month target = `(totalIncome * (100 - allocations.savings) / 100) * 3`
Months = `ceil(3-month target / savingsAmt)`

**Amount gate** (if investableAmount < 20, note above cards):
`Your current investable amount is [currency][amt]/month. Many platforms accept as little as €10. Start small and increase as your budget allows.`

**Pathway cards by profile:**

Cautious:
1. High-Yield Savings — `ti-building-bank` — Risk 1/5 — 2–4%/yr — Any — Any — `https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts`
2. Government Bonds — `ti-certificate` — Risk 2/5 — 3–5%/yr — ~€100 — 1–5 years — `https://www.investopedia.com/terms/g/government-bond.asp`
3. Pension Top-Up — `ti-shield-check` — Risk 1/5 — Varies + tax benefit — Any — Long-term — `https://www.investopedia.com/terms/p/pensionplan.asp`

Balanced:
1. Global Index Fund — `ti-world` — Risk 3/5 — 6–10%/yr — ~€50/month — 5+ years — `https://www.investopedia.com/terms/i/indexfund.asp`
2. ETF — `ti-chart-bar` — Risk 3/5 — 5–9%/yr — ~€50 — 3–10 years — `https://www.investopedia.com/terms/e/etf.asp`
3. Pension Top-Up — same as Cautious
4. High-Yield Savings — same as Cautious

Growth:
1. Global Index Fund — same as Balanced
2. S&P 500 Index Fund — `ti-chart-line` — Risk 3/5 — ~10%/yr historical — ~€50/month — 10+ years — `https://www.investopedia.com/terms/s/sp500.asp`
3. REITs — `ti-building` — Risk 4/5 — 4–8%/yr — ~€100 — 5+ years — `https://www.investopedia.com/terms/r/reit.asp`
4. Individual Stocks — `ti-trending-up` — Risk 5/5 — Varies — ~€50 — 5+ years — `https://www.investopedia.com/terms/s/stock.asp`

Each card: icon · title · risk dots (●●○○○) · 2–3 sentence description · return range · minimum · horizon · `Learn more →` link (new tab) · disclaimer

#### 8.5.3 AI Investment Explainer

Card label: `ASK THE AI ADVISER`

UI: text input (placeholder: `"Ask anything — e.g. Should I pay off my loan or start investing?"`) + `Ask` primary button + response area below.

Loading: 3 pulsing dots. Single turn only — previous Q&A shown above new input.

**API call:**
```javascript
async function askAIAdviser(question, ctx) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: `You are a financial literacy assistant for BudgetFQ.
You help users understand personal finance concepts. You do NOT give specific investment recommendations or regulated financial advice.
Explain concepts clearly using the user's actual numbers. Always suggest consulting a qualified financial adviser for personalised decisions.
Keep answers under 200 words. Plain language, no jargon.

User's budget:
- Monthly income: ${ctx.currency}${ctx.totalIncome}
- Investable: ${ctx.currency}${ctx.investableAmount}/month
- Profile: ${ctx.profile || 'Not assessed'}
- Savings: ${ctx.savingsPct}%
- Loans: ${ctx.loansPct}%
- Emergency fund: ${ctx.hasEmergencyFund ? 'Yes' : 'Not yet'}`,
      messages: [{ role: 'user', content: question }]
    })
  });
  const data = await res.json();
  return data.content.filter(b => b.type === 'text').map(b => b.text).join('');
}
```

Errors: network → `⚠ Could not reach the AI. Check your connection.` · API error → `⚠ The AI adviser is temporarily unavailable.` · Empty → `⚠ No response received. Try rephrasing.`

Disclaimer below card: `ℹ BudgetFQ's AI adviser provides general financial education only. It is not a licensed financial adviser. Always consult a qualified professional before making investment decisions.`

---

### 8.6 WHAT-IF SIMULATOR TAB

**Controls card:** Label `SIMULATE A SPENDING CHANGE`
- Dropdown: category to reduce (all core categories)
- Number input: amount per month in primary currency

**Impact cards (3-column):** Monthly saving · 1-year (×12) · 5-year (×60). Live update.

**Tip banner** (amber, shown when amount > 0): `💡 Cutting [currency][amount]/month from [Category] saves you [currency][5yr] over 5 years — without investing a single cent.`

**Stacked what-ifs:**
- `+ Add another reduction` button — up to 3 rows
- Each row has `×` remove button
- Combined total row when > 1 row: `Combined monthly saving: [total]`

---

### 8.7 FORECAST TAB

**Salary day countdown (top):**
- User sets `salaryDay` (1–28), stored in state
- Display: `[N] days until payday` — Sora 700 large
- Below: `Daily spending limit: [currency][amount]` = unallocated amount ÷ daysUntilPayday
- If daysUntilPayday = 0: `Payday! Remember to allocate your income.`

**Next month projection card:**
- Label: `NEXT MONTH FORECAST`
- Same breakdown as Overview but read-only
- `Recurring bills this month` section: all `recurring: true` bills, sorted by dueDay
- Total committed + available for unplanned spending

**Bill calendar strip:**
- Horizontal flex row of 28 day cells (simple divs, no library)
- Days with a bill due: coloured dot (category colour)
- Hovering a dot: tooltip `[Bill name] — [currency][amount]`

**Forecast note (static):** `This forecast is based on your current income and allocation settings. Actual spending may vary.`

---

### 8.8 HISTORY TAB

**Header:** `MONTHLY SNAPSHOTS` label + `Auto-saved on 1st of each month · manual saves anytime` · `📷 Save this month now` ghost button (right)

**Toast** (on manual save): `✓ Snapshot saved for [Month Year].` — accent-light, 3s auto-dismiss, inline below header.

**Year overview card** (shown when history.length ≥ 3):
- Label: `YEAR AT A GLANCE`
- Last 12 months as CSS-only horizontal bar chart
- Bar height proportional to investableAmount vs max in set
- Bar colour: `var(--accent)`
- Month labels below bars (abbreviated)
- Hover: `[Month]: [currency][investableAmount] investable`

**Snapshot cards** (descending date, max 24 displayed):
- Month label Sora 700 14px + trigger badge (`Auto-snapshot` muted / `Manual save` accent-tinted)
- `Current month` accent badge if id = current YYYY-MM
- 3-stat grid: Income · Bills total · Investable (accent if > 0)
- 4th stat: `[paidCount] / [billCount] bills paid`

**Empty state:** SVG (flat document + clock, monochrome `#E8E9EC` / `#D1D5DB`) + `No history yet` + `Snapshots appear here at the start of each new month. You can also save one manually anytime.`

**Auto-snapshot logic (on mount):**
```javascript
function checkAutoSnapshot(state, history) {
  const now = new Date();
  const currentId = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const alreadySaved = history.some(s => s.id === currentId && s.trigger === 'auto');
  const lastSnap = history[0];
  const isNewMonth = lastSnap && lastSnap.id !== currentId;
  if (!alreadySaved && isNewMonth) return [buildSnapshot(state, 'auto'), ...history];
  return history;
}
```
After writing auto-snapshot: reset all `bill.paid = false`.

**buildSnapshot:**
```javascript
function buildSnapshot(state, trigger) {
  const now = new Date();
  const id = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const billsTotal = state.bills.reduce((s, b) => s + b.amount, 0);
  const totalAllocated = Object.values(state.allocations).reduce((s, v) => s + (parseFloat(v)||0), 0);
  const investablePct = Math.max(0, 100 - totalAllocated);
  return {
    id, label: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
    savedAt: now.toISOString(), trigger,
    income: state.totalIncome, currency: state.primaryCurrency,
    allocations: { ...state.allocations },
    billsTotal: Math.round(billsTotal * 100) / 100,
    investablePct: Math.round(investablePct * 10) / 10,
    investableAmount: Math.round((state.totalIncome * investablePct / 100) * 100) / 100,
    billCount: state.bills.length,
    paidCount: state.bills.filter(b => b.paid).length,
  };
}
```

**Manual snapshot:** Replace existing manual for same month (keep auto). Show toast.

**Storage:** `"budgetfq_history_v1"`, all ops in try/catch. If unavailable: disable save button, show `⚠ History cannot be saved in this session.` in History tab only.

**Snapshots are read-only.** No restore or delete in this version.

---

### 8.9 INVOICE UPLOAD (Bills Tab — sub-feature)

**Upload zone:**
```
border: 1.5px dashed var(--border-mid); border-radius: 12px;
padding: 20px; text-align: center; cursor: pointer;
background: var(--bg-surface); transition: all 0.2s;
```
Hover/drag-over: `border-color: var(--accent); background: var(--accent-light)`

Content: `ti-file-upload` icon 26px · `Upload invoice to auto-fill bill details` · `Drag & drop or click · PDF, JPG, PNG · AI-powered`

Hidden `<input type="file" accept=".pdf,.jpg,.jpeg,.png">` triggered on click. Drag-and-drop via `ondrop`.

**Scan state:** `'idle'` | `'scanning'` | `'review'` | `'error'`

Transitions: idle→scanning on file · scanning→review on success · scanning→error on failure · review→idle on save/discard · error→idle after 5s or on click

**File validation:** > 10MB → `⚠ File too large. Maximum size is 10MB.` · Wrong type → `⚠ Unsupported file type. Upload a PDF, JPG, or PNG.`

**Base64:**
```javascript
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('Read failed'));
    reader.readAsDataURL(file);
  });
}
```

**API call:**
```javascript
async function scanInvoice(file) {
  const base64 = await fileToBase64(file);
  const mediaType = {'application/pdf':'application/pdf','image/jpeg':'image/jpeg','image/png':'image/png'}[file.type];
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 1000,
      messages: [{ role: 'user', content: [
        { type: mediaType === 'application/pdf' ? 'document' : 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 } },
        { type: 'text', text: `Extract from this invoice: vendor_name (shortest recognisable name), amount_due (number only), due_day (day of month 1-28 or null).
Respond ONLY with valid JSON, no markdown: {"vendor_name":"...","amount_due":0.00,"due_day":0}` }
      ]}]
    })
  });
  return res.json();
}
```

**Parse:**
```javascript
function parseInvoiceResponse(data) {
  try {
    const text = data.content.filter(b => b.type==='text').map(b => b.text).join('');
    const parsed = JSON.parse(text.replace(/```json|```/g,'').trim());
    return { vendorName: parsed.vendor_name??'', amountDue: parsed.amount_due??'', dueDay: parsed.due_day??'' };
  } catch { return null; }
}
```

**Pre-fill review form** (state = 'review'):
- Green-tinted card: `background: var(--accent-light); border: 1px solid var(--accent-border)`
- Header: `✦ AI extracted — review and confirm` + `[AI]` badge
- 3 editable inputs: Name / Amount / Due Day
- Category dropdown (default: Recurring Bills)
- `✓ Save to bills` + `Discard`
- Null fields: blank (never "null"), focus first blank field
- On save: same validation as manual add. Success: `✓ [Name] added.` for 2.5s then restore zone.

**Scanning animation:** muted label + 3 pulsing dots (animation-delay 0s/0.2s/0.4s) + `Extracting vendor · amount · due date`

**Errors (all inline, never `alert()`):**

| Situation | Message |
|---|---|
| File > 10MB | `⚠ File too large. Maximum size is 10MB.` |
| Wrong type | `⚠ Unsupported file type. Upload a PDF, JPG, or PNG.` |
| Network failure | `⚠ Could not reach the scanner. Check your connection.` |
| API non-200 | `⚠ The AI scanner returned an error. Try again or enter manually.` |
| Parse failure | `⚠ Could not read this invoice. Try again or enter manually.` |
| All fields null | Show form empty + `ℹ No details found. Please fill in manually.` |

**Rules:** Never save without confirmation. Never store base64 in state/localStorage. Never display raw API response.

---

### 8.10 50/30/20 RATIO TAB

**Calculation (core categories only, custom excluded):**
```
needs   = rent + food + bills + transport + loans
wants   = leisure
savings = savings
```

**Three rows** (white cards):

| Label | Description | Ideal |
|---|---|---|
| Needs | Rent, food, bills, transport, loans | 50% |
| Wants | Leisure & non-essentials | 30% |
| Savings | Savings & investments | 20% |

Each row:
- Header: name (weight 600) + description (muted inline) + `X.X% / ideal Y%` right-aligned
- Progress bar (6px, bg `#F3F4F6`): fill = category colour, width = `Math.min(actual,100)%`
- Vertical marker at ideal%: `2px wide, 12px tall, bg var(--border-mid)`
- Status below bar:
  - Actual > ideal + 5: `▲ X.X% over target` in red
  - Actual < ideal - 5: `▼ X.X% under target` in amber
  - Otherwise: `On track` in accent

**Footer note:** `The 50/30/20 rule is a guide, not a law. In high cost-of-living regions, needs often exceed 50%. Adjust to match your own reality.`

---

### 8.11 EXPORT & IMPORT

**CSV export** (header button `↓ Export CSV`):
Filename: `budgetfq-[YYYY-MM].csv`
```
BudgetFQ Report — [Month Year]
"Smart budgeting for real life"

INCOME
Source,Amount,Currency
Primary salary,3000,€

ALLOCATIONS
Category,Percentage,Monthly Amount
Savings,20%,€600
...

BILLS
Name,Amount,Due Day,Category,Recurring,Paid
Electricity,€80,5,Recurring Bills,Yes,No
...
```

**JSON export** (`↓ Export data (JSON)`):
- Downloads full `budgetfq_v1` state as `.json`
- Filename: `budgetfq-backup-[YYYY-MM-DD].json`

**JSON import** (`↑ Import data (JSON)`):
- File picker: `.json` only
- Parse and validate: must contain `incomeSources`, `allocations`, `bills`
- Inline confirmation before overwrite: `This will replace all your current data. [Proceed] [Cancel]`
- On valid + confirmed: replace state, save to localStorage, reload app
- On invalid: `⚠ Invalid backup file. Please use a file exported from BudgetFQ.` Current data untouched.
- Never `window.confirm()`

---

## 9. COMPONENT STRUCTURE

```
src/
  index.js
  App.jsx                   — All state, localStorage sync, tab routing, income calc
  constants.js              — CATEGORIES, DEFAULT_STATE, EXCHANGE_RATES, INVEST_CARDS
  utils.js                  — All utility functions (Section 10)
  hooks/
    useWindowWidth.js
  components/
    Header.jsx
    IncomeBar.jsx
    TabBar.jsx
    Overview.jsx
    AllocationRow.jsx
    PriorityBills.jsx
    BillCard.jsx
    InvoiceUpload.jsx
    InvestScore.jsx
    ProfileQuiz.jsx
    PathwayCard.jsx
    AIExplainer.jsx
    WhatIfSimulator.jsx
    ForecastTab.jsx
    HistoryTab.jsx
    SnapshotCard.jsx
    RatioChecker.jsx
    AlertBanner.jsx          — variant prop: 'ok' | 'error' | 'warning'
    ConfirmInline.jsx
    EmptyState.jsx
    Toast.jsx                — 3s auto-dismiss inline notification
```

Lift all state to `App.jsx`. No prop drilling beyond 2 levels.

---

## 10. UTILITY FUNCTIONS (`src/utils.js`)

### `getDaysUntil(dueDay)`
```javascript
function getDaysUntil(dueDay) {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(today.getFullYear(), today.getMonth(), dueDay);
  if (target <= today) target.setMonth(target.getMonth() + 1);
  return Math.ceil((target - today) / 86400000);
}
```

### `formatCurrency(amount, currency, income = 1)`
Returns `currency + Math.round(amount).toLocaleString()`. Returns `'—'` if amount === 0 && income === 0.

### `generateCSV(state)` — per Section 8.11

### `detectBillClusters(bills)` — groups by getDaysUntil within 3 days. Returns `[{ bills, nearestDay }]`.

### `toPrimary(amount, from, primary)` — `(amount * EXCHANGE_RATES[from]) / EXCHANGE_RATES[primary]`

### `calcTotalIncome(incomeSources, primaryCurrency)` — sum of toPrimary for all sources

### `calcInvestables(allocations, totalIncome)` — returns `{ totalAllocated, unallocated, investablePct, investableAmount, score }`

### `buildSnapshot(state, trigger)` — per Section 8.8

### `assignProfile(answers)` — per Section 8.5.2

### `currentMonthId()` — returns `YYYY-MM` string for today

### `fileToBase64(file)` — per Section 8.9

### `parseInvoiceResponse(data)` — per Section 8.9

---

## 11. VALIDATION RULES

| Field | Rule | Error |
|---|---|---|
| Income source amount | ≥ 0 | `Amount must be 0 or greater` |
| Income source label | Non-empty, max 30 chars | `Please enter a label` |
| Allocation % | ≥ 0 per field | `Must be 0 or greater` |
| Bill amount | > 0 | `Amount must be greater than 0` |
| Bill due day | Integer 1–28 | `Enter a day between 1 and 28` |
| Bill name | Non-empty, max 40 chars | `Please enter a bill name` |
| Custom category name | Non-empty, max 30 chars, no duplicates | `Name required` / `Name already exists` |
| Custom category % | ≥ 0 | `Must be 0 or greater` |
| What-if reduction | ≥ 0 | `Must be 0 or greater` |
| Salary day | Integer 1–28 | `Enter a day between 1 and 28` |
| JSON import | Must have `incomeSources`, `allocations`, `bills` | `⚠ Invalid backup file.` |

All errors: inline red text (`var(--red)`, 12px) below input. Never `alert()` or `window.confirm()`.

---

## 12. ACCESSIBILITY

- All interactive elements keyboard-focusable
- Inputs have `<label>` or `aria-label`
- Icon buttons: `aria-label` describing action + `aria-hidden="true"` on `<i>` tags
- Colour never the only status indicator — always paired with text/icon
- Focus ring: `outline: 2px solid var(--accent); outline-offset: 2px`
- Status banners: `role="alert"`
- App fully usable without a mouse

---

## 13. ERROR STATES & EDGE CASES

| Situation | Behaviour |
|---|---|
| Total income = 0 | All amounts show `—`. Score = 0. Projections hidden. |
| All allocations = 0 | Green banner: `Start by entering percentages for each category.` |
| localStorage unavailable | Amber banner top of page. All features still functional. |
| Bill due today | Show `Due today!` in red |
| Custom category deleted | Remove from allocations. Recalculate total. |
| No bills | SVG empty state |
| Investable = 0 | Hide projections. Show prompt. |
| investProfile = null | Show quiz on Invest Score tab |
| History empty | SVG empty state |
| AI explainer down | Inline error banner. Input stays active. |
| Invoice scan fails | Error banner. Restore zone. Suggest manual entry. |
| JSON import invalid | Inline error. Data untouched. |
| Only 1 income source | Delete button hidden on that row |
| daysUntilPayday = 0 | Show `Payday! Remember to allocate your income.` |

---

## 14. WHAT NOT TO BUILD

- User accounts, authentication, sessions
- Server-side logic, databases, backend of any kind
- Push notifications or browser alerts
- Bank account linking or Plaid integration
- Live exchange rates (use hardcoded per Section 8.2.1)
- Chart or graph libraries (CSS-only bars and rings)
- Transaction logging or per-transaction tracking
- Split transactions
- Mobile app wrapper (web only)
- Dark mode (light mode only)
- Snapshot restore or delete
- Third-party analytics or tracking scripts

---

## 15. DEFINITION OF DONE

**Core:**
- [ ] All 7 tabs render and navigate correctly
- [ ] Income bar always visible above tabs
- [ ] Total income = sum of all sources converted to primary currency
- [ ] Multiple income sources add/delete (min 1)
- [ ] Currency change updates all amounts instantly
- [ ] Allocation percentages persist in localStorage
- [ ] Budget health banner live
- [ ] Summary cards live

**Bills:**
- [ ] Sort: unpaid by days, paid at bottom
- [ ] Urgency colours correct
- [ ] Conflict detector fires correctly
- [ ] Edit panel opens/saves inline
- [ ] Delete requires inline confirmation
- [ ] Mark-as-paid persists and fades
- [ ] Paid flags reset on new month after auto-snapshot
- [ ] Recurring bills re-appear each month
- [ ] Empty state renders

**Invoice upload:**
- [ ] Accepts PDF/JPG/PNG, rejects others
- [ ] Rejects files > 10MB
- [ ] Scanning animation during API call
- [ ] Pre-fill form populates from response
- [ ] Null fields blank (not "null")
- [ ] No bill saved without confirmation
- [ ] All 6 error cases show correct messages

**Invest Score:**
- [ ] Score ring updates live
- [ ] Status badge and banner match range
- [ ] Projection table shows/hides correctly
- [ ] Improvement tips always visible
- [ ] Profile quiz completes and assigns profile
- [ ] Emergency fund gate shows when q4 = 'Not yet'
- [ ] Pathway cards match profile
- [ ] Retake quiz resets to null
- [ ] AI explainer sends question with budget context
- [ ] AI response displays
- [ ] AI error states handled
- [ ] Disclaimer visible on all pathway cards

**What-If:**
- [ ] Single row calculates monthly/1yr/5yr
- [ ] Up to 3 stacked rows work
- [ ] Combined total appears when > 1 row
- [ ] Tip banner shows when amount > 0

**Forecast:**
- [ ] Salary day input persists
- [ ] Countdown correct
- [ ] Daily spend limit = unallocated ÷ days
- [ ] Bill calendar strip shows correct days
- [ ] Recurring bills list renders

**History:**
- [ ] Auto-snapshot fires on first open of new month
- [ ] Auto-snapshot does not fire twice
- [ ] Manual snapshot saves with toast
- [ ] Manual snapshot replaces previous manual for same month
- [ ] Descending date order
- [ ] Year overview shows when ≥ 3 months
- [ ] Max 24 shown
- [ ] Empty state renders
- [ ] History-unavailable banner in History tab only

**50/30/20:**
- [ ] Needs/wants/savings calculated correctly
- [ ] Bars and markers render
- [ ] Status text correct

**Export/Import:**
- [ ] CSV downloads with correct filename and structure
- [ ] JSON export downloads full state
- [ ] JSON import validates before replacing
- [ ] Invalid import shows error, data untouched
- [ ] Import requires inline confirmation

**Technical:**
- [ ] All localStorage ops in try/catch
- [ ] Usable 320px–1440px
- [ ] No console errors
- [ ] All icon buttons have aria-label
- [ ] Keyboard navigable
- [ ] Google Fonts and Tabler Icons load from CDN

---

*End of BudgetFQ PRD v2.0.*
*This document supersedes all previous versions.*
*Build exactly what is described here. If something is not in this document, do not build it.*
