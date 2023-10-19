import React, { Component, useRef } from 'react';
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
  _id: Object,
  name: string;
  BillingAddress: BillingAddress;
  brewerId: Brewery;
  type: string;
}

interface State {
  breweries: Brewery[];
  selectBreweries: Brewery[];
  brewerId: String,
  beers: Beers[];
  error: {},
  searchString: "", // Initialize searchString
}

class Home extends Component<{}, State> {
 
  constructor(props: {}) {
    super(props);
    this.state = {
      breweries: [],
      brewerId: "",
      selectBreweries: [],
      beers: [],
      error: {},
      searchString: "", // Initialize searchString
    };
    
  }

  componentDidMount() {
   

    this.loadBeers();
    this.loadBreweries();
    this.searchBeers();
   
  }

  searchBeers = () => {
    axios.post(`${server_name}/beers/search`, {  terms: ["Yuletide", "Yuppee K"] })
      .then((response) => {
        console.log(response);
        
      })
      .catch((error) => {
        console.error('Error fetching brewery data: ', error);
     
      });
    }

  loadBreweries = () => {
  axios.get(`${server_name}/breweries/`)
  //axios.get('https://www.raystar.io/breweries/')
    .then((response) => {
      this.setState({ breweries: response.data });
    })
    .catch((error) => {
      console.error('Error fetching brewery data: ', error);
      this.setState({ error: 'Error fetching data' });
    });
  }

  loadBeers = () => {
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

  loadBeersByName = (name) => {
    axios.get(`${server_name}/beers/name/${name}`)
      .then((response) => {
        this.setState({ beers: response.data });
      })
      .catch((error) => {
        console.error('Error fetching brewery data: ', error);
        this.setState({ error: 'Error fetching data' });
      });
  }

  handleSearchInputChange = (event) => {
    this.setState({ searchString: event.target.value });
    this.loadBeersByName(event.target.value);
  };

  updateBeerBrewer = (_id) => {
    const { brewerId } = this.state;
    const br = brewerId
    console.log(this.state.brewerId);
     axios.patch(`http://localhost/beers/id/${_id}`, { brewerId: brewerId })
       .then((response) => {
         // Update the state with the updated beer
         this.loadBeers();
         console.log('Beer updated:', response.data);
       })
       .catch((error) => {
         console.error('Error updating Beer:', error);
       });
  };

  updateBrewer = (brewerId) => {
    this.setState({
      brewerId: brewerId
    });
  }

  findBrewerByName = (name) => {
    axios.get(`${server_name}/breweries/name/${name}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          this.setState({ breweries: response.data });
        }
      })
      .catch((error) => {
        this.setState({ breweries: [] });
      });
  };

  render() {
    const { breweries, beers, searchString } = this.state;

    Array.isArray(beers) && beers.map((beer, index) => (
      {}
    ))

    return (
      <>
        <div className='beer-table'>
          <h1>Beers</h1>
          <div>
          <input
              type="text"
              name="searchString"
              value={searchString}
              onChange={this.handleSearchInputChange}
            />
          </div>
          <table className='beer-table'>
            <thead>
              <tr>
                <th>Beer</th>
                <th>Brewer</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(beers) && beers.map((beer, index) => (
                <tr key={index}>
                  <td>{beer.name}</td>
                  <td>{beer.brewerId?.Name || this.state.brewerId}</td>
                  <td>
                    <AutocompleteDropdown 
                      findBrewerByName={this.findBrewerByName} 
                      updateBrewer={this.updateBrewer} 
                      options={this.state.breweries} />
                  </td>
                  <td>
                    <button onClick={()=>this.updateBeerBrewer(beer._id)}>
                      Save
                      </button>
                  </td>
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
