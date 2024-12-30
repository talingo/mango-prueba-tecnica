'use client';
import React, { useState, useEffect } from 'react';
import Range from '../components/Range/Range'; // Adjust import path

export default function Exercise2() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [value1, setValue1] = useState(1);
  const [value2, setValue2] = useState(100);
  const [fixedValues, setFixedValues] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRange = async () => {
      try {
        // Use the Mockable URL for the mock service
        const response = await fetch(
          'https://demo7130955.mockable.io/fixed-values'
        ); // Replace with your actual Mockable URL
        if (!response.ok) throw new Error('Failed to fetch range');
        const data = await response.json();

        // Assuming the mock response has fixedValues and ranges
        setMin(1.99);
        setMax(70.99);
        setValue1(1.99);
        setValue2(70.99);
        setFixedValues(data.fixedValues || []); // Use the fixedValues from the API
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
      fixedValues={fixedValues} // Pass the fixed values to the Range component
    />
  );
}
