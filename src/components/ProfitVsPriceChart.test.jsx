import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfitVsPriceChart from './ProfitVsPriceChart';
import { DashboardContext } from '../context/DashboardContext';

// Mock the recharts library
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  ScatterChart: ({ children }) => <div data-testid="scatter-chart">{children}</div>,
  Scatter: () => <div data-testid="scatter" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

// Mock the utils functions
jest.mock('@/lib/utils', () => ({
  formatCompactNumber: jest.fn(val => `${val}`),
  formatCurrency: jest.fn(val => `$${val}`),
}));

describe('ProfitVsPriceChart', () => {
  const defaultContextValue = {
    data: [
      { 'TTM Profit': 500000, 'Asking Price': 5000000, 'Business Type': 'Tech' },
      { 'TTM Profit': 1000000, 'Asking Price': 8000000, 'Business Type': 'Retail' },
    ],
    filters: {
      revenue: [0, 10000000],
      profit: [0, 10000000],
      price: [0, 100000000],
      businessType: 'all'
    },
  };

  const renderWithContext = (ui, contextValue = defaultContextValue) => {
    return render(
      <DashboardContext.Provider value={contextValue}>
        {ui}
      </DashboardContext.Provider>
    );
  };

  test('renders chart with sample data', () => {
    renderWithContext(<ProfitVsPriceChart />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('scatter')).toBeInTheDocument();
  });

  test('handles empty data scenario', () => {
    const emptyContextValue = { ...defaultContextValue, data: [] };
    renderWithContext(<ProfitVsPriceChart />, emptyContextValue);
    
    // The chart should still render, but with default domains
    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
  });

  test('updates chart when data changes', () => {
    const { rerender } = renderWithContext(<ProfitVsPriceChart />);
    
    expect(screen.getByTestId('scatter')).toBeInTheDocument();

    const newContextValue = {
      ...defaultContextValue,
      data: [{ 'TTM Profit': 1500000, 'Asking Price': 10000000, 'Business Type': 'SaaS' }],
    };

    rerender(
      <DashboardContext.Provider value={newContextValue}>
        <ProfitVsPriceChart />
      </DashboardContext.Provider>
    );
    
    expect(screen.getByTestId('scatter')).toBeInTheDocument();
  });
});