// src/App.js
import React, { useState, useEffect, Suspense } from 'react';
import { useWallet } from './contexts/WalletContext';
import ErrorBoundary from './components/ErrorBoundary';
import NFTMarketSection from './components/NFTMarketSection';
import IndieFundSection from './components/IndieFundSection';
import HyreBlockSection from './components/HyreBlockSection';
import BlockOfficeSection from './components/BlockOfficeSection';
import CommunityVoiceSection from './components/CommunityVoiceSection';
import './App.css';
import './components/DesignFixes.css';

function App() {
  // Keep the existing state and functions
  const [activeSection, setActiveSection] = useState('indiefund'); // Changed default to indiefund
  const [notifications] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { 
    account, 
    connectWallet, 
    disconnectWallet, 
    isMetaMaskInstalled,
    isConnecting,
    error: walletError
  } = useWallet();

  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'indiefund':
        return (
          <ErrorBoundary>
            <IndieFundSection />
          </ErrorBoundary>
        );
      case 'communityvoice':
        return (
          <ErrorBoundary>
            <CommunityVoiceSection />
          </ErrorBoundary>
        );
      case 'hyreblock':
        return (
          <ErrorBoundary>
            <HyreBlockSection />
          </ErrorBoundary>
        );
      case 'blockoffice':
        return (
          <ErrorBoundary>
            <BlockOfficeSection />
          </ErrorBoundary>
        );
      case 'nftmarket':
        return (
          <ErrorBoundary>
            <NFTMarketSection />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary>
            <IndieFundSection />
          </ErrorBoundary>
        );
    }
  };

  // Keep the existing functions
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileMenu) setShowProfileMenu(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  // If MetaMask is not installed, show installation prompt
  if (!isMetaMaskInstalled) {
    return (
      <div className="metamask-prompt">
        <div className="metamask-prompt-content">
          <h2>MetaMask Required</h2>
          <p>To use FilmChain, you need to install the MetaMask browser extension.</p>
          <p>MetaMask allows you to securely interact with blockchain applications.</p>
          <a 
            href="https://metamask.io/download.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          <div className="logo-container">
            <h1 className="logo">FilmChain</h1>
          </div>
          
          <button 
            className="mobile-menu-btn" 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <i className={`fas fa-${menuOpen ? 'times' : 'bars'}`}></i>
          </button>
          
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              {/* Reordered navigation items */}
              <li>
                <button 
                  className={`nav-button ${activeSection === 'indiefund' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('indiefund')}
                >
                  <i className="fas fa-film"></i>
                  <span>IndieFund</span>
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${activeSection === 'communityvoice' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('communityvoice')}
                >
                  <i className="fas fa-comments"></i>
                  <span>Community</span>
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${activeSection === 'hyreblock' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('hyreblock')}
                >
                  <i className="fas fa-briefcase"></i>
                  <span>HyreBlock</span>
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${activeSection === 'blockoffice' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('blockoffice')}
                >
                  <i className="fas fa-chart-line"></i>
                  <span>BlockOffice</span>
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${activeSection === 'nftmarket' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('nftmarket')}
                >
                  <i className="fas fa-store"></i>
                  <span>NFT Market</span>
                </button>
              </li>
            </ul>
          </nav>
          
          {/* Keep the rest of the header unchanged */}
          <div className="header-actions">
            {/* ... existing code ... */}
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          {walletError && (
            <div className="wallet-error-banner">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{walletError}</p>
              <button 
                className="close-btn"
                onClick={() => {/* Clear error */}}
                aria-label="Dismiss error"
              >
                &times;
              </button>
            </div>
          )}
          
          <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
            {renderSection()}
          </Suspense>
        </div>
      </main>
      
      {/* Keep the footer unchanged */}
      <footer className="app-footer">
        {/* ... existing code ... */}
      </footer>
    </div>
  );
}

export default App;
