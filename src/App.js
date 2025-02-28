// src/App.js
import React, { useState, useEffect } from 'react';
import { useWallet } from './contexts/WalletContext';
import NFTMarketSection from './components/NFTMarketSection';
import IndieFundSection from './components/IndieFundSection';
import HyreBlockSection from './components/HyreBlockSection';
import BlockOfficeSection from './components/BlockOfficeSection';
import CommunityVoiceSection from './components/CommunityVoiceSection';
import './App.css';
import './components/DesignFixes.css'; // Import the new design fixes

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
