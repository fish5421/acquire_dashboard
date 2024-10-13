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
    if (file.name === 'invalid.txt') {
      config.error({ message: 'Invalid file type' });
    } else if (file.name === 'empty.csv') {
      config.complete({ data: [] });
    } else {
      setTimeout(() => {
        config.complete({
          data: [
            { 'Business Type': 'Tech', 'TTM Revenue': 1000000, 'TTM Profit': 500000, 'Asking Price': 5000000 },
            { 'Business Type': 'Retail', 'TTM Revenue': 2000000, 'TTM Profit': 750000, 'Asking Price': 7500000 },
            { 'Business Type': 'Tech', 'TTM Revenue': 1500000, 'TTM Profit': 600000, 'Asking Price': 6000000 },
          ],
        });
      }, 100);
    }
  }),
}));

// Custom render function
const renderApp = () => {
  return render(
    <MemoryRouter initialEntries={['/file-management']}>
      <App />
    </MemoryRouter>
  );
};

// Helper function for file upload
const uploadFile = async (fileName = 'test.csv') => {
  const fileInput = screen.getByTestId('file-input');
  const file = new File(['test'], fileName, { type: 'text/csv' });
  await act(async () => {
    userEvent.upload(fileInput, file);
  });
  const uploadButton = screen.getByTestId('upload-button');
  await act(async () => {
    fireEvent.click(uploadButton);
  });
};

describe('File Upload and Filter Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('Uploading a valid file updates the Dashboard components', async () => {
    renderApp();

    await uploadFile();

    await waitFor(() => {
      expect(screen.queryByText('100% Uploaded')).toBeInTheDocument();
    }, { timeout: 5000 });

    const dashboardLink = screen.getByText('Dashboard');
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    await waitFor(() => {
      expect(screen.getByText(/Avg Revenue/i)).toBeInTheDocument();
      expect(screen.getByText(/Avg Profit/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Listings/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4); // 3 data rows + 1 header row
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Retail')).toBeInTheDocument();

    expect(screen.getByTestId('revenue-price-chart')).toBeInTheDocument();
    expect(screen.getByTestId('profit-price-chart')).toBeInTheDocument();
  });

  test('Applying and clearing filters updates the StartupDetailsTable', async () => {
    renderApp();
    await uploadFile();

    const dashboardLink = screen.getByText('Dashboard');
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    // Apply Business Type filter
    const businessTypeFilter = await screen.findByLabelText('Business Type');
    await act(async () => {
      fireEvent.change(businessTypeFilter, { target: { value: 'Tech' } });
    });

    await waitFor(() => {
      const filteredRows = screen.getAllByRole('row');
      expect(filteredRows).toHaveLength(3); // 2 Tech rows + 1 header row
      expect(screen.queryByText('Retail')).not.toBeInTheDocument();
    });

    // Clear filters
    const clearFiltersButton = screen.getByText('Clear Filters');
    await act(async () => {
      fireEvent.click(clearFiltersButton);
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // All 3 rows + 1 header row
      expect(screen.getByText('Retail')).toBeInTheDocument();
    });
  });

  test('Uploading an invalid file shows an error message', async () => {
    renderApp();
    await uploadFile('invalid.txt');

    await waitFor(() => {
      expect(screen.getByText(/Unsupported file type/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('Uploading an empty file shows appropriate message', async () => {
    renderApp();
    await uploadFile('empty.csv');

    await waitFor(() => {
      expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('Multiple range filters interact correctly', async () => {
    renderApp();
    await uploadFile();

    const dashboardLink = screen.getByText('Dashboard');
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    // Apply revenue filter
    const minRevenueInput = await screen.findByLabelText('Min Revenue');
    await act(async () => {
      fireEvent.change(minRevenueInput, { target: { value: '1200000' } });
    });

    // Apply profit filter
    const minProfitInput = await screen.findByLabelText('Min Profit');
    await act(async () => {
      fireEvent.change(minProfitInput, { target: { value: '600000' } });
    });

    await waitFor(() => {
      const filteredRows = screen.getAllByRole('row');
      expect(filteredRows).toHaveLength(2); // 1 data row (Retail) + 1 header row
      expect(screen.getByText('Retail')).toBeInTheDocument();
      expect(screen.queryByText('Tech')).not.toBeInTheDocument();
    });
  });
});