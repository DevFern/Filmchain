import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';

const NFTMarketSection = () => {
  const { account, filmBalance = 1000, error: walletError } = useWallet();
  
  // State management
  const [items, setItems] = useState([
    {
      id: 1,
      title: "The Last Sunset - Original Poster",
      type: "NFT",
      creator: "Maria Rodriguez",
      price: 0.5,
      currency: "FILM",
      edition: "1 of 10",
      image: "https://i.ibb.co/RT0vfKzb/The-Last-Sunset.jpg",
      endTime: new Date(Date.now() + 8640000), // 24 hours from now
      bids: [
        { bidder: "0x1234...5678", amount: 0.45, time: new Date() },
        { bidder: "0x8765...4321", amount: 0.4, time: new Date() }
      ],
      description: "Limited edition poster from the award-winning film 'The Last Sunset', signed by the director and lead actors."
    },
    // Other items remain the same
  ]);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionPending, setTransactionPending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('endingSoon');
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const categories = [
    { id: 'all', name: 'All Items', icon: 'fas fa-th-large' },
    { id: 'nft', name: 'NFTs', icon: 'fas fa-image' },
    { id: 'memorabilia', name: 'Memorabilia', icon: 'fas fa-film' },
    { id: 'props', name: 'Props', icon: 'fas fa-theater-masks' },
    { id: 'costumes', name: 'Costumes', icon: 'fas fa-tshirt' },
    { id: 'scripts', name: 'Scripts', icon: 'fas fa-scroll' }
  ];

  // Filter and sort items
  const filteredItems = useCallback(() => {
    return items
      .filter(item => {
        const matchesCategory = activeCategory === 'all' || 
                               item.type.toLowerCase() === activeCategory;
        const matchesSearch = searchTerm === '' || 
                             item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.creator.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch(sortOption) {
          case 'endingSoon':
            return a.endTime - b.endTime;
          case 'priceLowHigh':
            return a.price - b.price;
          case 'priceHighLow':
            return b.price - a.price;
          case 'mostBids':
            return b.bids.length - a.bids.length;
          default:
            return a.endTime - b.endTime;
        }
      });
  }, [items, activeCategory, searchTerm, sortOption]);

  // Toggle favorite status
  const toggleFavorite = (itemId) => {
    if (favoriteItems.includes(itemId)) {
      setFavoriteItems(prev => prev.filter(id => id !== itemId));
      showNotificationWithTimeout('Removed from favorites');
    } else {
      setFavoriteItems(prev => [...prev, itemId]);
      showNotificationWithTimeout('Added to favorites');
    }
  };

  // Show notification with timeout
  const showNotificationWithTimeout = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Format time left for auction
  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) {
      return "Ended";
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Handle bid submission
  const handleBid = async (item) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!bidAmount || parseFloat(bidAmount) <= item.price) {
      setError('Bid must be higher than current price');
      return;
    }

    if (parseFloat(bidAmount) > filmBalance) {
      setError('Insufficient FilmCoin balance');
      return;
    }

    setTransactionPending(true);
    setError(null);

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newBid = {
        bidder: account.substring(0, 6) + '...' + account.substring(account.length - 4),
        amount: parseFloat(bidAmount),
        time: new Date()
      };

      setItems(prev => prev.map(i => 
        i.id === item.id 
          ? {...i, price: parseFloat(bidAmount), bids: [newBid, ...i.bids]} 
          : i
      ));

      showNotificationWithTimeout('Bid placed successfully!');
      setShowBidModal(false);
      setBidAmount('');
    } catch (err) {
      console.error("Error placing bid:", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setTransactionPending(false);
    }
  };

  // Item Card Component
  const ItemCard = ({ item }) => (
    <motion.div 
      className={`nft-card ${viewMode === 'list' ? 'list-view' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-image-container">
        <img src={item.image} alt={item.title} className="card-image" />
        <div className="card-overlay">
          <button 
            className="favorite-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
          >
            <i className={`${favoriteItems.includes(item.id) ? 'fas' : 'far'} fa-heart`}></i>
          </button>
          <div className="time-remaining">
            <i className="far fa-clock"></i> {formatTimeLeft(item.endTime)}
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-creator">By {item.creator}</p>
        
        <div className="card-price">
          <span className="current-price">{item.price} {item.currency}</span>
          <span className="bid-count">{item.bids.length} bids</span>
        </div>
        
        <button 
          className="bid-button"
          onClick={() => {
            setSelectedItem(item);
            setShowBidModal(true);
          }}
        >
          Place Bid
        </button>
      </div>
    </motion.div>
  );

  // Bid Modal Component
  const BidModal = () => (
    <AnimatePresence>
      {showBidModal && selectedItem && (
        <motion.div 
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bid-modal"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="modal-header">
              <h3>{selectedItem.title}</h3>
              <button 
                className="close-modal"
                onClick={() => {
                  setShowBidModal(false);
                  setSelectedItem(null);
                  setBidAmount('');
                  setError(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="item-preview">
                <img src={selectedItem.image} alt={selectedItem.title} />
                <div className="item-details">
                  <p className="item-creator">Created by {selectedItem.creator}</p>
                  <p className="item-description">{selectedItem.description || "No description available."}</p>
                  <div className="current-price-container">
                    <span>Current Price:</span>
                    <span className="price-value">{selectedItem.price} {selectedItem.currency}</span>
                  </div>
                  <div className="time-remaining-container">
                    <span>Time Remaining:</span>
                    <span className="time-value">{formatTimeLeft(selectedItem.endTime)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bid-history">
                <h4>Bid History</h4>
                {selectedItem.bids.length > 0 ? (
                  <div className="bid-list">
                    {selectedItem.bids.map((bid, index) => (
                      <div key={index} className="bid-item">
                        <span className="bidder">{bid.bidder}</span>
                        <span className="bid-amount">{bid.amount} {selectedItem.currency}</span>
                        <span className="bid-time">{bid.time.toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-bids">No bids yet. Be the first to bid!</p>
                )}
              </div>
              
              <div className="place-bid-form">
                <div className="wallet-balance">
                  <i className="fas fa-wallet"></i>
                  <span>Your Balance: {filmBalance} {selectedItem.currency}</span>
                </div>
                
                <div className="bid-input-group">
                  <label htmlFor="bidAmount">Your Bid ({selectedItem.currency})</label>
                  <input
                    id="bidAmount"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Min. ${(selectedItem.price + 0.1).toFixed(1)}`}
                    min={selectedItem.price + 0.1}
                    step="0.1"
                  />
                </div>
                
                {error && <p className="error-message">{error}</p>}
                
                <button 
                  className="submit-bid-btn"
                  onClick={() => handleBid(selectedItem)}
                  disabled={transactionPending}
                >
                  {transactionPending ? (
                    <span className="loading-spinner">
                      <i className="fas fa-spinner fa-spin"></i> Processing...
                    </span>
                  ) : (
                    'Place Bid'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="nft-marketplace">
      <div className="marketplace-header">
        <h2>NFT Market</h2>
        <p>Buy, sell, and trade film memorabilia and digital collectibles</p>
      </div>
      
      <div className="marketplace-controls">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search items or creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="view-options">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <i className="fas fa-th-large"></i>
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <i className="fas fa-list"></i>
          </button>
        </div>
        
        <div className="sort-container">
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="endingSoon">Ending Soon</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="mostBids">Most Bids</option>
          </select>
        </div>
      </div>
      
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <i className={category.icon}></i>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
      
      <div className={`items-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
        {filteredItems().length > 0 ? (
          filteredItems().map(item => (
            <ItemCard key={item.id} item={item} />
          ))
        ) : (
          <div className="no-items-found">
            <i className="fas fa-search"></i>
            <h3>No items found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      
      <button 
        className="add-item-btn"
        onClick={() => setShowAddModal(true)}
      >
        <i className="fas fa-plus"></i>
      </button>
      
      <BidModal />
      
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            className="notification"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <i className="fas fa-check-circle"></i>
            <span>{notificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NFTMarketSection;
