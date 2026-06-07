import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Overview from '../../components/Overview';

const defaultProps = {
  allocations: { savings: 20, loans: 10, rent: 30, food: 12, transport: 8, leisure: 8, bills: 7 },
  setAllocations: jest.fn(),
  customCategories: [],
  setCustomCategories: jest.fn(),
  deletedCoreKeys: [],
  setDeletedCoreKeys: jest.fn(),
  totalIncome: 3000,
  primaryCurrency: '€',
};

describe('Overview — summary cards', () => {
  test('renders income, committed and free cards', () => {
    render(<Overview {...defaultProps} />);
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Committed')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  test('shows correct income amount', () => {
    render(<Overview {...defaultProps} />);
    expect(screen.getByText('€3,000')).toBeInTheDocument();
  });

  test('shows correct committed amount (95% of €3000 = €2850)', () => {
    render(<Overview {...defaultProps} />);
    expect(screen.getByText('€2,850')).toBeInTheDocument();
  });

  test('shows dashes when income is 0', () => {
    render(<Overview {...defaultProps} totalIncome={0} />);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });
});

describe('Overview — allocation rows', () => {
  test('renders all 7 core categories', () => {
    render(<Overview {...defaultProps} />);
    ['Savings','Loans / Debt','Rent / Mortgage','Food & Groceries','Fuel / Transport','Leisure','Recurring Bills'].forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test('shows delete buttons when multiple categories exist', () => {
    render(<Overview {...defaultProps} />);
    expect(screen.getAllByLabelText(/Delete/)).toHaveLength(7);
  });

  test('hides delete button when only 1 category remains', () => {
    const minimal = {
      ...defaultProps,
      allocations: { savings: 100 },
      deletedCoreKeys: ['loans','rent','food','transport','leisure','bills'],
    };
    render(<Overview {...minimal} />);
    expect(screen.queryAllByLabelText(/Delete/)).toHaveLength(0);
  });
});

describe('Overview — health banner', () => {
  test('shows over-allocated warning when total > 100%', () => {
    const over = { ...defaultProps, allocations: { savings: 40, loans: 40, rent: 40 } };
    render(<Overview {...over} />);
    expect(screen.getByText(/Over-allocated/)).toBeInTheDocument();
  });

  test('shows fully allocated message when total = 100%', () => {
    const full = { ...defaultProps, allocations: { savings: 20, loans: 10, rent: 30, food: 12, transport: 8, leisure: 8, bills: 12 } };
    render(<Overview {...full} />);
    expect(screen.getByText(/Fully allocated/)).toBeInTheDocument();
  });

  test('shows unallocated message when total < 100%', () => {
    render(<Overview {...defaultProps} />);
    expect(screen.getByText(/unallocated/)).toBeInTheDocument();
  });
});

describe('Overview — add custom category', () => {
  test('shows form when add button is clicked', () => {
    render(<Overview {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add custom category/));
    expect(screen.getByPlaceholderText('e.g. Childcare')).toBeInTheDocument();
  });

  test('shows validation error when name is empty', () => {
    render(<Overview {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add custom category/));
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Name required')).toBeInTheDocument();
  });

  test('cancel button hides the form', () => {
    render(<Overview {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add custom category/));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByPlaceholderText('e.g. Childcare')).not.toBeInTheDocument();
  });

  test('calls setCustomCategories and setAllocations when valid category added', () => {
    const setCustomCategories = jest.fn();
    const setAllocations = jest.fn();
    render(<Overview {...defaultProps} setCustomCategories={setCustomCategories} setAllocations={setAllocations} />);
    fireEvent.click(screen.getByText(/Add custom category/));
    fireEvent.change(screen.getByPlaceholderText('e.g. Childcare'), { target: { value: 'Childcare' } });
    // Target the add-form amount input specifically (last number input before Add button)
    const allNumberInputs = screen.getAllByPlaceholderText('0');
    const formAmtInput = allNumberInputs[allNumberInputs.length - 1];
    fireEvent.change(formAmtInput, { target: { value: '200' } });
    fireEvent.click(screen.getByText('Add'));
    expect(setCustomCategories).toHaveBeenCalled();
    expect(setAllocations).toHaveBeenCalled();
  });

  test('shows validation error for duplicate name', () => {
    render(<Overview {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add custom category/));
    fireEvent.change(screen.getByPlaceholderText('e.g. Childcare'), { target: { value: 'Savings' } });
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Name already exists')).toBeInTheDocument();
  });
});

describe('Overview — restore deleted categories', () => {
  test('shows restore section when a core category is deleted', () => {
    render(<Overview {...defaultProps} deletedCoreKeys={['savings']} />);
    expect(screen.getByText(/Removed categories/)).toBeInTheDocument();
    expect(screen.getByText(/Restore Savings/)).toBeInTheDocument();
  });

  test('does not show restore section when nothing is deleted', () => {
    render(<Overview {...defaultProps} />);
    expect(screen.queryByText(/Removed categories/)).not.toBeInTheDocument();
  });

  test('clicking restore calls setDeletedCoreKeys and setAllocations', () => {
    const setDeletedCoreKeys = jest.fn();
    const setAllocations = jest.fn();
    render(<Overview {...defaultProps} deletedCoreKeys={['savings']}
      setDeletedCoreKeys={setDeletedCoreKeys} setAllocations={setAllocations} />);
    fireEvent.click(screen.getByText(/Restore Savings/));
    expect(setDeletedCoreKeys).toHaveBeenCalled();
    expect(setAllocations).toHaveBeenCalled();
  });
});
