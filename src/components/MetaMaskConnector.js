// src/components/MetaMaskConnector.js
import React, { useState, useEffect } from 'react';

const MetaMaskConnector = () => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [status, setStatus] = useState('Checking for MetaMask...');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        console.log('MetaMask is installed!');
        setIsMetaMaskInstalled(true);
        setStatus('MetaMask detected. Please connect your wallet.');
        
        // Check if already connected
        window.ethereum.request({ method: 'eth_accounts' })
          .then(accounts => {
            if (accounts && accounts.length > 0) {
              console.log('Already connected to account:', accounts[0]);
              setAccount(accounts[0]);
              setStatus('Connected to MetaMask!');
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
            setStatus('Connected to MetaMask!');
          } else {
            console.log('Account disconnected');
            setAccount(null);
            setStatus('MetaMask detected. Please connect your wallet.');
          }
        });
      } else {
        console.log('MetaMask is not installed');
        setIsMetaMaskInstalled(false);
        setStatus('MetaMask is not installed.');
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
        setStatus('Connected to MetaMask!');
      } else {
        throw new Error('No accounts found');
      }
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
      setError(err.message || 'Failed to connect to MetaMask');
      setStatus('Connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from MetaMask
  const disconnectWallet = () => {
    setAccount(null);
    setStatus('Disconnected. Please connect your wallet.');
  };

  // Render MetaMask installation prompt
  if (!isMetaMaskInstalled) {
    return (
      <div className="metamask-container">
        <h2>MetaMask Required</h2>
        <p>To use this application, you need to install the MetaMask browser extension.</p>
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
    <div className="metamask-container">
      <h2>MetaMask Connection</h2>
      <p className="status-message">{status}</p>
      
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}
      
      {!account ? (
        <button 
          className="connect-button"
          onClick={connectToMetaMask}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect to MetaMask'}
        </button>
      ) : (
        <div className="account-info">
          <p>Connected Account: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
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
