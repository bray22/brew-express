import React from 'react';
import { render } from '@testing-library/react';
import Layout from '../pages/Layout'; // Replace with the correct path to your component

test('renders "Hello"', () => {
  const { getByText } = render(<Layout />);
  const helloElement = getByText('Hello');
  expect(helloElement).toBeTruthy(); // Use toBeTruthy() instead of toBeInTheDocument()
});