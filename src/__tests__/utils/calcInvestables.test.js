import { calcInvestables } from '../../utils';

describe('calcInvestables', () => {
  const baseAllocations = {
    savings: 20, loans: 10, rent: 30,
    food: 12, transport: 8, leisure: 8, bills: 7,
  };

  test('calculates correct total allocated percentage', () => {
    const result = calcInvestables(baseAllocations, 3000);
    expect(result.totalAllocated).toBe(95);
  });

  test('calculates correct unallocated percentage', () => {
    const result = calcInvestables(baseAllocations, 3000);
    expect(result.unallocated).toBe(5);
  });

  test('calculates investable amount from income and unallocated pct', () => {
    const result = calcInvestables(baseAllocations, 3000);
    expect(result.investableAmount).toBe(150); // 5% of 3000
  });

  test('score = unallocated + savings - 5 buffer', () => {
    // unallocated=5, savings=20 → 5+20-5 = 20, clamped to 100 → 20
    const result = calcInvestables(baseAllocations, 3000);
    expect(result.score).toBe(20);
  });

  test('score is clamped to 0 when deeply over-allocated with no savings', () => {
    // 120% total, 0% savings → score = max(0, 0 + 0 - 5) = 0
    const overAllocated = { savings: 0, loans: 40, rent: 40, food: 40, transport: 0, leisure: 0, bills: 0 };
    const result = calcInvestables(overAllocated, 3000);
    expect(result.score).toBe(0);
  });

  test('score is clamped to 100 maximum', () => {
    const minimalAllocations = { savings: 50 };
    const result = calcInvestables(minimalAllocations, 3000);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test('returns zero investable amount when income is 0', () => {
    const result = calcInvestables(baseAllocations, 0);
    expect(result.investableAmount).toBe(0);
  });

  test('handles fully allocated (100%) budget', () => {
    const full = { savings: 20, loans: 10, rent: 30, food: 12, transport: 8, leisure: 8, bills: 12 };
    const result = calcInvestables(full, 3000);
    expect(result.unallocated).toBe(0);
    expect(result.investableAmount).toBe(0);
  });

  test('handles empty allocations object', () => {
    const result = calcInvestables({}, 3000);
    expect(result.totalAllocated).toBe(0);
    expect(result.unallocated).toBe(100);
    expect(result.investableAmount).toBe(3000);
  });

  test('handles string values in allocations (from input fields)', () => {
    const withStrings = { ...baseAllocations, savings: '20', rent: '30' };
    const result = calcInvestables(withStrings, 3000);
    expect(result.totalAllocated).toBe(95);
  });
});
