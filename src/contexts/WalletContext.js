// src/contexts/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Check for MetaMask on component mount
  useEffect(() => {
    const detectMetaMask = () => {
      // Log the current state for debugging
      console.log("Detecting MetaMask...");
      console.log("window.ethereum:", window.ethereum);
      
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        console.log("window.ethereum exists");
        
        if (window.ethereum.isMetaMask) {
          console.log("MetaMask is confirmed!");
          setIsMetaMaskInstalled(true);
          
          // Check if already connected
          window.ethereum.request({ method: 'eth_accounts' })
            .then(accounts => {
              if (accounts && accounts.length > 0) {
                console.log("Already connected to:", accounts[0]);
                setAccount(accounts[0]);
              }
              setIsInitializing(false);
            })
            .catch(err => {
              console.error("Error checking accounts:", err);
              setIsInitializing(false);
            });
        } else {
          console.log("window.ethereum exists but isMetaMask is false");
          setIsMetaMaskInstalled(false);
          setIsInitializing(false);
        }
      } else {
        console.log("window.ethereum is undefined");
        setIsMetaMaskInstalled(false);
        setIsInitializing(false);
      }
    };

    // Delay detection slightly to ensure window.ethereum is injected
    const timer = setTimeout(detectMetaMask, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        throw new Error("No accounts found");
      }
    } catch (err) {
      console.error("Error connecting:", err);
      setError(err.message);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        isMetaMaskInstalled,
        isInitializing,
        error,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
