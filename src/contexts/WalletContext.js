// src/contexts/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { createHttp } from '@helia/http';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [filmBalance, setFilmBalance] = useState(1000);
  const [error, setError] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [helia, setHelia] = useState(null);
  const [fs, setFs] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkIfMetaMaskInstalled();
    initializeHelia();
  }, []);

  const initializeHelia = async () => {
    try {
      setIsInitializing(true);
      
      // Create a new Helia instance
      const heliaInstance = await createHelia();
      setHelia(heliaInstance);
      
      // Create HTTP client using the correct import
      const httpClient = createHttp(heliaInstance);
      
      // Initialize UnixFS with the Helia instance
      const fsInstance = unixfs(heliaInstance);
      setFs(fsInstance);
    } catch (err) {
      console.error("Failed to initialize Helia:", err);
      // Provide fallback functionality
      setHelia({
        add: async () => "mock-cid-for-fallback",
        get: async () => new Uint8Array([])
      });
      setFs({
        addBytes: async () => "mock-cid-for-fallback",
        cat: async function* () { yield new Uint8Array([]); }
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const checkIfMetaMaskInstalled = () => {
    const { ethereum } = window;
    if (!ethereum || !ethereum.isMetaMask) {
      setIsMetaMaskInstalled(false);
    } else {
      setIsMetaMaskInstalled(true);
      setupEventListeners();
      
      // Check if already connected
      ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            initializeWeb3(ethereum);
          }
        })
        .catch(err => {
          console.error("Error checking connected accounts:", err);
        });
    }
  };

  const setupEventListeners = () => {
    const { ethereum } = window;
    
    if (ethereum) {
      ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          initializeWeb3(ethereum);
        } else {
          setAccount(null);
          setProvider(null);
          setSigner(null);
        }
      });
      
      ethereum.on('chainChanged', () => {
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
        return;
      }
      
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await initializeWeb3(ethereum);
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

  // Function to upload to IPFS using Helia
  const uploadToIPFS = async (file) => {
    if (!fs) {
      throw new Error("IPFS not initialized");
    }
    
    try {
      const fileBuffer = await file.arrayBuffer();
      const cid = await fs.addBytes(new Uint8Array(fileBuffer));
      return cid.toString();
    } catch (err) {
      console.error("Error uploading to IPFS:", err);
      throw err;
    }
  };

  // Function to get content from IPFS using Helia
  const getFromIPFS = async (cid) => {
    if (!fs) {
      throw new Error("IPFS not initialized");
    }
    
    try {
      const decoder = new TextDecoder();
      let data = '';
      
      for await (const chunk of fs.cat(cid)) {
        data += decoder.decode(chunk, { stream: true });
      }
      
      return data;
    } catch (err) {
      console.error("Error getting from IPFS:", err);
      throw err;
    }
  };

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
        disconnectWallet,
        uploadToIPFS,
        getFromIPFS
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
