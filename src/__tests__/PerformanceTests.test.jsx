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

// Mock Papa Parse
const mockPapaParse = jest.fn();
jest.mock('papaparse', () => ({
  parse: (file, config) => mockPapaParse(file, config),
}));

// Custom render function
const renderApp = () => {
  return render(
    <MemoryRouter initialEntries={['/file-management']}>
      <App />
    </MemoryRouter>
  );
};

describe('Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Handling large dataset upload and processing', async () => {
    const largeDataset = Array(10000).fill().map((_, index) => ({
      'Business Type': index % 2 === 0 ? 'Tech' : 'Retail',
      'TTM Revenue': Math.floor(Math.random() * 10000000),
      'TTM Profit': Math.floor(Math.random() * 5000000),
      'Asking Price': Math.floor(Math.random() * 50000000),
    }));

    mockPapaParse.mockImplementation((file, config) => {
      setTimeout(() => {
        config.complete({ data: largeDataset });
      }, 100);
    });

    renderApp();

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['large dataset'], 'large_dataset.csv', { type: 'text/csv' });
    await act(async () => {
      userEvent.upload(fileInput, file);
    });

    const uploadButton = screen.getByTestId('upload-button');
    
    const startTime = performance.now();
    
    await act(async () => {
      fireEvent.click(uploadButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('100% Uploaded')).toBeInTheDocument();
    }, { timeout: 10000 });

    const dashboardLink = screen.getByText('Dashboard');
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    await waitFor(() => {
      expect(screen.getByText(/Avg Revenue/i)).toBeInTheDocument();
      expect(screen.getByText(/Avg Profit/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Listings/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    console.log(`Large dataset processing time: ${processingTime} ms`);

    // Assert that processing time is within acceptable limits (e.g., under 5 seconds)
    expect(processingTime).toBeLessThan(5000);

    // Verify that all data is loaded correctly
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(10001); // 10000 data rows + 1 header row

    // Test filtering performance
    const businessTypeFilter = screen.getByLabelText('Business Type');
    const filterStartTime = performance.now();
    
    await act(async () => {
      fireEvent.change(businessTypeFilter, { target: { value: 'Tech' } });
    });

    await waitFor(() => {
      const filteredRows = screen.getAllByRole('row');
      expect(filteredRows.length).toBe(5001); // 5000 Tech rows + 1 header row
    }, { timeout: 5000 });

    const filterEndTime = performance.now();
    const filterTime = filterEndTime - filterStartTime;

    console.log(`Filtering time for large dataset: ${filterTime} ms`);

    // Assert that filtering time is within acceptable limits (e.g., under 1 second)
    expect(filterTime).toBeLessThan(1000);
  });
});