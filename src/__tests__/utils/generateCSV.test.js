import { generateCSV } from '../../utils';

describe('generateCSV', () => {
  const mockState = {
    primaryCurrency: '€',
    incomeSources: [
      { id: '1', label: 'Primary salary', amount: 3000, currency: '€' },
    ],
    allocations: { savings: 20, rent: 30 },
    bills: [
      { id: '1', name: 'Electricity', amount: 80, dueDay: 5, category: 'bills', recurring: true, paid: false },
    ],
    customCategories: [],
  };

  test('contains the BudgetFQ header', () => {
    const csv = generateCSV(mockState, 3000);
    expect(csv).toContain('BudgetFQ Report');
  });

  test('contains the tagline', () => {
    const csv = generateCSV(mockState, 3000);
    expect(csv).toContain('Smart budgeting for real life');
  });

  test('contains INCOME section with source data', () => {
    const csv = generateCSV(mockState, 3000);
    expect(csv).toContain('INCOME');
    expect(csv).toContain('Primary salary');
    expect(csv).toContain('3000');
  });

  test('contains ALLOCATIONS section', () => {
    const csv = generateCSV(mockState, 3000);
    expect(csv).toContain('ALLOCATIONS');
    expect(csv).toContain('Savings');
    expect(csv).toContain('20%');
  });

  test('contains BILLS section with bill data', () => {
    const csv = generateCSV(mockState, 3000);
    expect(csv).toContain('BILLS');
    expect(csv).toContain('Electricity');
    expect(csv).toContain('Yes'); // recurring
    expect(csv).toContain('No');  // not paid
  });

  test('calculates monthly amounts correctly in allocations', () => {
    const csv = generateCSV(mockState, 3000);
    expect(csv).toContain('€600'); // 20% of 3000
    expect(csv).toContain('€900'); // 30% of 3000
  });

  test('output is a non-empty string', () => {
    const csv = generateCSV(mockState, 3000);
    expect(typeof csv).toBe('string');
    expect(csv.length).toBeGreaterThan(50);
  });

  test('handles empty bills array gracefully', () => {
    const stateNoBills = { ...mockState, bills: [] };
    const csv = generateCSV(stateNoBills, 3000);
    expect(csv).toContain('BILLS');
  });
});
