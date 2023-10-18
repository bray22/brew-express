import './App.css';
import Home from './pages/Home';
import Layout from './pages/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';

//const root = ReactDOM.createRoot(document.getElementById('root'));


function App() {
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
