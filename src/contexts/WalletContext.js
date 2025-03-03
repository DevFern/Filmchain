// src/contexts/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [filmBalance, setFilmBalance] = useState(1000);
  const [error, setError] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false); // Default to false
  const [isInitializing, setIsInitializing] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if MetaMask is installed on page load
  useEffect(() => {
    const checkMetaMask = async () => {
      console.log("Checking for MetaMask...");
      
      // Give the window time to load ethereum object
      setTimeout(() => {
        const { ethereum } = window;
        
        if (ethereum && ethereum.isMetaMask) {
          console.log("MetaMask is installed!");
          setIsMetaMaskInstalled(true);
          setupEventListeners();
          
          // Check if already connected
          ethereum.request({ method: 'eth_accounts' })
            .then(accounts => {
              if (accounts && accounts.length > 0) {
                console.log("Found connected account:", accounts[0]);
                setAccount(accounts[0]);
                initializeWeb3(ethereum);
              } else {
                console.log("No connected accounts found");
              }
              setIsInitializing(false);
            })
            .catch(err => {
              console.error("Error checking connected accounts:", err);
              setIsInitializing(false);
            });
        } else {
          console.log("MetaMask is not installed");
          setIsMetaMaskInstalled(false);
          setIsInitializing(false);
        }
      }, 500); // Give a small delay to ensure window.ethereum is available
    };
    
    checkMetaMask();
  }, []);

  const setupEventListeners = () => {
    const { ethereum } = window;
    
    if (ethereum) {
      // Handle account changes
      ethereum.on('accountsChanged', (accounts) => {
        console.log("Accounts changed:", accounts);
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          initializeWeb3(ethereum);
        } else {
          setAccount(null);
          setProvider(null);
          setSigner(null);
        }
      });
      
      // Handle chain changes
      ethereum.on('chainChanged', () => {
        console.log("Network changed, reloading...");
        window.location.reload();
      });
    }
  };

  const initializeWeb3 = async (ethereum) => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      setProvider(provider);
      
      const signer = provider.getSigner();
      setSigner(signer);
      
      // In a real app, you would fetch the actual token balance here
      setFilmBalance(1000); // Placeholder value
      
      setError(null);
    } catch (err) {
      console.error("Error initializing web3:", err);
      setError("Failed to initialize blockchain connection");
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const { ethereum } = window;
      
      if (!ethereum) {
        setError("Please install MetaMask to use this feature");
        setIsConnecting(false);
        return;
      }
      
      console.log("Requesting accounts...");
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        console.log("Connected to account:", accounts[0]);
        setAccount(accounts[0]);
        await initializeWeb3(ethereum);
      } else {
        setError("No accounts found. Please create an account in MetaMask.");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      if (err.code === 4001) {
        // User rejected the connection request
        setError("You rejected the connection request");
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setFilmBalance(0);
  };

  // For debugging
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
        provider,
        signer,
        filmBalance,
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
