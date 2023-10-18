import React, { Component } from 'react';
import axios from 'axios';

interface BillingAddress {
  city: string;
  country: string;
}

interface Brewery {
  Name: string;
  BillingAddress: BillingAddress;
  type: string;
}

interface State {
  breweries: Brewery[];
  error: {}
}

class Home extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      breweries: [],
      error: {}
    };
  }

  componentDidMount() {
    axios.get('http://localhost/breweries/')
    //axios.get('https://www.raystar.io/breweries/')
      .then((response) => {
        this.setState({ breweries: response.data });
      })
      .catch((error) => {
        console.error('Error fetching brewery data: ', error);
        this.setState({ error: 'Error fetching data' });
      });
  }

  render() {
    const { breweries } = this.state;

    return (
      <>
        <div>
          <h1>Brewery Table</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(breweries) && breweries.map((brewery, index) => (
                <tr key={index}>
                  <td>{brewery.Name}</td>
                  <td>{brewery.BillingAddress.city}</td>
                  <td>{brewery.BillingAddress.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default Home;
