// src/contexts/WalletContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import Web3 from 'web3';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [filmBalance, setFilmBalance] = useState(0);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      setIsMetaMaskInstalled(true);
      
      // Handle account changes
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setAccount(null);
          setError('Wallet disconnected');
        } else {
          // User switched accounts
          setAccount(accounts[0]);
          setError(null);
        }
      };

      // Handle chain changes
      const handleChainChanged = (chainId) => {
        window.location.reload(); // Recommended by MetaMask
      };

      // Subscribe to events
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            initializeWeb3();
          }
        })
        .catch(err => {
          console.error('Error checking connected accounts:', err);
        });

      // Cleanup
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const initializeWeb3 = async () => {
    try {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      
      // Get network ID
      const network = await web3Instance.eth.net.getId();
      setNetworkId(network);
      
      // Here you would typically load your token contract and get balance
      // For demo purposes, we'll just set a mock balance
      setFilmBalance(1000);
    } catch (err) {
      console.error('Error initializing web3:', err);
      setError('Failed to initialize blockchain connection');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to use this application.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setAccount(accounts[0]);
      await initializeWeb3();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      if (err.code === 4001) {
        // User rejected the connection request
        setError('You rejected the connection request. Please connect your wallet to use all features.');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
    setNetworkId(null);
    setFilmBalance(0);
  };

  const value = {
    account,
    web3,
    networkId,
    filmBalance,
    isConnecting,
    error,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
