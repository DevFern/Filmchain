// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import MetaMaskConnector from './components/MetaMaskConnector';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 className="logo">FilmChain</h1>
            <div className="wallet-section">
              <ErrorBoundary>
                <MetaMaskConnector compact={true} />
              </ErrorBoundary>
            </div>
          </div>
        </header>
        
        <main className="app-main">
          <ErrorBoundary>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                {/* Add your other routes here */}
              </Routes>
            </Router>
          </ErrorBoundary>
        </main>
        
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} FilmChain. All rights reserved.</p>
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
