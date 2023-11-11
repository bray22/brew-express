import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './pages/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Feedback from './pages/Feedback';
import Reviews from './pages/Reviews';
import Favorites from './pages/Favorites';

//const root = ReactDOM.createRoot(document.getElementById('root'));


function App() {
  const [user, setUser] = useState(null);

  // useEffect(()=>{
  //   getUser();
  // },
  // []);

  // const getUser = async () => {
  //   try {
  //     const url = "http://localhost/auth/google/callback";
  //     const {data} = await axios.get(url);
  //     setUser(data.user._json);

  //   } catch(e) {
  //     console.log(e);
  //   }

  // } 

  return (
    <> 
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/login" index element={<Login />} />
        <Route path="/posts" index element={<Feedback />} />
        <Route path="/favorites" index element={<Favorites />} />
        <Route path="/reviews" index element={<Reviews />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
