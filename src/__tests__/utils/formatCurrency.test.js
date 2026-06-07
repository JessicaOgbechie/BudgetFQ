import { formatCurrency } from '../../utils';

describe('formatCurrency', () => {
  test('formats whole number with euro sign', () => {
    expect(formatCurrency(1200, '€')).toBe('€1,200');
  });

  test('rounds decimals to nearest whole number', () => {
    expect(formatCurrency(1234.56, '€')).toBe('€1,235');
    expect(formatCurrency(1234.44, '€')).toBe('€1,234');
  });

  test('returns dash when amount and income are both 0', () => {
    expect(formatCurrency(0, '€', 0)).toBe('—');
  });

  test('returns formatted zero when income exists but amount is 0', () => {
    expect(formatCurrency(0, '€', 3000)).toBe('€0');
  });

  test('works with pound sign', () => {
    expect(formatCurrency(500, '£')).toBe('£500');
  });

  test('works with naira sign', () => {
    expect(formatCurrency(250000, '₦')).toBe('₦250,000');
  });

  test('handles large numbers with commas', () => {
    expect(formatCurrency(1000000, '€')).toBe('€1,000,000');
  });
});
