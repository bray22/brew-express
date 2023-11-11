import axios from 'axios';

import React, { Component } from 'react';

const server_name = 'http://localhost:8080';

interface State {
  userId: string;
  beerId: string;
  isFavorite: boolean;
  error: any;
}

class Favorites extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      userId: '65011a637a142ea37d473d64',
      beerId: '653d547bfc232964944010d9',
      isFavorite: false,
      error: null,
    };
  }

  handleFavorite = () => {
    const { userId, beerId, isFavorite } = this.state;

    console.log(userId);
    console.log(beerId);
    console.log(isFavorite);
    if (isFavorite) {
    axios
      .post(`http://localhost:8080/favorites`, {
         userId,
         beerId,
         isFavorite,
       })
       .then((response) => {
         console.log(response.data);
       })
       .catch((error) => {
         console.log(error);
       });
    } else {
      axios
        .delete(`http://localhost:8080/favorites/${userId}/${beerId}`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
      });

      axios
      .delete(`$http://localhost:8080/favorites/${userId}/${beerId}`)
      .then((response) => {
        console.log(response.data);
        // Handle success, update UI or state if needed
      })
      .catch((error) => {
        console.log(error);
        // Handle error, show error message or update state if needed
      });

    }
  };

  handleFavoriteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ isFavorite: event.target.checked });
  };

  render() {
    const { userId, beerId, isFavorite } = this.state;
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
                checked={this.state.isFavorite}
                onChange={this.handleFavoriteChange}
              />
            </div>
          </div>
          <button onClick={this.handleFavorite}>Submit Favorite</button>
        </div>
      </>
    );
  }
}

export default Favorites;
