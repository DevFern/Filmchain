import React, { createContext, useContext, useState } from 'react';

// Create context
const WalletContext = createContext();

// Provider component
export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);

  const connectWallet = async () => {
    try {
      setAccount("0x1234567890abcdef1234567890abcdef12345678");
      return "0x1234567890abcdef1234567890abcdef12345678";
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
    disconnectWallet
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
