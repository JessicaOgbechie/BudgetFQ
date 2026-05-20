# BudgetFQ — Smart budgeting for real life

**FQ = Financial Quotient**

BudgetFQ is a fully client-side personal budget planning web application. It helps you manage your monthly income, track bills by priority, understand how much you can safely invest, and plan ahead — without linking a bank account or creating an account.

---

## What it does

| Feature | Description |
|---|---|
| **Income allocation** | Distribute your salary across 7 fixed categories + unlimited custom ones |
| **Priority bills** | Bills sorted by urgency with colour-coded due dates and conflict detection |
| **Invoice upload** | Upload a PDF or photo of a bill — AI extracts the details automatically |
| **Invest Score** | A 0–100 Financial Quotient score showing how much you can safely invest |
| **Investment profile** | 5-question quiz that matches investment options to your situation |
| **AI adviser** | Ask plain-English questions about your money — answered with your real numbers |
| **What-If simulator** | See how cutting spending in one category affects your savings over 5 years |
| **Forecast** | Salary countdown, daily spend limit, and next-month bill calendar |
| **History** | Monthly snapshots saved automatically, with a year-overview chart |
| **50/30/20 checker** | Compare your allocations against the classic budgeting rule |
| **Multi-currency** | Support for €, £, $, ₦, kr — with multiple income sources |
| **Export** | Download your budget as CSV or full JSON backup |
| **Import** | Restore from a JSON backup on any device |

---

## Why BudgetFQ is different

Most budgeting apps track what already happened. BudgetFQ helps you decide what happens next.

- **No bank linking required** — works with just your salary number
- **No account needed** — fully private, everything stays in your browser
- **Built for the international user** — designed for Finland, Nigeria, and everyone the big apps ignore
- **Investment education built in** — not just tracking, but coaching you toward your first investment
- **AI that knows your numbers** — the AI adviser has your actual budget context, not generic advice

---

## Getting started

### Prerequisites

- Node.js 16 or higher
- npm 8 or higher

### Install and run

```bash
git clone https://github.com/JessicaOgbechie/BudgetFQ.git
cd BudgetFQ
npm install
npm start
```

The app opens at `http://localhost:3000`.

### Build for production

```bash
npm run build
```

The `build/` folder is ready to deploy to any static host (Netlify, Vercel, GitHub Pages).

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Create React App) |
| Styling | Inline JS styles + CSS variables — no CSS framework |
| State | React useState and useMemo — no Redux |
| Persistence | localStorage — fully client-side, no backend |
| AI features | Anthropic Claude API (claude-sonnet-4-20250514) |
| Fonts | Sora + DM Sans (Google Fonts CDN) |
| Icons | Tabler Icons (CDN) |

---

## Project structure

```
src/
├── App.js                    Main app — state, routing, localStorage sync
├── constants.js              Categories, default state, exchange rates, investment cards
├── utils.js                  Utility functions (calculations, formatting, CSV generation)
├── index.css                 CSS variables (design tokens)
├── hooks/
│   └── useWindowWidth.js     Responsive breakpoint hook
└── components/
    ├── Header.jsx            Logo, currency selector, export buttons
    ├── IncomeBar.jsx         Income input, multi-source manager
    ├── TabBar.jsx            Seven-tab navigation
    ├── Overview.jsx          Allocation sliders, summary cards
    ├── PriorityBills.jsx     Bill list, edit/delete, conflict detector
    ├── InvoiceUpload.jsx     AI-powered invoice scanner
    ├── InvestScore.jsx       FQ score, profile quiz, pathway cards, AI explainer
    ├── WhatIfSimulator.jsx   Spending reduction simulator
    ├── ForecastTab.jsx       Salary countdown, bill calendar, next-month projection
    ├── HistoryTab.jsx        Monthly snapshots, year overview chart
    ├── RatioChecker.jsx      50/30/20 visualisation
    ├── AlertBanner.jsx       Reusable status banner
    ├── ConfirmInline.jsx     Inline confirmation (no window.confirm)
    ├── EmptyState.jsx        Empty state with SVG illustration
    └── Toast.jsx             3-second auto-dismiss notification
```

---

## Data & privacy

All data is stored in your browser's localStorage. Nothing is sent to any server except:

- **Invoice uploads** — sent to the Anthropic Claude API for text extraction only. The file is not stored.
- **AI adviser questions** — sent to the Anthropic Claude API with your budget context. Not stored.

No analytics, no tracking, no ads.

To clear all data: open browser DevTools → Application → localStorage → delete `budgetfq_v1` and `budgetfq_history_v1`.

---

## AI features

BudgetFQ uses the Anthropic Claude API for two features:

### Invoice scanning
Upload a PDF or image of a bill. The AI extracts vendor name, amount, and due date and pre-fills the Add Bill form for your confirmation.

### AI investment adviser
Ask plain-English questions about your finances. The AI answers using your actual budget numbers as context. It provides financial education only — not regulated financial advice.

> **Disclaimer:** The AI adviser provides general financial education. It is not a licensed financial adviser. Always consult a qualified professional before making investment decisions.

---

## Deployment

### Netlify

1. Push this repo to GitHub
2. Go to netlify.com → New site from Git
3. Build command: `npm run build` — Publish directory: `build`
4. Deploy

### Vercel

```bash
npm install -g vercel
vercel --prod
```

---

## Roadmap (v2)

- Cloud sync / cross-device (requires Supabase)
- Bank account linking (requires Open Banking API)
- Live exchange rates
- Push notifications for bill due dates
- Transaction history and split transactions
- Mobile app wrapper

---

## Documentation

Full product specification and agent build instructions are in the `docs/` folder:

- `docs/BudgetFQ-PRD-v2.0.md` — Complete product requirements document
- `docs/BudgetFQ-Agent-Instructions.md` — AI agent build instructions

---

## License

MIT

---

*Built with care. Designed for real people managing real money.*
