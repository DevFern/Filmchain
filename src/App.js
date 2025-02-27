import React, { useState, useEffect } from 'react';
import { useWallet } from './contexts/WalletContext';
import NFTMarketSection from './components/NFTMarketSection';
import IndieFundSection from './components/IndieFundSection';
import HyreBlockSection from './components/HyreBlockSection';
import BlockOfficeSection from './components/BlockOfficeSection';
import CommunityVoiceSection from './components/CommunityVoiceSection';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('nftmarket');
  const [notifications] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { account, connectWallet, disconnectWallet, isMetaMaskInstalled } = useWallet();

  const renderSection = () => {
    switch (activeSection) {
      case 'nftmarket':
        return <NFTMarketSection />;
      case 'indiefund':
        return <IndieFundSection />;
      case 'hyreblock':
        return <HyreBlockSection />;
      case 'blockoffice':
        return <BlockOfficeSection />;
      case 'communityvoice':
        return <CommunityVoiceSection />;
      default:
        return <NFTMarketSection />;
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-container')) {
        setShowProfileMenu(false);
      }
      if (showNotifications && !event.target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, showNotifications]);

  // MetaMask installation prompt
  if (!isMetaMaskInstalled) {
    return (
      <div className="metamask-prompt">
        <div className="metamask-prompt-content">
          <h2>MetaMask Required</h2>
          <p>Please install MetaMask to use the FilmChain platform.</p>
          <p>MetaMask is a browser extension that allows you to interact with blockchain applications.</p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="install-metamask-btn"
          >
            Install MetaMask
          </a>
          <p className="metamask-note">After installing, please refresh this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <img 
              src="https://i.ibb.co/dsc9RSQ6/filmchain-logo.jpg" 
              alt="FilmChain Logo" 
              className="logo" 
            />
            <h1>FilmChain</h1>
          </div>
          
          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              <li className={`nav-item ${activeSection === 'nftmarket' ? 'active' : ''}`}>
                <button 
                  className={`nav-button ${activeSection === 'nftmarket' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('nftmarket')}
                >
                  <i className="fas fa-store"></i>
                  <span>NFT Market</span>
                </button>
              </li>
              <li className={`nav-item ${activeSection === 'indiefund' ? 'active' : ''}`}>
                <button 
                  className={`nav-button ${activeSection === 'indiefund' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('indiefund')}
                >
                  <i className="fas fa-film"></i>
                  <span>Indie Fund</span>
                </button>
              </li>
              <li className={`nav-item ${activeSection === 'hyreblock' ? 'active' : ''}`}>
                <button 
                  className={`nav-button ${activeSection === 'hyreblock' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('hyreblock')}
                >
                  <i className="fas fa-briefcase"></i>
                  <span>Hyre Block</span>
                </button>
              </li>
              <li className={`nav-item ${activeSection === 'blockoffice' ? 'active' : ''}`}>
                <button 
                  className={`nav-button ${activeSection === 'blockoffice' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('blockoffice')}
                >
                  <i className="fas fa-chart-line"></i>
                  <span>Block Office</span>
                </button>
              </li>
              <li className={`nav-item ${activeSection === 'communityvoice' ? 'active' : ''}`}>
                <button 
                  className={`nav-button ${activeSection === 'communityvoice' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('communityvoice')}
                >
                  <i className="fas fa-comments"></i>
                  <span>Community Voice</span>
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="header-actions">
            {/* Notifications */}
            <div className="notifications-container">
              <button className="action-button notifications-btn" onClick={toggleNotifications} aria-label="Notifications">
                <i className="fas fa-bell"></i>
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </button>
              
              <div className={`dropdown ${showNotifications ? 'active' : ''}`}>
                <div className="dropdown-header">
                  <h3 className="dropdown-title">Notifications</h3>
                </div>
                <div className="dropdown-body">
                  {notifications.length === 0 ? (
                    <div className="dropdown-empty">
                      <i className="fas fa-bell-slash"></i>
                      <p>No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <div key={index} className="dropdown-item">
                        <i className="fas fa-info-circle"></i>
                        <div>
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            {/* Wallet Connection */}
            {!account ? (
              <button className="connect-wallet-btn" onClick={connectWallet}>
                <i className="fas fa-wallet"></i>
                <span>Connect Wallet</span>
              </button>
            ) : (
              <div className="profile-container">
                <button className="profile-btn" onClick={toggleProfileMenu}>
                  <span className="wallet-address">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </span>
                  <i className="fas fa-user-circle profile-icon"></i>
                </button>
                
                <div className={`dropdown ${showProfileMenu ? 'active' : ''}`}>
                  <div className="dropdown-header">
                    <h3 className="dropdown-title">My Wallet</h3>
                    <p className="dropdown-subtitle">{account}</p>
                  </div>
                  <div className="dropdown-body">
                    <div className="dropdown-item">
                      <i className="fas fa-user"></i>
                      <span>My Profile</span>
                    </div>
                    <div className="dropdown-item">
                      <i className="fas fa-images"></i>
                      <span>My NFTs</span>
                    </div>
                    <div className="dropdown-item">
                      <i className="fas fa-chart-pie"></i>
                      <span>My Investments</span>
                    </div>
                    <div className="dropdown-item">
                      <i className="fas fa-cog"></i>
                      <span>Settings</span>
                    </div>
                    <div className="dropdown-item danger" onClick={disconnectWallet}>
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Disconnect</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="main-content">
        {renderSection()}
      </main>
      
      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img 
              src="https://i.ibb.co/dsc9RSQ6/filmchain-logo.jpg" 
              alt="FilmChain Logo" 
              className="logo-small" 
            />
            <p>FilmChain © 2023</p>
          </div>
          <div className="footer-links">
            <a href="/about" className="footer-link">About</a>
            <a href="/terms" className="footer-link">Terms</a>
            <a href="/privacy" className="footer-link">Privacy</a>
            <a href="/contact" className="footer-link">Contact</a>
          </div>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Discord">
              <i className="fab fa-discord"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Powered by Blockchain Technology</p>
          <p>All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
