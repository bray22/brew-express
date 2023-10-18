import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Home from '../pages/Home'; // Adjust the import path as needed

jest.mock('axios');

const mockBreweries = [
  {
    Name: 'Brewery 1',
    BillingAddress: { city: 'City 1', country: 'Country 1' },
    type: 'Type 1',
  },
  {
    Name: 'Brewery 2',
    BillingAddress: { city: 'City 2', country: 'Country 2' },
    type: 'Type 2',
  },
];

test('renders Home component and fetches data', async () => {

  render(<Home />);

  // Wait for the API call to complete and populate the component
  await waitFor(() => {
    expect(screen.getByText('Brewery Table')).toBeInTheDocument();
  });

  // Verify the rendered data
  mockBreweries.forEach((brewery) => {
    expect(screen.getByText(brewery.Name)).toBeInTheDocument();
    expect(screen.getByText(brewery.BillingAddress.city)).toBeInTheDocument();
    expect(screen.getByText(brewery.BillingAddress.country)).toBeInTheDocument();
  });
});

test('handles API error', async () => {

  render(<Home />);

  // Wait for the API call to complete and display an error message
  await waitFor(() => {
    expect(screen.getByText('Error fetching brewery data:')).toBeInTheDocument();
  });
});
