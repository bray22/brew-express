import React, { Component } from 'react';
import axios from 'axios';

const server_name = 'http://localhost:8080';

interface State {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  isLoggedIn: boolean;
  error: any;
}

class Login extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      isLoggedIn: false,
      error: null,
    };
  }

  handleLogin = () => {
    const { username, password, firstName, lastName, email } = this.state;
   
    // Make an API request to the Express server for authentication
    axios.post(`http://localhost:8080/login`, 
    { username, 
      password, 
      firstName, 
      lastName,
      email 
    })
      .then((response) => {
        const { user } = response.data;
        console.log(user);
        this.setState({ isLoggedIn: true, error: null });
        // You can also store the user data in a context or Redux store for future use.
      })
      .catch((error) => {
        this.setState({ isLoggedIn: false, error: 'Invalid username or password' });
      });
  }

  handleReset = () => {
    const { email } = this.state;
    const server = "http://localhost: 300"
    // Make an API request to the Express server for authentication
    axios.post(`http://localhost:8080/login/reset`, 
    { 
      email, 
      server
    })
      .then((response) => {
        const user = response.data;
        console.log(user);
        this.setState({ isLoggedIn: true, error: null });
        // You can also store the user data in a context or Redux store for future use.
      })
      .catch((error) => {
        this.setState({ isLoggedIn: false, error: 'Invalid username or password' });
      });
  }

  handleNewUser = () => {
    console.log("xxx");
    const { 
      username, 
      password,
      firstName,
      lastName,
      email
    } = this.state;
   
    // Make an API request to the Express server for authentication

    axios.post(`http://localhost:8080/users`, { 
      username, 
      password,
      firstName,
      lastName,
      email
    })
    .then((response) => {
      const { user } = response.data;
      this.setState({ isLoggedIn: true, error: null });
      // You can also store the user data in a context or Redux store for future use.
    })
    .catch((error) => {
      this.setState({ isLoggedIn: false, error: 'Cant Add User' });
    });
  }

  handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  }

  handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ firstName: event.target.value });
  }

  handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ lastName: event.target.value });
  }

  handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  }

  render() {
    return (
      <>
        <div id="login">
          <div className="username">
            <div>Username</div>
            <div>
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleUsernameChange}
              />
            </div>
          </div>
          <div className="password">
            <div>Password</div>
            <div>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
            </div>
          </div>
          <button onClick={this.handleReset}>Login</button>
        </div>

        {/* email */}
        <div id="login">
          <div className="username">
            <div>Email</div>
            <div>
              <input
                type="text"
                name="email"
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
            </div>
          </div>
       
          <button onClick={this.handleReset}>Reset</button>
        </div>

        {/* new user */}
        <div id="login">
        <div className="username">
            <div>First Name</div>
            <div>
              <input
                type="text"
                name="firstName"
                value={this.state.firstName}
                onChange={this.handleFirstNameChange}
              />
            </div>
          </div>
          <div className="username">
            <div>Last Name</div>
            <div>
              <input
                type="text"
                name="lastName"
                value={this.state.lastName}
                onChange={this.handleLastNameChange}
              />
            </div>
          </div>
          <div className="username">
            <div>Email</div>
            <div>
              <input
                type="text"
                name="email"
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
            </div>
          </div>
          <div className="username">
            <div>Username</div>
            <div>
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleUsernameChange}
              />
            </div>
          </div>
          <div className="password">
            <div>Password</div>
            <div>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
            </div>
          </div>
          <button onClick={this.handleNewUser}>Add</button>
        </div>
      </>
    );
  }
}

export default Login;
