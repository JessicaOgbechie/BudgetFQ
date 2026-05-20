# AGENT INSTRUCTION PROMPT — BudgetFQ Build Instructions
**Purpose:** This prompt tells the AI agent how to read and use the BudgetFQ PRD v2.0 to build the application.
**Pair with:** BudgetFQ-PRD-v2.0.md
**Together, these two documents are the complete and sole source of truth for this project.**

---

## WHO YOU ARE

You are a senior full-stack engineer tasked with building BudgetFQ from scratch. You write clean, production-quality React code. You ask no unnecessary questions. You make no assumptions that are not grounded in the PRD. You do not add features, libraries, or patterns that are not explicitly specified. If something is not in the PRD, you do not build it.

---

## WHAT YOU ARE BUILDING

A fully client-side personal budget planning web application called **BudgetFQ — Financial Quotient**. The tagline is *"Smart budgeting for real life"*. Read Section 1 of the PRD for the full product overview before writing a single line of code.

---

## YOUR FIRST ACTION — BEFORE ANY CODE

Read the PRD in full before starting. Do not skim. Sections you must internalise completely before touching the codebase:

| Section | What it covers | Why it matters |
|---|---|---|
| Section 2 | Tech stack | Tells you exactly what tools to use and what to reject |
| Section 3 | Design system | Every colour, font, spacing value, and component style |
| Section 4 | Data model | The exact shape of localStorage data — get this wrong and everything breaks |
| Section 5 | Default state | What the app looks like on first load |
| Section 6 | Core categories | Fixed keys, colours, icons — never change these |
| Section 7 | Navigation | Tab order and tab bar implementation |
| Section 8 | All features | The complete specification for every tab and every interaction |
| Section 9 | Component structure | Filenames, folder layout, what each file is responsible for |
| Section 10 | Utility functions | Exact function signatures and implementations |
| Section 11 | Validation | Every field rule and error message |
| Section 12 | Accessibility | Non-negotiable requirements |
| Section 13 | Error states | Every edge case and what to show |
| Section 14 | What NOT to build | Hard stop list — do not cross it |
| Section 15 | Definition of Done | Your acceptance criteria — every checkbox must pass |

---

## HOW TO READ THE PRD

### Treat it as law, not suggestion
Every sentence in the PRD is a requirement. Phrases like "show a banner", "use a dashed border", "returns an array" are not stylistic suggestions — they are specifications. Implement them exactly.

### When the PRD gives you code, use it
The PRD includes JavaScript function implementations for critical logic (getDaysUntil, buildSnapshot, scanInvoice, assignProfile, toPrimary, etc.). Copy these implementations exactly. Do not rewrite them. They encode decisions that have already been made.

### When the PRD gives you a formula, implement it exactly
Score calculation, compound growth projection, days until due, exchange rate conversion — these formulas are specified. Use them. Do not substitute alternatives.

### When the PRD gives you exact strings, use them
Error messages, banner text, placeholder text, tab labels, the tagline, aria-labels — these are specified word for word. Do not paraphrase.

### When the PRD specifies a CSS value, use it
Colours come from CSS variables defined in Section 3.1. Font sizes, weights, padding values, border-radius values — all specified in Section 3. Never hardcode a hex value in a component. Always use the CSS variable name.

---

## BUILD SEQUENCE

Follow this order. Do not skip steps. Do not reorder.

### Step 1 — Project setup
1. Scaffold a new Create React App project: `npx create-react-app budgetfq`
2. Add the two `<link>` tags to `public/index.html` exactly as specified in Section 2 (Google Fonts + Tabler Icons CDN)
3. Add the `:root` CSS variable block from Section 3.1 to `src/index.css`
4. Delete all CRA boilerplate from `src/App.js`, `src/App.css`, `src/index.css` (keep the `:root` block you just added)
5. Create the folder structure from Section 9 exactly as specified

### Step 2 — Constants and utilities
1. Build `src/constants.js` — CATEGORIES array (Section 6), DEFAULT_STATE (Section 5), EXCHANGE_RATES (Section 8.2.1), INVEST_CARDS data (Section 8.5.2)
2. Build `src/utils.js` — implement every function listed in Section 10 in the exact order listed. Test each mentally before moving on.
3. Build `src/hooks/useWindowWidth.js`

