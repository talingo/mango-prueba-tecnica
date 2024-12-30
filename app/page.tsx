// pages/main.tsx
'use client';

import React from 'react';
import Link from 'next/link'; // Import Link component from next

export default function Main() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the Exercises</h1>
      <ul>
        <li>
          <Link
            href="/exercise1"
            style={{ textDecoration: 'none', color: 'blue' }}
          >
            Normal Range
          </Link>
        </li>
        <li>
          <Link
            href="/exercise2"
            style={{ textDecoration: 'none', color: 'blue' }}
          >
            Fixed Values Range
          </Link>
        </li>
      </ul>
    </div>
  );
}
