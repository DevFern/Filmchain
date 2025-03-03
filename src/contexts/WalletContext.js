// src/contexts/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const WalletContext = createContext();

// Hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      console.log("Checking for MetaMask...");
      
      if (window.ethereum && window.ethereum.isMetaMask) {
        console.log("MetaMask is installed!");
        setIsMetaMaskInstalled(true);
        
        // Check if already connected
        window.ethereum.request({ method: 'eth_accounts' })
          .then(accounts => {
            if (accounts && accounts.length > 0) {
              console.log("Found connected account:", accounts[0]);
              setAccount(accounts[0]);
            } else {
              console.log("No connected accounts found");
            }
            setIsInitializing(false);
          })
          .catch(err => {
            console.error("Error checking accounts:", err);
            setIsInitializing(false);
          });
          
        // Setup event listeners
        window.ethereum.on('accountsChanged', (accounts) => {
          console.log("Accounts changed:", accounts);
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount(null);
          }
        });
        
        window.ethereum.on('chainChanged', () => {
          console.log("Network changed, reloading...");
          window.location.reload();
        });
      } else {
        console.log("MetaMask is not installed");
        setIsMetaMaskInstalled(false);
        setIsInitializing(false);
      }
    };
    
    // Small delay to ensure window.ethereum is available
    setTimeout(checkMetaMask, 500);
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }
      
      console.log("Requesting accounts...");
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        console.log("Connected to account:", accounts[0]);
        setAccount(accounts[0]);
      } else {
        throw new Error("No accounts found");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    console.log("Disconnecting wallet");
    setAccount(null);
  };

  // Debug logging
  useEffect(() => {
    console.log("WalletContext state:", {
      isMetaMaskInstalled,
      account,
      isInitializing,
      error
    });
  }, [isMetaMaskInstalled, account, isInitializing, error]);

  return (
    <WalletContext.Provider
      value={{
        account,
        error,
        isConnecting,
        isMetaMaskInstalled,
        isInitializing,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
