import { getDaysUntil } from '../../utils';

describe('getDaysUntil', () => {
  beforeEach(() => {
    // Fix today to 2026-05-15 for deterministic tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns correct days for a due date later this month', () => {
    expect(getDaysUntil(20)).toBe(5);
  });

  test('returns 1 for a due date tomorrow', () => {
    expect(getDaysUntil(16)).toBe(1);
  });

  test('wraps to next month when due date has already passed this month', () => {
    // Day 10 has already passed (today is 15th), so should return days until June 10
    const result = getDaysUntil(10);
    expect(result).toBeGreaterThan(20);
    expect(result).toBeLessThanOrEqual(31);
  });

  test('wraps to next month when due date is today (already passed midnight)', () => {
    const result = getDaysUntil(15);
    // Today is the 15th — getDaysUntil should return ~30 days (next month's 15th)
    expect(result).toBeGreaterThan(25);
  });

  test('returns a positive number for any valid day (1–28)', () => {
    for (let day = 1; day <= 28; day++) {
      expect(getDaysUntil(day)).toBeGreaterThan(0);
    }
  });

  test('never returns 0 or negative', () => {
    for (let day = 1; day <= 28; day++) {
      expect(getDaysUntil(day)).toBeGreaterThanOrEqual(1);
    }
  });
});
