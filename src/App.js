import React, { useState, useEffect } from 'react';
import { WalletProvider } from './contexts/WalletContext';
import IndieFundSection from './components/IndieFundSection';
import CommunityVoiceSection from './components/CommunityVoiceSection';
import HyreBlockSection from './components/HyreBlockSection';
import BlockOfficeSection from './components/BlockOfficeSection';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import './components/DesignFixes.css';

function App() {
  const [activeSection, setActiveSection] = useState('indieFund');
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Simulate wallet connection
  const connectWallet = () => {
    // In a real app, this would connect to MetaMask or another wallet
    setIsConnected(true);
    setAccount('0x1234...5678');
    setShowWalletModal(false);
  };

  return (
    <WalletProvider>
      <div className="app">
        <header className="app-header">
          <div className="logo-container">
            <h1 className="logo">FilmChain</h1>
          </div>
          
          <div className="wallet-container">
            {isConnected ? (
              <div className="account-info">
                <span className="account-address">{account}</span>
                <span className="balance">1,000 FILM</span>
              </div>
            ) : (
              <button 
                className="connect-wallet-btn"
                onClick={() => setShowWalletModal(true)}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </header>
        
        <main className="app-main">
          {/* Updated Navigation Order - Indie Fund and Community Voice first */}
          <div className="main-navigation">
            <button 
              className={`nav-button ${activeSection === 'indieFund' ? 'active' : ''}`}
              onClick={() => setActiveSection('indieFund')}
            >
              Indie Fund
            </button>
            <button 
              className={`nav-button ${activeSection === 'communityVoice' ? 'active' : ''}`}
              onClick={() => setActiveSection('communityVoice')}
            >
              Community Voice
            </button>
            <button 
              className={`nav-button ${activeSection === 'hyreBlock' ? 'active' : ''}`}
              onClick={() => setActiveSection('hyreBlock')}
            >
              Hyre Block
            </button>
            <button 
              className={`nav-button ${activeSection === 'blockOffice' ? 'active' : ''}`}
              onClick={() => setActiveSection('blockOffice')}
            >
              Block Office
            </button>
          </div>
          
          <ErrorBoundary>
            {/* Updated Section Rendering Order */}
            {activeSection === 'indieFund' && <IndieFundSection />}
            {activeSection === 'communityVoice' && <CommunityVoiceSection />}
            {activeSection === 'hyreBlock' && <HyreBlockSection />}
            {activeSection === 'blockOffice' && <BlockOfficeSection />}
          </ErrorBoundary>
        </main>
        
        <footer className="app-footer">
          <p>&copy; 2024 FilmChain. All rights reserved.</p>
        </footer>
        
        {/* Wallet Connection Modal */}
        {showWalletModal && (
          <div className="modal-overlay">
            <div className="modal-content wallet-modal">
              <button 
                className="close-btn"
                onClick={() => setShowWalletModal(false)}
              >
                &times;
              </button>
              
              <h2>Connect Your Wallet</h2>
              <p>Choose a wallet to connect to FilmChain:</p>
              
              <div className="wallet-options">
                <button 
                  className="wallet-option"
                  onClick={connectWallet}
                >
                  <img src="https://placehold.co/30x30/6a11cb/ffff?text=M" alt="MetaMask" />
                  <span>MetaMask</span>
                </button>
                
                <button className="wallet-option">
                  <img src="https://placehold.co/30x30/2575fc/ffff?text=W" alt="WalletConnect" />
                  <span>WalletConnect</span>
                </button>
                
                <button className="wallet-option">
                  <img src="https://placehold.co/30x30/e91e63/ffff?text=C" alt="Coinbase Wallet" />
                  <span>Coinbase Wallet</span>
                </button>
              </div>
              
              <p className="wallet-note">
                By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        )}
      </div>
    </WalletProvider>
  );
}

export default App;
