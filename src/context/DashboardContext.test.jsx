import React, { useContext } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardContext, DashboardProvider } from './DashboardContext';

const TestComponent = () => {
  const context = useContext(DashboardContext);
  return (
    <div>
      <div data-testid="filters">{JSON.stringify(context.filters)}</div>
      <div data-testid="data">{JSON.stringify(context.data)}</div>
      <div data-testid="hasUploadedData">{context.hasUploadedData.toString()}</div>
      <button onClick={() => context.setFilters({ ...context.filters, businessType: 'Tech' })}>
        Update Filters
      </button>
      <button onClick={() => context.setData([{ id: 1, name: 'Test' }])}>
        Update Data
      </button>
      <button onClick={() => context.removeListingFromData(0)}>
        Remove Listing
      </button>
      <button onClick={() => context.setData([
        { 'TTM Revenue': 5000000, 'TTM Profit': 1000000, 'Asking Price': 20000000 },
        { 'TTM Revenue': 8000000, 'TTM Profit': 2000000, 'Asking Price': 30000000 },
      ])}>
        Set New Data
      </button>
    </div>
  );
};

describe('DashboardContext', () => {
  test('renders provider without crashing', () => {
    render(
      <DashboardProvider>
        <div>Test</div>
      </DashboardProvider>
    );
  });

  test('provides default values', () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    const filtersElement = screen.getByTestId('filters');
    expect(filtersElement).toHaveTextContent('"businessType":"all"');
    expect(filtersElement).toHaveTextContent('"revenue":[0,10000000]');
    expect(filtersElement).toHaveTextContent('"profit":[0,10000000]');
    expect(filtersElement).toHaveTextContent('"price":[0,100000000]');

    const dataElement = screen.getByTestId('data');
    expect(dataElement).toHaveTextContent('[]');

    const hasUploadedDataElement = screen.getByTestId('hasUploadedData');
    expect(hasUploadedDataElement).toHaveTextContent('false');
  });

  test('updates filters', () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    fireEvent.click(screen.getByText('Update Filters'));

    const filtersElement = screen.getByTestId('filters');
    expect(filtersElement).toHaveTextContent('"businessType":"Tech"');
  });

  test('updates data and hasUploadedData', () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    fireEvent.click(screen.getByText('Update Data'));

    const dataElement = screen.getByTestId('data');
    expect(dataElement).toHaveTextContent('[{"id":1,"name":"Test"}]');

    const hasUploadedDataElement = screen.getByTestId('hasUploadedData');
    expect(hasUploadedDataElement).toHaveTextContent('true');
  });

  test('removes listing from data', () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    // First, add some data
    fireEvent.click(screen.getByText('Update Data'));

    // Then remove the listing
    fireEvent.click(screen.getByText('Remove Listing'));

    const dataElement = screen.getByTestId('data');
    expect(dataElement).toHaveTextContent('[]');

    const hasUploadedDataElement = screen.getByTestId('hasUploadedData');
    expect(hasUploadedDataElement).toHaveTextContent('false');
  });

  test('updates filter ranges when new data is set', () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    fireEvent.click(screen.getByText('Set New Data'));

    const filtersElement = screen.getByTestId('filters');
    expect(filtersElement).toHaveTextContent('"revenue":[5000000,8000000]');
    expect(filtersElement).toHaveTextContent('"profit":[1000000,2000000]');
    expect(filtersElement).toHaveTextContent('"price":[20000000,30000000]');
  });
});