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
    <MemoryRouter initialEntries={['/file-management']}>
      <App />
    </MemoryRouter>
  );
};

// Helper function for file upload
const uploadFile = async () => {
  const fileInput = screen.getByTestId('file-input');
  const file = new File(['test'], 'test.csv', { type: 'text/csv' });
  await act(async () => {
    userEvent.upload(fileInput, file);
  });
  const uploadButton = screen.getByTestId('upload-button');
  await act(async () => {
    fireEvent.click(uploadButton);
  });
};

describe('State Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('Dashboard state persists when navigating away and back', async () => {
    renderApp();

    // Upload file and navigate to Dashboard
    await uploadFile();
    await waitFor(() => {
      expect(screen.queryByText('100% Uploaded')).toBeInTheDocument();
    }, { timeout: 5000 });

    const dashboardLink = screen.getByText('Dashboard');
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    // Apply filters
    const businessTypeFilter = await screen.findByLabelText('Business Type');
    await act(async () => {
      fireEvent.change(businessTypeFilter, { target: { value: 'Tech' } });
    });

    const minRevenueInput = await screen.findByLabelText('Min Revenue');
    await act(async () => {
      fireEvent.change(minRevenueInput, { target: { value: '1200000' } });
    });

    // Verify filtered state
    await waitFor(() => {
      const filteredRows = screen.getAllByRole('row');
      expect(filteredRows).toHaveLength(2); // 1 Tech row (revenue > 1.2M) + 1 header row
    });

    // Navigate away from Dashboard
    const fileManagementLink = screen.getByText('File Management');
    await act(async () => {
      fireEvent.click(fileManagementLink);
    });

    // Navigate back to Dashboard
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    // Verify that filters are still applied
    await waitFor(() => {
      const filteredRows = screen.getAllByRole('row');
      expect(filteredRows).toHaveLength(2); // 1 Tech row (revenue > 1.2M) + 1 header row
    });

    expect(screen.getByLabelText('Business Type')).toHaveValue('Tech');
    expect(screen.getByLabelText('Min Revenue')).toHaveValue('1200000');
  });

  test('File upload state persists when navigating away and back', async () => {
    renderApp();

    // Upload file
    await uploadFile();
    await waitFor(() => {
      expect(screen.queryByText('100% Uploaded')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Navigate to Dashboard
    const dashboardLink = screen.getByText('Dashboard');
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    // Verify data is loaded
    await waitFor(() => {
      expect(screen.getByText(/Avg Revenue/i)).toBeInTheDocument();
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // 3 data rows + 1 header row
    });

    // Navigate back to File Management
    const fileManagementLink = screen.getByText('File Management');
    await act(async () => {
      fireEvent.click(fileManagementLink);
    });

    // Verify file upload state is maintained
    expect(screen.queryByText('100% Uploaded')).toBeInTheDocument();

    // Navigate to Dashboard again
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    // Verify data is still loaded without re-uploading
    await waitFor(() => {
      expect(screen.getByText(/Avg Revenue/i)).toBeInTheDocument();
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // 3 data rows + 1 header row
    });
  });
});