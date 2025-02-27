import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { ethers } from 'ethers';

// NFT contract ABI (simplified for this example)
const nftContractABI = [
  "function createNFT(string memory title, string memory description, string memory category, uint256 price, string memory tokenURI, bool isAuction, uint256 auctionDuration) returns (uint256)",
  "function buyNFT(uint256 tokenId)",
  "function placeBid(uint256 tokenId, uint256 bidAmount)",
  "function endAuction(uint256 tokenId)",
  "function getNFTDetails(uint256 tokenId) view returns (string memory title, string memory description, string memory category, uint256 price, address creator, bool isAuction, uint256 auctionEndTime, address highestBidder, uint256 highestBid)",
  "event NFTCreated(uint256 indexed tokenId, address indexed creator, string title, uint256 price)",
  "event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price)",
  "event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 amount)"
];

// NFT contract address - replace with your deployed contract address
const NFT_CONTRACT_ADDRESS = "0x456..."; // Replace with actual NFT contract address

const NFTMarketSection = () => {
  const { account, provider, filmTokenContract, filmBalance, error: walletError } = useWallet();
  
  const [nftContract, setNftContract] = useState(null);
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

  // Initialize NFT contract
  useEffect(() => {
    if (provider && account) {
      try {
        const signer = provider.getSigner();
        const nftContractInstance = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          nftContractABI,
          signer
        );
        setNftContract(nftContractInstance);
        
        // In a real app, you would load NFTs from the blockchain here
        // For now, we're using the mock data in the items state
      } catch (err) {
        console.error("Error initializing NFT contract:", err);
        setError("Failed to initialize NFT marketplace. Please try again.");
      }
    }
  }, [provider, account]);

  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const timeLeft = endTime - now;
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
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
      setShowBidModal(false);
      setBidAmount('');
    } catch (err) {
      console.error("Error placing bid:", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setTransactionPending(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!account) {
      setError("Please connect your wallet first");
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
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Failed to add item. Please try again.");
    } finally {
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

  const ItemCard = ({ item }) => (
    <div className="auction-card">
      <div className="auction-image">
        <img src={item.image} alt={item.title} />
        <div className="auction-timer">
          {formatTimeLeft(item.endTime)}
        </div>
      </div>
      <div className="auction-info">
        <h3>{item.title}</h3>
        <p>Current Price: {item.price} {item.currency}</p>
        <p>Type: {item.type}</p>
        <button 
          className="place-bid-btn"
          onClick={() => {
            setSelectedItem(item);
            setShowBidModal(true);
          }}
        >
          Place Bid
        </button>
      </div>
    </div>
  );

  const BidModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{selectedItem.title}</h3>
        <div className="filmcoin-balance">
          Your FilmCoin Balance: {filmBalance} FILM
        </div>
        <div className="bid-history">
          {selectedItem.bids.map((bid, index) => (
            <div key={index} className="bid-item">
              <span>{bid.bidder}</span>
              <span>{bid.amount} {selectedItem.currency}</span>
            </div>
          ))}
        </div>
        <div className="bid-input-group">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter bid amount"
            className="bid-input"
          />
          <button 
            className="place-bid-btn"
            onClick={() => handleBid(selectedItem)}
            disabled={transactionPending}
          >
            {transactionPending ? 'Processing...' : 'Place Bid'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button 
          className="close-btn"
          onClick={() => setShowBidModal(false)}
        >
          ×
        </button>
      </div>
    </div>
  );

  const AddItemModal = () => (
    <div className="modal-overlay">
      <div className="add-merchandise-modal">
        <h3>Add New Item</h3>
        <form className="merchandise-form" onSubmit={handleAddItem}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
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
            <label>Description</label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Starting Price (in FILM)</label>
            <input
              type="number"
              value={newItem.startingPrice}
              onChange={(e) => setNewItem(prev => ({ ...prev, startingPrice: e.target.value }))}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Condition</label>
            <select
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
            <label>Image</label>
            <input
              type="file"
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
            <label>Auction Duration (days)</label>
            <input
              type="number"
              value={newItem.auctionDuration}
              onChange={(e) => setNewItem(prev => ({ ...prev, auctionDuration: e.target.value }))}
              required
              min="1"
              max="30"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );

  return (
    <div className="nft-market-container">
      <div className="section-header">
        <h2>NFT Market</h2>
        <p>Buy, sell, and trade film memorabilia and digital collectibles</p>
      </div>
      
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items
          .filter(item => activeCategory === 'all' || item.type.toLowerCase() === activeCategory)
          .map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
      </div>

      {showBidModal && selectedItem && <BidModal />}
      {showAddModal && <AddItemModal />}
     
      <button 
        className="add-merchandise-btn"
        onClick={() => setShowAddModal(true)}
      >
        +
      </button>
      
      {walletError && <p className="error-message">{walletError}</p>}
    </div>
  );
};

export default NFTMarketSection;
