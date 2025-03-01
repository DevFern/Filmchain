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
  const [activeSection, setActiveSection] = useState('nftmarket');
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
      case 'nftmarket':
        return (
          <ErrorBoundary>
            <NFTMarketSection />
          </ErrorBoundary>
        );
      case 'indiefund':
        return (
          <ErrorBoundary>
            <IndieFundSection />
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
      case 'communityvoice':
        return (
          <ErrorBoundary>
            <CommunityVoiceSection />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary>
            <NFTMarketSection />
          </ErrorBoundary>
        );
    }
  };

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
              <li>
                <button 
                  className={`nav-button ${activeSection === 'nftmarket' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('nftmarket')}
                >
                  <i className="fas fa-store"></i>
                  <span>NFT Market</span>
                </button>
              </li>
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
                  className={`nav-button ${activeSection === 'communityvoice' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('communityvoice')}
                >
                  <i className="fas fa-comments"></i>
                  <span>Community</span>
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="header-actions">
            {account ? (
              <div className="user-actions">
                <button 
                  className="notification-btn"
                  onClick={toggleNotifications}
                  aria-label="Notifications"
                >
                  <i className="fas fa-bell"></i>
                  {notifications.length > 0 && (
                    <span className="notification-badge">{notifications.length}</span>
                  )}
                </button>
                
                <button 
                  className="profile-btn"
                  onClick={toggleProfileMenu}
                  aria-label="User profile"
                >
                  <span className="wallet-address">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </span>
                  <i className="fas fa-user-circle"></i>
                </button>
                
                {showProfileMenu && (
                  <div className="profile-menu">
                    <div className="profile-menu-header">
                      <span className="wallet-address-full">{account}</span>
                    </div>
                    <ul className="profile-menu-list">
                      <li>
                        <button className="profile-menu-item">
                          <i className="fas fa-user"></i>
                          <span>My Profile</span>
                        </button>
                      </li>
                      <li>
                        <button className="profile-menu-item">
                          <i className="fas fa-cog"></i>
                          <span>Settings</span>
                        </button>
                      </li>
                      <li>
                        <button 
                          className="profile-menu-item logout"
                          onClick={disconnectWallet}
                        >
                          <i className="fas fa-sign-out-alt"></i>
                          <span>Disconnect Wallet</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
                
                {showNotifications && (
                  <div className="notifications-menu">
                    <div className="notifications-header">
                      <h3>Notifications</h3>
                    </div>
                    {notifications.length > 0 ? (
                      <ul className="notifications-list">
                        {notifications.map((notification, index) => (
                          <li key={index} className="notification-item">
                            <div className="notification-icon">
                              <i className={`fas fa-${notification.icon}`}></i>
                            </div>
                            <div className="notification-content">
                              <p className="notification-text">{notification.text}</p>
                              <span className="notification-time">{notification.time}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="empty-notifications">
                        <i className="fas fa-bell-slash"></i>
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button 
                className={`connect-wallet-btn ${isConnecting ? 'loading' : ''}`}
                onClick={connectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-wallet"></i>
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            )}
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
      
      <footer className="app-footer">
        <div className="container footer-content">
          <div className="footer-logo">
            <h2>FilmChain</h2>
            <p>Revolutionizing the film industry with blockchain technology</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Platform</h3>
              <ul>
                <li><a href="#nftmarket">NFT Market</a></li>
                <li><a href="#indiefund">IndieFund</a></li>
                <li><a href="#hyreblock">HyreBlock</a></li>
                <li><a href="#blockoffice">BlockOffice</a></li>
                <li><a href="#communityvoice">Community Voice</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Resources</h3>
              <ul>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#whitepaper">Whitepaper</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#tutorials">Tutorials</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Company</h3>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#press">Press Kit</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="container footer-bottom">
          <p>&copy; 2024 FilmChain. All rights reserved.</p>
          
          <div className="footer-social">
            <a href="#twitter" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#discord" aria-label="Discord"><i className="fab fa-discord"></i></a>
            <a href="#telegram" aria-label="Telegram"><i className="fab fa-telegram"></i></a>
            <a href="#medium" aria-label="Medium"><i className="fab fa-medium"></i></a>
            <a href="#github" aria-label="GitHub"><i className="fab fa-github"></i></a>
          </div>
          
          <div className="footer-legal">
            <a href="#terms">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