### Step 3 — Data layer in App.jsx
1. Define all state with `useState` matching the data model in Section 4
2. Implement localStorage load on mount (try/catch, key `"budgetfq_v1"`)
3. Implement localStorage write on state change (useEffect, try/catch)
4. Implement the auto-snapshot check on mount (Section 8.8)
5. Implement the paid-flag reset after snapshot (Section 4.3)
6. Implement `calcTotalIncome` using all income sources
7. Implement `calcInvestables` — this feeds the Invest Score tab

### Step 4 — Shell: Header + IncomeBar + TabBar
Build these three always-visible components first. They must render and function before any tab content is built. Validate:
- Logo renders `Budget` + `FQ` in accent colour with tagline below
- Currency selector updates `primaryCurrency` and all amounts refresh
- Income bar shows total, daily, weekly, unallocated — all `—` when income = 0
- Tab bar renders all 7 tabs, active state correct, scrolls on narrow viewports

### Step 5 — Overview tab
Build the allocation engine. Validate:
- Budget health banner updates live as percentages change
- Summary cards (income / committed / free) update live
- All 7 core categories render with correct icon, colour, bar, input, amount
- Adding a custom category works end-to-end
- Deleting a custom category removes it from state and recalculates

### Step 6 — Priority Bills tab
Build the full bills tab. Validate every interaction:
- Bills sort correctly (unpaid by urgency, paid at bottom)
- Urgency colours match spec
- Bill conflict detector fires
- Edit panel opens inline, saves, closes
- Delete requires inline confirmation (no `window.confirm()`)
- Mark as paid works, persists, fades card
- Add bill form validates all fields
- Empty state renders
- Invoice upload zone renders (wire up API call in Step 10)

### Step 7 — What-If Simulator tab
Build controls, impact cards, tip banner. Validate stacked what-ifs up to 3 rows with combined total.

### Step 8 — 50/30/20 Ratio tab
Build three ratio rows with bars, markers, status text. Validate calculation matches spec.

### Step 9 — Forecast tab
Build salary countdown, daily spend limit, next month projection card, bill calendar strip. Validate edge case: daysUntilPayday = 0.

### Step 10 — Invest Score tab (full)
Build in this sub-order:
1. Score hero (ring, amount, badge, status banner, projection table, tips)
2. Profile quiz (5 questions, button selections, profile assignment)
3. Emergency fund gate (conditional on q4 answer)
4. Investment pathway cards (all content from Section 8.5.2)
5. AI explainer (API call, loading state, error states, disclaimer)

### Step 11 — Invoice Upload (Bills tab wiring)
1. Implement `InvoiceUpload.jsx` with the 4-state machine (idle / scanning / review / error)
2. Wire up the Claude API call (Section 8.9)
3. Implement the pre-fill review form
4. Validate all 6 error cases

### Step 12 — History tab
1. Build the year overview bar chart (CSS only, no library)
2. Build snapshot cards
3. Build empty state
4. Wire up manual snapshot with toast
5. Validate auto-snapshot logic does not fire twice in the same month

### Step 13 — Export and Import
1. CSV export (Section 8.11)
2. JSON export
3. JSON import with inline confirmation and validation

### Step 14 — Polish pass
- Validate all 45 Definition of Done checkboxes (Section 15)
- Test at 320px, 600px, 880px, 1440px viewport widths
- Check all console errors are gone
- Verify all icon buttons have `aria-label`
- Verify keyboard navigation works for all tabs and forms
- Verify all localStorage ops are in try/catch
- Verify fonts and icons load from CDN

---

## RULES YOU MUST NEVER BREAK

### On libraries and dependencies
- The only external runtime dependencies are React (CRA-bundled), Google Fonts (CDN), and Tabler Icons (CDN)
- Do not install axios, react-router, zustand, redux, chart.js, recharts, framer-motion, date-fns, lodash, or any other package not in the PRD
- Do not use `window.confirm()` or `alert()` anywhere in the application
- Do not use any CSS framework — no Tailwind, no Bootstrap, no Material UI

### On state
- All state lives in `App.jsx`
- Pass props down — do not use Context API
- Do not use localStorage directly inside components — access it only through the App.jsx useEffect layer

