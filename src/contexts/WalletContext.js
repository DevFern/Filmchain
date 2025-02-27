import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const WalletContext = createContext();

// Provider component
export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsMetaMaskInstalled(true);
      
      // Check if already connected
      checkIfWalletIsConnected();
    }
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this application.");
        return;
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      return accounts[0];
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return null;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  // Value to be provided by the context
  const value = {
    account,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    // Add dummy values for any other properties used in components
    provider: null,
    filmTokenContract: null,
    chainId: null
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
