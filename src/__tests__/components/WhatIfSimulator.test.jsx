import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WhatIfSimulator from '../../components/WhatIfSimulator';

const defaultProps = { totalIncome: 3000, primaryCurrency: '€' };

describe('WhatIfSimulator', () => {
  test('renders the simulator controls', () => {
    render(<WhatIfSimulator {...defaultProps} />);
    expect(screen.getByText(/Simulate a spending change/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category to reduce/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount to reduce/)).toBeInTheDocument();
  });

  test('shows zero impact cards on load', () => {
    render(<WhatIfSimulator {...defaultProps} />);
    expect(screen.getByText('Monthly saving')).toBeInTheDocument();
    expect(screen.getByText('1-year saving')).toBeInTheDocument();
    expect(screen.getByText('5-year saving')).toBeInTheDocument();
  });

  test('calculates correct monthly saving', async () => {
    render(<WhatIfSimulator {...defaultProps} />);
    const input = screen.getByLabelText(/Amount to reduce/);
    await userEvent.clear(input);
    await userEvent.type(input, '100');
    expect(screen.getByText('€100')).toBeInTheDocument();
  });

  test('calculates correct 1-year saving (×12)', async () => {
    render(<WhatIfSimulator {...defaultProps} />);
    const input = screen.getByLabelText(/Amount to reduce/);
    await userEvent.clear(input);
    await userEvent.type(input, '100');
    expect(screen.getByText('€1,200')).toBeInTheDocument();
  });

  test('calculates correct 5-year saving (×60)', async () => {
    render(<WhatIfSimulator {...defaultProps} />);
    const input = screen.getByLabelText(/Amount to reduce/);
    await userEvent.clear(input);
    await userEvent.type(input, '100');
    expect(screen.getByText('€6,000')).toBeInTheDocument();
  });

  test('shows tip banner when amount > 0', async () => {
    render(<WhatIfSimulator {...defaultProps} />);
    const input = screen.getByLabelText(/Amount to reduce/);
    await userEvent.clear(input);
    await userEvent.type(input, '50');
    expect(screen.getByText(/saves you/)).toBeInTheDocument();
  });

  test('does not show tip banner when amount is 0', () => {
    render(<WhatIfSimulator {...defaultProps} />);
    expect(screen.queryByText(/saves you/)).not.toBeInTheDocument();
  });

  test('shows Add another reduction button', () => {
    render(<WhatIfSimulator {...defaultProps} />);
    expect(screen.getByText(/Add another reduction/)).toBeInTheDocument();
  });

  test('adds a second row when Add another reduction is clicked', async () => {
    render(<WhatIfSimulator {...defaultProps} />);
    await userEvent.click(screen.getByText(/Add another reduction/));
    const inputs = screen.getAllByLabelText(/Amount to reduce/);
    expect(inputs).toHaveLength(2);
  });

  test('hides Add button after 3 rows', async () => {
    render(<WhatIfSimulator {...defaultProps} />);
    await userEvent.click(screen.getByText(/Add another reduction/));
    await userEvent.click(screen.getByText(/Add another reduction/));
    expect(screen.queryByText(/Add another reduction/)).not.toBeInTheDocument();
  });

  test('shows combined total when more than 1 row has values', async () => {
    render(<WhatIfSimulator {...defaultProps} />);
    const inputs = screen.getAllByLabelText(/Amount to reduce/);
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], '100');
    await userEvent.click(screen.getByText(/Add another reduction/));
    const inputs2 = screen.getAllByLabelText(/Amount to reduce/);
    await userEvent.clear(inputs2[1]);
    await userEvent.type(inputs2[1], '50');
    expect(screen.getByText(/Combined monthly saving/)).toBeInTheDocument();
    expect(screen.getByText('€150')).toBeInTheDocument();
  });

  test('remove button deletes a row', async () => {
    render(<WhatIfSimulator {...defaultProps} />);
    await userEvent.click(screen.getByText(/Add another reduction/));
    expect(screen.getAllByLabelText(/Amount to reduce/)).toHaveLength(2);
    const removeBtns = screen.getAllByLabelText(/Remove this reduction row/);
    await userEvent.click(removeBtns[0]);
    expect(screen.getAllByLabelText(/Amount to reduce/)).toHaveLength(1);
  });
});
