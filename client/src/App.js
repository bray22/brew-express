import './App.css';
import Home from './pages/Home';
import Layout from './pages/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

//const root = ReactDOM.createRoot(document.getElementById('root'));


function App() {
  const [user, setUser] = useState(null);

  useEffect(()=>{
    getUser();
  },
  []);

  const getUser = async () => {
    try {
      const url = "http://localhost/auth/google/callback";
      const {data} = await axios.get(url);
      setUser(data.user._json);

    } catch(e) {
      console.log(e);
    }

  } 

  return (
    <> 
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
