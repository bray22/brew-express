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
import Sessions from './pages/Sessions';
import Recents from './pages/Recents';

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
        <Route path="/sessions" index element={<Sessions />} />
        <Route path="/recents" index element={<Recents />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
