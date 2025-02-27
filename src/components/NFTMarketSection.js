import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { ethers } from 'ethers';

// NFT contract ABI (simplified for this example)
const nftContractABI = [
  "function createNFT(string memory title, string memory description, string memory category, uint256 price, string memory tokenURI, bool isAuction, uint256 auctionDuration) returns (uint256)",
  "function buyNFT(uint256 tokenId)",
  "function placeBid(uint256 tokenId, uint256 bidAmount)",
  "function getNFTDetails(uint256 tokenId) view returns (string memory title, string memory description, string memory category, uint256 price, address creator, bool isAuction, uint256 auctionEndTime, address highestBidder, uint256 highestBid)"
];

// NFT contract address - replace with your deployed contract address
const NFT_CONTRACT_ADDRESS = "0xYourContractAddressHere";

const NFTMarketSection = () => {
  const { account, provider, connectWallet } = useWallet();
  const [nftContract, setNftContract] = useState(null);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'nft', name: 'NFTs' },
    { id: 'memorabilia', name: 'Memorabilia' }
  ];

  // Initialize NFT contract
  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      const nftContractInstance = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        nftContractABI,
        signer
      );
      setNftContract(nftContractInstance);
    }
  }, [provider]);

  // Fetch NFTs from the blockchain
  const fetchNFTs = async () => {
    if (!nftContract) return;

    try {
      setIsLoading(true);
      const totalSupply = await nftContract.totalSupply(); // Assuming the contract has a totalSupply function
      const nftItems = [];

      for (let i = 1; i <= total; i++) {
        const nftDetails = await nftContract.getNFTDetails(i);
        nftItems.push({
          id: i,
          title: nftDetails.title,
          description: nftDetails.description,
          category: nftDetails.category,
          price: ethers.utils.formatEther(nftDetails.price),
          creator: nftDetails.creator,
          isAuction: nftDetails.isAuction,
          auctionEndTime: new Date(nftDetails.auctionEndTime * 1000),
          highestBidder: nftDetails.highestBidder,
          highestBid: ethers.utils.formatEther(nftDetails.highestBid)
        });
      }

      setItems(nftItems);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Failed to load NFTs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (nftContract) {
      fetchNFTs();
    }
  }, [nftContract]);

  const handleBid = async (item) => {
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }

    if (!bidAmount || parseFloat(bidAmount) <= parse(item.price)) {
      setError("Bid must be higher than the current price.");
      return;
    }

    try {
      setIsLoading(true);
      const bidAmountInWei = ethers.utils.parseEther(bidAmount);
      const tx = await nftContract.placeBid(item.id, bidAmountInWei);
      await tx.wait();
      setShowBidModal(false);
      setBidAmount('');
      fetchNFTs(); // Refresh the list of NFTs
    } catch (err) {
      console.error("Error placing bid:", err);
      setError("Failed to place bid. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (newItem) => {
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }

    try {
      setIsLoading(true);
      const priceInWei = ethers.utils.parseEther(newItem.startingPrice);
      const tx = await nftContract.createNFT(
        newItem.title,
        newItem.description,
        newItem.category,
        priceInWei,
        newItem.tokenURI, // Assuming the image is uploaded to IPFS and the URI is provided
        newItem.isAuction,
        newItem.auctionDuration * 86400 // Convert days to seconds
      );
      await tx.wait();
      setShowAddModal(false);
      fetchNFTs(); // Refresh the list of NFTs
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Failed to add item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const timeLeft = endTime - now;
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div class="nft-market-container">
      <div class="section-header">
        <h2>NFT</h2>
       <p>Buy,, and trade film memorabilia and digital collectibles.</p>
     </div>

 <div class="category-tabs">
        {categories.map((category) => (
          <button            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button        ))}
      </div>

 <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items
          .filter((item) => activeCategory === 'all' || item.category.toLowerCase() === activeCategory)
          .map((item) => (
            <div keyitem.id} className="auction-card">
              <div class="auction-image">
                <img srcitem.image} alt={item.title} />
                {item.isAuction && (
                  <div class="auction-timer">{formatTimeLeft(item.auctionEndTime)}</div>
 )}
              </div>
 <div class="auction-info">
                <h3>{item}</h3>
               <p>Price {item.price} FILM</p>
               <button                  className="place-bid-btn"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowBidModal(true);
                  }}
                >
                  {item.isAuction ? "Place Bid" : "Buy Now"}
                </button              </div>
 </div>
 ))}
      </div>

 {showBidModal && selectedItem && (
        <div class="modal-overlay">
          <div class="modal-content">
            <h3>Place Bid</h3>
           <input
 type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
            />
            <buttonClick={() => handleBid(selectedItem)}>Submit Bid</button            <buttonClick={() => setShowBidModal(false)}>Cancel</button          </div>
 </div>
 )}

      {showAddModal && (
        <div class="modal-overlay">
          <div class="modal-content">
            <h3>Add Item</h3>
            Add form for creating a new NFT */}
            <buttonClick={() => setShowAddModal(false)}>Cancel</button          </div>
 </div>
 )}

      <buttonName="add-item-btn" onClick={() => setShowAddModal(true)}>
        Add Item
      </button      {error && <p class="error-message">{error}</p>}
   </div>
 );
};

export default NFTMarketSection;
