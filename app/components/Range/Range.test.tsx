import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Range from './Range';

describe('Range Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Range component correctly with default props', () => {
    render(
      <Range
        min={1}
        max={10000}
        step={1}
        value1={1}
        value2={100}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('€1.00')).toBeInTheDocument(); // Expecting currency format
    expect(screen.getByText('€100.00')).toBeInTheDocument(); // Expecting currency format
  });

  it('calls onChange when a thumb is dragged', () => {
    render(
      <Range
        min={1}
        max={10000}
        step={1}
        value1={1}
        value2={100}
        onChange={mockOnChange}
      />
    );
    const sliderThumb1 = screen.getByText('€10.00');
    fireEvent.mouseDown(sliderThumb1, { clientX: 10 });
    fireEvent.mouseMove(window, { clientX: 50 });
    fireEvent.mouseUp(window);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('ensures value1 does not exceed value2', () => {
    render(
      <Range
        min={1}
        max={100}
        step={1}
        value1={1}
        value2={100}
        onChange={mockOnChange}
      />
    );
    const sliderThumb1 = screen.getByText('€30.00');
    fireEvent.mouseDown(sliderThumb1, { clientX: 60 }); // Attempt to move above value2
    fireEvent.mouseMove(window, { clientX: 60 });
    fireEvent.mouseUp(window);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Number), 50);
  });

  it('ensures value2 does not go below value1', () => {
    render(
      <Range
        min={1}
        max={100}
        step={1}
        value1={1}
        value2={100}
        onChange={mockOnChange}
      />
    );
    const sliderThumb2 = screen.getByText('€50.00');
    fireEvent.mouseDown(sliderThumb2, { clientX: 20 }); // Attempt to move below value1
    fireEvent.mouseMove(window, { clientX: 20 });
    fireEvent.mouseUp(window);
    expect(mockOnChange).toHaveBeenCalledWith(30, expect.any(Number));
  });

  it('fetches min and max values from API on mount', async () => {
    // Mock API response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ min: 5, max: 500 }),
    });

    render(
      <Range
        min={1}
        max={1000}
        step={1}
        value1={1}
        value2={1000}
        onChange={mockOnChange}
      />
    );

    // Use waitFor to ensure the async operation completes before the test proceeds
    await waitFor(() => {
      expect(screen.getByText('€5.00')).toBeInTheDocument();
      expect(screen.getByText('€500.00')).toBeInTheDocument();
    });
  });

  it('handles API failure gracefully', async () => {
    // Mock API failure
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));

    render(
      <Range
        min={1}
        max={10000}
        step={1}
        value1={1}
        value2={10000}
        onChange={mockOnChange}
      />
    );

    expect(
      await screen.findByText('Loading range slider...')
    ).toBeInTheDocument();
  });

  // --- New tests for Exercise 2 (two-handle range) ---

  it('renders two thumbs correctly with initial values', () => {
    render(
      <Range
        min={1}
        max={10000}
        step={1}
        value1={1000}
        value2={5000}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('€1000.00')).toBeInTheDocument();
    expect(screen.getByText('€5000.00')).toBeInTheDocument();
  });

  it('should update value1 when dragging the first handle', () => {
    render(
      <Range
        min={1}
        max={10000}
        step={1}
        value1={1000}
        value2={5000}
        onChange={mockOnChange}
      />
    );
    const thumb1 = screen.getByText('€1000.00');
    fireEvent.mouseDown(thumb1, { clientX: 100 });
    fireEvent.mouseMove(window, { clientX: 200 });
    fireEvent.mouseUp(window);
    expect(mockOnChange).toHaveBeenCalledWith(200, 5000);
  });

  it('should update value2 when dragging the second handle', () => {
    render(
      <Range
        min={1}
        max={10000}
        step={1}
        value1={1000}
        value2={5000}
        onChange={mockOnChange}
      />
    );
    const thumb2 = screen.getByText('€5000.00');
    fireEvent.mouseDown(thumb2, { clientX: 200 });
    fireEvent.mouseMove(window, { clientX: 400 });
    fireEvent.mouseUp(window);
    expect(mockOnChange).toHaveBeenCalledWith(1000, 400);
  });

  it('should not allow overlap of values when dragging', () => {
    render(
      <Range
        min={1}
        max={10000}
        step={1}
        value1={1000}
        value2={5000}
        onChange={mockOnChange}
      />
    );
    const thumb1 = screen.getByText('€1000.00');
    const thumb2 = screen.getByText('€5000.00');

    fireEvent.mouseDown(thumb1, { clientX: 100 });
    fireEvent.mouseMove(window, { clientX: 4000 }); // Drag thumb1 near thumb2
    fireEvent.mouseUp(window);

    fireEvent.mouseDown(thumb2, { clientX: 200 });
    fireEvent.mouseMove(window, { clientX: 3000 }); // Attempt to drag below thumb1
    fireEvent.mouseUp(window);

    expect(mockOnChange).toHaveBeenCalledWith(1000, 5000); // Ensure thumb1 and thumb2 do not overlap
  });

  it('should clamp values within the min and max boundaries', () => {
    render(
      <Range
        min={1}
        max={5000}
        step={1}
        value1={1000}
        value2={4000}
        onChange={mockOnChange}
      />
    );
    const thumb1 = screen.getByText('€1000.00');
    const thumb2 = screen.getByText('€4000.00');

    // Try dragging thumb1 past the min
    fireEvent.mouseDown(thumb1, { clientX: 0 });
    fireEvent.mouseMove(window, { clientX: -50 });
    fireEvent.mouseUp(window);

    // Try dragging thumb2 past the max
    fireEvent.mouseDown(thumb2, { clientX: 5000 });
    fireEvent.mouseMove(window, { clientX: 5500 });
    fireEvent.mouseUp(window);

    expect(mockOnChange).toHaveBeenCalledWith(1, 5000); // Clamped values
  });
});
