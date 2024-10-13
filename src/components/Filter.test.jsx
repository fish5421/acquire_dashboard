import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Filter from './Filter';
import { DashboardContext } from '../context/DashboardContext';

// Mock the DashboardContext
const mockContextValue = {
  filters: {
    revenue: [0, 10000000],
    profit: [0, 10000000],
    price: [0, 100000000],
    businessType: 'all'
  },
  setFilters: jest.fn(),
  filterRanges: {
    revenue: [0, 10000000],
    profit: [0, 10000000],
    price: [0, 100000000],
  },
};

const renderWithContext = (component) => {
  return render(
    <DashboardContext.Provider value={mockContextValue}>
      {component}
    </DashboardContext.Provider>
  );
};

describe('Filter Component', () => {
  test('renders without crashing', () => {
    renderWithContext(<Filter data={[]} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  test('displays "No Data to Display" message when data is empty', () => {
    renderWithContext(<Filter data={[]} />);
    expect(screen.getByText('No Data to Display')).toBeInTheDocument();
  });

  test('renders filter options when data is provided', () => {
    const mockData = [
      { 'Business Type': 'Tech', 'TTM Revenue': 1000000, 'TTM Profit': 500000, 'Asking Price': 5000000 },
      { 'Business Type': 'Retail', 'TTM Revenue': 2000000, 'TTM Profit': 750000, 'Asking Price': 7500000 },
    ];
    renderWithContext(<Filter data={mockData} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Profit')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Business Type')).toBeInTheDocument();
  });

  test('handles undefined data gracefully', async () => {
    renderWithContext(<Filter data={undefined} />);
    await waitFor(() => {
      expect(screen.getByText('Loading filters...')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('populates business types correctly from data', async () => {
    const mockData = [
      { 'Business Type': 'Tech', 'TTM Revenue': 1000000, 'TTM Profit': 500000, 'Asking Price': 5000000 },
      { 'Business Type': 'Retail', 'TTM Revenue': 2000000, 'TTM Profit': 750000, 'Asking Price': 7500000 },
    ];
    renderWithContext(<Filter data={mockData} />);
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    // Check if the select element has the correct placeholder
    expect(screen.getByText('Select a business type')).toBeInTheDocument();

    fireEvent.click(selectElement);

    // Wait for the select options to be rendered
    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Tech')).toBeInTheDocument();
      expect(screen.getByText('Retail')).toBeInTheDocument();
    });
  });

  test('disables filter options when there is no data', () => {
    renderWithContext(<Filter data={[]} />);
    const rangeInputs = screen.queryAllByRole('slider');
    rangeInputs.forEach(input => {
      expect(input).toBeDisabled();
    });
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  test('renders "Reset All Filters" button', () => {
    renderWithContext(<Filter data={[]} />);
    expect(screen.getByText('Reset All Filters')).toBeInTheDocument();
  });
});