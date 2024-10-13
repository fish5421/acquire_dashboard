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

const renderApp = () => {
  return render(
    <MemoryRouter initialEntries={['/file-management']}>
      <App />
    </MemoryRouter>
  );
};

describe('Cross-component Data Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('Data flows correctly between FileUpload, Dashboard, and child components', async () => {
    renderApp();

    // Step 1: Upload file
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

    // Step 2: Navigate to Dashboard
    const dashboardLink = screen.getByText('Dashboard');
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    // Step 3: Verify initial state in all components
    await waitFor(() => {
      // Check SummaryStatistics
      expect(screen.getByText('$1,500,000.00')).toBeInTheDocument(); // Avg Revenue
      expect(screen.getByText('$616,666.67')).toBeInTheDocument(); // Avg Profit
      expect(screen.getByText('3')).toBeInTheDocument(); // Total Listings

      // Check StartupDetailsTable
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // 3 data rows + 1 header row

      // Check Charts
      expect(screen.getByTestId('revenue-price-chart')).toBeInTheDocument();
      expect(screen.getByTestId('profit-price-chart')).toBeInTheDocument();
    });

    // Step 4: Apply filter and verify data flow
    const businessTypeFilter = screen.getByLabelText('Business Type');
    await act(async () => {
      fireEvent.change(businessTypeFilter, { target: { value: 'Tech' } });
    });

    await waitFor(() => {
      // Check updated SummaryStatistics
      expect(screen.getByText('$1,250,000.00')).toBeInTheDocument(); // New Avg Revenue
      expect(screen.getByText('$550,000.00')).toBeInTheDocument(); // New Avg Profit
      expect(screen.getByText('2')).toBeInTheDocument(); // New Total Listings

      // Check updated StartupDetailsTable
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3); // 2 Tech rows + 1 header row

      // Verify Charts update (this is a basic check, you might want to add more specific checks)
      expect(screen.getByTestId('revenue-price-chart')).toBeInTheDocument();
      expect(screen.getByTestId('profit-price-chart')).toBeInTheDocument();
    });

    // Step 5: Clear filters and verify data flow back to initial state
    const clearFiltersButton = screen.getByText('Clear Filters');
    await act(async () => {
      fireEvent.click(clearFiltersButton);
    });

    await waitFor(() => {
      // Check SummaryStatistics back to initial state
      expect(screen.getByText('$1,500,000.00')).toBeInTheDocument(); // Avg Revenue
      expect(screen.getByText('$616,666.67')).toBeInTheDocument(); // Avg Profit
      expect(screen.getByText('3')).toBeInTheDocument(); // Total Listings

      // Check StartupDetailsTable back to initial state
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // 3 data rows + 1 header row
    });
  });
});