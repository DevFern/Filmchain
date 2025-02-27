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
  const [userProfile] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { account, connectWallet, disconnectWallet, isMetaMaskInstalled } = useWallet();
  
  console.log("Wallet context values:", { account, isMetaMaskInstalled });

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
