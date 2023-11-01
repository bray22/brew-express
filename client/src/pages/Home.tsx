import React, { Component, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Beer from '../models/Beer';
import AutocompleteDropdown from '../components/AutocompleteDropdown';
import { ObjectId } from 'mongodb';

import * as WebBrowser from "expo-web-browser";
//import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
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

interface label {
  medium: string
}

interface Beers {
  labels: label;
  description: string | number | readonly string[];
  nameDisplay: string | number | readonly string[];
  _id: Object,
  name: string;
  image: String;
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
  formMode: String
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
      formMode: ""
    };

    Modal.setAppElement('#root'); // Replace '#your-app-root' with the actual element selector
  }

  handleGoogleOAuth = () => {
    // Step 1: Initiate the Google OAuth process by redirecting to /auth/google.
    //window.location.href = 'https://localhost/auth/google';
  };

  componentDidMount() {
    console.log("MOUNT");
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const user = JSON.parse(urlParams.get('user'));
console.log("AT");

console.log(urlParams);

    if (accessToken) {
      // Access token is available, you can use it for authorized requests.
      console.log('Access Token:', accessToken);
    }

    if (user) {
      // User information is available.
      console.log('User Info:', user);
    }



    this.loadBeers();
    this.loadBreweries();
    this.searchBeers();
  }

  googleAuth = () => {
    window.open('https://www.raystar.io/auth/google/callback', "_self");
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

  openModalNew = () => {
    this.setState({ isModalOpen: true, formMode:'new', selectedBeer: new Beer() });
  };

  // Function to open the modal for editing
  openModalUpdate = (beer) => {
    this.setState({ isModalOpen: true, formMode:'update', selectedBeer: beer });
  };

  // Function to close the modal
  closeModal = () => {
    this.setState({ isModalOpen: false, formMode:"", selectedBeer: null });
  };

  createBeer = () => {
    const { selectedBeer } = this.state;
    const { description, nameDisplay, name, brewerId } = selectedBeer;
    console.log("selected beer")
    console.log(this.state.selectedBeer);
    // Make an API call to update the beer details
    axios.post(`http://localhost/beers/`, { 
      name: name,
      nameDisplay: nameDisplay,
      description: description,
      brewerId: brewerId
    })
    .then((response) => {
      // Update the state with the updated beer
      console.log('Beer create:', response.data);
    })
    .catch((error) => {
      console.error('Error creating Beer:', error);
    });
    // After the update, close the modal
    this.closeModal();
  };

      // Function to update beer details
  updateBeer = () => {
    const { selectedBeer } = this.state;
    const { description, nameDisplay, name, _id, brewerId, image } = selectedBeer;
    console.log("selected beer")
    console.log(this.state.selectedBeer);
    // Make an API call to update the beer details
    axios.patch(`http://localhost/beers/id/${_id}`, { 
      name: name,
      nameDisplay: nameDisplay,
      description: description,
      brewerId: brewerId,
      image: image,
    })
    .then((response) => {
      // Update the state with the updated beer
      //this.loadBeers();
      console.log('Beer updated:', response.data);
    })
    .catch((error) => {
      console.error('Error updating Beer:', error);
    });
    // After the update, close the modal
    this.closeModal();
  };

  deleteBeer = (beer) => {
    console.log('beer')
    const objId = beer._id;
    // Make an API call to update the beer details
    axios.delete(`http://localhost/beers/id/${objId}`)
    .then((response) => {
      // Update the state with the updated beer
      this.loadBeers();
      console.log('Beer delete:', response.data);
    })
    .catch((error) => {
      console.error('Error deleting Beer:', error);
    });
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
    console.log(this.state);
    const { breweries, 
      beers, 
      searchString, 
      selectedBeer, 
      isModalOpen,
      formMode 
    } = this.state;

    Array.isArray(beers) && beers.map((beer, index) => (
      {}
    ))

    const tempName = selectedBeer?.name;

    return (
      <>
        <div className='beer-table'>
        <div>
        {/* <button onClick={this.handleGoogleOAuth}>Login with Google</button> */}
      </div>
          <h1 onClick={this.googleAuth}>Google Login</h1>

          <h1 onClick={this.openModalNew}>Add New </h1>
          
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
                  <td>{ <a onClick={() => this.openModalUpdate(beer)}>{beer.name}</a> || this.state.brewerId}</td>
                  <td>
                    {beer.brewerId?.Name}
                  </td>
                  <td><a onClick={() => this.deleteBeer(beer)}>Delete</a> </td>
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
              <h2>{selectedBeer?.name}</h2>
              <table>
                <tbody>
                <tr>
                    <td>
                      <label htmlFor="name">
                        Display Name:
                      </label>
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
                      <label htmlFor="nameDisplay">Image:</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="image"
                        name="image"
                        value={selectedBeer?.labels?.medium} // Bind to the nameDisplay property
                        onChange={(e) => {
                          // Update the selectedBeer with the new value for labels.medium
                          this.setState((prevState) => ({
                            selectedBeer: {
                              ...prevState.selectedBeer,
                              labels: {
                                ...prevState.selectedBeer.labels, // Keep the existing labels properties
                                medium: e.target.value, // Update the medium property
                              },
                            },
                          }));
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="brewer">Brewer: <h3>{selectedBeer.brewerId?.Name}</h3></label>
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
                {formMode === "new" ? (<button onClick={this.createBeer}>Create</button>) : (<button onClick={this.updateBeer}>Update</button>)}
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
