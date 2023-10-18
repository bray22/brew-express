import React, { Component } from 'react';
import axios from 'axios';

import AutocompleteDropdown from '../components/AutocompleteDropdown';

const server_name = 'http://localhost';
//const server_name = 'https://www.raystar.io';


interface BillingAddress {
  city: string;
  country: string;
}

interface Brewery {
  Name: string;
  BillingAddress: BillingAddress;
  type: string;
}

interface Beers {
  name: string;
  BillingAddress: BillingAddress;
  brewerId: Brewery;
  type: string;
}

interface State {
  breweries: Brewery[];
  selectBreweries: Brewery[];
  beers: Beers[];
  error: {}
}

class Home extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      breweries: [],
      selectBreweries: [],
      beers: [],
      error: {}
    };
    this.findBrewerByName = this.findBrewerByName.bind(this); 
  }

  componentDidMount() {
    axios.get(`${server_name}/breweries/`)
    //axios.get('https://www.raystar.io/breweries/')
      .then((response) => {
        this.setState({ breweries: response.data });
      })
      .catch((error) => {
        console.error('Error fetching brewery data: ', error);
        this.setState({ error: 'Error fetching data' });
      });

    
    axios.get(`${server_name}/beers/`)
    //axios.get('https://www.raystar.io/breweries/')
      .then((response) => {
        this.setState({ beers: response.data });
        console.log(response.data[0].brewerId);
      })
      .catch((error) => {
        console.error('Error fetching brewery data: ', error);
        this.setState({ error: 'Error fetching data' });
      });
  }

  findBrewerByName(name="John") {
    axios.get(`${server_name}/breweries/name/${name}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
        this.setState({ breweries: response?.data });
      }
        //console.log(response.data[0].Name);
      })
      .catch((error) => {
        this.setState({ breweries: [] });
       // console.error('Error fetching brewery data: ', error);
        //this.setState({ error: 'Error fetching data' });
    });
  }

  render() {
    const { breweries, beers } = this.state;

    Array.isArray(beers) && beers.map((beer, index) => (
      {}
    ))

    return (
      <>
        <div>
          <h1>CL Table</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(beers) && beers.map((beer, index) => (
                <tr key={index}>
                  <td>{beer.name}</td>
                  <td>{beer.brewerId.Name && beer.brewerId.Name}</td>
                  <td><AutocompleteDropdown findBrewerByName={this.findBrewerByName} options={this.state.breweries} /></td>
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
