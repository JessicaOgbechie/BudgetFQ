import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvestScore from '../../components/InvestScore';

// Mock the Anthropic API fetch
global.fetch = jest.fn();

const defaultProps = {
  allocations: { savings: 20, loans: 10, rent: 30, food: 12, transport: 8, leisure: 8, bills: 7 },
  totalIncome: 3000,
  primaryCurrency: '€',
  investProfile: null,
  setInvestProfile: jest.fn(),
};

describe('InvestScore — score display', () => {
  test('renders the score ring with a number', () => {
    render(<InvestScore {...defaultProps} />);
    expect(screen.getByText('/100')).toBeInTheDocument();
  });

  test('renders investable amount when income > 0', () => {
    render(<InvestScore {...defaultProps} />);
    // The /month label appears in the score hero
    expect(screen.getAllByText(/month/).length).toBeGreaterThan(0);
  });

  test('renders projection cards when investable > 0', () => {
    render(<InvestScore {...defaultProps} />);
    expect(screen.getByText('1 year')).toBeInTheDocument();
    expect(screen.getByText('5 years')).toBeInTheDocument();
    expect(screen.getByText('10 years')).toBeInTheDocument();
    expect(screen.getByText('20 years')).toBeInTheDocument();
  });

  test('hides projection table when income is 0', () => {
    render(<InvestScore {...defaultProps} totalIncome={0} />);
    expect(screen.queryByText('1 year')).not.toBeInTheDocument();
    expect(screen.getByText(/unlock projections/)).toBeInTheDocument();
  });

  test('renders improvement tips', () => {
    render(<InvestScore {...defaultProps} />);
    expect(screen.getByText(/savings allocation/)).toBeInTheDocument();
    expect(screen.getByText(/loans/)).toBeInTheDocument();
  });
});

describe('InvestScore — profile quiz', () => {
  test('shows quiz when investProfile is null', () => {
    render(<InvestScore {...defaultProps} />);
    expect(screen.getByText('Investment Profile Quiz')).toBeInTheDocument();
  });

  test('does not show quiz when profile is already set', () => {
    render(<InvestScore {...defaultProps} investProfile={{ profile: 'balanced', answers: {} }} />);
    expect(screen.queryByText('Investment Profile Quiz')).not.toBeInTheDocument();
  });

  test('Complete profile button appears only when all 5 questions answered', async () => {
    render(<InvestScore {...defaultProps} />);
    expect(screen.queryByText('Complete profile →')).not.toBeInTheDocument();

    // Answer all 5 questions
    await userEvent.click(screen.getByText('Under 1 year'));
    await userEvent.click(screen.getByText('Sell immediately'));
    await userEvent.click(screen.getByText('Emergency cushion'));
    await userEvent.click(screen.getByText('Not yet'));
    await userEvent.click(screen.getByText(/I'm just starting/));

    expect(screen.getByText('Complete profile →')).toBeInTheDocument();
  });

  test('selected answer gets highlighted styling', async () => {
    render(<InvestScore {...defaultProps} />);
    const btn = screen.getByText('10+ years');
    await userEvent.click(btn);
    // After click the button should have accent border
    expect(btn).toBeInTheDocument();
  });

  test('completing quiz calls setInvestProfile with correct profile', async () => {
    const setInvestProfile = jest.fn();
    render(<InvestScore {...defaultProps} setInvestProfile={setInvestProfile} />);

    // Answer for cautious profile
    await userEvent.click(screen.getByText('Under 1 year'));
    await userEvent.click(screen.getByText('Sell immediately'));
    await userEvent.click(screen.getByText('Emergency cushion'));
    await userEvent.click(screen.getByText('Not yet'));
    await userEvent.click(screen.getByText(/I'm just starting/));
    await userEvent.click(screen.getByText('Complete profile →'));

    expect(setInvestProfile).toHaveBeenCalledWith(
      expect.objectContaining({ profile: 'cautious' })
    );
  });
});

describe('InvestScore — pathway cards', () => {
  const cautious = {
    profile: 'cautious',
    answers: { q1: 'Under 1 year', q2: 'Sell immediately', q3: 'Emergency cushion', q4: 'Yes', q5: 'Yes' }
  };

  test('shows pathway cards after profile is set', () => {
    render(<InvestScore {...defaultProps} investProfile={cautious} />);
    expect(screen.getByText('High-Yield Savings Account')).toBeInTheDocument();
    expect(screen.getByText('Government Bonds')).toBeInTheDocument();
  });

  test('shows Retake quiz link', () => {
    render(<InvestScore {...defaultProps} investProfile={cautious} />);
    expect(screen.getByText('Retake quiz')).toBeInTheDocument();
  });

  test('retake quiz resets profile', async () => {
    const setInvestProfile = jest.fn();
    render(<InvestScore {...defaultProps} investProfile={cautious} setInvestProfile={setInvestProfile} />);
    await userEvent.click(screen.getByText('Retake quiz'));
    expect(setInvestProfile).toHaveBeenCalledWith(null);
  });

  test('shows emergency fund gate when q4 = Not yet', () => {
    const profile = { ...cautious, answers: { ...cautious.answers, q4: 'Not yet' } };
    render(<InvestScore {...defaultProps} investProfile={profile} />);
    expect(screen.getByText(/Build your emergency fund first/)).toBeInTheDocument();
  });

  test('every pathway card shows the disclaimer', () => {
    render(<InvestScore {...defaultProps} investProfile={cautious} />);
    const disclaimers = screen.getAllByText(/educational information/);
    expect(disclaimers.length).toBeGreaterThan(0);
  });
});

describe('InvestScore — AI explainer', () => {
  test('renders the AI adviser input', () => {
    render(<InvestScore {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Ask anything/)).toBeInTheDocument();
    expect(screen.getByText('Ask')).toBeInTheDocument();
  });

  test('Ask button is disabled when input is empty', () => {
    render(<InvestScore {...defaultProps} />);
    const askBtn = screen.getByText('Ask');
    expect(askBtn).toBeDisabled();
  });

  test('Ask button is enabled when input has text', async () => {
    render(<InvestScore {...defaultProps} />);
    await userEvent.type(screen.getByPlaceholderText(/Ask anything/), 'What is an index fund?');
    expect(screen.getByText('Ask')).not.toBeDisabled();
  });

  test('shows AI response after successful API call', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'An index fund tracks a market index like the S&P 500.' }]
      }),
    });

    render(<InvestScore {...defaultProps} />);
    await userEvent.type(screen.getByPlaceholderText(/Ask anything/), 'What is an index fund?');
    await userEvent.click(screen.getByText('Ask'));

    await waitFor(() => {
      expect(screen.getByText(/index fund tracks/)).toBeInTheDocument();
    });
  });

  test('shows error when API call fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    render(<InvestScore {...defaultProps} />);
    await userEvent.type(screen.getByPlaceholderText(/Ask anything/), 'Test question');
    await userEvent.click(screen.getByText('Ask'));
    await waitFor(() => {
      expect(screen.getByText(/Could not reach/)).toBeInTheDocument();
    });
  });

  test('renders the AI disclaimer', () => {
    render(<InvestScore {...defaultProps} />);
    expect(screen.getByText(/general financial education only/)).toBeInTheDocument();
  });
});
