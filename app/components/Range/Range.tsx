import React, { useEffect, useRef, useState } from 'react';
import styles from './Range.module.css';

interface RangeProps {
  min: number;
  max: number;
  step: number;
  value1: number;
  value2: number;
  onChange: (value1: number, value2: number) => void;
  fixedValues?: number[];
}

const Range: React.FC<RangeProps> = ({
  min,
  max,
  step,
  value1,
  value2,
  onChange,
  fixedValues,
}) => {
  const [isDragging1, setIsDragging1] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Function to calculate the closest value from fixed values
  const getClosestValue = (value: number) => {
    if (!fixedValues) return value;
    return fixedValues.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  const calculateValue = (clientX: number) => {
    if (!sliderRef.current) return 0;
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    const offsetX = clientX - sliderRect.left;
    const percentage = Math.min(Math.max(offsetX / sliderWidth, 0), 1);
    const value = Math.round(min + (percentage * (max - min)) / step) * step;
    return getClosestValue(value); // Get the closest value for fixed values range
  };

  const handleMouseDown = (e: React.MouseEvent, isDraggingThumb1: boolean) => {
    if (isDraggingThumb1) {
      setIsDragging1(true);
    } else {
      setIsDragging2(true);
    }
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging1 || isDragging2) {
      const newValue = calculateValue(e.clientX);
      if (isDragging1 && newValue <= value2) {
        onChange(newValue, value2); // Ensure value1 stays below value2
      } else if (isDragging2 && newValue >= value1) {
        onChange(value1, newValue); // Ensure value2 stays above value1
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging1(false);
    setIsDragging2(false);
  };

  useEffect(() => {
    if (isDragging1 || isDragging2) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging1, isDragging2]);

  const percentage1 = ((value1 - min) / (max - min)) * 100;
  const percentage2 = ((value2 - min) / (max - min)) * 100;

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.value}>€{value1.toFixed(2)}</div>
      <div className={styles.slider} ref={sliderRef}>
        <div className={styles.track} />
        <div
          className={`${styles.thumb} ${isDragging1 ? styles.grabbing : ''}`}
          style={{ left: `${percentage1}%` }}
          onMouseDown={(e) => handleMouseDown(e, true)}
        />
        <div
          className={`${styles.thumb} ${isDragging2 ? styles.grabbing : ''}`}
          style={{ left: `${percentage2}%` }}
          onMouseDown={(e) => handleMouseDown(e, false)}
        />
      </div>
      <div className={styles.value}>€{value2.toFixed(2)}</div>

      {/* Display fixed values if they exist */}
      {fixedValues && (
        <div className={styles.fixedValues}>
          <h5>Fixed Values:</h5>
          {fixedValues.map((val) => (
            <span key={val} className={styles.fixedValue}>
              {val.toFixed(2)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Range;
