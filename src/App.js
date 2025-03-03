// src/App.js
import React from 'react';
import { useWallet } from './contexts/WalletContext';
import './App.css';

function App() {
  const { 
    account, 
    connectWallet, 
    disconnectWallet, 
    isMetaMaskInstalled,
    isInitializing,
    isConnecting,
    error
  } = useWallet();

  // Show loading state while checking for MetaMask
  if (isInitializing) {
    return (
      <div className="metamask-prompt">
        <div className="metamask-prompt-content">
          <h2>Loading...</h2>
          <p>Checking for MetaMask...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // If MetaMask is not installed, show installation prompt
  if (!isMetaMaskInstalled) {
    return (
      <div className="metamask-prompt">
        <div className="metamask-prompt-content">
          <h2>MetaMask Required</h2>
          <p>To use this application, you need to install the MetaMask browser extension.</p>
          <a 
            href="https://metamask.io/download.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-container">
              <h1 className="logo">FilmChain</h1>
            </div>
            
            {/* Wallet Connection UI */}
            <div className="header-actions">
              {!account ? (
                <button 
                  className="connect-wallet-btn" 
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              ) : (
                <div className="wallet-info">
                  <span className="wallet-address">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </span>
                  <button className="disconnect-btn" onClick={disconnectWallet}>
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          {/* Display wallet errors if any */}
          {error && (
            <div className="wallet-error-banner">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button 
                className="close-btn"
                onClick={() => {/* Clear error function would go here */}}
              >
                &times;
              </button>
            </div>
          )}
          
          {/* Main content */}
          <div className="content-section">
            <h2>Welcome to FilmChain</h2>
            {account ? (
              <div>
                <p>You are connected with account: {account}</p>
                <p>Now you can interact with the blockchain!</p>
              </div>
            ) : (
              <p>Please connect your MetaMask wallet to continue.</p>
            )}
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} FilmChain. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
