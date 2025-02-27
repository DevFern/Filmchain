import React, { createContext, useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';

// ABI for our FilmChain token
const filmTokenABI = [
  // ERC-20 standard functions
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)"
];

// Contract addresses - replace with your deployed contract addresses
const FILM_TOKEN_ADDRESS = "0x123..."; // Replace with actual token contract address

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [filmTokenContract, setFilmTokenContract] = useState(null);
  const [filmBalance, setFilmBalance] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize web3 and provider
  useEffect(() => {
    const initializeWeb3 = async () => {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          
          const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(ethersProvider);
          
          // Initialize token contract
          const signer = ethersProvider.getSigner();
          const tokenContract = new ethers.Contract(
            FILM_TOKEN_ADDRESS,
            filmTokenABI,
            signer
          );
          setFilmTokenContract(tokenContract);
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              fetchFilmBalance(accounts[0], tokenContract);
            } else {
              setAccount(null);
              setFilmBalance(0);
            }
          });
          
          // Listen for chain changes
          window.ethereum.on('chainChanged', (chainId) => {
            setChainId(parseInt(chainId, 16));
            window.location.reload();
          });
          
        } catch (err) {
          console.error("Error initializing web3:", err);
          setError("Failed to initialize Web3. Please refresh the page.");
        }
      } else {
        setError("Please install MetaMask to use this application.");
      }
    };
    
    initializeWeb3();
    
    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);
  
  // Fetch FILM token balance
  const fetchFilmBalance = async (address, contract) => {
    if (!address || !contract) return;
    
    try {
      const balance = await contract.balanceOf(address);
      setFilmBalance(ethers.utils.formatUnits(balance, 18)); // Assuming 18 decimals
    } catch (err) {
      console.error("Error fetching FILM balance:", err);
    }
  };
  
  // Connect wallet function
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask to use this application.");
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        
        const chainId = await window.ethereum.request({ 
          method: 'eth_chainId' 
        });
        setChainId(parseInt(chainId, 16));
        
        // Fetch token balance
        if (filmTokenContract) {
          fetchFilmBalance(accounts[0], filmTokenContract);
        }
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setFilmBalance(0);
  };
  
  // Transfer FILM tokens
  const transferFilm = async (to, amount) => {
    if (!filmTokenContract || !account) {
      setError("Wallet not connected or contract not initialized");
      return false;
    }
    
    try {
      const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
      const tx = await filmTokenContract.transfer(to, amountInWei);
      await tx.wait();
      
      // Update balance after transfer
      fetchFilmBalance(account, filmTokenContract);
      return true;
    } catch (err) {
      console.error("Error transferring FILM tokens:", err);
      setError("Transaction failed. Please try again.");
      return false;
    }
  };
  
  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        provider,
        web3,
        filmTokenContract,
        filmBalance,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
        transferFilm,
        fetchFilmBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook for using wallet context
export const useWallet = () => useContext(WalletContext);
