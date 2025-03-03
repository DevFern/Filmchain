// src/App.js
import React from 'react';
import MetaMaskConnector from './components/MetaMaskConnector';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>FilmChain</h1>
      </header>
      
      <main className="app-main">
        <MetaMaskConnector />
        
        <div className="content-section">
          <h2>Welcome to FilmChain</h2>
          <p>Connect your MetaMask wallet to interact with the blockchain.</p>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} FilmChain. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
