import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const WalletContext = createContext();

// Provider component
export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [filmBalance, setFilmBalance] = useState(1000); // Mock balance
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = async () => {
      if (window.ethereum) {
        setIsMetaMaskInstalled(true);
      } else {
        setIsMetaMaskInstalled(false);
      }
    };

    checkMetaMask();
  }, []);

  const connectWallet = async () => {
    try {
      // In a real app, you would connect to MetaMask here
      // For now, we'll just simulate a successful connection
      setAccount("0x1234567890abcdef1234567890abcdef12345678");
      return "0x1234567890abcdef1234567890abcdef12345678";
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Failed to connect wallet. Please try again.");
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
    filmBalance,
    connectWallet,
    disconnectWallet,
    error
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