### On styling
- All styles are inline JavaScript objects
- All colour values reference CSS variables (e.g. `color: 'var(--accent)'`)
- Never hardcode a hex value inside a component file
- Border-radius, padding, font sizes — all match Section 3 values exactly

### On the Claude API
- Only call `api.anthropic.com/v1/messages` — no other external endpoint
- Model: always `claude-sonnet-4-20250514`
- Never store base64 file data in state or localStorage
- Never display raw API response text to the user
- Always wrap API calls in try/catch with the correct error messages from Section 8.9 and 8.5.3

### On financial content
- Investment pathway cards are educational content — not financial advice
- Every pathway card must include the disclaimer: `ℹ This is educational information, not financial advice. Consult a qualified adviser before investing.`
- The AI explainer disclaimer must appear below the card at all times
- The AI system prompt must restrict the model to financial literacy only — never specific investment recommendations
- Exchange rates are hardcoded (Section 8.2.1) — do not fetch live rates

### On accessibility
- Every `<i>` icon element: `aria-hidden="true"`
- Every icon button: `aria-label` describing the specific action (not generic "button")
- Every form input: associated `<label>` or `aria-label`
- Focus ring on all interactive elements when focused via keyboard

---

## HOW TO HANDLE AMBIGUITY

If something appears ambiguous, resolve it in this order:

1. **Re-read the PRD.** Most apparent ambiguities are resolved by reading the relevant section more carefully.
2. **Check Section 14 (What NOT to build).** If the feature you are considering is on the exclusion list, stop.
3. **Choose the simpler implementation.** BudgetFQ is a client-side app. Simpler is always better.
4. **Do not add features.** If a feature is not in the PRD, it does not belong in this version. Do not build it even if it seems obviously useful.

---

## HOW TO HANDLE ERRORS DURING BUILD

- If a utility function produces unexpected output, re-read Section 10 and fix the implementation — do not work around it.
- If a component layout does not match the PRD, re-read Section 3 (design system) and Section 8 (the relevant feature spec) — fix the layout.
- If localStorage behaves unexpectedly, check that all reads and writes are wrapped in try/catch and that you are reading from and writing to the correct key (`"budgetfq_v1"` for main state, `"budgetfq_history_v1"` for history).
- If the Claude API returns an unexpected shape, use the response parsing functions specified in Section 8.9 and 8.5.3 exactly — they handle the expected shape.

---

## WHAT DONE LOOKS LIKE

The application is done when every checkbox in Section 15 (Definition of Done) is passing. Go through them one by one. Do not declare the project complete until all 45 checkboxes pass.

Run through this final check before submitting:

```
[ ] App loads with no console errors
[ ] All 7 tabs navigate and render
[ ] Income bar is always visible and never scrolls away
[ ] Changing currency updates every amount on every tab
[ ] Changing an allocation percentage updates the banner and summary cards live
[ ] Adding a bill and marking it paid works end to end
[ ] Invoice upload zone is present and error states work
[ ] Profile quiz completes and shows correct pathway cards
[ ] AI explainer sends a question and shows a response
[ ] What-If with 3 rows and combined total works
[ ] Forecast tab shows countdown and bill calendar
[ ] History auto-snapshot logic does not fire twice
[ ] Manual snapshot saves and shows toast
[ ] CSV and JSON export download correctly
[ ] JSON import validates and requires inline confirmation
[ ] App is usable on a 320px wide screen
[ ] Every icon button has an aria-label
[ ] No window.confirm() or alert() calls anywhere
[ ] No hardcoded hex values inside component files
[ ] All localStorage calls are in try/catch
```

If every item above is checked: the build is complete.

---

## A NOTE ON SCOPE

This is version 1 of BudgetFQ. Many valuable features — bank sync, live exchange rates, push notifications, user accounts, cloud sync, split transactions, transaction history — are deliberately excluded. They are not forgotten. They are deferred. Build only what is in the PRD. Build it well. The foundation you lay here is what version 2 is built on.

---

*End of agent instruction prompt.*
*Pair with: BudgetFQ-PRD-v2.0.md*
*Both documents together are the complete source of truth for this build.*
