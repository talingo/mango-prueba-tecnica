'use client';
import React, { useState, useEffect } from 'react';
import Range from '../components/Range/Range'; // Adjust import path

export default function Exercise1() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [value1, setValue1] = useState(1);
  const [value2, setValue2] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRange = async () => {
      try {
        const response = await fetch(
          'http://demo0427535.mockable.io/range-values'
        );
        if (!response.ok) throw new Error('Failed to fetch range');
        const data = await response.json();

        setMin(data.min);
        setMax(data.max);
        setValue1(data.min);
        setValue2(data.max);
      } catch (error) {
        console.error('Error fetching range:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRange();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Range
      min={min}
      max={max}
      step={1}
      value1={value1}
      value2={value2}
      onChange={(newValue1, newValue2) => {
        setValue1(newValue1);
        setValue2(newValue2);
      }}
    />
  );
}
