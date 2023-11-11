import React, { Component } from 'react';
import axios from 'axios';

const server_name = 'http://localhost:8080';

interface State {
  userId: string;
  beerId: string;
  review: string;
  error: any;
}

class Reviews extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      userId: '65011a637a142ea37d473d64',
      beerId: '653d547bfc232964944010d9',
      review: '',
      error: null,
    };
  }

  handleReview = () => {
    const { 
      userId, 
      beerId,
      review
    } = this.state;
   
    // Make an API request to the Express server for authentication

    console.log(userId);
    console.log(beerId);
    console.log(review);

    axios.post(`http://localhost:8080/reviews`, { 
       userId, 
       beerId,
       review,
     })
     .then((response) => {
       console.log(response.data);
     })
     .catch((error) => {
       console.log(error);
     });
  }

  handleReviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ review: event.target.value });
  }

  render() {
    const { userId, beerId, review } = this.state;

    return (
      <>
        {/* new user */}
        <div id="login">
          <div className="username">
            <div>name</div>
            <div>
              {userId}
            </div>
          </div>
          <div className="username">
            <div>beer</div>
            <div>
              {beerId}
            </div>
          </div>
          <div className="username">
            <div>Review</div>
            <div>
              <input
                type="text"
                name="review"
                value={review}
                onChange={this.handleReviewChange}
              />
            </div>
          </div>
          <button onClick={this.handleReview}>Submit Review</button>
        </div>
      </>
    );
  }
}

export default Reviews;
