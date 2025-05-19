import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatePickerRange } from './index';

describe('DatePickerRange Component', () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    from: '2023-05-10',
    to: '2023-05-20',
    onChange: mockOnChange
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with provided from and to dates', () => {
    render(<DatePickerRange {...defaultProps} />);
    
    expect(screen.getByTestId('date-from')).toHaveTextContent('2023-05-10');
    expect(screen.getByTestId('date-to')).toHaveTextContent('2023-05-20');
    expect(screen.getByTestId('date-picker-range')).toBeInTheDocument();
  });

  it('opens from date picker when clicking on from date', () => {
    render(<DatePickerRange {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('date-from'));
    expect(screen.getByText('From')).toBeInTheDocument();
    const buttons = screen.getAllByTestId('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    expect(buttons.some(btn => btn.textContent === 'Cancel')).toBeTruthy();
    expect(buttons.some(btn => btn.textContent === 'Save')).toBeTruthy();
  });

  it('opens to date picker when clicking on to date', () => {
    render(<DatePickerRange {...defaultProps} />);
    
    fireEvent.click(screen.getByText('2023-05-20'));
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('calls onChange with new dates when Save is clicked', () => {
    render(<DatePickerRange {...defaultProps} />);
    
    fireEvent.click(screen.getByText('2023-05-10'));
    const fromInput = screen.getByTestId('input');
    fireEvent.change(fromInput, { target: { value: '2023-05-15' } });
    fireEvent.blur(fromInput);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockOnChange).toHaveBeenCalledWith('2023-05-15', '2023-05-20');
  });

  it('reverts to original dates when Cancel is clicked', () => {
    render(<DatePickerRange {...defaultProps} />);
    
    fireEvent.click(screen.getByText('2023-05-20'));
    const toInput = screen.getByTestId('input');
    fireEvent.change(toInput, { target: { value: '2023-05-25' } });
    fireEvent.blur(toInput);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByText('2023-05-20')).toBeInTheDocument();
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('shows error message when from date is later than to date', () => {
    render(<DatePickerRange {...defaultProps} />);
    
    fireEvent.click(screen.getByText('2023-05-10'));
    const fromInput = screen.getByTestId('input');
    fireEvent.change(fromInput, { target: { value: '2023-05-25' } });
    fireEvent.blur(fromInput);
    expect(screen.getByText(/start date.*later than.*end date/i)).toBeInTheDocument();
  });
});
