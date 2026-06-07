import { toPrimary, calcTotalIncome } from '../../utils';

// EXCHANGE_RATES: { '€': 1, '£': 0.86, '$': 1.08, '₦': 0.00067, 'kr': 0.088 }
// Formula: toPrimary(amount, from, primary) = amount * RATES[from] / RATES[primary]

describe('toPrimary', () => {
  test('same currency returns original amount', () => {
    expect(toPrimary(1000, '€', '€')).toBe(1000);
  });

  test('converts GBP to EUR correctly', () => {
    // £1000 → 1000 * 0.86 / 1 = €860
    expect(toPrimary(1000, '£', '€')).toBeCloseTo(860, 0);
  });

  test('converts USD to EUR correctly', () => {
    // $1000 → 1000 * 1.08 / 1 = €1080
    expect(toPrimary(1000, '$', '€')).toBeCloseTo(1080, 0);
  });

  test('converts NGN to EUR correctly', () => {
    // ₦1,000,000 → 1000000 * 0.00067 / 1 = €670
    expect(toPrimary(1000000, '₦', '€')).toBeCloseTo(670, 0);
  });

  test('converts EUR to GBP correctly', () => {
    // €1000 → 1000 * 1 / 0.86 ≈ £1162.79
    expect(toPrimary(1000, '€', '£')).toBeCloseTo(1162.79, 0);
  });

  test('handles zero amount', () => {
    expect(toPrimary(0, '£', '€')).toBe(0);
  });

  test('unknown currency defaults to rate of 1', () => {
    // Unknown currency falls back to 1, so toPrimary(500, 'XYZ', '€') = 500 * 1 / 1 = 500
    expect(toPrimary(500, 'XYZ', '€')).toBe(500);
  });
});

describe('calcTotalIncome', () => {
  test('sums single source correctly', () => {
    const sources = [{ id: '1', label: 'Salary', amount: 3000, currency: '€' }];
    expect(calcTotalIncome(sources, '€')).toBe(3000);
  });

  test('sums multiple sources in same currency', () => {
    const sources = [
      { id: '1', label: 'Salary', amount: 3000, currency: '€' },
      { id: '2', label: 'Freelance', amount: 500, currency: '€' },
    ];
    expect(calcTotalIncome(sources, '€')).toBe(3500);
  });

  test('converts GBP source to EUR primary correctly', () => {
    // £1000 → €860, so €2000 + £1000 = €2860
    const sources = [
      { id: '1', label: 'EUR Salary', amount: 2000, currency: '€' },
      { id: '2', label: 'GBP Freelance', amount: 1000, currency: '£' },
    ];
    const result = calcTotalIncome(sources, '€');
    expect(result).toBeCloseTo(2860, 0);
  });

  test('converts USD source to EUR primary correctly', () => {
    // $500 → €540, so €1000 + $500 = €1540
    const sources = [
      { id: '1', label: 'EUR Base', amount: 1000, currency: '€' },
      { id: '2', label: 'USD Contract', amount: 500, currency: '$' },
    ];
    const result = calcTotalIncome(sources, '€');
    expect(result).toBeCloseTo(1540, 0);
  });

  test('returns 0 for empty sources array', () => {
    expect(calcTotalIncome([], '€')).toBe(0);
  });

  test('handles sources with 0 amount', () => {
    const sources = [
      { id: '1', label: 'Salary', amount: 0, currency: '€' },
      { id: '2', label: 'Bonus', amount: 0, currency: '£' },
    ];
    expect(calcTotalIncome(sources, '€')).toBe(0);
  });

  test('works when primary currency is GBP', () => {
    // €3000 → £3000 * 1/0.86 ≈ £3488 in GBP primary
    const sources = [{ id: '1', label: 'Salary', amount: 3000, currency: '€' }];
    const result = calcTotalIncome(sources, '£');
    expect(result).toBeCloseTo(3488, 0);
  });
});
