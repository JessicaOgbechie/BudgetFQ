import React from 'react';
import { render, screen } from '@testing-library/react';
import RatioChecker from '../../components/RatioChecker';

// allocations that sit near ideal: needs≈50, wants≈30, savings≈20
const balanced = {
  allocations: { savings: 20, loans: 10, rent: 25, food: 10, transport: 5, leisure: 30, bills: 0 },
};

describe('RatioChecker', () => {
  test('renders all three ratio row labels', () => {
    render(<RatioChecker {...balanced} />);
    expect(screen.getByText('Needs')).toBeInTheDocument();
    expect(screen.getByText('Wants')).toBeInTheDocument();
    expect(screen.getByText('Savings')).toBeInTheDocument();
  });

  test('shows ideal targets for each row', () => {
    render(<RatioChecker {...balanced} />);
    expect(screen.getByText(/ideal 50%/)).toBeInTheDocument();
    expect(screen.getByText(/ideal 30%/)).toBeInTheDocument();
    expect(screen.getByText(/ideal 20%/)).toBeInTheDocument();
  });

  test('shows On track for savings when savings = 20%', () => {
    render(<RatioChecker {...balanced} />);
    const onTrackItems = screen.getAllByText('On track');
    expect(onTrackItems.length).toBeGreaterThan(0);
  });

  test('shows over target when needs exceeds 55%', () => {
    const over = {
      allocations: { savings: 5, loans: 20, rent: 35, food: 15, transport: 10, leisure: 10, bills: 5 },
    };
    // needs = 20+35+15+10+5 = 85%
    render(<RatioChecker {...over} />);
    expect(screen.getByText(/over target/)).toBeInTheDocument();
  });

  test('shows under target for savings when savings = 5%', () => {
    const low = {
      allocations: { savings: 5, loans: 5, rent: 30, food: 15, transport: 10, leisure: 25, bills: 5 },
    };
    // savings = 5% vs ideal 20% → -15% → under target
    render(<RatioChecker {...low} />);
    const underItems = screen.getAllByText(/under target/);
    expect(underItems.length).toBeGreaterThan(0);
  });

  test('shows over target for wants when leisure = 50%', () => {
    const highWants = {
      allocations: { savings: 20, loans: 5, rent: 15, food: 5, transport: 5, leisure: 50, bills: 0 },
    };
    // wants = 50% vs ideal 30% → +20% → over target
    render(<RatioChecker {...highWants} />);
    expect(screen.getByText(/over target/)).toBeInTheDocument();
  });

  test('calculates needs correctly (rent+food+bills+transport+loans)', () => {
    const allocations = { savings: 20, loans: 10, rent: 30, food: 12, transport: 8, leisure: 8, bills: 7 };
    render(<RatioChecker allocations={allocations} />);
    // needs = 10+30+12+8+7 = 67%
    expect(screen.getByText(/67\.0%/)).toBeInTheDocument();
  });

  test('renders the guiding note at the bottom', () => {
    render(<RatioChecker {...balanced} />);
    expect(screen.getByText(/guide, not a law/)).toBeInTheDocument();
  });

  test('handles zero allocations gracefully', () => {
    const zero = { allocations: {} };
    expect(() => render(<RatioChecker {...zero} />)).not.toThrow();
  });
});
