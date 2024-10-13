import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock modules
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

jest.mock('papaparse', () => ({
  parse: jest.fn((file, config) => {
    setTimeout(() => {
      config.complete({
        data: [
          { 'Business Type': 'Tech', 'TTM Revenue': 1000000, 'TTM Profit': 500000, 'Asking Price': 5000000 },
          { 'Business Type': 'Retail', 'TTM Revenue': 2000000, 'TTM Profit': 750000, 'Asking Price': 7500000 },
          { 'Business Type': 'Tech', 'TTM Revenue': 1500000, 'TTM Profit': 600000, 'Asking Price': 6000000 },
        ],
      });
    }, 100);
  }),
}));

// Custom render function
const renderApp = () => {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
};

describe('User Workflow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('Complete user workflow: Upload file, navigate to dashboard, apply filters, and analyze data', async () => {
    renderApp();

    // Step 1: Navigate to File Management
    const fileManagementLink = screen.getByText('File Management');
    await act(async () => {
      fireEvent.click(fileManagementLink);
    });

    // Step 2: Upload a file
    const fileInput = screen.getByTestId('file-input');
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    await act(async () => {
      userEvent.upload(fileInput, file);
    });

    const uploadButton = screen.getByTestId('upload-button');
    await act(async () => {
      fireEvent.click(uploadButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('100% Uploaded')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Step 3: Navigate to Dashboard
    const dashboardLink = screen.getByText('Dashboard');
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    // Step 4: Verify initial dashboard state
    await waitFor(() => {
      expect(screen.getByText(/Avg Revenue/i)).toBeInTheDocument();
      expect(screen.getByText(/Avg Profit/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Listings/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    const initialRows = screen.getAllByRole('row');
    expect(initialRows).toHaveLength(4); // 3 data rows + 1 header row

    // Step 5: Apply Business Type filter
    const businessTypeFilter = screen.getByLabelText('Business Type');
    await act(async () => {
      fireEvent.change(businessTypeFilter, { target: { value: 'Tech' } });
    });

    // Step 6: Verify filtered state
    await waitFor(() => {
      const filteredRows = screen.getAllByRole('row');
      expect(filteredRows).toHaveLength(3); // 2 Tech rows + 1 header row
      expect(screen.queryByText('Retail')).not.toBeInTheDocument();
    });

    // Step 7: Apply Revenue Range filter
    const minRevenueInput = screen.getByLabelText('Min Revenue');
    await act(async () => {
      fireEvent.change(minRevenueInput, { target: { value: '1200000' } });
    });

    // Step 8: Verify filtered state after range filter
    await waitFor(() => {
      const rangeFilteredRows = screen.getAllByRole('row');
      expect(rangeFilteredRows).toHaveLength(2); // 1 Tech row (revenue > 1.2M) + 1 header row
    });

    // Step 9: Verify chart updates
    expect(screen.getByTestId('revenue-price-chart')).toBeInTheDocument();
    expect(screen.getByTestId('profit-price-chart')).toBeInTheDocument();

    // Step 10: Clear filters
    const clearFiltersButton = screen.getByText('Clear Filters');
    await act(async () => {
      fireEvent.click(clearFiltersButton);
    });

    // Step 11: Verify restored state
    await waitFor(() => {
      const restoredRows = screen.getAllByRole('row');
      expect(restoredRows).toHaveLength(4); // All 3 rows + 1 header row
      expect(screen.getByText('Retail')).toBeInTheDocument();
    });

    // Step 12: Verify summary statistics update
    const avgRevenue = screen.getByText(/Avg Revenue/i);
    const avgProfit = screen.getByText(/Avg Profit/i);
    const totalListings = screen.getByText(/Total Listings/i);

    expect(avgRevenue).toHaveTextContent('$1,500,000.00');
    expect(avgProfit).toHaveTextContent('$616,666.67');
    expect(totalListings).toHaveTextContent('3');
  });
});