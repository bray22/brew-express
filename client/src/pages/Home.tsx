import React, { Component, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

import AutocompleteDropdown from '../components/AutocompleteDropdown';

const server_name = 'http://localhost';
//const server_name = 'https://www.raystar.io';


interface BillingAddress {
  city: string;
  country: string;
}

interface Brewery {
  _id: string;
  Name: string;
  BillingAddress: BillingAddress;
  type: string;
}

interface Beers {
  labels: any;
  description: string | number | readonly string[];
  nameDisplay: string | number | readonly string[];
  _id: Object,
  name: string;
  BillingAddress: BillingAddress;
  brewerId: Brewery;
  type: string;
}

interface State {
  breweries: Brewery[];
  selectBreweries: Brewery[];
  brewerId: Brewery,
  beers: Beers[];
  error: {},
  searchString: "",
  selectedBeer: Beers | null;
  isModalOpen: Boolean, 
}

class Home extends Component<{}, State> {
 
  constructor(props: {}) {
    super(props);
    this.state = {
      breweries: [],
      brewerId: null,
      selectBreweries: [],
      beers: [],
      error: {},
      searchString: "", 
      selectedBeer: null,
      isModalOpen: false, 
    };

    Modal.setAppElement('#root'); // Replace '#your-app-root' with the actual element selector
    
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

  // Function to open the modal for editing
  openModal = (beer) => {
    this.setState({ isModalOpen: true, selectedBeer: beer });
  };

  // Function to close the modal
  closeModal = () => {
    this.setState({ isModalOpen: false, selectedBeer: null });
  };

      // Function to update beer details
  updateBeer = () => {
    const { selectedBeer } = this.state;
    const { description, nameDisplay, name, _id, brewerId } = selectedBeer;
    console.log("selected beer")
    console.log(this.state.selectedBeer);
    // Make an API call to update the beer details
    axios.patch(`http://localhost/beers/id/${_id}`, { 
      name: name,
      nameDisplay: nameDisplay,
      description: description,
      brewerId: brewerId
    })
    .then((response) => {
      // Update the state with the updated beer
      this.loadBeers();
      console.log('Beer updated:', response.data);
    })
    .catch((error) => {
      console.error('Error updating Beer:', error);
    });
    // After the update, close the modal
    this.closeModal();
  };

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
    // Create a copy of the selectedBeer with the updated brewerId
    const updatedSelectedBeer = { ...this.state.selectedBeer, brewerId };

    // Update the selectedBeer in the state
    this.setState({
      selectedBeer: updatedSelectedBeer,
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
    const { breweries, 
      beers, 
      searchString, 
      selectedBeer, 
      isModalOpen 
    } = this.state;

    Array.isArray(beers) && beers.map((beer, index) => (
      {}
    ))

    const tempName = selectedBeer?.name;

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
                  <td>{ <a onClick={() => this.openModal(beer)}>{beer.name}</a> || this.state.brewerId}</td>
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

         {/* Modal for editing beer details */}
         <Modal
          isOpen={isModalOpen}
          onRequestClose={this.closeModal}
          contentLabel="Edit Beer"
          // Customize the modal styles here
        >
          {/* Modal content and form for editing */}
          {selectedBeer && (
            <div className='admin-modal'>
              <h2>{selectedBeer?.name} : {selectedBeer?._id}</h2>
              <table>
                <tbody>
                <tr>
                    <td>
                      <label htmlFor="name">Display Name:</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={selectedBeer?.name} 
                         onChange={(e) => {
                           // Update the selectedBeer with the new value
                           this.setState((prevState) => ({
                             selectedBeer: {
                               ...prevState.selectedBeer,
                               name: e.target.value,
                             },
                           }));
                         }}
                      />
                    </td>
                  </tr>


                  <tr>
                    <td>
                      <label htmlFor="nameDisplay">Display Name:</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="nameDisplay"
                        name="nameDisplay"
                        value={selectedBeer?.nameDisplay} // Bind to the nameDisplay property
                        onChange={(e) => {
                          // Update the selectedBeer with the new value
                          this.setState((prevState) => ({
                            selectedBeer: {
                              ...prevState.selectedBeer,
                              nameDisplay: e.target.value,
                            },
                          }));
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="brewer">Brewer: <h3>{selectedBeer.brewerId.Name}</h3></label>
                    </td>
                    <td>
                      <AutocompleteDropdown 
                        findBrewerByName={this.findBrewerByName} 
                        updateBrewer={this.updateBrewer} 
                        options={this.state.breweries} 
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="description">Description:</label>
                    </td>
                   
                    <td>
                      <textarea
                        id="description"
                        name="description"
                        value={selectedBeer.description} // Bind to the description property
                        onChange={(e) => {
                          // Update the selectedBeer with the new value
                          this.setState((prevState) => ({
                            selectedBeer: {
                              ...prevState.selectedBeer,
                              description: e.target.value,
                            },
                          }));
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                  <td colSpan={2}>
                      <img src={selectedBeer?.labels?.medium} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <button onClick={this.updateBeer}>Save</button>
                <button onClick={this.closeModal}>Cancel</button>
              </div>
            </div>
          )}
        </Modal>
      </>
    );
  }
}

export default Home;
