// src/components/MetaMaskConnector.js
import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import './DesignFixes.css'; // Make sure this CSS file is available

const MetaMaskConnector = ({ compact = false }) => {
  const { 
    account, 
    isMetaMaskInstalled, 
    isInitializing,
    error, 
    connectWallet, 
    disconnectWallet 
  } = useWallet();
  
  const [showError, setShowError] = useState(false);

  // Show error message for 5 seconds when error changes
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // If still initializing, show loading state
  if (isInitializing) {
    return (
      <div className={compact ? "metamask-header-container" : "metamask-container"}>
        <div className="status-message">Checking wallet status...</div>
      </div>
    );
  }

  // If MetaMask is not installed
  if (!isMetaMaskInstalled) {
    return (
      <div className={compact ? "metamask-header-container" : "metamask-container"}>
        <div className="status-message">MetaMask is not installed</div>
        <a 
          href="https://metamask.io/download.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="metamask-button"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  // If connected to wallet
  if (account) {
    return (
      <div className={compact ? "metamask-header-container" : "metamask-container"}>
        {compact ? (
          <div className="wallet-address">
            {account.slice(0, 6)}...{account.slice(-4)}
            <button 
              onClick={disconnectWallet}
              className="disconnect-button"
              title="Disconnect wallet"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <>
            <div className="account-info">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
            <button 
              onClick={disconnectWallet}
              className="disconnect-button"
            >
              Disconnect Wallet
            </button>
          </>
        )}
        
        {showError && error && (
          <div className={compact ? "wallet-error-tooltip" : "error-message"}>
            {error}
          </div>
        )}
      </div>
    );
  }

  // Not connected yet
  return (
    <div className={compact ? "metamask-header-container" : "metamask-container"}>
      <button 
        onClick={connectWallet}
        className="connect-button"
        disabled={isInitializing}
      >
        Connect Wallet
      </button>
      
      {showError && error && (
        <div className={compact ? "wallet-error-tooltip" : "error-message"}>
          {error}
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnector;
