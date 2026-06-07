import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PriorityBills from '../../components/PriorityBills';

// Fix date for deterministic getDaysUntil
beforeAll(() => {
  jest.useFakeTimers({ legacyFakeTimers: true });
  jest.setSystemTime(new Date('2026-05-01T12:00:00.000Z'));
});

afterAll(() => jest.useRealTimers());

const mockBills = [
  { id: '1', name: 'Electricity', amount: 80,  dueDay: 10, category: 'bills',   paid: false, recurring: true },
  { id: '2', name: 'Internet',    amount: 45,  dueDay: 20, category: 'bills',   paid: false, recurring: true },
  { id: '3', name: 'Phone',       amount: 30,  dueDay: 25, category: 'bills',   paid: false, recurring: true },
  { id: '4', name: 'Gym',         amount: 35,  dueDay: 15, category: 'leisure', paid: true,  recurring: true },
];

const defaultProps = {
  bills: mockBills,
  setBills: jest.fn(),
  primaryCurrency: '€',
};

describe('PriorityBills — rendering', () => {
  test('renders all bill names', () => {
    render(<PriorityBills {...defaultProps} />);
    expect(screen.getByText('Electricity')).toBeInTheDocument();
    expect(screen.getByText('Internet')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Gym')).toBeInTheDocument();
  });

  test('renders bill amounts with currency', () => {
    render(<PriorityBills {...defaultProps} />);
    expect(screen.getByText('€80')).toBeInTheDocument();
    expect(screen.getByText('€45')).toBeInTheDocument();
  });

  test('shows empty state when no bills', () => {
    render(<PriorityBills {...defaultProps} bills={[]} />);
    expect(screen.getByText(/No bills yet/)).toBeInTheDocument();
  });

  test('shows urgency legend', () => {
    render(<PriorityBills {...defaultProps} />);
    expect(screen.getByText(/≤ 3 days/)).toBeInTheDocument();
    expect(screen.getByText(/4–7 days/)).toBeInTheDocument();
    expect(screen.getByText(/8\+ days/)).toBeInTheDocument();
  });

  test('paid bill shows Paid status text', () => {
    render(<PriorityBills {...defaultProps} />);
    expect(screen.getByText(/Paid/)).toBeInTheDocument();
  });

  test('renders edit buttons for each bill', () => {
    render(<PriorityBills {...defaultProps} />);
    const editBtns = screen.getAllByLabelText(/Edit .* bill/);
    expect(editBtns).toHaveLength(4);
  });

  test('renders delete buttons for each bill', () => {
    render(<PriorityBills {...defaultProps} />);
    const deleteBtns = screen.getAllByLabelText(/Delete .* bill/);
    expect(deleteBtns).toHaveLength(4);
  });
});

describe('PriorityBills — add bill form', () => {
  test('shows add bill form when button is clicked', () => {
    render(<PriorityBills {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add bill manually/));
    expect(screen.getByPlaceholderText('Bill name')).toBeInTheDocument();
  });

  test('shows validation error for empty name', () => {
    render(<PriorityBills {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add bill manually/));
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText(/Please enter a bill name/)).toBeInTheDocument();
  });

  test('shows validation error for amount ≤ 0', () => {
    render(<PriorityBills {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add bill manually/));
    fireEvent.change(screen.getByPlaceholderText('Bill name'), { target: { value: 'Water' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '-10' } });
    fireEvent.change(screen.getByPlaceholderText('1–28'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText(/Amount must be greater than 0/)).toBeInTheDocument();
  });

  test('shows validation error for due day out of range', () => {
    render(<PriorityBills {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add bill manually/));
    fireEvent.change(screen.getByPlaceholderText('Bill name'), { target: { value: 'Water' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50' } });
    fireEvent.change(screen.getByPlaceholderText('1–28'), { target: { value: '35' } });
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText(/Enter a day between 1 and 28/)).toBeInTheDocument();
  });

  test('cancel hides the form', () => {
    render(<PriorityBills {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add bill manually/));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByPlaceholderText('Bill name')).not.toBeInTheDocument();
  });

  test('calls setBills when valid bill is submitted', () => {
    const setBills = jest.fn();
    render(<PriorityBills {...defaultProps} setBills={setBills} />);
    fireEvent.click(screen.getByText(/Add bill manually/));
    fireEvent.change(screen.getByPlaceholderText('Bill name'), { target: { value: 'Water Bill' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '40' } });
    fireEvent.change(screen.getByPlaceholderText('1–28'), { target: { value: '15' } });
    fireEvent.click(screen.getByText('Add'));
    expect(setBills).toHaveBeenCalled();
  });
});

describe('PriorityBills — edit bill', () => {
  test('shows edit form when edit button is clicked', () => {
    render(<PriorityBills {...defaultProps} />);
    fireEvent.click(screen.getAllByLabelText(/Edit .* bill/)[0]);
    expect(screen.getByText('Edit bill')).toBeInTheDocument();
  });

  test('clicking same edit button again closes the panel', () => {
    render(<PriorityBills {...defaultProps} />);
    const editBtn = screen.getAllByLabelText(/Edit .* bill/)[0];
    fireEvent.click(editBtn);
    expect(screen.getByText('Edit bill')).toBeInTheDocument();
    fireEvent.click(editBtn);
    expect(screen.queryByText('Edit bill')).not.toBeInTheDocument();
  });

  test('Cancel button closes the edit panel', () => {
    render(<PriorityBills {...defaultProps} />);
    fireEvent.click(screen.getAllByLabelText(/Edit .* bill/)[0]);
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Edit bill')).not.toBeInTheDocument();
  });

  test('Save button calls setBills', () => {
    const setBills = jest.fn();
    render(<PriorityBills {...defaultProps} setBills={setBills} />);
    fireEvent.click(screen.getAllByLabelText(/Edit .* bill/)[0]);
    fireEvent.click(screen.getByText('Save'));
    expect(setBills).toHaveBeenCalled();
  });
});

describe('PriorityBills — delete bill', () => {
  test('shows inline confirmation when delete is clicked', () => {
    render(<PriorityBills {...defaultProps} />);
    fireEvent.click(screen.getAllByLabelText(/Delete .* bill/)[0]);
    expect(screen.getByText(/Remove this bill/)).toBeInTheDocument();
  });

  test('shows Yes, remove and Cancel buttons', () => {
    render(<PriorityBills {...defaultProps} />);
    fireEvent.click(screen.getAllByLabelText(/Delete .* bill/)[0]);
    expect(screen.getByText('Yes, remove')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('Cancel dismisses the confirmation without deleting', () => {
    render(<PriorityBills {...defaultProps} />);
    fireEvent.click(screen.getAllByLabelText(/Delete .* bill/)[0]);
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText(/Remove this bill/)).not.toBeInTheDocument();
    expect(screen.getByText('Electricity')).toBeInTheDocument();
  });

  test('Yes, remove calls setBills to remove the bill', () => {
    const setBills = jest.fn();
    render(<PriorityBills {...defaultProps} setBills={setBills} />);
    fireEvent.click(screen.getAllByLabelText(/Delete .* bill/)[0]);
    fireEvent.click(screen.getByText('Yes, remove'));
    expect(setBills).toHaveBeenCalled();
  });
});

describe('PriorityBills — mark as paid', () => {
  test('renders a checkbox for each bill', () => {
    render(<PriorityBills {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4);
  });

  test('paid bill has a checked checkbox', () => {
    render(<PriorityBills {...defaultProps} />);
    const checked = screen.getAllByRole('checkbox').filter(cb => cb.checked);
    expect(checked).toHaveLength(1);
  });

  test('toggling a checkbox calls setBills', () => {
    const setBills = jest.fn();
    render(<PriorityBills {...defaultProps} setBills={setBills} />);
    const unpaid = screen.getAllByRole('checkbox').find(cb => !cb.checked);
    fireEvent.click(unpaid);
    expect(setBills).toHaveBeenCalled();
  });
});
