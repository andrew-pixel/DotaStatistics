import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./Main.css";

import { Link, Navigate } from 'react-router-dom';
import Matchpage from './Matchpage';
import Homepage from './Homepage';
import HeroPage from "./Heropage";
import Personalpage from './Personalpage';
function Main() {
  return (
    <BrowserRouter>
      <div className='main'>
      <nav className='navBar'>

        <div className="navbar-left">
          <a href="/" className="logo">
          <img src='/asset/dotalogo.png'/>
            <h1>DOTA IMPACT</h1>
            
          </a>
        </div>
        <div className="navbar-center">
          <Link className='link' to="/Homepage">Trends</Link> 
          <Link className='link' to="/Personalpage">DotaBuddy</Link>
        </div>
        <div className="navbar-right">
          
        </div>
      </nav>
      <div className='content'>
      <Routes >
      <Route path="/" element={<Navigate to="/Homepage" />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/Matchpage" element={<Matchpage />} />
        <Route path="/hero-page" element={<HeroPage />}/>
        <Route path="/Personalpage" element={<Personalpage />}/>
      </Routes>
      </div>
    </div>
    </BrowserRouter>

  );
}

export default Main;