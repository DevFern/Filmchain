// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FilmToken is ERC20, Ownable, ReentrancyGuard {
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event ProjectFunded(address indexed funder, uint256 projectId, uint256 amount);
    event NFTPurchased(address indexed buyer, uint256 nftId, uint256 amount);
    event RewardDistributed(address indexed recipient, uint256 projectId, uint256 amount);
    event ContributionWithdrawn(address indexed contributor, uint256 projectId, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    // Project funding tracking
    mapping(uint256 => uint256) public projectFunding;
    mapping(uint256 => mapping(address => uint256)) public projectContributions;

    constructor() ERC20("FilmChain Token", "FILM") {
        // Mint initial supply to contract creator
        _mint(msg.sender, 100000000 * 10**18); // 100 million tokens with 18 decimals
    }

    // Function to mint additional tokens (only owner)
    function mint(address to, uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // Function to fund a project
    function fundProject(uint256 projectId, uint256 amount) public nonReentrant returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Transfer tokens from sender to contract
        _transfer(msg.sender, address(this), amount);

        // Update project funding
        projectFunding[projectId] += amount;
        projectContributions[projectId][msg.sender] += amount;

        emit ProjectFunded(msg.sender, projectId, amount);
        return true;
    }

    // Function to purchase an NFT
    function purchaseNFT(uint256 nftId, uint256 amount) public nonReentrant returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Transfer tokens from buyer to contract
        _transfer(msg.sender, address(this), amount);

        emit NFTPurchased(msg.sender, nftId, amount);
        return true;
    }

    // Function to distribute rewards to project contributors (only owner)
    function distributeRewards(address recipient, uint256 projectId, uint256 amount) public onlyOwner nonReentrant returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(address(this)) >= amount, "Insufficient contract balance");

        // Transfer tokens from contract to recipient
        _transfer(address(this), recipient, amount);

        emit RewardDistributed(recipient, projectId, amount);
        return true;
    }

    // Function to withdraw contributions from a project
    function withdrawContribution(uint256 projectId) public nonReentrant returns (bool) {
        uint256 contribution = projectContributions[projectId][msg.sender];
        require(contribution > 0, "No contributions to withdraw");

        // Update project funding and contributions
        projectFunding[projectId] -= contribution;
        projectContributions[projectId][msg.sender] = 0;

        // Transfer tokens back to the contributor
        _transfer(address(this), msg.sender, contribution);

        emit ContributionWithdrawn(msg.sender, projectId, contribution);
        return true;
    }

    // Function to withdraw unused funds from the contract (only owner)
    function withdrawFunds(uint256 amount) public onlyOwner nonReentrant returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(address(this)) >= amount, "Insufficient contract balance");

        // Transfer tokens to the owner
        _transfer(address(this), msg.sender, amount);

        emit FundsWithdrawn(msg.sender, amount);
        return true;
    }

    // Function to get user's contribution to a specific project
    function getContribution(address user, uint256 projectId) public view returns (uint256) {
        return projectContributions[projectId][user];
    }

    // Function to get total funding for a project
    function getProjectFunding(uint256 projectId) public view returns (uint256) {
        return projectFunding[projectId];
    }
}
