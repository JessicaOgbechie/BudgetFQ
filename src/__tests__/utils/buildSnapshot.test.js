import { buildSnapshot, currentMonthId } from '../../utils';

describe('buildSnapshot', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-15T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockState = {
    totalIncome: 3000,
    primaryCurrency: '€',
    allocations: { savings: 20, loans: 10, rent: 30, food: 12, transport: 8, leisure: 8, bills: 7 },
    bills: [
      { id: '1', name: 'Electric', amount: 80, paid: true },
      { id: '2', name: 'Internet', amount: 45, paid: false },
      { id: '3', name: 'Phone', amount: 30, paid: false },
    ],
  };

  test('generates correct month id', () => {
    const snap = buildSnapshot(mockState, 'auto');
    expect(snap.id).toBe('2026-05');
  });

  test('generates human-readable label', () => {
    const snap = buildSnapshot(mockState, 'auto');
    expect(snap.label).toContain('2026');
  });

  test('sets trigger correctly', () => {
    expect(buildSnapshot(mockState, 'auto').trigger).toBe('auto');
    expect(buildSnapshot(mockState, 'manual').trigger).toBe('manual');
  });

  test('captures income and currency', () => {
    const snap = buildSnapshot(mockState, 'auto');
    expect(snap.income).toBe(3000);
    expect(snap.currency).toBe('€');
  });

  test('calculates billsTotal correctly', () => {
    const snap = buildSnapshot(mockState, 'auto');
    expect(snap.billsTotal).toBe(155); // 80 + 45 + 30
  });

  test('calculates investablePct as 100 minus total allocated', () => {
    const snap = buildSnapshot(mockState, 'auto');
    expect(snap.investablePct).toBe(5); // 100 - 95 = 5
  });

  test('calculates investableAmount from income and investablePct', () => {
    const snap = buildSnapshot(mockState, 'auto');
    expect(snap.investableAmount).toBe(150); // 5% of 3000
  });

  test('counts bills and paid bills correctly', () => {
    const snap = buildSnapshot(mockState, 'auto');
    expect(snap.billCount).toBe(3);
    expect(snap.paidCount).toBe(1);
  });

  test('includes a savedAt ISO timestamp', () => {
    const snap = buildSnapshot(mockState, 'auto');
    expect(snap.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test('allocations is a copy, not a reference', () => {
    const snap = buildSnapshot(mockState, 'auto');
    snap.allocations.savings = 99;
    expect(mockState.allocations.savings).toBe(20);
  });
});

describe('currentMonthId', () => {
  test('returns YYYY-MM format', () => {
    expect(currentMonthId()).toMatch(/^\d{4}-\d{2}$/);
  });

  test('returns correct month for known date', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-15'));
    expect(currentMonthId()).toBe('2026-05');
    jest.useRealTimers();
  });
});
