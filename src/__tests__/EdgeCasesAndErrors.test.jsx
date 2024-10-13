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

// Mock Papa Parse with different scenarios
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

describe('Edge Cases and Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('Uploading an empty file shows appropriate message', async () => {
    mockPapaParse.mockImplementation((file, config) => {
      setTimeout(() => {
        config.complete({ data: [] });
      }, 100);
    });

    renderApp();

    const fileInput = screen.getByTestId('file-input');
    const file = new File([''], 'empty.csv', { type: 'text/csv' });
    await act(async () => {
      userEvent.upload(fileInput, file);
    });

    const uploadButton = screen.getByTestId('upload-button');
    await act(async () => {
      fireEvent.click(uploadButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('Uploading an invalid file format shows error message', async () => {
    mockPapaParse.mockImplementation((file, config) => {
      setTimeout(() => {
        config.error({ message: 'Invalid file type' });
      }, 100);
    });

    renderApp();

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['invalid data'], 'invalid.txt', { type: 'text/plain' });
    await act(async () => {
      userEvent.upload(fileInput, file);
    });

    const uploadButton = screen.getByTestId('upload-button');
    await act(async () => {
      fireEvent.click(uploadButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('Applying filters with no matching results shows appropriate message', async () => {
    mockPapaParse.mockImplementation((file, config) => {
      setTimeout(() => {
        config.complete({
          data: [
            { 'Business Type': 'Tech', 'TTM Revenue': 1000000, 'TTM Profit': 500000, 'Asking Price': 5000000 },
            { 'Business Type': 'Retail', 'TTM Revenue': 2000000, 'TTM Profit': 750000, 'Asking Price': 7500000 },
          ],
        });
      }, 100);
    });

    renderApp();

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

    const dashboardLink = screen.getByText('Dashboard');
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    // Apply impossible filter combination
    const businessTypeFilter = await screen.findByLabelText('Business Type');
    await act(async () => {
      fireEvent.change(businessTypeFilter, { target: { value: 'Tech' } });
    });

    const minRevenueInput = await screen.findByLabelText('Min Revenue');
    await act(async () => {
      fireEvent.change(minRevenueInput, { target: { value: '3000000' } });
    });

    await waitFor(() => {
      expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    });
  });

  test('Handling network error during file upload', async () => {
    mockPapaParse.mockImplementation((file, config) => {
      setTimeout(() => {
        config.error({ message: 'Network error' });
      }, 100);
    });

    renderApp();

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
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});