import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryStatistics from './SummaryStatistics';

// Mock the ui components and utils
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }) => <div data-testid="card-title">{children}</div>,
  CardContent: ({ children }) => <div data-testid="card-content">{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} data-testid="button">
      {children}
    </button>
  ),
}));

jest.mock('@/lib/utils', () => ({
  formatCurrency: jest.fn(val => `$${val.toFixed(2)}`),
}));

describe('SummaryStatistics', () => {
  const mockAverageMetrics = {
    avgRevenue: 1000000,
    avgProfit: 500000,
    avgPrice: 5000000,
    avgPriceToRevenue: '5.0x',
    avgPriceToProfit: '10.0x',
  };

  const mockGenerateReport = jest.fn();

  test('renders without crashing', () => {
    render(<SummaryStatistics averageMetrics={{}} hasUploadedData={false} generateReport={() => {}} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  test('displays "No Data Available" message when no data is uploaded', () => {
    render(<SummaryStatistics averageMetrics={{}} hasUploadedData={false} generateReport={() => {}} />);
    expect(screen.getByText('No Data Available')).toBeInTheDocument();
    expect(screen.getByText('Upload data from the File Management page to see summary statistics.')).toBeInTheDocument();
  });

  test('displays correct statistics when data is available', () => {
    render(<SummaryStatistics averageMetrics={mockAverageMetrics} hasUploadedData={true} generateReport={mockGenerateReport} />);
    expect(screen.getByText('Avg Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1000000.00')).toBeInTheDocument();
    expect(screen.getByText('Avg Profit')).toBeInTheDocument();
    expect(screen.getByText('$500000.00')).toBeInTheDocument();
    expect(screen.getByText('Avg Price')).toBeInTheDocument();
    expect(screen.getByText('$5000000.00')).toBeInTheDocument();
    expect(screen.getByText('Avg PriceToRevenue')).toBeInTheDocument();
    expect(screen.getByText('5.0x')).toBeInTheDocument();
    expect(screen.getByText('Avg PriceToProfit')).toBeInTheDocument();
    expect(screen.getByText('10.0x')).toBeInTheDocument();
  });

  test('handles edge case with empty averageMetrics', () => {
    render(<SummaryStatistics averageMetrics={{}} hasUploadedData={true} generateReport={mockGenerateReport} />);
    expect(screen.queryAllByText('N/A')).toHaveLength(0);
    expect(screen.getByTestId('card-content').children).toHaveLength(1);
    expect(screen.getByText('Generate Report')).toBeInTheDocument();
  });

  test('Generate Report button is enabled when data is available', () => {
    render(<SummaryStatistics averageMetrics={mockAverageMetrics} hasUploadedData={true} generateReport={mockGenerateReport} />);
    const button = screen.getByText('Generate Report');
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(mockGenerateReport).toHaveBeenCalled();
  });

  test('Generate Report button is not rendered when no data is available', () => {
    render(<SummaryStatistics averageMetrics={{}} hasUploadedData={false} generateReport={mockGenerateReport} />);
    expect(screen.queryByText('Generate Report')).not.toBeInTheDocument();
  });
});