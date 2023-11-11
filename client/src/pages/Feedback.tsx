import React, { Component } from 'react';
import axios from 'axios';

const server_name = 'http://localhost:8080';

interface State {
  feedback: string;
  userId: string;
  beerId: string;
  error: any;
}

class Feedback extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      feedback: '',
      userId: '65011a637a142ea37d473d64',
      beerId: '653d547bfc232964944010d9',
      error: null,
    };
  }

  handleFeedback = () => {
    const { 
      userId, 
      feedback,
      beerId,
    } = this.state;
   
    console.log(userId);
    console.log(beerId);
    console.log(feedback);

    axios.post(`http://localhost:8080/posts`, { 
      userId, 
      beerId,
      feedback
    })
    .then((response) => {
       console.log(response.data);  
     })
     .catch((error) => {
       console.log(error);
     });
  }

  handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ feedback: event.target.value });
  }

  render() {
    const { userId, beerId, feedback } = this.state;
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
            <div>Feedback</div>
            <div>
              <input
                type="text"
                name="review"
                value={feedback}
                onChange={this.handleFeedbackChange}
              />
            </div>
          </div>
          <button onClick={this.handleFeedback}>Submit Feedback</button>
        </div>
      </>
    );
  }
}

export default Feedback;
