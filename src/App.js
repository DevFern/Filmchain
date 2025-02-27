// Find this line:
const [notifications, setNotifications] = useState([]);

// Replace with:
const [notifications] = useState([]);

// Find this line:
const [userProfile, setUserProfile] = useState(null);

// Replace with:
const [userProfile] = useState(null);

// Find this line:
const { account, chainId, connectWallet, disconnectWallet } = useWallet();

// Replace with:
const { account, connectWallet, disconnectWallet } = useWallet();import React, { useState } from 'react';
import { WalletProvider, useWallet } from './contexts/WalletContext';
import './App.css';

// Import your section components
import IndieFundSection from './components/IndieFundSection';
import CommunityVoiceSection from './components/CommunityVoiceSection';
import HyreBlockSection from './components/HyreBlockSection';
import BlockOfficeSection from './components/BlockOfficeSection';
import NFTMarketSection from './components/NFTMarketSection';

// Main App wrapped with WalletProvider
function AppWithWallet() {
  return (
    <WalletProvider>
      <App />
    </WalletProvider>
  );
}

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'project', message: 'New funding milestone reached for "The Last Sunset"', unread: true },
    { id: 2, type: 'vote', message: 'Your proposal is trending in Community Voice', unread: true },
    { id: 3, type: 'job', message: 'New job match based on your profile', unread: false }
  ]);
  const [userProfile, setUserProfile] = useState({
    name: 'Sardar D',
    role: 'Filmmaker',
    avatar: 'https://placehold.co/100x100/666/fff?text=SD',
    projects: 3,
    contributions: 12,
    reputation: 4.8
  });
  
  const { 
    account, 
    chainId, 
    filmBalance, 
    connectWallet, 
    disconnectWallet, 
    isConnecting, 
    error 
  } = useWallet();
  
  // Welcome Screen Component with Web3 wallet connection
  const WelcomeScreen = () => (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <img
          src="https://i.ibb.co/dsc9RSQ6/filmchain-logo.jpg"
          alt="FilmChain Background"
          className="w-full max-w-3xl"
        />
      </div>
      <div className="z-10 text-center p-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          Welcome to FilmChain
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl">
          Revolutionizing film industry financing and collaboration through blockchain technology
        </p>
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-xl font-semibold text-white hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet to Continue'}
        </button>
        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}
      </div>
    </div>
  );

  // Header Component with wallet info
  const Header = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    
    // Format account address for display
    const formatAddress = (address) => {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img
                src="https://placehold.co/150x50/6a1b9a/ffffff?text=FilmChain"
                alt="FilmChain"
                className="h-8"
              />
              <div className="hidden md:flex ml-10 space-x-4">
                {['indieFund', 'communityVoice', 'hyreBlock', 'blockOffice', 'nftMarket'].map(section => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === section
                        ? 'bg-pink-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 px-3 py-1 rounded-full">
                <span className="text-sm text-gray-300">
                  {parseFloat(filmBalance).toFixed(2)} FILM
                </span>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-300 hover:text-white"
                >
                  <i className="fas fa-bell"></i>
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-pink-600"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-700 ${notification.unread ? 'bg-gray-750' : ''}`}
                      >
                        <p className="text-sm text-gray-300">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={userProfile.avatar}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="hidden md:block text-sm text-gray-300">{userProfile.name}</span>
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">{userProfile.name}</p>
                      <p className="text-xs text-gray-400">{account ? formatAddress(account) : 'Not connected'}</p>
                    </div>
                    <div className="px-4 py-2">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Projects</span>
                        <span>{userProfile.projects}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Contributions</span>
                        <span>{userProfile.contributions}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Reputation</span>
                        <span>⭐ {userProfile.reputation}</span>
                      </div>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!account ? (
        <WelcomeScreen />
      ) : (
        <>
          <Header />
          <main className="max-w-7xl mx-auto">
            {activeSection === 'indieFund' && <IndieFundSection />}
            {activeSection === 'communityVoice' && <CommunityVoiceSection />}
            {activeSection === 'hyreBlock' && <HyreBlockSection />}
            {activeSection === 'blockOffice' && <BlockOfficeSection />}
            {activeSection === 'nftMarket' && <NFTMarketSection />}
          </main>
        </>
      )}
    </div>
  );
}

export default AppWithWallet;
