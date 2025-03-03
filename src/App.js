import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MetaMaskConnector from './components/MetaMaskConnector';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo">FilmChain</h1>
          <div className="wallet-section">
            <MetaMaskConnector />
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Add your other routes here */}
          </Routes>
        </Router>
      </main>
      
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} FilmChain. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
