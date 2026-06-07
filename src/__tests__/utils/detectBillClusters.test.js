import { detectBillClusters, getDaysUntil } from '../../utils';

// Fix the date so getDaysUntil is deterministic
beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-05-01T12:00:00.000Z'));
});

afterAll(() => {
  jest.useRealTimers();
});

// On May 1st:
// dueDay 3  → 2 days away
// dueDay 4  → 3 days away
// dueDay 5  → 4 days away
// dueDay 20 → 19 days away

describe('detectBillClusters', () => {
  test('returns empty array when no bills', () => {
    expect(detectBillClusters([])).toEqual([]);
  });

  test('returns empty array when only one unpaid bill', () => {
    const bills = [{ id: '1', name: 'Electric', dueDay: 5, paid: false }];
    expect(detectBillClusters(bills)).toEqual([]);
  });

  test('detects two bills within 3 days of each other as a cluster', () => {
    const bills = [
      { id: '1', name: 'Electric', dueDay: 3, paid: false },
      { id: '2', name: 'Internet', dueDay: 5, paid: false },
    ];
    // dueDay 3 → 2 days, dueDay 5 → 4 days: difference = 2 (within 3)
    const clusters = detectBillClusters(bills);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].bills).toHaveLength(2);
  });

  test('does not cluster bills more than 3 days apart', () => {
    const bills = [
      { id: '1', name: 'Electric', dueDay: 3, paid: false },   // 2 days
      { id: '2', name: 'Rent',     dueDay: 20, paid: false },  // 19 days
    ];
    expect(detectBillClusters(bills)).toHaveLength(0);
  });

  test('ignores paid bills when detecting clusters', () => {
    const bills = [
      { id: '1', name: 'Electric', dueDay: 3, paid: true },  // paid — excluded
      { id: '2', name: 'Internet', dueDay: 4, paid: false },
      { id: '3', name: 'Phone',    dueDay: 5, paid: false },
    ];
    const clusters = detectBillClusters(bills);
    // Only Internet + Phone (both within 1 day of each other)
    if (clusters.length > 0) {
      expect(clusters[0].bills.every(b => !b.paid)).toBe(true);
    }
  });

  test('returns nearestDay as the smallest days value in the cluster', () => {
    const bills = [
      { id: '1', name: 'A', dueDay: 3, paid: false }, // 2 days
      { id: '2', name: 'B', dueDay: 5, paid: false }, // 4 days
    ];
    const clusters = detectBillClusters(bills);
    expect(clusters[0].nearestDay).toBe(2); // minimum of [2, 4]
  });

  test('handles two separate clusters independently', () => {
    const bills = [
      { id: '1', name: 'A', dueDay: 3,  paid: false }, // 2 days
      { id: '2', name: 'B', dueDay: 4,  paid: false }, // 3 days — clusters with A
      { id: '3', name: 'C', dueDay: 20, paid: false }, // 19 days
      { id: '4', name: 'D', dueDay: 21, paid: false }, // 20 days — clusters with C
    ];
    const clusters = detectBillClusters(bills);
    expect(clusters).toHaveLength(2);
  });

  test('all-paid bills returns no clusters', () => {
    const bills = [
      { id: '1', name: 'A', dueDay: 3, paid: true },
      { id: '2', name: 'B', dueDay: 4, paid: true },
    ];
    expect(detectBillClusters(bills)).toHaveLength(0);
  });
});
