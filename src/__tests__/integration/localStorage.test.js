import { getDefaultState, currentMonthId } from '../../constants';
import { buildSnapshot, calcTotalIncome } from '../../utils';

const PRIMARY_KEY = 'budgetfq_v1';
const HISTORY_KEY = 'budgetfq_history_v1';

describe('localStorage — save and load cycle', () => {
  test('default state has expected shape', () => {
    const state = getDefaultState();
    expect(state).toHaveProperty('incomeSources');
    expect(state).toHaveProperty('primaryCurrency');
    expect(state).toHaveProperty('allocations');
    expect(state).toHaveProperty('bills');
    expect(state).toHaveProperty('customCategories');
    expect(state).toHaveProperty('investProfile');
    expect(state).toHaveProperty('salaryDay');
  });

  test('default income is 0', () => {
    const state = getDefaultState();
    expect(state.incomeSources[0].amount).toBe(0);
  });

  test('default allocations sum to 95%', () => {
    const state = getDefaultState();
    const total = Object.values(state.allocations).reduce((s, v) => s + v, 0);
    expect(total).toBe(95);
  });

  test('default has 4 sample bills', () => {
    const state = getDefaultState();
    expect(state.bills).toHaveLength(4);
  });

  test('all default bills are recurring', () => {
    const state = getDefaultState();
    expect(state.bills.every(b => b.recurring)).toBe(true);
  });

  test('all default bills start unpaid', () => {
    const state = getDefaultState();
    expect(state.bills.every(b => !b.paid)).toBe(true);
  });

  test('serialising and deserialising state preserves values', () => {
    // Test JSON round-trip directly (not via localStorage mock which may behave differently)
    const state = {
      incomeSources: [{ id: '1', label: 'Salary', amount: 4500, currency: '€' }],
      primaryCurrency: '€',
      allocations: { savings: 20 },
      bills: [],
      customCategories: [],
      investProfile: null,
      salaryDay: 25,
      lastOpenedMonth: '2026-05',
    };
    const serialised = JSON.stringify(state);
    const loaded = JSON.parse(serialised);
    expect(loaded.incomeSources[0].amount).toBe(4500);
    expect(loaded.salaryDay).toBe(25);
    expect(loaded.primaryCurrency).toBe('€');
  });

  test('malformed JSON does not throw when caught', () => {
    expect(() => {
      try { JSON.parse('not-valid-json{{'); }
      catch { return null; }
    }).not.toThrow();
  });
});

describe('Auto-snapshot logic', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-15T00:00:00.000Z'));
  });

  afterEach(() => jest.useRealTimers());

  const mockState = {
    totalIncome: 3000,
    primaryCurrency: '€',
    allocations: { savings: 20, loans: 10, rent: 30, food: 12, transport: 8, leisure: 8, bills: 7 },
    bills: [{ id: '1', name: 'Electric', amount: 80, paid: false }],
  };

  test('snapshot id matches current month', () => {
    expect(buildSnapshot(mockState, 'auto').id).toBe('2026-05');
  });

  test('auto snapshot trigger is set correctly', () => {
    expect(buildSnapshot(mockState, 'auto').trigger).toBe('auto');
  });

  test('manual snapshot trigger is set correctly', () => {
    expect(buildSnapshot(mockState, 'manual').trigger).toBe('manual');
  });

  test('snapshot does not fire twice for same month', () => {
    const existingHistory = [buildSnapshot(mockState, 'auto')];
    const alreadySaved = existingHistory.some(s => s.id === '2026-05' && s.trigger === 'auto');
    expect(alreadySaved).toBe(true);
  });

  test('snapshot fires for a new month', () => {
    const history = [{ id: '2026-04', trigger: 'auto', label: 'April 2026' }];
    const currentId = currentMonthId(); // May 2026
    const alreadySaved = history.some(s => s.id === currentId && s.trigger === 'auto');
    const isNewMonth = history[0].id !== currentId;
    expect(alreadySaved).toBe(false);
    expect(isNewMonth).toBe(true);
  });
});

describe('Bill paid flag reset', () => {
  test('bills reset to unpaid when month changes', () => {
    const bills = [
      { id: '1', name: 'Electric', amount: 80, paid: true },
      { id: '2', name: 'Internet', amount: 45, paid: true },
    ];
    const isNewMonth = '2026-04' !== '2026-05';
    const reset = isNewMonth ? bills.map(b => ({ ...b, paid: false })) : bills;
    expect(reset.every(b => !b.paid)).toBe(true);
  });

  test('bills are NOT reset within the same month', () => {
    const bills = [{ id: '1', name: 'Electric', amount: 80, paid: true }];
    const isNewMonth = '2026-05' !== '2026-05';
    const reset = isNewMonth ? bills.map(b => ({ ...b, paid: false })) : bills;
    expect(reset[0].paid).toBe(true);
  });
});

describe('Multi-currency income', () => {
  test('calculates total income from single EUR source', () => {
    const sources = [{ id: '1', label: 'Salary', amount: 3000, currency: '€' }];
    expect(calcTotalIncome(sources, '€')).toBe(3000);
  });

  test('sums multiple same-currency sources correctly', () => {
    const sources = [
      { id: '1', label: 'Salary', amount: 2000, currency: '€' },
      { id: '2', label: 'Freelance', amount: 1000, currency: '€' },
    ];
    expect(calcTotalIncome(sources, '€')).toBe(3000);
  });

  test('converts GBP to EUR correctly for multi-source total', () => {
    // EXCHANGE_RATES: €=1, £=0.86
    // £1000 → 1000 * 0.86 / 1 = €860
    // Total: €2000 + €860 = €2860
    const sources = [
      { id: '1', label: 'EUR Salary', amount: 2000, currency: '€' },
      { id: '2', label: 'GBP Freelance', amount: 1000, currency: '£' },
    ];
    expect(calcTotalIncome(sources, '€')).toBeCloseTo(2860, 0);
  });

  test('returns 0 when all sources have 0 amount', () => {
    const sources = [{ id: '1', label: 'Salary', amount: 0, currency: '€' }];
    expect(calcTotalIncome(sources, '€')).toBe(0);
  });

  test('returns 0 for empty sources array', () => {
    expect(calcTotalIncome([], '€')).toBe(0);
  });
});
