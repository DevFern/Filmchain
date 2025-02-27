// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./FilmToken.sol";

contract FilmChainNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Reference to the FILM token contract
    FilmToken private filmToken;
    
    // NFT metadata structure
    struct NFTItem {
        uint256 id;
        string title;
        string description;
        string category;
        uint256 price;
        address creator;
        bool isAuction;
        uint256 auctionEndTime;
        address highestBidder;
        uint256 highestBid;
    }
    
    // Mapping from token ID to NFT metadata
    mapping(uint256 => NFTItem) public nftItems;
    
    // Events
    event NFTCreated(uint256 indexed tokenId, address indexed creator, string title, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event AuctionCreated(uint256 indexed tokenId, uint256 startingPrice, uint256 endTime);
    event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed tokenId, address indexed winner, uint256 amount);
    
    constructor(address _filmTokenAddress) ERC721("FilmChain NFT", "FCNFT") {
        filmToken = FilmToken(_filmTokenAddress);
    }
    
    // Create a new NFT
    function createNFT(
        string memory title,
        string memory description,
        string memory category,
        uint256 price,
        string memory tokenURI,
        bool isAuction,
        uint256 auctionDuration
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        uint256 auctionEndTime = 0;
        if (isAuction) {
            auctionEndTime = block.timestamp + auctionDuration;
        }
        
        nftItems[newItemId] = NFTItem({
            id: newItemId,
            title: title,
            description: description,
            category: category,
            price: price,
            creator: msg.sender,
            isAuction: isAuction,
            auctionEndTime: auctionEndTime,
            highestBidder: address(0),
            highestBid: 0
        });
        
        if (isAuction) {
            emit AuctionCreated(newItemId, price, auctionEndTime);
        }
        
        emit NFTCreated(newItemId, msg.sender, title, price);
        return newItemId;
    }
    
    // Buy an NFT (for fixed price items)
    function buyNFT(uint256 tokenId) public {
        NFTItem storage item = nftItems[tokenId];
        require(!item.isAuction, "Item is on auction");
        require(ownerOf(tokenId) != msg.sender, "You already own this NFT");
        
        address seller = ownerOf(tokenId);
        
        // Transfer FILM tokens from buyer to seller
        bool success = filmToken.transferFrom(msg.sender, seller, item.price);
        require(success, "Token transfer failed");
        
        // Transfer NFT from seller to buyer
        _transfer(seller, msg.sender, tokenId);
        
        emit NFTSold(tokenId, seller, msg.sender, item.price);
    }
    
    // Place a bid on an auction
    function placeBid(uint256 tokenId, uint256 bidAmount) public {
        NFTItem storage item = nftItems[tokenId];
        require(item.isAuction, "Item is not on auction");
        require(block.timestamp < item.auctionEndTime, "Auction has ended");
        require(bidAmount > item.highestBid, "Bid must be higher than current highest bid");
        require(bidAmount >= item.price, "Bid must be at least the starting price");
        
        // If there was a previous bid, refund it
        if (item.highestBidder != address(0)) {
            bool refundSuccess = filmToken.transfer(item.highestBidder, item.highestBid);
            require(refundSuccess, "Refund to previous bidder failed");
        }
        
        // Transfer tokens from bidder to contract
        bool success = filmToken.transferFrom(msg.sender, address(this), bidAmount);
        require(success, "Token transfer failed");
        
        // Update highest bid
        item.highestBidder = msg.sender;
        item.highestBid = bidAmount;
        
        emit BidPlaced(tokenId, msg.sender, bidAmount);
    }
    
    // End an auction
    function endAuction(uint256 tokenId) public {
        NFTItem storage item = nftItems[tokenId];
        require(item.isAuction, "Item is not on auction");
        require(block.timestamp >= item.auctionEndTime, "Auction has not ended yet");
        require(item.highestBidder != address(0), "No bids were placed");
        
        address seller = ownerOf(tokenId);
        
        // Transfer highest bid to seller
        bool success = filmToken.transfer(seller, item.highestBid);
        require(success, "Token transfer to seller failed");
        
        // Transfer NFT to highest bidder
        _transfer(seller, item.highestBidder, tokenId);
        
        emit AuctionEnded(tokenId, item.highestBidder, item.highestBid);
        
        // Reset auction data
        item.isAuction = false;
        item.auctionEndTime = 0;
    }
    
    // Get NFT details
    function getNFTDetails(uint256 tokenId) public view returns (
        string memory title,
        string memory description,
        string memory category,
        uint256 price,
        address creator,
        bool isAuction,
        uint256 auctionEndTime,
        address highestBidder,
        uint256 highestBid
    ) {
        NFTItem storage item = nftItems[tokenId];
        return (
            item.title,
            item.description,
            item.category,
            item.price,
            item.creator,
            item.isAuction,
            item.auctionEndTime,
            item.highestBidder,
            item.highestBid
        );
    }
}
