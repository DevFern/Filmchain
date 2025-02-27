import React, { useState } from 'react';
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
  const [userProfile] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
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
        <div className="logo-container">
          <img src="/logo.png" alt="FilmChain Logo" className="logo" />
          <h1>FilmChain</h1>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li className={activeSection === 'nftmarket' ? 'active' : ''}>
              <button onClick={() => setActiveSection('nftmarket')}>NFT Market</button>
            </li>
            <li className={activeSection === 'indiefund' ? 'active' : ''}>
              <button onClick={() => setActiveSection('indiefund')}>IndieFund</button>
            </li>
            <li className={activeSection === 'hyreblock' ? 'active' : ''}>
              <button onClick={() => setActiveSection('hyreblock')}>HyreBlock</button>
            </li>
            <li className={activeSection === 'blockoffice' ? 'active' : ''}>
              <button onClick={() => setActiveSection('blockoffice')}>BlockOffice</button>
            </li>
            <li className={activeSection === 'communityvoice' ? 'active' : ''}>
              <button onClick={() => setActiveSection('communityvoice')}>Community Voice</button>
            </li>
          </ul>
        </nav>
        
        <div className="header-actions">
          {/* Notifications */}
          <div className="notifications-container">
            <button className="notifications-btn" onClick={toggleNotifications}>
              <i className="fas fa-bell"></i>
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notifications-dropdown">
                <h3>Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="no-notifications">No new notifications</p>
                ) : (
                  <ul className="notifications-list">
                    {notifications.map((notification, index) => (
                      <li key={index} className="notification-item">
                        <div className="notification-content">
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          
          {/* Wallet Connection */}
          {!account ? (
            <button className="connect-wallet-btn" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <div className="profile-container">
              <button className="profile-btn" onClick={toggleProfileMenu}>
                <span className="wallet-address">
                  {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </span>
                <i className="fas fa-user-circle"></i>
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <h3>My Wallet</h3>
                    <p className="wallet-address-full">{account}</p>
                  </div>
                  <ul className="profile-menu">
                    <li><button>My Profile</button></li>
                    <li><button>My NFTs</button></li>
                    <li><button>My Investments</button></li>
                    <li><button>Settings</button></li>
                    <li><button className="disconnect-btn" onClick={disconnectWallet}>Disconnect</button></li>
                  </ul>
                </div>
              )}
            </div>
          )}
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
            <img src="/logo.png" alt="FilmChain Logo" className="logo-small" />
            <p>FilmChain © 2023</p>
          </div>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-discord"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
