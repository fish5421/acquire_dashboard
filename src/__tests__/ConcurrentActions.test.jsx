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

describe('Concurrent User Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('Handles rapid filter changes correctly', async () => {
    renderApp();

    // Upload file and navigate to Dashboard
    const fileInput = await screen.findByTestId('file-input', {}, { timeout: 5000 });
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    await act(async () => {
      await userEvent.upload(fileInput, file);
    });

    const uploadButton = await screen.findByTestId('upload-button', {}, { timeout: 5000 });
    await act(async () => {
      fireEvent.click(uploadButton);
    });

    // Wait for upload to complete
    await waitFor(() => {
      expect(screen.queryByText('100% Uploaded')).toBeInTheDocument();
    }, { timeout: 10000 });

    const dashboardLink = await screen.findByText('Dashboard', {}, { timeout: 5000 });
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    // Rapid filter changes
    const businessTypeFilter = await screen.findByLabelText('Business Type', {}, { timeout: 5000 });
    const minRevenueInput = await screen.findByLabelText('Min Revenue', {}, { timeout: 5000 });
    const maxRevenueInput = await screen.findByLabelText('Max Revenue', {}, { timeout: 5000 });

    await act(async () => {
      fireEvent.change(businessTypeFilter, { target: { value: 'Tech' } });
      fireEvent.change(minRevenueInput, { target: { value: '1000000' } });
      fireEvent.change(maxRevenueInput, { target: { value: '1500000' } });
    });

    // Wait for the final state
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1); // At least 1 data row + 1 header row
      expect(screen.getByText('$1,000,000.00')).toBeInTheDocument(); // TTM Revenue
    }, { timeout: 10000 });

    // Verify that the filters are applied correctly
    expect(businessTypeFilter).toHaveValue('Tech');
    expect(minRevenueInput).toHaveValue('1000000');
    expect(maxRevenueInput).toHaveValue('1500000');
  }, 30000);

  test('Handles simultaneous file uploads correctly', async () => {
    renderApp();

    const fileInput = await screen.findByTestId('file-input', {}, { timeout: 5000 });
    const file1 = new File(['test1'], 'test1.csv', { type: 'text/csv' });
    const file2 = new File(['test2'], 'test2.csv', { type: 'text/csv' });

    // Upload two files in quick succession
    await act(async () => {
      await userEvent.upload(fileInput, file1);
    });

    const uploadButton = await screen.findByTestId('upload-button', {}, { timeout: 5000 });
    await act(async () => {
      fireEvent.click(uploadButton);
    });

    await act(async () => {
      await userEvent.upload(fileInput, file2);
    });

    await act(async () => {
      fireEvent.click(uploadButton);
    });

    // Wait for the final upload to complete
    await waitFor(() => {
      expect(screen.queryByText('100% Uploaded')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Verify that only the last uploaded file is processed
    const fileList = await screen.findByText(/File List/i, {}, { timeout: 5000 });
    expect(fileList).toHaveTextContent('test2.csv');
    expect(fileList).not.toHaveTextContent('test1.csv');
  }, 30000);

  test('Handles rapid navigation between components', async () => {
    renderApp();

    const dashboardLink = await screen.findByText('Dashboard', {}, { timeout: 5000 });
    const fileManagementLink = await screen.findByRole('link', { name: /File Management/i }, { timeout: 5000 });

    // Rapidly switch between Dashboard and File Management
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        fireEvent.click(dashboardLink);
      });

      await act(async () => {
        fireEvent.click(fileManagementLink);
      });
    }

    // Verify that we end up on the File Management page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Files and assets/i, level: 2 })).toBeInTheDocument();
    }, { timeout: 10000 });

    // Navigate to Dashboard and verify it loads correctly
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    await waitFor(() => {
      expect(screen.getByText(/Avg Revenue/i)).toBeInTheDocument();
      expect(screen.getByText(/Avg Profit/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Listings/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 30000);
});