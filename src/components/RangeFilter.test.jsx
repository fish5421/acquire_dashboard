import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RangeFilter from './RangeFilter';

jest.mock('@/lib/utils', () => ({
  formatCurrency: jest.fn(val => `$${val}`),
}));

describe('RangeFilter', () => {
  const mockOnChange = jest.fn();
  const presets = [
    { label: 'Low', min: 0, max: 100 },
    { label: 'Medium', min: 100, max: 200 },
    { label: 'High', min: 200, max: 300 },
  ];

  test('renders correctly', () => {
    render(<RangeFilter label="Test Range" min={0} max={300} value={[50, 200]} onChange={mockOnChange} presets={presets} />);
    expect(screen.getByText('Test Range')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimum Test Range')).toHaveValue(50);
    expect(screen.getByLabelText('Maximum Test Range')).toHaveValue(200);
  });

  test('updates minimum value', () => {
    render(<RangeFilter label="Test Range" min={0} max={300} value={[50, 200]} onChange={mockOnChange} presets={presets} />);
    fireEvent.change(screen.getByLabelText('Minimum Test Range'), { target: { value: 60 } });
    expect(mockOnChange).toHaveBeenCalledWith([60, 200]);
  });

  test('updates maximum value', () => {
    render(<RangeFilter label="Test Range" min={0} max={300} value={[50, 200]} onChange={mockOnChange} presets={presets} />);
    fireEvent.change(screen.getByLabelText('Maximum Test Range'), { target: { value: 250 } });
    expect(mockOnChange).toHaveBeenCalledWith([50, 250]);
  });

  test('shows error message for invalid range', () => {
    render(<RangeFilter label="Test Range" min={0} max={300} value={[200, 100]} onChange={mockOnChange} presets={presets} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Min value cannot be greater than max value');
  });

  test('sets values using presets', () => {
    render(<RangeFilter label="Test Range" min={0} max={300} value={[50, 200]} onChange={mockOnChange} presets={presets} />);
    fireEvent.click(screen.getByText('Medium'));
    expect(mockOnChange).toHaveBeenCalledWith([100, 200]);
  });

  test('validates slider changes', () => {
    const { rerender } = render(<RangeFilter label="Test Range" min={0} max={300} value={[50, 200]} onChange={mockOnChange} presets={presets} />);
    // Assuming that the slider would adjust values as percentages (0-100)
    fireEvent.change(screen.getByTestId('slider-min'), { target: { value: 75 } });
    expect(mockOnChange).toHaveBeenCalledWith([75, 200]);

    rerender(<RangeFilter label="Test Range" min={0} max={300} value={[75, 150]} onChange={mockOnChange} presets={presets} />);
    fireEvent.change(screen.getByTestId('slider-max'), { target: { value: 100 } });
    expect(mockOnChange).toHaveBeenCalledWith([75, 100]);
  });
});