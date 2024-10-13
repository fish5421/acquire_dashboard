import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import StartupDetailsTable from './StartupDetailsTable';
import { DashboardContext } from '@/context/DashboardContext';

// Mock the ui components
jest.mock('@/components/ui/table', () => ({
  Table: ({ children }) => <table data-testid="table">{children}</table>,
  TableHeader: ({ children }) => <thead data-testid="table-header">{children}</thead>,
  TableBody: ({ children }) => <tbody data-testid="table-body">{children}</tbody>,
  TableHead: ({ children, onClick }) => <th data-testid="table-head" onClick={onClick}>{children}</th>,
  TableRow: ({ children }) => <tr data-testid="table-row">{children}</tr>,
  TableCell: ({ children }) => <td data-testid="table-cell">{children}</td>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('@/lib/utils', () => ({
  formatCurrency: jest.fn(val => `$${val}`),
  calculateFinancialRatio: jest.fn(() => '2.5x'),
}));

jest.mock('lucide-react', () => ({
  Trash2: () => <span>Trash Icon</span>,
  ArrowUpDown: () => <span>Sort Icon</span>,
}));

describe('StartupDetailsTable', () => {
  const mockData = [
    { id: 1, 'Business Type': 'Tech', 'TTM Revenue': 1000000, 'TTM Profit': 500000, 'Asking Price': 5000000, 'marketplace-card href': 'http://example.com/1' },
    { id: 2, 'Business Type': 'Retail', 'TTM Revenue': 2000000, 'TTM Profit': 750000, 'Asking Price': 7500000, 'marketplace-card href': 'http://example.com/2' },
    { id: 3, 'Business Type': 'SaaS', 'TTM Revenue': 1500000, 'TTM Profit': 600000, 'Asking Price': 6000000, 'marketplace-card href': 'http://example.com/3' },
  ];

  const mockOnSort = jest.fn();
  const mockRemoveListingFromData = jest.fn();

  const renderWithContext = (ui, contextValue) => {
    return render(
      <DashboardContext.Provider value={contextValue}>
        {ui}
      </DashboardContext.Provider>
    );
  };

  test('renders table with sample data', () => {
    renderWithContext(
      <StartupDetailsTable data={mockData} onSort={mockOnSort} sortConfig={{ key: null, direction: 'ascending' }} />,
      { removeListingFromData: mockRemoveListingFromData }
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getAllByTestId('table-row')).toHaveLength(mockData.length + 1); // +1 for header row
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Retail')).toBeInTheDocument();
    expect(screen.getByText('SaaS')).toBeInTheDocument();
  });

  test('calls onSort when table header is clicked', () => {
    renderWithContext(
      <StartupDetailsTable data={mockData} onSort={mockOnSort} sortConfig={{ key: null, direction: 'ascending' }} />,
      { removeListingFromData: mockRemoveListingFromData }
    );

    const businessTypeHeader = screen.getByText('Business Type').closest('th');
    fireEvent.click(businessTypeHeader);
    expect(mockOnSort).toHaveBeenCalledWith('Business Type');
  });

  test('shows correct number of pages', () => {
    const largeDataSet = Array(30).fill().map((_, index) => ({
      id: index + 1,
      'Business Type': 'Tech',
      'TTM Revenue': 1000000,
      'TTM Profit': 500000,
      'Asking Price': 5000000,
      'marketplace-card href': `http://example.com/${index + 1}`
    }));

    renderWithContext(
      <StartupDetailsTable data={largeDataSet} onSort={mockOnSort} sortConfig={{ key: null, direction: 'ascending' }} />,
      { removeListingFromData: mockRemoveListingFromData }
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2); // 30 items with 25 per page = 2 pages
  });

  test('changes page when pagination is clicked', () => {
    const largeDataSet = Array(30).fill().map((_, index) => ({
      id: index + 1,
      'Business Type': `Tech ${index + 1}`,
      'TTM Revenue': 1000000,
      'TTM Profit': 500000,
      'Asking Price': 5000000,
      'marketplace-card href': `http://example.com/${index + 1}`
    }));

    renderWithContext(
      <StartupDetailsTable data={largeDataSet} onSort={mockOnSort} sortConfig={{ key: null, direction: 'ascending' }} />,
      { removeListingFromData: mockRemoveListingFromData }
    );

    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText('Tech 26')).toBeInTheDocument();
  });

  test('calls removeListingFromData when remove button is clicked', () => {
    renderWithContext(
      <StartupDetailsTable data={mockData} onSort={mockOnSort} sortConfig={{ key: null, direction: 'ascending' }} />,
      { removeListingFromData: mockRemoveListingFromData }
    );

    const removeButtons = screen.getAllByText('Trash Icon');
    fireEvent.click(removeButtons[0]);

    // We use setTimeout in the component, so we need to wait for it
    setTimeout(() => {
      expect(mockRemoveListingFromData).toHaveBeenCalledWith(0);
    }, 400);
  });

  test('changes records per page when dropdown is changed', () => {
    const largeDataSet = Array(60).fill().map((_, index) => ({
      id: index + 1,
      'Business Type': `Tech ${index + 1}`,
      'TTM Revenue': 1000000,
      'TTM Profit': 500000,
      'Asking Price': 5000000,
      'marketplace-card href': `http://example.com/${index + 1}`
    }));

    renderWithContext(
      <StartupDetailsTable data={largeDataSet} onSort={mockOnSort} sortConfig={{ key: null, direction: 'ascending' }} />,
      { removeListingFromData: mockRemoveListingFromData }
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '50' } });

    expect(screen.getAllByTestId('table-row')).toHaveLength(51); // 50 data rows + 1 header row
  });
});