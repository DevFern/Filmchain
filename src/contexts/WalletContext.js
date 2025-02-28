// src/contexts/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { createHttpClient } from '@helia/http-client';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [filmBalance, setFilmBalance] = useState(0);
  const [error, setError] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [helia, setHelia] = useState(null);
  const [fs, setFs] = useState(null);

  useEffect(() => {
    checkIfMetaMaskIsInstalled();
    initializeHelia();
  }, []);

  const initializeHelia = async () => {
    try {
      // For HTTP client (similar to ipfs-http-client)
      const heliaHttpClient = await createHttpClient({
        url: 'https://ipfs.infura.io:5001/api/v0' // Use your IPFS gateway
      });
      
      setHelia(heliaHttpClient);
      setFs(unixfs(heliaHttpClient));
      
      // Alternatively, for a local node:
      // const heliaNode = await createHelia();
      // setHelia(heliaNode);
      // setFs(unixfs(heliaNode));
    } catch (err) {
      console.error("Failed to initialize Helia:", err);
    }
  };

  const checkIfMetaMaskIsInstalled = () => {
    const { ethereum } = window;
    if (!ethereum || !ethereum.isMetaMask) {
      setIsMetaMaskInstalled(false);
    } else {
      setIsMetaMaskInstalled(true);
      setupEventListeners();
    }
  };

  const setupEventListeners = () => {
    const { ethereum } = window;
    
    if (ethereum) {
      ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
      
      ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        setError("Please install MetaMask to use this feature");
        return;
      }
      
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        setProvider(provider);
        
        const signer = provider.getSigner();
        setSigner(signer);
        
        // In a real app, you would fetch the actual token balance here
        setFilmBalance(1000); // Placeholder value
        
        setError(null);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet. Please try again.");
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
        isMetaMaskInstalled,
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
