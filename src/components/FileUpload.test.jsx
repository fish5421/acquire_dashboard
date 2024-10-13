import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from './FileUpload';

// Mock Papa Parse
jest.mock('papaparse', () => ({
  parse: jest.fn((file, config) => {
    config.complete({
      data: [{ col1: 'test', col2: 'data' }],
    });
  }),
}));

describe('FileUpload Component', () => {
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    expect(screen.getByText('Files and assets')).toBeInTheDocument();
  });

  test('handles file selection', () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    const input = screen.getByTestId('file-input');
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('test.csv')).toBeInTheDocument();
  });

  test('displays error for non-CSV files', () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    const input = screen.getByTestId('file-input');
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText('Upload File'));

    expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument();
  });

  test('uploads file and shows progress', async () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    const input = screen.getByTestId('file-input');
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText('Upload File'));

    await waitFor(() => {
      expect(screen.getByText('100% Uploaded')).toBeInTheDocument();
    });

    expect(mockOnUpload).toHaveBeenCalled();
  });

  test('displays uploaded files in the table', async () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    const input = screen.getByTestId('file-input');
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText('Upload File'));

    await waitFor(() => {
      expect(screen.getAllByText('test.csv').length).toBeGreaterThan(0);
      expect(screen.getByText('Current User')).toBeInTheDocument();
    });
  });

  test('handles drag and drop', () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    const dropzone = screen.getByText(/Click to upload or drag and drop/i);
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(screen.getByText('test.csv')).toBeInTheDocument();
  });
});