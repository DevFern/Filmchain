import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

const NFTMarketSection = () => {
  const { account, filmBalance = 1000, error: walletError } = useWallet();
  
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
      endTime: new Date(Date.now() + 86400000), // 24 hours from now
      bids: [
        { bidder: "0x1234...5678", amount: 0.45, time: new Date() },
        { bidder: "0x8765...4321", amount: 0.4, time: new Date() }
      ]
    },
    {
      id: 2,
      title: "Digital Dreams - Hero Costume",
      type: "Memorabilia",
      creator: "Alex Chen",
      price: 1000,
      currency: "FILM",
      condition: "Excellent",
      image: "https://i.ibb.co/9kgV2mtk/heroic-super-cat-stockcake.jpg",
      endTime: new Date(Date.now() + 172800000), // 48 hours from now
      bids: [
        { bidder: "0x2468...1357", amount: 950, time: new Date() }
      ]
    },
    {
      id: 3,
      title: "Quantum Horizon - Concept Art",
      type: "NFT",
      creator: "James Wilson",
      price: 0.75,
      currency: "FILM",
      edition: "1 of 5",
      image: "https://i.ibb.co/d4zkmt45/Quantum-Dreams.jpg",
      endTime: new Date(Date.now() + 129600000), // 36 hours from now
      bids: [
        { bidder: "0x9876...5432", amount: 0.7, time: new Date() }
      ]
    },
    {
      id: 4,
      title: "Neon City - Original Script",
      type: "Scripts",
      creator: "Sarah Chen",
      price: 2500,
      currency: "FILM",
      condition: "New",
      image: "https://i.ibb.co/VpHHLnYM/Last-Symphony.jpg",
      endTime: new Date(Date.now() + 259200000), // 72 hours from now
      bids: []
    }
  ]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionPending, setTransactionPending] = useState(false);
  
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'Memorabilia',
    description: '',
    startingPrice: '',
    currency: 'FILM',
    image: '',
    condition: 'New',
    authenticity: '',
    filmRelated: '',
    isAuction: true,
    auctionDuration: 7 // days
  });

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'nft', name: 'NFTs' },
    { id: 'memorabilia', name: 'Memorabilia' },
    { id: 'props', name: 'Props' },
    { id: 'costumes', name: 'Costumes' },
    { id: 'scripts', name: 'Scripts' }
  ];

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
      // In a real app, you would call the smart contract here
      // For now, we'll just simulate a successful bid
      
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

      // Simulate balance update
      // In a real app, this would happen automatically when the contract emits events
      setTimeout(() => {
        setShowBidModal(false);
        setBidAmount('');
        setTransactionPending(false);
      }, 1500);
    } catch (err) {
      console.error("Error placing bid:", err);
      setError("Transaction failed. Please try again.");
      setTransactionPending(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!newItem.title || !newItem.startingPrice) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you would upload the image to IPFS and call the smart contract
      // For now, we'll just simulate adding a new item
      
      const newItemObj = {
        id: items.length + 1,
        title: newItem.title,
        type: newItem.type,
        creator: account.substring(0, 6) + '...' + account.substring(account.length - 4),
        price: parseFloat(newItem.startingPrice),
        currency: "FILM",
        condition: newItem.condition,
        image: newItem.image || "https://placehold.co/400x300/9c27b0/ffffff?text=NFT",
        endTime: new Date(Date.now() + (newItem.auctionDuration * 86400000)), // days to ms
        bids: []
      };

      setItems(prev => [...prev, newItemObj]);
      
      // Reset form and close modal
      setNewItem({
        title: '',
        type: 'Memorabilia',
        description: '',
        startingPrice: '',
        currency: 'FILM',
        image: '',
        condition: 'New',
        authenticity: '',
        filmRelated: '',
        isAuction: true,
        auctionDuration: 7
      });
      
      setTimeout(() => {
        setShowAddModal(false);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Failed to add item. Please try again.");
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="nft-market-container">
      <div className="section-header">
        <h2 className="section-title">NFT Market</h2>
        <p className="section-subtitle">Buy, sell, and trade film memorabilia and digital collectibles</p>
      </div>
      
      <div className="tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`tab-button ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid">
        {items
          .filter(item => activeCategory === 'all' || item.type.toLowerCase() === activeCategory)
          .map(item => (
            <div key={item.id} className="card">
              <div className="card-image">
                <img src={item.image} alt={item.title} />
                <div className="card-badge">
                  {formatTimeLeft(item.endTime)}
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-subtitle">By {item.creator}</p>
                <p className="card-text">Current Price: {item.price} {item.currency}</p>
                <div className="card-footer">
                  <span>{item.bids.length} bids</span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowBidModal(true);
                    }}
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Bid Modal */}
      {showBidModal && selectedItem && (
        <div className={`modal-overlay ${showBidModal ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{selectedItem.title}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowBidModal(false);
                  setSelectedItem(null);
                  setBidAmount('');
                  setError(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="bid-details">
                <div className="bid-image">
                  <img src={selectedItem.image} alt={selectedItem.title} />
                </div>
                
                <div className="bid-info">
                  <div className="filmcoin-balance">
                    Your FilmCoin Balance: <strong>{filmBalance} FILM</strong>
                  </div>
                  
                  <div className="current-price">
                    Current Price: <strong>{selectedItem.price} {selectedItem.currency}</strong>
                  </div>
                  
                  <div className="bid-history">
                    <h4>Bid History</h4>
                    {selectedItem.bids.length > 0 ? (
                      <div className="bid-list">
                        {selectedItem.bids.map((bid, index) => (
                          <div key={index} className="bid-item">
                            <span className="bidder">{bid.bidder}</span>
                            <span className="bid-amount">{bid.amount} {selectedItem.currency}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-bids">No bids yet. Be the first to bid!</p>
                    )}
                  </div>
                  
                  <div className="bid-form">
                    <div className="form-group">
                      <label className="form-label">Your Bid (FILM)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Min. ${(selectedItem.price + 0.1).toFixed(1)}`}
                        min={selectedItem.price + 0.1}
                        step="0.1"
                      />
                    </div>
                    
                    {error && <p className="form-error">{error}</p>}
                    
                    <button 
                      className="btn btn-accent btn-block"
                      onClick={() => handleBid(selectedItem)}
                      disabled={transactionPending}
                    >
                      {transactionPending ? (
                        <span>
                          <i className="fas fa-spinner fa-spin"></i> Processing...
                        </span>
                      ) : (
                        'Place Bid'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className={`modal-overlay ${showAddModal ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New Item</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setError(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleAddItem}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newItem.title}
                    onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-control form-select"
                    value={newItem.type}
                    onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                    required
                  >
                    <option value="Memorabilia">Memorabilia</option>
                    <option value="NFT">NFT</option>
                    <option value="Props">Props</option>
                    <option value="Costumes">Costumes</option>
                    <option value="Scripts">Scripts</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control form-textarea"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Starting Price (in FILM)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newItem.startingPrice}
                    onChange={(e) => setNewItem(prev => ({ ...prev, startingPrice: e.target.value }))}
                    required
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Condition</label>
                  <select
                    className="form-control form-select"
                    value={newItem.condition}
                    onChange={(e) => setNewItem(prev => ({ ...prev, condition: e.target.value }))}
                    required
                  >
                    <option value="New">New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {newItem.image && (
                    <div className="image-preview">
                      <img src={newItem.image} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Auction Duration (days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newItem.auctionDuration}
                    onChange={(e) => setNewItem(prev => ({ ...prev, auctionDuration: e.target.value }))}
                    required
                    min="1"
                    max="30"
                  />
                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span>
                        <i className="fas fa-spinner fa-spin"></i> Adding...
                      </span>
                    ) : (
                      'Add Item'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
     
      <button 
        className="btn-floating"
        onClick={() => setShowAddModal(true)}
        aria-label="Add new item"
      >
        <i className="fas fa-plus"></i>
      </button>
      
      {walletError && <p className="form-error">{walletError}</p>}
    </div>
  );
};

export default NFTMarketSection;
