import axios from 'axios';

import React, { Component } from 'react';

const server_name = 'http://localhost:8080';

interface State {
  userId: string;
  beerId: string;
  favorite: boolean;
  error: any;
}

class Recents extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      userId: '65011a637a142ea37d473d64',
      beerId: '653d547bfc232964944010d9',
      favorite: false,
      error: null,
    };
  }

  componentDidMount = () =>{
    axios
    .get(`http://localhost:8080/favorites/65011a637a142ea37d473d64/653d547bfc232964944010d9`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
   
  }

  deleteRecents = () => {
    const sessionId = '655cce9ca7b65ca84b99a220';
    const beerId = '653d5476fc232964943ffd4f';
    
    axios
    .delete(`http://localhost:8080/recents/${sessionId}/${beerId}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
    });
  }

  getRecents = () => {
    console.log("recent");
    const sessionId = '655cce9ca7b65ca84b99a220';
    axios
    .get(`http://localhost:8080/recents/${sessionId}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  createRecents = () => {
    console.log("recent");
    const myRecents = [
      '653d5476fc232964943ffd4a', 
      '653d5476fc232964943ffd4f', 
      '653d5476fc232964943ffd51'
    ];

    const userId = '65011a637a142ea37d473d64';
    const sessionId = '655cce9ca7b65ca84b99a220';

    myRecents.map((beerId) => {
      console.log("recent");
      console.log(beerId);

      axios
      .post(`http://localhost:8080/recents`, {
          beerId,
          sessionId,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  handleFavorite = () => {
    const { userId, beerId, favorite } = this.state;

    console.log(userId);
    console.log(beerId);
    console.log(favorite);

    axios
    .put(`http://localhost:8080/favorites`, {
        userId,
        beerId,
        favorite,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleFavoriteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ favorite: event.target.checked });
  };

  render() {
    const { userId, beerId, favorite } = this.state;
    return (
      <>
        {/* new user */}
        <div id="login">
          <div className="username">
            <div>UserId</div>
            <div>
              {userId}
            </div>
          </div>
          <div className="username">
            <div>BeerId</div>
            <div>
              {beerId}
            </div>
          </div>
          <div className="username">
            <div>Favorite</div>
            <div>
              <input
                type="checkbox"
                name="favorite"
                checked={favorite}
                onChange={this.handleFavoriteChange}
              />
            </div>
          </div>
          <button onClick={this.deleteRecents}>Delete Recent</button>
          <button onClick={this.getRecents}>Get Recents</button>
          <button onClick={this.createRecents}>Create Recents</button>
          <button onClick={this.handleFavorite}>Submit Favorite</button>
        </div>
      </>
    );
  }
}

export default Recents;
