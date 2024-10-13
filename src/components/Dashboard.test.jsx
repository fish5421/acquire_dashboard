import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import { DashboardContext } from '../context/DashboardContext';

// Mock child components
jest.mock('./Filter', () => () => <div data-testid="mock-filter">Filter Component</div>);
jest.mock('./StartupDetailsTable', () => () => <div data-testid="mock-startup-details-table">Startup Details Table</div>);
jest.mock('./RevenueVsPriceChart', () => () => <div data-testid="mock-revenue-price-chart">Revenue vs Price Chart</div>);
jest.mock('./ProfitVsPriceChart', () => () => <div data-testid="mock-profit-price-chart">Profit vs Price Chart</div>);
jest.mock('./SummaryStatistics', () => () => <div data-testid="mock-summary-statistics">Summary Statistics</div>);

// Mock context
const mockContextValue = {
  data: [
    { 'Business Type': 'Tech', 'TTM Revenue': 1000000, 'TTM Profit': 500000, 'Asking Price': 5000000 },
    { 'Business Type': 'Retail', 'TTM Revenue': 2000000, 'TTM Profit': 750000, 'Asking Price': 7500000 },
  ],
  filters: {
    revenue: [0, 10000000],
    profit: [0, 10000000],
    price: [0, 100000000],
    businessType: 'all'
  },
  updateFilterRanges: jest.fn(),
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderWithContext = (ui, contextValue = mockContextValue) => {
    return render(
      <DashboardContext.Provider value={contextValue}>
        {ui}
      </DashboardContext.Provider>
    );
  };

  test('renders without crashing', () => {
    renderWithContext(<Dashboard />);
    expect(screen.getByText('Dashboard 2.0')).toBeInTheDocument();
  });

  test('displays loading message when isLoading is true', () => {
    renderWithContext(<Dashboard isLoading={true} />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  test('displays all child components when data is available', async () => {
    renderWithContext(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-filter')).toBeInTheDocument();
      expect(screen.getByTestId('mock-summary-statistics')).toBeInTheDocument();
      expect(screen.getByTestId('mock-revenue-price-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mock-profit-price-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mock-startup-details-table')).toBeInTheDocument();
    });
  });

  test('displays onboarding overlay for first-time visitors', () => {
    renderWithContext(<Dashboard />);
    expect(screen.getByText('Welcome to Dashboard 2.0!')).toBeInTheDocument();
  });

  test('hides onboarding overlay after clicking "Get Started"', async () => {
    renderWithContext(<Dashboard />);
    fireEvent.click(screen.getByText('Get Started'));
    await waitFor(() => {
      expect(screen.queryByText('Welcome to Dashboard 2.0!')).not.toBeInTheDocument();
    });
  });

  test('displays empty state messages when no data is available', () => {
    const emptyContextValue = { ...mockContextValue, data: [] };
    renderWithContext(<Dashboard />, emptyContextValue);
    expect(screen.getByText('No Data to Display')).toBeInTheDocument();
    expect(screen.getByText('No Startup Data Available')).toBeInTheDocument();
  });

  test('handles errors gracefully', () => {
    console.error = jest.fn(); // Suppress console.error for this test
    const errorContextValue = { ...mockContextValue, data: null };
    renderWithContext(<Dashboard />, errorContextValue);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  test('displays contextual help tooltips on hover', async () => {
    renderWithContext(<Dashboard />);
    fireEvent.mouseEnter(screen.getAllByRole('presentation')[0]);
    await waitFor(() => {
      expect(screen.getByText('This chart shows the relationship between a startup\'s revenue and its asking price')).toBeInTheDocument();
    });
  });
});