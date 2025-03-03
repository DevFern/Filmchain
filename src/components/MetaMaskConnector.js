// src/components/MetaMaskConnector.js
import React, { useState, useEffect } from 'react';

const MetaMaskConnector = () => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        console.log('MetaMask is installed!');
        setIsMetaMaskInstalled(true);
        
        // Check if already connected
        window.ethereum.request({ method: 'eth_accounts' })
          .then(accounts => {
            if (accounts && accounts.length > 0) {
              console.log('Already connected to account:', accounts[0]);
              setAccount(accounts[0]);
            }
          })
          .catch(err => {
            console.error('Error checking accounts:', err);
          });
          
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            console.log('Account changed to:', accounts[0]);
            setAccount(accounts[0]);
          } else {
            console.log('Account disconnected');
            setAccount(null);
          }
        });
      } else {
        console.log('MetaMask is not installed');
        setIsMetaMaskInstalled(false);
      }
    };
    
    // Small delay to ensure window.ethereum is available
    setTimeout(checkMetaMask, 1000);
  }, []);

  // Connect to MetaMask
  const connectToMetaMask = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      console.log('Requesting accounts...');
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        console.log('Connected to account:', accounts[0]);
        setAccount(accounts[0]);
      } else {
        throw new Error('No accounts found');
      }
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
      setError(err.message || 'Failed to connect to MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from MetaMask
  const disconnectWallet = () => {
    setAccount(null);
  };

  // Render MetaMask installation prompt
  if (!isMetaMaskInstalled) {
    return (
      <div className="metamask-header-container">
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

  return (
    <div className="metamask-header-container">
      {error && (
        <div className="wallet-error-tooltip">
          Error: {error}
        </div>
      )}
      
      {!account ? (
        <button 
          className="connect-button"
          onClick={connectToMetaMask}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="wallet-address">
          {account.substring(0, 6)}...{account.substring(account.length - 4)}
          <button 
            className="disconnect-button"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnector;
