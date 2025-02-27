import React, { useState } from 'react';
import { useWallet } from './contexts/WalletContext';
import NFTMarketSection from './components/NFTMarketSection';
import IndieFundSection from './components/IndieFundSection';
import HyreBlockSection from './components/HyreBlockSection';
import BlockOfficeSection from './components/BlockOfficeSection';
import CommunityVoiceSection from './components/CommunityVoiceSection';
import './App.css';

function App() {
  console.log("App component rendering");

  const [activeSection, setActiveSection] = useState('nftmarket');
  const [notifications] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { account, connectWallet, disconnectWallet, isMetaMaskInstalled } = useWallet();

  console.log("Wallet context values:", { account, isMetaMaskInstalled });

  const renderSection = () => {
    switch (activeSection) {
      case 'nftmarket':
        return <NFTMarket />;
      case 'indiefund':
        return <IndieFund />;
      case 'hyreblock':
        return <HyreBlock />;
      case 'blockoffice':
        return <BlockOffice />;
      case 'communityvoice':
        return <CommunitySection />;
      default:
        return <NFTMarket />;
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
      <div class="metamask-prompt">
        <div class="metamask-prompt-content">
          <h2>Meta Required</h2>
         <p>Please MetaMask to use the FilmChain platform.</p>
         <p>Meta is a browser extension that allows you to interact with blockchain applications.</p>
         <a 
           ="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="install-metamask-btn"
          >
            Install MetaMask
          </a>
         <p class="metamask-note">After installing, please refresh this page.</p>
       </div>
 </div>
 );
  }

  return (
    <div class="app-container">
      {/* Header */}
      <headerName="app-header">
        <div class="logo-container">
          {/* Updated to use the external logo URL */}
          <img 
           ="https://i.ibb.co/dsc9RSQ6/filmchain-logo.jpg" 
            alt="FilmChain Logo" 
            className="logo" 
          />
          <h1>Film</h1>
       </div>
        <nav class="main-nav">
          <ul>
           ['nftmarket', 'indiefund', 'hyreblock', 'blockoffice', 'communityvoice'].map((section) => (
              <li keysection} className={activeSection === section ? 'active' : ''}>
                <buttonClick={() => setActiveSection(section)}>
                  {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
                </button              </li>
                     </ul>
       </nav>
        <div class="header-actions">
          {/* Notifications */}
          <div class="notifications-container">
            <buttonName="notifications-btn" onClick={toggleNotifications}>
              <i class="fas fa-bell"></i>
             notifications.length > 0 && (
                <span class="notification-badge">{notifications.length}</span>
 )}
            </button            
            {showNotifications && (
              <div class="notifications-dropdown">
                <h3>Notifications3>
                {notifications.length === 0 ? (
                  <p class="no-notifications">No new notifications</p>
                : (
                  <ul class="notifications-list">
                    {notifications.map((notification, index) => (
                      <li keyindex} className="notification-item">
                        <div class="notification-content">
                          <p>{notification}</p>
                         <span class="notification-time">{notification.time}</span>
 </div>
 </li>
                                     </ul>
                             </div>
 )}
          </div>
          {/* Wallet Connection */}
          {!account ? (
            <buttonName="connect-wallet-btn" onClick={connectWallet}>
              Connect Wallet
            </button          ) : (
            <div class="profile-container">
              <buttonName="profile-btn" onClick={toggleProfileMenu}>
                <span class="wallet-address">
                  {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </span>
 <i class="fas fa-user-circle"></i>
             </button              
              {showProfileMenu && (
                <div class="profile-dropdown">
                  <div class="profile-header">
                    <h3>My Wallet3>
                    <p class="wallet-address-full">{account}</p>
                 </div>
 <ul class="profile-menu">
                    <li><buttonMy Profile</button</li>
                   <li><buttonMy NFTs</button</li>
                   <li><buttonMy Investments</button</li>
                   <li><buttonSettings</button</li>
                   <li><buttonName="disconnect-btn" onClick={disconnectWallet}>Disconnect</button</li>
                 </ul>
               </div>
 )}
            </div>
 )}
        </div>
 </header      
      {/* Main Content */}
      <main class="main-content">
        {renderSection()}
      </main>
      {/* Footer */}
      <footerName="app-footer">
        <div class="footer-content">
          <div class="footer-logo">
            <img 
             ="https://i.ibb.co/dsc9RSQ6/filmchain-logo.jpg" 
              alt="FilmChain Logo" 
              className="logo-small" 
            />
            <p>Film © 2023</p>
         </div>
 <div class="footer-links">
            <a hrefabout">About</a>
           <a hrefterms">Terms</a>
           <a hrefprivacy">Privacy</a>
           <a hrefcontact">Contact</a>
         </div>
 <div class="social-links">
            <a hrefhttps://twitter.com" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-twitter"></i>
           </a>
           <a hrefhttps://discord.com" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-discord"></i>
           </a>
           <a hrefhttps://github.com" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-github"></i>
           </a>
         </div>
 </div>
 </footer    </div>
 );
}

export default App;
