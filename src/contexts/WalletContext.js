import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const WalletContext = createContext();

// Provider component
export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [network, setNetwork] = useState(null);

  // Check if MetaMask is installed
  useEffect(() => {
    if (window.ethereum) {
      setIsMetaMaskInstalled(true);
    } else {
      setIsMetaMaskInstalled(false);
    }
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      alert("MetaMask is not installed. Please install it to use this feature.");
      return null;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetwork(chainId);
      return accounts[0];
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return null;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setNetwork(null);
  };

  // Handle account or network changes
  useEffect(() => {
    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId) => {
        setNetwork(chainId);
        window.location.reload(); // Reload the page to reflect network changes
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  // Value to be provided by the context
  const value = {
    account,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    network,
  };

return (
  <WalletContext.Provider value={value}>
    {children}
  </WalletContext.Provider>
);


// Custom hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
